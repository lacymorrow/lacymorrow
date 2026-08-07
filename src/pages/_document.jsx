import { Head, Html, Main, NextScript } from 'next/document'

// Set data-mood on <html> before first paint so the bespoke faces never
// flash the wrong palette. Route-native default (/ → aurora, /work → daybreak)
// unless the visitor made an explicit choice. Also nudges next-themes' .dark
// class to agree when no explicit theme is stored.
const NO_FLASH_MOOD = `(function(){try{
var path=location.pathname;
var isFace=path==='/'||path==='/work';
var explicit=localStorage.getItem('mood:explicit')==='1';
var stored=localStorage.getItem('mood');
var mood=(explicit&&stored)?stored:(path.indexOf('/work')===0?'daybreak':'aurora');
document.documentElement.setAttribute('data-mood',mood);
// Only couple the .dark class on the bespoke faces; leave Nextra docs pages
// to next-themes (system) so we don't override their theme.
if(isFace){var t=localStorage.getItem('theme');if(!t||t==='system'){document.documentElement.classList.toggle('dark',mood==='aurora');}}
}catch(e){}})();`

export default function Document() {
    return (
        <Html lang="en" suppressHydrationWarning>
            <Head>
                <script dangerouslySetInnerHTML={{ __html: NO_FLASH_MOOD }} />
            </Head>
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