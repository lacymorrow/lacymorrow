import { receivingEmail, resendApiKey, resendAudienceId } from '@/config/config'
import { Resend } from 'resend'

const resend = new Resend(resendApiKey)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface SubscribeInput {
	email: string
	source?: string
}

export interface SubscribeResult {
	ok: boolean
	stored: boolean
	notified: boolean
}

export async function subscribe({ email, source }: SubscribeInput): Promise<SubscribeResult> {
	const trimmed = (email ?? '').trim().toLowerCase()
	if (!EMAIL_RE.test(trimmed)) {
		throw new Error('Invalid email address.')
	}

	let stored = false
	if (resendAudienceId) {
		const { error } = await resend.contacts.create({
			email: trimmed,
			audienceId: resendAudienceId,
			unsubscribed: false,
		})
		// Duplicates from Resend are treated as success.
		if (error && !/already exists|duplicate/i.test(error.message ?? '')) {
			throw new Error(error.message ?? 'Failed to store subscriber.')
		}
		stored = true
	}

	let notified = false
	try {
		const { error } = await resend.emails.send({
			from: 'Lacy Morrow <me@lacymorrow.com>',
			to: [receivingEmail],
			replyTo: trimmed,
			subject: `🚀 [lm.com] fleet log subscribe: ${trimmed}`,
			html: `
				<p>New fleet log subscriber:</p>
				<p><b>${trimmed}</b></p>
				${source ? `<p>Source: ${source}</p>` : ''}
				<p>Stored in Resend audience: ${stored ? 'yes' : 'no (RESEND_AUDIENCE_ID not set)'}</p>
			`,
		})
		notified = !error
	} catch {
		// Notification failure is non-fatal if the subscriber was stored.
	}

	if (!stored && !notified) {
		throw new Error('Subscription failed.')
	}

	return { ok: true, stored, notified }
}
