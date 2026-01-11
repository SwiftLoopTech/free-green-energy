import "../styles/globals.css";
import { AppProps } from "next/app";
import Layout from "../components/layout";
import Head from "next/head";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Additional structured data for enhanced SEO
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Future Green Energy",
    image: "https://www.fgesolar.in/images/fge-logo.png",
    description:
      "Leading solar solutions provider in Kochi, Kerala, offering comprehensive solar panel installation for homes and businesses",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Solar Solutions Center",
      addressLocality: "Kochi",
      addressRegion: "Kerala",
      postalCode: "682xxx",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 9.9312,
      longitude: 76.2673,
    },
    telephone: "+91-XXXXXXXXXX",
    url: "https://www.fgesolar.in",
    priceRange: "$$$",
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: 9.9312,
        longitude: 76.2673,
      },
      geoRadius: "50 km",
    },
    knowsAbout: [
      "Solar Panel Installation",
      "Residential Solar Solutions",
      "Commercial Solar Systems",
      "Solar Energy Consulting",
    ],
  };

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>Future Green Energy - Solar Solutions in Kochi, Kerala</title>
        <meta
          name="description"
          content="Expert solar panel installation in Kochi. We provide top-tier residential and commercial solar solutions across Kerala. Sustainable energy made affordable and efficient."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Favicon */}
        <link rel="icon" href="/images/logo2.png" />
        <link rel="apple-touch-icon" href="/images/logo2.png" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="business.business" />
        <meta
          property="og:title"
          content="Future Green Energy - Solar Solutions in Kochi"
        />
        <meta
          property="og:description"
          content="Expert solar panel installation in Kochi. We provide top-tier residential and commercial solar solutions across Kerala. Sustainable energy made affordable and efficient."
        />
        <meta
          property="og:image"
          content="https://www.fgesolar.in/images/logo2.png"
        />
        <meta property="og:url" content="https://www.fgesolar.in" />
        <meta
          property="business:contact_data:street_address"
          content="Solar Solutions Center, Kochi"
        />
        <meta property="business:contact_data:locality" content="Kochi" />
        <meta property="business:contact_data:region" content="Kerala" />
        <meta property="business:contact_data:country_name" content="India" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Future Green Energy - Solar Solutions in Kochi"
        />
        <meta
          name="twitter:description"
          content="Expert solar panel installation in Kochi. We provide top-tier residential and commercial solar solutions across Kerala. Sustainable energy made affordable and efficient."
        />
        <meta
          name="twitter:image"
          content="https://www.fgesolar.in/images/logo2.png"
        />

        {/* Canonical URL */}
        <link
          rel="canonical"
          href={`https://www.fgesolar.in${router.pathname}`}
        />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>

        {/* Geo Tags for Local SEO */}
        <meta name="geo.region" content="IN-KL" />
        <meta name="geo.placename" content="Kochi" />
        <meta name="geo.position" content="9.9312;76.2673" />
        <meta name="ICBM" content="9.9312, 76.2673" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
