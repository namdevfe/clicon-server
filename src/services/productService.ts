import { StatusCodes } from "http-status-codes"
import mongoose from "mongoose"
import {
  LIMIT_DEFAULT,
  PAGE_DEFAULT,
  SORT,
  SORT_BY_DEFAULT,
} from "~/constants/pagination"
import ProductAttribute, {
  PRODUCT_ATTRIBUTE_COLLECTION_NAME,
} from "~/models/productAttributeModel"
import ProductAttributeValue from "~/models/productAttributeValueModel"
import Product from "~/models/productModel"
import ProductVariantValue from "~/models/productVariantValue"
import Variant from "~/models/variantModel"
import VariantValue from "~/models/variantValueModel"
import { IApiResponse, IQueryParams } from "~/types/common"
import {
  AddProductPayload,
  EditProductPayload,
  IProduct,
  ProductList,
  variants,
  formatvariants,
} from "~/types/productType"
import ApiError from "~/utils/ApiError"
import slugify from "~/utils/slugify"

const addNew = async (payload: AddProductPayload): Promise<IApiResponse> => {
  const {
    attributes = [],
    variants = [],
    variantValues = [],
    ...addProductPayload
  } = payload
  try {
    const existingProduct = await Product.findOne({
      name: addProductPayload.name,
    })

    if (existingProduct) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Product name had already exist!"
      )
    }

    // Add product
    const addData = {
      ...addProductPayload,
      slug: slugify(addProductPayload.name),
    }

    const addedProduct = await Product.create(addData)

    // Add attributes
    if (attributes.length > 0) {
      for (const attribute of attributes) {
        // Check attribute already exist
        const existingAttribute = await ProductAttribute.findOne({
          name: attribute.name,
        })
        // Add name to attribute collection
        let addedAttribute = null
        if (!existingAttribute) {
          addedAttribute = await ProductAttribute.create({
            name: attribute.name,
          })
        } else {
          addedAttribute = await ProductAttribute.findOne({
            name: attribute.name,
          })
        }

        // Add value to attribute value collection
        await ProductAttributeValue.create({
          product: addedProduct._id,
          attribute: addedAttribute?._id,
          value: attribute.value,
        })
      }
    }

    // Add variants
    if (variants.length > 0) {
      for (const variant of variants) {
        // Check variant had already existed before
        const existingVariant = await Variant.findOne({ name: variant.name })
        if (!existingVariant) {
          // Add variant
          const addedVariant = await Variant.create({ name: variant.name })
          // Add variant value
          for (const variantValue of variant.values) {
            await VariantValue.create({
              variant: addedVariant._id,
              value: variantValue.toString(),
            })
          }
        }
      }
    }

    // Add product variant values
    if (variantValues.length > 0) {
      for (const variantData of variantValues) {
        const variantValueIds = []

        for (const value of variantData.variantCombination) {
          const variantValue = await VariantValue.findOne({ value })
          variantValue && variantValueIds.push(variantValue._id)
        }

        // Create SKU code. Example: 'id1-id2-id3-...'
        const sku = variantValueIds.sort((a: any, b: any) => a - b).join("-")

        // Add new product variant value
        await ProductVariantValue.create({
          product: addedProduct._id,
          price: variantData.price,
          oldPrice: variantData.oldPrice || 0,
          sku,
          stock: variantData.stock || 0,
        })
      }
    }

    return {
      statusCode: StatusCodes.CREATED,
      message: "Added product is successfully.",
      data: addedProduct,
    }
  } catch (error) {
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
  try {
    const editData = {
      ...editPayload,
      slug: editPayload.name && slugify(editPayload.name),
    }

    const editedProduct = await Product.findOneAndUpdate({ slug }, editData, {
      new: true,
    })

    if (!editedProduct) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Product does not exist!")
    }

    // Update attributes
    if (attributes.length > 0) {
      for (const attribute of attributes) {
        // Check attribute already exist
        const existingAttribute = await ProductAttribute.findOne({
          name: attribute.name,
        })
        // Add name to attribute collection
        let addedAttribute = null
        if (!existingAttribute) {
          addedAttribute = await ProductAttribute.create({
            name: attribute.name,
          })
        } else {
          addedAttribute = await ProductAttribute.findOne({
            name: attribute.name,
          })
        }

        // Check attribute value is created before
        const existingAttributeValue = await ProductAttributeValue.findOne({
          product: editedProduct._id,
          value: attribute.value,
        })

        if (!existingAttributeValue) {
          // Add value to attribute value collection
          await ProductAttributeValue.create({
            product: editedProduct._id,
            attribute: addedAttribute?._id,
            value: attribute.value,
          })
        }
      }
    }

    // Add variants
    if (variants.length > 0) {
      for (const variant of variants) {
        // Check variant had already existed before
        const existingVariant = await Variant.findOne({ name: variant.name })
        if (!existingVariant) {
          // Add variant
          const addedVariant = await Variant.create({ name: variant.name })
          // Add variant value
          for (const variantValue of variant.values) {
            await VariantValue.create({
              variant: addedVariant._id,
              value: variantValue.toString(),
            })
          }
        }
      }
    }

    // Add product variant values
    if (variantValues.length > 0) {
      for (const variantData of variantValues) {
        const variantValueIds = []

        for (const value of variantData.variantCombination) {
          const variantValue = await VariantValue.findOne({ value })
          variantValue && variantValueIds.push(variantValue._id)
        }

        // Create SKU code. Example: 'id1-id2-id3-...'
        const sku = variantValueIds.sort((a: any, b: any) => a - b).join("-")

        // Update product variant value
        const existingProductVariantValue = await ProductVariantValue.findOne({
          product: editedProduct._id,
          sku,
        })

        if (existingProductVariantValue) {
          // Update
          existingProductVariantValue.price = variantData.price || 0
          existingProductVariantValue.oldPrice = variantData.oldPrice || 0
          existingProductVariantValue.stock = variantData.stock || 0
          await existingProductVariantValue.save()
        } else {
          // Add new
          await ProductVariantValue.create({
            product: editedProduct._id,
            price: variantData.price || 0,
            oldPrice: variantData.oldPrice || 0,
            sku,
            stock: variantData.stock || 0,
          })
        }
      }
    }

    return {
      statusCode: StatusCodes.OK,
      message: "Edited product is successfully.",
      data: editedProduct,
    }
  } catch (error) {
    throw error
  }
}

const getAll = async (): Promise<IApiResponse> => {
  try {
    const products = await Product.find({ _destroy: false })

    return {
      statusCode: StatusCodes.OK,
      message: "Get all products are successfully.",
      data: products,
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
    sortBy = SORT_BY_DEFAULT,
  } = query || {}
  try {
    const queries: Record<string, any> = {
      _destroy: false,
    }

    const options = {
      skip: (Number(page) - 1) * Number(limit),
      limit: +limit,
      sort: { [sortBy as string]: sort },
    }

    const products = (await Product.find(queries, null, options)) as IProduct[]
    const total = await Product.countDocuments()
    const totalPages = Math.ceil(Number(total) / Number(limit))

    return {
      statusCode: StatusCodes.OK,
      message: "Get list products are successfully.",
      data: {
        products,
        pagination: {
          currentPage: +page,
          limit: +limit,
          total,
          totalPages,
        },
      },
    }
  } catch (error) {
    throw error
  }
}

const getDetails = async (slug: string): Promise<IApiResponse> => {
  try {
    const productDetails = await Product.findOne({ slug })
    if (!productDetails) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Product does not exist!")
    }

    const attributeValues = await ProductAttributeValue.find({
      product: productDetails._id,
    }).populate("attribute")

    const attributes = attributeValues.map((item: any) => ({
      name: item.attribute?.name,
      value: item.value,
    }))

    const arraySkus = await ProductVariantValue.find(
      { product: productDetails._id },
      { sku: 1, _id: 0 } // chỉ lấy field `sku`
    ).lean() // trả về plain JS object
    let variants: formatvariants[] = []
    if (arraySkus.length > 0) {
      const uniqueIds: string[] = []
      for (const item of arraySkus) {
        const parts = item.sku.split("-")
        for (const id of parts) {
          if (!uniqueIds.includes(id)) {
            uniqueIds.push(id)
          }
        }
      }
      // map Set thành mảng ObjectId của monggo
      const objectIds = uniqueIds.map((id) => new mongoose.Types.ObjectId(id))
      const pipeline = [
        // chỉ lấy docs có _id nằm trong list
        {
          $match: { _id: { $in: objectIds } },
        },
        // join sang collection variants để lấy tên variant (Color, RAM,…)
        {
          $lookup: {
            from: "variants", // tên collection bên MongoDB
            localField: "variant", // field reference bên ProductVariant
            foreignField: "_id", // field _id bên Variant
            as: "variantInfo",
          },
        },
        {
          $unwind: "$variantInfo", // biến mảng thành object
        },
        // gom nhóm theo tên variant
        {
          $group: {
            _id: "$variantInfo.name",
            items: {
              $push: {
                id: "$_id",
                value: "$value",
              },
            },
          },
        },
      ]

      const variantValue: variants[] = await VariantValue.aggregate(pipeline)

      variants = variantValue.map((group) => ({
        name: group._id,
        items: group.items.map((item) => ({
          id: item.id.toString(),
          value: item.value,
        })),
      }))
    }

    return {
      statusCode: StatusCodes.OK,
      message: "Get product details is successfully.",
      data: {
        ...productDetails.toObject(),
        attributes,
        variants,
      },
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
  getDetails,
}

export default productService
