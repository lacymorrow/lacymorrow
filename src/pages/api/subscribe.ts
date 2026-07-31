import type { NextApiRequest, NextApiResponse } from 'next'
import { subscribe } from '@/lib/subscribe'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method not allowed' })
	}

	try {
		const { email, source } = (req.body ?? {}) as { email?: string; source?: string }
		if (!email || typeof email !== 'string') {
			return res.status(400).json({ message: 'Email is required.' })
		}
		const result = await subscribe({ email, source })
		return res.status(200).json(result)
	} catch (error: any) {
		return res.status(400).json({ message: error?.message ?? 'Subscription failed.' })
	}
}

export default handler
