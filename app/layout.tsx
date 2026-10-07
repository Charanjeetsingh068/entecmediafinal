import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/shared/SmoothScroll";
import AutoReveal from "@/components/shared/AutoReveal";
import ButtonMagnet from "@/components/shared/ButtonMagnet";
import OffscreenAnimations from "@/components/shared/OffscreenAnimations";
import { siteConfig } from "@/lib/siteConfig";

// Fonts are self-hosted from app/fonts so builds never depend on downloading from Google Fonts.
// Inter's variable file carries the optical-size axis, which renders large headings in the "Inter Display" cut.
const interSans = localFont({
  src: "./fonts/Inter-Variable.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Arial", "sans-serif"],
});

// Intel One Mono has no metric overrides in Next's font data, so it gets an explicit monospace fallback.
const intelMono = localFont({
  src: [
    { path: "./fonts/IntelOneMono-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/IntelOneMono-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/IntelOneMono-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-intel-mono",
  display: "swap",
  // Only used for small labels: not preloaded, so the three files don't compete with the hero image
  preload: false,
  adjustFontFallback: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Consolas", "monospace"],
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
        {/* Hero photos on most inner pages come from Unsplash: open that connection right away */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        {/* Google Tag Manager, Google Tag (gtag.js) and Meta Pixel.
            The queues (dataLayer, gtag, fbq) are set up — and the page view recorded — right away, but
            the three vendor scripts (~550 KB, ~1 s of main-thread work on a phone) are only downloaded
            on the visitor's first interaction, or 6 s after the page has loaded, whichever comes first.
            Everything queued before that is sent as soon as they arrive, so no hits are lost; the page
            just isn't competing with them while it loads. */}
        <Script id="third-party-tags" strategy="afterInteractive">
          {`(function(w,d){
            w.dataLayer=w.dataLayer||[];
            w.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});
            w.gtag=function(){w.dataLayer.push(arguments);};
            w.gtag('js',new Date());
            w.gtag('config','G-R44TE77NBN');
            if(!w.fbq){var n=w.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!w._fbq)w._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];}
            w.fbq('init','978296769438064');
            w.fbq('track','PageView');
            var done=false,ev=['pointerdown','keydown','touchstart','scroll','mousemove','wheel'];
            function add(src){var s=d.createElement('script');s.async=true;s.src=src;d.head.appendChild(s);}
            function load(){
              if(done)return;done=true;
              ev.forEach(function(e){w.removeEventListener(e,load,{passive:true});});
              add('https://www.googletagmanager.com/gtm.js?id=GTM-5BHVGV9');
              add('https://www.googletagmanager.com/gtag/js?id=G-R44TE77NBN');
              add('https://connect.facebook.net/en_US/fbevents.js');
            }
            ev.forEach(function(e){w.addEventListener(e,load,{passive:true});});
            function later(){setTimeout(load,6000);}
            if(d.readyState==='complete')later();else w.addEventListener('load',later,{once:true});
          })(window,document);`}
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
        <ButtonMagnet />
        <OffscreenAnimations />
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

