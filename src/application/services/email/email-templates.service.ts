export const getEmailTemplate = (
  type: string,
  otp?: string
): { subject: string; html: string } => {
  let subject = "";
  let message = "";

  switch (type) {
    case "otp":
      subject = "Welcome to ByteStack - Your OTP for Verification";
      message = `Welcome to ByteStack! We're excited to have you on board. Please use the verification code below to activate your account.`;
      break;

    case "resend-otp":
      subject = "Your Resent OTP for ByteStack Verification";
      message = `Here's your new OTP to complete your verification process.`;
      break;

    case "forgot-password":
      subject = "Password Reset Request for ByteStack";
      message = `Use the following OTP to reset your password and regain access to your account.`;
      break;

    default:
      throw new Error("Invalid email type");
  }

  const emailContent = `
    <!DOCTYPE html>
    <html lang="en">
  
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body {
          font-family: 'Helvetica', Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f9f9f9;
        }
  
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
          text-align: center;
        }
  
        h1 {
          color: #333333;
          margin-bottom: 20px;
        }
  
        p {
          color: #555555;
          line-height: 1.6;
          margin-bottom: 20px;
        }
  
        .otp {
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 4px;
          background-color: #f3f4f6;
          padding: 10px 20px;
          border-radius: 8px;
          display: inline-block;
          margin-bottom: 20px;
        }
  
        .footer {
          margin-top: 30px;
          font-size: 12px;
          color: #888888;
        }
      </style>
    </head>
  
    <body>
      <div class="container">
        <h1>${subject}</h1>
        <p>${message}</p>
        <div class="otp">${otp || "XXXXXX"}</div>
        <p>This code is valid for <strong>3 minutes</strong>. Please do not share this code with anyone.</p>
        <p>If you didn’t request this, you can safely ignore this email.</p>
      </div>
    </body>
  
    </html>
    `;

  return { subject, html: emailContent };
};
