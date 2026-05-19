import Logo from '@/components/images/logo';
import Footer from '@/components/layout/footer';
import { EnvelopeClosedIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useConfig } from 'nextra-theme-docs';

const title = "Lacy Morrow";
const description = "Lacy Morrow is a leading web and software engineer, UAV operator, and the creator of Crossover and other open-source projects.";
const ogImage = "https://lacy.is/api/og";
const ogUrl = "https://www.lacymorrow.com";
const githubUrl = 'https://github.com/lacymorrow/';

const themeConfig = {
	docsRepositoryBase: `${githubUrl}lacymorrow/tree/main`,
	logo: Logo,
	logoLink: '/',
	primaryHue: 310,
	faviconGlyph: '🧬',
	feedback: {
		content: 'Questions? Leave feedback →',
		labels: 'feedback'
	},
	editLink: {
		text: 'Edit on GitHub →',
	},
	useNextSeoProps() {
		const { asPath } = useRouter()
		const { frontMatter } = useConfig()
		const pageDescription = frontMatter?.description || description
		if (asPath === '/') return { titleTemplate: title, description: pageDescription }
		return { titleTemplate: `%s – ${title}`, description: pageDescription }
	},
	project: { link: githubUrl },
	chat: {
		link: `${ogUrl}/contact`,
		icon: (<EnvelopeClosedIcon className='h-6 w-6' />),
	},
	navigation: { prev: true, next: true },
	toc: { backToTop: true, float: true },
	search: { placeholder: 'Search lacymorrow.com…' },
	banner: {
		text: (
			<Link href="https://shipkit.io" target="_blank" rel="noopener noreferrer">
				🚀  Launch your app today with Shipkit →
			</Link>
		)
	},
	sidebar: {
		toggleButton: true,
		defaultMenuCollapseLevel: 1,
		autoCollapse: true,
		titleComponent({ title, type }) {
			return type === 'separator' ? <span className="cursor-default">{title}</span> : <>{title}</>
		},
	},
	head: function useHead() {
		const { title: pageTitle, frontMatter } = useConfig()
		const { route } = useRouter()
		const socialCard = route === '/' || !pageTitle ? ogImage : `${ogImage}?title=${pageTitle}`
		const canonicalUrl = `${ogUrl}${route === '/' ? '' : route}`
		const pageDescription = frontMatter?.description || description

		const personSchema = {
			'@context': 'https://schema.org',
			'@type': 'Person',
			name: 'Lacy Morrow',
			url: ogUrl,
			image: 'https://www.lacymorrow.com/images/lacy-morrow.jpg',
			jobTitle: 'Software Engineer',
			description: description,
			sameAs: [
				'https://github.com/lacymorrow',
				'https://www.linkedin.com/in/lacymorrow/',
				'https://twitter.com/lacybuilds',
			],
		}

		const webSiteSchema = {
			'@context': 'https://schema.org',
			'@type': 'WebSite',
			name: title,
			url: ogUrl,
			description: description,
			author: { '@type': 'Person', name: 'Lacy Morrow', url: ogUrl },
		}

		return (
			<>
				<meta charSet="utf-8" />
				<meta name="msapplication-TileColor" content="#fff" />
				<meta name="theme-color" content="#fff" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta httpEquiv="Content-Language" content="en" />
				<meta property="og:description" content={pageDescription} />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:image" content={socialCard} />
				<meta name="twitter:site:domain" content={ogUrl.replace('https://', '')} />
				<meta name="twitter:url" content={canonicalUrl} />
				<meta property="og:title" content={pageTitle ? `${pageTitle} – ${title}` : title} />
				<meta property="og:image" content={socialCard} />
				<meta property="og:url" content={canonicalUrl} />
				<meta property="og:type" content="website" />
				<meta name="apple-mobile-web-app-title" content={title} />
				<link rel="canonical" href={canonicalUrl} />
				<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
				<link rel="icon" href="/favicon.png" type="image/png" />
				<link rel="icon" href="/favicon-dark.svg" type="image/svg+xml" media="(prefers-color-scheme: dark)" />
				<link rel="icon" href="/favicon-dark.png" type="image/png" media="(prefers-color-scheme: dark)" />
				{route === '/' && (
					<>
						<script
							type="application/ld+json"
							dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
						/>
						<script
							type="application/ld+json"
							dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
						/>
					</>
				)}
			</>
		)
	},
	footer: { text: (<Footer />) }
}

export default themeConfig;
