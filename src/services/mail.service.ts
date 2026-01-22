import * as nodemailer from "nodemailer";

console.log("MAIL_HOST =", process.env.MAIL_HOST);
console.log("MAIL_PORT =", process.env.MAIL_PORT);


const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

/* ================= FORGOT PASSWORD OTP ================= */
export const sendForgotPasswordOtpMail = async (
  to: string,
  otp: string
): Promise<void> => {
  const text = `
Reset Your Password

We received a request to reset your password.

Your OTP is: ${otp}

This OTP is valid for the next 2 minutes.

If you did not request this, please ignore this email.

Stay secure,
Team 4TYSIX
`;

  await transporter.sendMail({
    from: `"Cash Book" <${process.env.MAIL_USER}>`,
    to,
    subject: "Reset Password - OTP Verification",
    text
  });
};



/* ================= CHANGE EMAIL OTP ================= */

export const sendChangeEmailOtpMail = async (
  to: string,
  otp: string
): Promise<void> => {
  const text = `
Reset Your Password

We received a request to reset your Email.

Your OTP is: ${otp}

This OTP is valid for the next 2 minutes.

If you did not request this, please ignore this email.

Stay secure,
Team 4TYSIX
`;

  await transporter.sendMail({
    from: `"Cash Book" <${process.env.MAIL_USER}>`,
    to,
    subject: "Reset Password - OTP Verification",
    text
  });
};
