import NextApp from "next/app";
import type { AppProps } from "next/app";
import { componentMap } from "@/components/mdx/mdxComponents";
import { Toaster } from "@/components/ui/toaster";

import { useEffect } from "react";
import consoleBanner from "@/lib/consoleBanner";

import "@/styles/globals.scss";
import 'react-medium-image-zoom/dist/styles.css'


function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    consoleBanner();
  }, []);

  return (
    <>
      <main className="wrapper">
        <Component {...pageProps} components={componentMap} />
      </main>
      <Toaster />
    </>
  );
}

App.getInitialProps = NextApp.getInitialProps;

export default App;
