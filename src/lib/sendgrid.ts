// import fetch from 'node-fetch';

import { receivingEmail, sendgridApiKey } from "@/config/config";

const SENDGRID_API = 'https://api.sendgrid.com/v3/mail/send';

const sendgrid = async (props) => {
	const { name, email, tel, subject, message, ...rest } = props;

	const body = {
		personalizations: [
			{
				to: [
					{
						email: receivingEmail,
					},
				],
				subject: `👻 [lm.com] ${name} ${subject && `: ${subject}`}`,
			},
		],
		from: {
			email: 'me@lacymorrow.com',
			name: `Lacy Morrow`,
		},
		replyTo: {
			email,
			name
		},
		content: [
			{
				type: 'text/html',
				value: `
					<p>Via <b>${name}</b>:</p>
					${tel && `<p>${tel}</p>`}
					${email && `<p>${email}</p>`}
					${subject && `<p>${subject}</p>`}
					<p>${message}</p>
					${rest && `<p>${JSON.stringify(rest)}</p>`}
				`,
			},
		],
	}

	const data = await fetch(SENDGRID_API, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${sendgridApiKey}`,
		},
		body: JSON.stringify(body),
	});

	return data
};

export default sendgrid;
