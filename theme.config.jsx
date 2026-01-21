import Logo from '@/components/images/logo';
import Footer from '@/components/layout/footer';
import { EnvelopeClosedIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useConfig } from 'nextra-theme-docs';

const title = "Lacy Morrow";
const description = "Lacy Morrow is a leading web and software engineer, UAV operator, and the creator of Crossover and other open-source projects.";
const ogImage = "https://lacy.is/api/og";
const ogUrl = "https://lacymorrow.com";
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
		return asPath !== '/' ? { titleTemplate: '%s – Lacy' } : {}
	},
	project: { link: githubUrl },
	chat: {
		link: `${ogUrl}/contact`,
		icon: (<EnvelopeClosedIcon className='h-6 w-6' />),
	},
	navigation: { prev: true, next: true },
	toc: { backToTop: true, float: true },
	banner: {
		text: (
			<Link href="https://shipkit.io" target="_blank">
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
		const { title: pageTitle } = useConfig()
		const { route, asPath } = useRouter()
		const socialCard = route === '/' || !pageTitle ? ogImage : `${ogImage}?title=${pageTitle}`
		const canonicalUrl = `${ogUrl}${asPath === '/' ? '' : asPath.split('?')[0].split('#')[0]}`

		// JSON-LD Structured Data for Person (site owner)
		const personSchema = {
			"@context": "https://schema.org",
			"@type": "Person",
			"name": "Lacy Morrow",
			"url": ogUrl,
			"image": "https://avatars.githubusercontent.com/u/1311301?v=4",
			"sameAs": [
				"https://github.com/lacymorrow",
				"https://twitter.com/lacymorrow",
				"https://linkedin.com/in/lacymorrow",
				"https://shipkit.io"
			],
			"jobTitle": "Software Engineer",
			"worksFor": {
				"@type": "Organization",
				"name": "Shipkit"
			},
			"knowsAbout": ["Web Development", "React", "Next.js", "TypeScript", "Open Source", "UAV/Drone Operation"],
			"description": description
		}

		// JSON-LD for WebSite
		const websiteSchema = {
			"@context": "https://schema.org",
			"@type": "WebSite",
			"name": title,
			"url": ogUrl,
			"description": description,
			"author": {
				"@type": "Person",
				"name": "Lacy Morrow"
			}
		}

		return (
			<>
				<meta name="msapplication-TileColor" content="#fff" />
				<meta name="theme-color" content="#fff" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta httpEquiv="Content-Language" content="en" />
				<meta name="description" content={description} />
				<meta name="og:description" content={description} />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:image" content={socialCard} />
				<meta name="twitter:site:domain" content={ogUrl.replace('https://', '')} />
				<meta name="twitter:url" content={ogUrl} />
				<meta name="og:title" content={pageTitle ? `${pageTitle} – ${title}` : title} />
				<meta name="og:image" content={socialCard} />
				<meta name="og:url" content={canonicalUrl} />
				<meta name="og:type" content="website" />
				<meta name="apple-mobile-web-app-title" content={title} />
				
				{/* Canonical URL */}
				<link rel="canonical" href={canonicalUrl} />
				
				{/* Favicons */}
				<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
				<link rel="icon" href="/favicon.png" type="image/png" />
				<link rel="icon" href="/favicon-dark.svg" type="image/svg+xml" media="(prefers-color-scheme: dark)" />
				<link rel="icon" href="/favicon-dark.png" type="image/png" media="(prefers-color-scheme: dark)" />
				
				{/* JSON-LD Structured Data */}
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
				/>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
				/>
			</>
		)
	},
	footer: { text: (<Footer />) }
}

export default themeConfig;
