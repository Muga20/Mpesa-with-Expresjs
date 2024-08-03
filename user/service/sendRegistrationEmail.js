const nodemailer = require("nodemailer");

// this process.end lines of code are conceals information for the application stored in the .env file
const baseUrl = process.env.BASE_URL;
const host = process.env.HOST;
const port = process.env.PORT;
const secure = process.env.SECURE === "true";
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

require("dotenv").config();

// Function to send the registration link to the user's email
const sendRegistrationLinkToEmail = async (
  email,
  registrationToken,
  registrationTimestamp
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: secure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const registrationURL = `http://localhost:3000/account/profile?token=${registrationToken}&timestamp=${registrationTimestamp}`;

    const mailOptions = {
      from: smtpUser,
      to: email,
      subject: "Complete Registration",
      html: `
      <div className="bg-gray-900 p-4">
      <header className="text-white text-center text-2xl font-semibold">Arts Market</header>
      </div>
    
       <div className="p-6">
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-2xl font-semibold mb-2">Thank you for registering!</h2>
        <p className="text-base mb-4">Please click the link below to complete your registration:</p>
        <a style="color: #007bff; text-decoration: underline;" href="${registrationURL}">${registrationURL}</a>
      </div>
      </div>
    
      <div className="bg-gray-900 p-4 mt-4">
      <footer className="text-sm text-center text-gray-600 ">
         ArtMarket  All Rights Reserved.
      </footer>
      </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending registration link:", error);
    throw new Error("Error sending registration link");
  }
};
