import nodeMailer from "nodemailer";
import config from "../config";

const sendMail = async (to, subject, htmlContent) => {
    const transport = nodeMailer.createTransport({
        host: config.mail_host,
        port: config.mail_port,
        secure: false,
        auth: {
            user: config.mail_username,
            pass: config.mail_password,
        }
    })

    const options = {
        from: config.mail_from_address,
        to: to,
        subject: subject,
        html: htmlContent
    }
    return await transport.sendMail(options);
}

export default sendMail;