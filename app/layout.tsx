import type { Metadata } from "next";
import { Inter, Intel_One_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/shared/SmoothScroll";
import AutoReveal from "@/components/shared/AutoReveal";
import { siteConfig } from "@/lib/siteConfig";

// Inter with the optical-size axis renders large headings in the "Inter Display" cut used by Kudos.
const interSans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

const intelMono = Intel_One_Mono({
  variable: "--font-intel-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Entec Media | IT & Digital Marketing Company",
    template: "%s | Entec Media",
  },
  description: siteConfig.description,
  keywords: [
    "website design",
    "website development",
    "mobile app development",
    "UI UX design",
    "graphic design",
    "digital marketing",
    "SEO",
    "Google Ads",
    "Meta Ads",
    "Zirakpur",
    "Punjab",
  ],
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: "Entec Media | IT & Digital Marketing Company",
    description: siteConfig.description,
    images: ["/images/aboutbac.png"],
  },
  alternates: { canonical: "/" },
  icons: {
    icon: "/images/fav.jpg",
    shortcut: "/images/fav.jpg",
    apple: "/images/fav.jpg",
  },
  verification: {
    google: "7AL2UAJBCifz0zGUnzL-MEH59vrSXMkjIzu27IMekxc",
  },
  other: {
    "facebook-domain-verification": "vb5a6oposf6to1yc7jnuvb8o9o8fwi",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${interSans.variable} ${intelMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-5BHVGV9');`}
        </Script>

        {/* Google Tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-R44TE77NBN"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-R44TE77NBN');
          `}
        </Script>

        {/* Meta Pixel Code */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '978296769438064');
          fbq('track', 'PageView');`}
        </Script>
      </head>
      <body className="site-body">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5BHVGV9"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* Meta Pixel (noscript) */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=978296769438064&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        <SmoothScroll />
        <AutoReveal />
        <Header />
        <main className="page-main">{children}</main>
        <Footer />
        <div className="k-guides" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </body>
    </html>
  );
}

