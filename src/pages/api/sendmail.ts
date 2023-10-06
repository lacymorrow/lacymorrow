import sendgrid from '@/lib/sendgrid';

const handler = async (req, res) => {
	if (req.method === 'POST') {
		const data = await sendgrid(req.body)
			.then(data => {
				if (data.error) {
					throw new Error(data.error.message)
				}
				return data
			})
			.catch(error => {
				console.log(error)
				return res.status(500).json({ message: error.message })
			}
			);

		if (data?.statusText === "Accepted") {
			return res
				.status(200)
				.json({ ok: true, message: 'Message sent successfully.' });
		}

		return res.status(500).json({ message: 'Message failed to send.' })
	}

	return res.status(404).json({ message: '404 Not Found' });
};

export default handler;
