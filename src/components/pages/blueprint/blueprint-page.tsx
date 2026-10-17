import Link from 'next/link';

import { keynotes, overallDimension, titleBlock } from '@/data/blueprint';
import { BlueprintSheet } from './blueprint-sheet';

export const BlueprintPage = () => (
	<div className="bp-root">
		<Link className="bp-escape" href="/">
			&larr; lacymorrow.com
		</Link>

		<main className="bp-sheet">
			<header className="bp-head">
				<p className="bp-stamp">Sheet A-01 &middot; Not for construction</p>
				<h1 className="bp-title">Sectional elevation of a person</h1>
				<p className="bp-premise">
					Same drawing an architect makes of a house. Different subject.
				</p>
			</header>

			<figure className="bp-figure">
				<BlueprintSheet />
				<figcaption className="bp-dimension-label">
					<span>{overallDimension.span}</span>
					<span className="bp-dimension-measure">
						{overallDimension.measure}
					</span>
				</figcaption>
			</figure>

			<section className="bp-keynotes" aria-labelledby="bp-keynotes-heading">
				<h2 className="bp-keynotes-heading" id="bp-keynotes-heading">
					Keynotes
				</h2>
				<ol className="bp-keynote-list">
					{keynotes.map((keynote) => (
						<li className="bp-keynote" key={keynote.code}>
							<p className="bp-keynote-mark">
								<span className="bp-keynote-number" aria-hidden="true">
									{keynote.number}
								</span>
								<span className="bp-keynote-code">{keynote.code}</span>
								<span className="bp-keynote-system">{keynote.system}</span>
							</p>
							<h3 className="bp-keynote-title">{keynote.title}</h3>
							<ul className="bp-keynote-items">
								{keynote.items.map((item) => (
									<li key={item}>{item}</li>
								))}
							</ul>
						</li>
					))}
				</ol>
			</section>

			<div className="bp-action">
				<Link className="bp-button" href="/work">
					View the work &rarr;
				</Link>
			</div>

			<section className="bp-title-block" aria-label="Title block">
				<dl>
					{titleBlock.map((field) => (
						<div className="bp-field" key={field.label}>
							<dt>{field.label}</dt>
							<dd>{field.value}</dd>
						</div>
					))}
				</dl>
			</section>
		</main>
	</div>
);
