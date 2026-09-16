import { receivingEmail, resendApiKey, resendAudienceId } from '@/config/config'
import { Resend } from 'resend'

const resend = new Resend(resendApiKey)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export class SubscribeValidationError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'SubscribeValidationError'
	}
}

export interface SubscribeInput {
	email: string
	source?: string
}

export interface SubscribeResult {
	ok: boolean
	stored: boolean
	notified: boolean
}

function escapeHtml(input: string): string {
	return input.replace(/[&<>"']/g, (c) => {
		switch (c) {
			case '&':
				return '&amp;'
			case '<':
				return '&lt;'
			case '>':
				return '&gt;'
			case '"':
				return '&quot;'
			case "'":
				return '&#39;'
			default:
				return c
		}
	})
}

export async function subscribe({ email, source }: SubscribeInput): Promise<SubscribeResult> {
	const trimmed = (email ?? '').trim().toLowerCase()
	if (!EMAIL_RE.test(trimmed)) {
		throw new SubscribeValidationError('Invalid email address.')
	}

	let stored = false
	if (resendAudienceId) {
		const { error } = await resend.contacts.create({
			email: trimmed,
			audienceId: resendAudienceId,
			unsubscribed: false,
		})
		// Duplicates from Resend surface as a validation-shaped error; treat as success.
		if (error && error.name !== 'validation_error') {
			throw new Error(error.message ?? 'Failed to store subscriber.')
		}
		stored = true
	}

	const safeEmail = escapeHtml(trimmed)
	const safeSource = source ? escapeHtml(source) : ''

	let notified = false
	try {
		const { error } = await resend.emails.send({
			from: 'Lacy Morrow <me@lacymorrow.com>',
			to: [receivingEmail],
			replyTo: trimmed,
			subject: `[lm.com] fleet log subscribe: ${trimmed}`,
			html: `
				<p>New fleet log subscriber:</p>
				<p><b>${safeEmail}</b></p>
				${safeSource ? `<p>Source: ${safeSource}</p>` : ''}
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
