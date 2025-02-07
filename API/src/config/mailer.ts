import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

const mailSender = process.env.MAIL_SENDER 
const pass = process.env.PASSWORD

const transporter = nodemailer.createTransport({
	host: 'smtp.ethereal.email',
	port: 587,
	auth: {
		user: mailSender,
		pass:pass 
	},
});

export class Mailer {
	static createMessageObject(
		emailToBeSendedTo: string,
		subject: string,
		messageText: string
	) {
		const messageObject = {
			from: mailSender,
			to: emailToBeSendedTo,
			subject: subject,
			text: messageText,
		};

		return messageObject;
	}

	public static sendEmail(
		emailToBeSendedTo: string,
		subject: string,
		messageText: string
	) {

		const messageObject = Mailer.createMessageObject(
			emailToBeSendedTo,
			subject,
			messageText
		);

		transporter.sendMail(messageObject, (error) => {
			if (error != null) {
				throw error;
			}
		});
	}
}