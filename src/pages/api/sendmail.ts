import { NextApiRequest, NextApiResponse } from 'next';
import sendEmail from '@/lib/resend';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'POST') {
		try {
			await sendEmail(req.body);
			return res
				.status(200)
				.json({ ok: true, message: 'Your message was sent, thanks for reaching out  🚀' });
		} catch (error: any) {
			console.log(error);
			return res.status(500).json({ message: error.message || 'Message failed to send.' });
		}
	}

	return res.status(404).json({ message: '404 Not Found' });
};

export default handler;
