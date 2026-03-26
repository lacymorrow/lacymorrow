import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang="en">
            <Head />
            <body>
                <Main />
                <NextScript />
                <script
                    defer
                    src="https://analytics.lacy.sh/script.js"
                    data-website-id="3596ceb9-e3cc-401a-822e-a1cfeb21e509"
                />
            </body>
        </Html>
    )
}