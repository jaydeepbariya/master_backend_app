import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

const mailSender = async (to, title, body) => {

    const info = await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: to,
        subject: title,
        html: body
    });

    return info;
}

export default mailSender;