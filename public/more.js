/*
 * More by Lacy: one quiet line in the footer of each of Lacy Morrow's sites,
 * pointing at another one of them, picked at random.
 *
 * Install on any site:
 *   <div data-more-by-lacy></div>
 *   <script src="https://lacymorrow.com/more.js" defer></script>
 *
 * The line inherits the host page's font and color. If this script fails to
 * load, nothing renders and the footer is unchanged.
 *
 * To add or retire a project, edit PROJECTS below and deploy lacymorrow.com.
 * Every site picks up the change. Only list sites that are finished.
 */
;(() => {
	const PROJECTS = [
		{ name: "Juno", line: "a Mac you can talk to", url: "https://junebug.ai" },
		{ name: "Shipkit", line: "launch a Next.js app this week", url: "https://shipkit.io" },
		{ name: "Lacy Shell", line: "type plain English in your terminal", url: "https://lacy.sh" },
		{ name: "Lash", line: "an AI coding agent for your shell", url: "https://lash.lacy.sh" },
		{ name: "Bones", line: "a free Next.js starter", url: "https://bones.sh" },
		{ name: "Uibrary", line: "600+ open-source UI components", url: "https://uibrary.com" },
		{ name: "CrossOver", line: "a crosshair for any game", url: "https://crossover.lacy.sh" },
		{ name: "Paperclip Hub", line: "plugins for Paperclip", url: "https://cliphub.fyi" },
		{ name: "Prescription Finder", line: "find who has your meds in stock", url: "https://rx.lacy.sh" },
		{ name: "FPV Bible", line: "everything about flying FPV", url: "https://fpv-bible.lacy.sh" },
		{ name: "The Hitchhiker's Guide", line: "the Guide, as a website", url: "https://hitchhikersgalaxy.guide" },
		{ name: "Thneed", line: "a drawer of small AI tools", url: "https://thneed.ai" },
		{ name: "Build and Serve", line: "websites and AI systems, built for you", url: "https://buildandserve.com" },
	]

	const host = location.hostname.replace(/^www\./, "")
	const sameSite = (url) => {
		const h = new URL(url).hostname
		return h === host || host.endsWith(`.${h}`)
	}

	const render = (slot) => {
		if (slot.shadowRoot) return
		const pool = PROJECTS.filter((p) => !sameSite(p.url))
		const pick = pool[Math.floor(Math.random() * pool.length)]
		const href = new URL(pick.url)
		href.searchParams.set("utm_source", host || "local")
		href.searchParams.set("utm_medium", "more-by-lacy")

		const root = slot.attachShadow({ mode: "open" })
		root.innerHTML = `<style>
:host { display: block; font: inherit; color: inherit; }
a {
	font-size: 0.8125em; line-height: 1.5; color: inherit;
	text-decoration: none; opacity: 0.72;
	transition: opacity 150ms ease;
}
a:hover, a:focus-visible { opacity: 1; }
a:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; border-radius: 2px; }
b { font-weight: 600; }
i { font-style: normal; display: inline-block; transition: transform 150ms ease; }
a:hover i { transform: translateX(2px); }
@media (prefers-reduced-motion: reduce) { a, i { transition: none; } a:hover i { transform: none; } }
</style><a part="link">Also by Lacy Morrow: <b></b>, <span class="l"></span>&nbsp;<i aria-hidden="true">→</i></a>`
		const a = root.querySelector("a")
		a.href = href.toString()
		root.querySelector("b").textContent = pick.name
		root.querySelector(".l").textContent = pick.line
	}

	const run = () => document.querySelectorAll("[data-more-by-lacy]").forEach(render)
	if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run)
	else run()
	window.moreByLacy = run
})()
