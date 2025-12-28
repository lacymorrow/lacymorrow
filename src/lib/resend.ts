// todo: block spam
// - robertres lucido.leinteract@gmail.com

import { receivingEmail, resendApiKey } from "@/config/config";
import { Resend } from "resend";

const resend = new Resend(resendApiKey);

const sendEmail = async (props: {
	name: string;
	email: string;
	tel?: string;
	subject?: string;
	message: string;
	[key: string]: any;
}) => {
	const { name, email, tel, subject, message, ...rest } = props;

	console.log('resend email to:', receivingEmail);

	const { data, error } = await resend.emails.send({
		from: 'Lacy Morrow <me@lacymorrow.com>',
		to: [receivingEmail],
		replyTo: email,
		subject: `👻 [lm.com] ${name}${subject ? `: ${subject}` : ''}`,
		html: `
			<p>Via <b>${name}</b>:</p>
			${tel ? `<p>${tel}</p>` : ''}
			${email ? `<p>${email}</p>` : ''}
			${subject ? `<p>${subject}</p>` : ''}
			<p>${message}</p>
			${Object.keys(rest).length > 0 ? `<p>${JSON.stringify(rest)}</p>` : ''}
		`,
	});

	if (error) {
		throw error;
	}

	return data;
};

export default sendEmail;

