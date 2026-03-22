import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createClient();
  const { data: settings } = await supabase.from("pengaturan_website").select("*");
  const getS = (k: string) => settings?.find((s) => s.kunci === k)?.nilai;
  
  const appName = getS("nama_website") || process.env.NEXT_PUBLIC_APP_NAME || "Indo Nusa Travel";
  const tagline = getS("tagline") || "Paket Wisata & Rental Mobil Terpercaya";

  return {
    title: `${appName} - ${tagline}`,
    description: getS("meta_description") || "Layanan paket wisata dan rental mobil terpercaya dengan pengalaman terbaik.",
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: settings } = await supabase.from("pengaturan_website").select("*");

  const getS = (k: string) => settings?.find((s) => s.kunci === k)?.nilai;

  const gtmId = getS("gtm_id");
  const fbPixel = getS("pixel_fb");
  const tiktokPixel = getS("pixel_tiktok");

  const gaId = getS("pixel_analytics");

  return (
    <html lang="id">
      <head>
        {/* Google Analytics (GA4) */}
        {gaId && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <Script
              id="ga-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `,
              }}
            />
          </>
        )}

        {/* Google Tag Manager */}
        {gtmId && (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');`,
            }}
          />
        )}

        {/* Facebook Pixel */}
        {fbPixel && (
          <Script
            id="fb-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${fbPixel}');
              fbq('track', 'PageView');`,
            }}
          />
        )}

        {/* TikTok Pixel */}
        {tiktokPixel && (
          <Script
            id="tiktok-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `!function (w, d, t) {
              w.Tawk_API = w.Tawk_API || {}; w.Tawk_LoadStart = new Date();
              }(window, document, 'script');
              !function (w, d, n, i, r) {
                w[i] = w[i] || function () { (w[i].q = w[i].q || []).push(arguments) };
                w[i].l = (new Date).getTime();
                var f = d.getElementsByTagName(n)[0], s = d.createElement(n);
                s.async = !0; s.src = "https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=" + r;
                f.parentNode.insertBefore(s, f);
              }(window, document, "script", "ttq", "${tiktokPixel}");
              ttq.page();`,
            }}
          />
        )}
      </head>
      <body>
        {/* GTM Noscript */}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>
        )}
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
