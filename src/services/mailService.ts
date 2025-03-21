import { OAuth2Client } from 'google-auth-library'
import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import ApiError from '~/utils/ApiError'
import nodemailer, { TransportOptions } from 'nodemailer'
import { ISendMail } from '~/types/mailType'

const sendMail = async ({
  email = '',
  subject = '',
  content = ''
}: ISendMail) => {
  try {
    if (!email || !subject || !content) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Please provide email, subject and content'
      )
    }

    // Khởi tạo OAuth2Client với Client ID và Client Secret
    const oauth2Client = new OAuth2Client(
      env.GOOGLE_MAILER_CLIENT_ID,
      env.GOOGLE_MAILER_CLIENT_SECRET
    )

    // Set Refresh Token vào OAuth2Client Credentials
    oauth2Client.setCredentials({
      refresh_token: env.GOOGLE_MAILER_REFRESH_TOKEN
    })

    /**
     * Lấy AccessToken từ RefreshToken (bởi vì Access Token cứ một khoảng thời gian ngắn sẽ bị hết hạn)
     * Vì vậy mỗi lần sử dụng Access Token, chúng ta sẽ generate ra một thằng mới là chắc chắn nhất.
     */
    const acccessTokenObject = await oauth2Client.getAccessToken()
    // Access Token sẽ nằm trong property 'token' trong Object mà chúng ta vừa get được ở trên
    const accessToken = acccessTokenObject?.token
    // Tạo một biến Transport từ Nodemailer với đầy đủ cấu hình, dùng để gọi hành động gửi mail
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: env.ADMIN_EMAIL_ADDRESS,
        clientId: env.GOOGLE_MAILER_CLIENT_ID,
        clientSecret: env.GOOGLE_MAILER_CLIENT_SECRET,
        refresh_token: env.GOOGLE_MAILER_REFRESH_TOKEN,
        accessToken
      }
    } as TransportOptions)
    // mailOption là những thông tin gửi từ phía client lên thông qua API
    const mailOptions = {
      to: email, // Gửi đến ai?
      subject: subject, // Tiêu đề email
      html: content // Nội dung email
    }
    // Gọi hành động gửi email
    await transport.sendMail(mailOptions)
    // Không có lỗi gì thì trả về success
    return {
      statusCode: StatusCodes.OK,
      message: 'Send mail is successfully'
    }
  } catch (error) {
    throw error
  }
}

const mailService = {
  sendMail
}

export default mailService
