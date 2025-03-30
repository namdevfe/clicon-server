import { env } from '~/config/environment'
import { SendMailVerifyOTPTypes } from '~/types/userType'

const generateHTMLVerifyOTP = (data: SendMailVerifyOTPTypes) => {
  const { firstName, lastName, otpCode } = data

  const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác thực tài khoản</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
        }
        .email-header {
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            text-align: center;
        }
        .email-body {
            padding: 20px;
            font-size: 16px;
            line-height: 1.6;
        }
        .otp-code {
            font-size: 24px;
            font-weight: bold;
            color: #4CAF50;
            padding: 10px;
            border: 2px solid #4CAF50;
            border-radius: 5px;
            background-color: #f1f1f1;
        }
        .footer {
            background-color: #f1f1f1;
            padding: 10px;
            text-align: center;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h2>Xác thực tài khoản của bạn</h2>
        </div>
        <div class="email-body">
            <p>Kính gửi ${lastName} ${firstName},</p>
            <p>Chúng tôi đã nhận được yêu cầu xác thực tài khoản từ bạn. Để hoàn tất quy trình xác thực, vui lòng nhập mã OTP (One-Time Password) dưới đây vào hệ thống của chúng tôi:</p>
            
            <div class="otp-code">
                ${otpCode}
            </div>

            <p>Lưu ý: Mã OTP này có hiệu lực trong vòng 5 phút kể từ thời điểm bạn nhận được email này. Nếu bạn không yêu cầu mã OTP, vui lòng bỏ qua email này.</p>

            <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
        </div>
        <div class="footer">
            <p>Trân trọng,</p>
            <p>Admin: ${env.ADMIN_EMAIL_ADDRESS}</p>
            <p>Clicon</p>
            <p>Số điện thoại: 0377-813-805</p>
            <p><em>Đây là email tự động, vui lòng không trả lời trực tiếp vào email này.</em></p>
        </div>
    </div>
</body>
</html>
`

  return html
}

export default generateHTMLVerifyOTP
