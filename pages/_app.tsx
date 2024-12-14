import "../styles/globals.css";
import { AppProps } from "next/app";
import Layout from "../components/layout";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Free Green Energy</title>
        <meta
          name="description"
          content="We provide the best solar solutions for your home and business."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/fge-logo.png" />
        <meta property="og:title" content="Free Green Energy" />
        <meta
          property="og:description"
          content="We provide the best solar solutions for your home and business."
        />
        <meta property="og:image" content="/images/fge-logo.png" />
        <meta property="og:url" content="https://www.yoursite.com" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
