import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'
import {
  LIMIT_DEFAULT,
  PAGE_DEFAULT,
  SORT,
  SORT_BY_DEFAULT
} from '~/constants/pagination'
import ProductAttribute from '~/models/productAttributeModel'
import ProductAttributeValue from '~/models/productAttributeValueModel'
import Product from '~/models/productModel'
import ProductVariantValue from '~/models/productVariantValue'
import Variant from '~/models/variantModel'
import VariantValue from '~/models/variantValueModel'
import { IApiResponse, IQueryParams } from '~/types/common'
import {
  AddProductPayload,
  EditProductPayload,
  IProduct,
  ProductList
} from '~/types/productType'
import ApiError from '~/utils/ApiError'
import { createRandomString } from '~/utils/random'
import slugify from '~/utils/slugify'

const addNew = async (payload: AddProductPayload): Promise<IApiResponse> => {
  const {
    attributes = [],
    variants = [],
    variantValues = [],
    ...addProductPayload
  } = payload
  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    const existingProduct = await Product.findOne({
      name: addProductPayload.name
    }).session(session)

    if (existingProduct) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Product name had already exist!'
      )
    }

    // Add product
    const addData = {
      ...addProductPayload,
      slug: slugify(addProductPayload.name)
    }

    const addedProduct = new Product(addData)
    await addedProduct.save({ session })

    // Add attributes
    const attributesData = []
    if (attributes.length > 0) {
      for (const attribute of attributes) {
        // Check attribute already exist
        const existingAttribute = await ProductAttribute.findOne({
          name: attribute.name
        }).session(session)
        // Add name to attribute collection
        let addedAttribute = null
        if (!existingAttribute) {
          addedAttribute = new ProductAttribute({ name: attribute.name })
          await addedAttribute.save({ session })
        } else {
          addedAttribute = await ProductAttribute.findOne({
            name: attribute.name
          }).session(session)
        }

        // Add value to attribute value collection
        const addedAttributeValue = new ProductAttributeValue({
          product: addedProduct._id,
          attribute: addedAttribute?._id,
          value: attribute.value
        })
        await addedAttributeValue.save({ session })

        attributesData.push({
          _id: addedAttributeValue._id,
          name: addedAttribute?.name,
          value: addedAttributeValue.value
        })
      }
    }

    // Add variants
    if (variants.length > 0) {
      for (const variant of variants) {
        // Check variant had already existed before
        const existingVariant = await Variant.findOne({
          name: new RegExp(`^${variant.name}$`, 'i')
        })

        if (!existingVariant) {
          // Add variant
          const addedVariant = new Variant({ name: variant.name })
          await addedVariant.save({ session })

          // Add variant value
          for (const variantValue of variant.values) {
            const addedVariantValue = new VariantValue({
              variant: addedVariant._id,
              valueCode: createRandomString(4).toUpperCase(),
              value: variantValue.toString()
            })
            await addedVariantValue.save({ session })
          }
        }
      }
    }

    // Add product variant values
    const variantValuesData = []
    if (variantValues.length > 0) {
      for (const variantData of variantValues) {
        const variantValueCodes = []

        for (const value of variantData.variantCombination) {
          const variantValue = await VariantValue.findOne({ value }).session(
            session
          )

          if (!variantValue) {
            throw new ApiError(
              StatusCodes.NOT_FOUND,
              `Variant ${value} not found!`
            )
          }

          variantValueCodes.push(variantValue.valueCode)
        }

        // Create SKU code. Example: 'code1-code2-code3-...'
        const sku = variantValueCodes.sort((a: any, b: any) => a - b).join('-')

        // Add new product variant value
        const addedProductVariantValue = new ProductVariantValue({
          product: addedProduct._id,
          price: variantData.price,
          oldPrice: variantData.oldPrice || 0,
          sku,
          stock: variantData.stock || 0
        })
        await addedProductVariantValue.save({ session })

        // Query product variants base on productVariantValue added
        if (addedProductVariantValue._id) {
          const varinatValueCodes = addedProductVariantValue.sku.split('-')

          const variantValues = await VariantValue.find({
            valueCode: { $in: varinatValueCodes },
            _destroy: false
          })
            .populate('variant')
            .session(session)

          const values = variantValues.map((item) => {
            return {
              code: item.valueCode,
              name: (item.variant as any)?.name,
              value: item.value
            }
          })

          variantValuesData.push({
            ...addedProductVariantValue.toObject(),
            values
          })
        }
      }
    }

    await session.commitTransaction()
    session.endSession()

    return {
      statusCode: StatusCodes.CREATED,
      message: 'Added product is successfully.',
      data: {
        ...addedProduct.toObject(),
        attributes: attributesData,
        variants: variantValuesData
      }
    }
  } catch (error) {
    await session.abortTransaction()
    throw error
  }
}

const edit = async (
  slug: string,
  payload: EditProductPayload
): Promise<IApiResponse> => {
  const {
    attributes = [],
    variants = [],
    variantValues = [],
    ...editPayload
  } = payload

  const session = await mongoose.startSession()
  try {
    const editData = {
      ...editPayload,
      slug: editPayload.name && slugify(editPayload.name)
    }

    session.startTransaction()

    const editedProduct = await Product.findOneAndUpdate({ slug }, editData, {
      new: true,
      session
    })

    if (!editedProduct) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product does not exist!')
    }

    // Update attributes
    const attributesData = (
      await Promise.all(
        await ProductAttributeValue.find({
          product: editedProduct._id
        })
          .populate('attribute')
          .session(session)
      )
    ).map((attributeValue) => {
      return {
        _id: attributeValue._id,
        name: (attributeValue.attribute as any)?.name,
        value: attributeValue.value
      }
    })

    // Handle attributes from payload
    if (attributes.length > 0) {
      for (const attribute of attributes) {
        // Check attribute already exist
        const existingAttribute = await ProductAttribute.findOne({
          name: attribute.name
        }).session(session)

        // Add name to attribute collection
        let addedAttribute = null

        if (!existingAttribute) {
          addedAttribute = new ProductAttribute({
            name: attribute.name
          })

          await addedAttribute.save({ session })
        } else {
          addedAttribute = existingAttribute
        }

        const existingAttributeValue = attributesData.find(
          (item) => item.name.toLowerCase() === attribute.name.toLowerCase()
        )

        if (existingAttributeValue) {
          // Update attribute value if value change
          if (existingAttributeValue.value !== attribute.value) {
            const updatedAttributeValue =
              await ProductAttributeValue.findByIdAndUpdate(
                existingAttributeValue._id,
                {
                  value: attribute.value
                },
                {
                  new: true,
                  session
                }
              )

            if (updatedAttributeValue) {
              const indexOfAttributeValueEdited = attributesData.findIndex(
                (item) =>
                  item.name.toLowerCase() === attribute.name.toLowerCase()
              )

              attributesData[indexOfAttributeValueEdited]._id =
                updatedAttributeValue._id
              attributesData[indexOfAttributeValueEdited].name =
                addedAttribute.name
              attributesData[indexOfAttributeValueEdited].value =
                attribute.value
            }
          }
        } else {
          // Add new attribute value
          const newAttributeValue = new ProductAttributeValue({
            product: editedProduct._id,
            attribute: addedAttribute?._id,
            value: attribute.value
          })

          await newAttributeValue.save({ session })

          attributesData.push({
            _id: newAttributeValue._id,
            name: addedAttribute.name,
            value: newAttributeValue.value
          })
        }
      }
    }

    // Add variants
    if (variants.length > 0) {
      for (const variant of variants) {
        // Check variant had already existed before
        const existingVariant = await Variant.findOne({
          name: variant.name
        }).session(session)

        if (!existingVariant) {
          // Add variant
          const addedVariant = new Variant({ name: variant.name })
          await addedVariant.save({ session })

          // Add variant value
          for (const variantValue of variant.values) {
            const value = await VariantValue.findOne({
              value: variantValue
            }).session(session)

            !value &&
              (await new VariantValue({
                variant: addedVariant._id,
                valueCode: createRandomString(4).toUpperCase(),
                value: variantValue.toString()
              }).save({ session }))
          }
        } else {
          for (const variantValue of variant.values) {
            const value = await VariantValue.findOne({
              value: variantValue
            }).session(session)

            !value &&
              (await new VariantValue({
                variant: existingVariant._id,
                valueCode: createRandomString(4).toUpperCase(),
                value: variantValue.toString()
              }).save({ session }))
          }
        }
      }
    }

    if (variantValues.length > 0) {
      for (const variantData of variantValues) {
        const variantValueCodes = []

        for (const value of variantData.variantCombination) {
          const variantValue = await VariantValue.findOne({ value }).session(
            session
          )

          if (!variantValue) {
            throw new ApiError(
              StatusCodes.BAD_REQUEST,
              'Variant value is not exist.'
            )
          }

          variantValueCodes.push(variantValue.valueCode)
        }

        // Create SKU code
        const sku = variantValueCodes.sort((a: any, b: any) => a - b).join('-')

        // Update product variant value
        const existingProductVariantValue = await ProductVariantValue.findOne({
          product: editedProduct._id,
          sku
        }).session(session)

        if (existingProductVariantValue) {
          // Update
          existingProductVariantValue.price = variantData.price || 0
          existingProductVariantValue.oldPrice = variantData.oldPrice || 0
          existingProductVariantValue.stock = variantData.stock || 0
          await existingProductVariantValue.save({ session })
        } else {
          // Add new
          const addedProductVariant = new ProductVariantValue({
            product: editedProduct._id,
            price: variantData.price || 0,
            oldPrice: variantData.oldPrice || 0,
            sku,
            stock: variantData.stock || 0
          })

          await addedProductVariant.save({ session })
        }
      }
    }

    const listProductVariant = await ProductVariantValue.find({
      product: editedProduct._id
    }).session(session)

    const variantsData = await Promise.all(
      listProductVariant.map(async (item) => {
        const listValueCode = item.sku.split('-')
        const listVariantValue = await VariantValue.find({
          valueCode: { $in: listValueCode }
        })
          .populate('variant')
          .session(session)

        return {
          ...item.toObject(),
          values: listVariantValue.map((variantValueItem) => ({
            code: variantValueItem.valueCode,
            name: (variantValueItem.variant as any)?.name,
            value: variantValueItem.value
          }))
        }
      })
    )

    await session.commitTransaction()
    session.endSession()

    return {
      statusCode: StatusCodes.OK,
      message: 'Edited product is successfully.',
      data: {
        ...editedProduct.toObject(),
        attributes: attributesData,
        variants: [...variantsData]
      }
    }
  } catch (error) {
    await session.abortTransaction()
    throw error
  }
}

const getAll = async (): Promise<IApiResponse> => {
  try {
    const products = await Product.find({ _destroy: false })

    return {
      statusCode: StatusCodes.OK,
      message: 'Get all products are successfully.',
      data: products
    }
  } catch (error) {
    throw error
  }
}

const getList = async (
  query: IQueryParams
): Promise<IApiResponse<ProductList>> => {
  const {
    page = PAGE_DEFAULT,
    limit = LIMIT_DEFAULT,
    sort = SORT.ASC,
    sortBy = SORT_BY_DEFAULT
  } = query || {}
  try {
    const queries: Record<string, any> = {
      _destroy: false
    }

    const options = {
      skip: (Number(page) - 1) * Number(limit),
      limit: +limit,
      sort: { [sortBy as string]: sort }
    }

    const products = (await Product.find(queries, null, options)) as IProduct[]
    const total = await Product.countDocuments()
    const totalPages = Math.ceil(Number(total) / Number(limit))

    return {
      statusCode: StatusCodes.OK,
      message: 'Get list products are successfully.',
      data: {
        products,
        pagination: {
          currentPage: +page,
          limit: +limit,
          total,
          totalPages
        }
      }
    }
  } catch (error) {
    throw error
  }
}

const getDetails = async (slug: string): Promise<IApiResponse> => {
  try {
    const productDetails = await Product.findOne({ slug })

    if (!productDetails) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product does not exist!')
    }

    const attributeValues = await ProductAttributeValue.find({
      product: productDetails._id
    }).populate('attribute')

    const attributes = attributeValues.map((item: any) => ({
      _id: item._id,
      name: item.attribute?.name,
      value: item.value
    }))

    // Get product variants
    const productVariants = await ProductVariantValue.find({
      product: productDetails._id
    })

    const variants = await Promise.all(
      productVariants.map(async (productVariant) => {
        const { sku } = productVariant
        const varinatValueCodes = sku.split('-')

        const variantValues = await VariantValue.find({
          valueCode: { $in: varinatValueCodes },
          _destroy: false
        }).populate('variant')

        const values = variantValues.map((item) => {
          return {
            code: item.valueCode,
            name: (item.variant as any)?.name,
            value: item.value
          }
        })

        return {
          ...productVariant.toObject(),
          values
        }
      })
    )

    return {
      statusCode: StatusCodes.OK,
      message: 'Get product details is successfully.',
      data: {
        ...productDetails.toObject(),
        attributes,
        variants
      }
    }
  } catch (error) {
    throw error
  }
}

const productService = {
  addNew,
  edit,
  getAll,
  getList,
  getDetails
}

export default productService
