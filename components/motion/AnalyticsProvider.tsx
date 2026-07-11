'use client';
import { useEffect } from 'react';
import Script from 'next/script';
import { captureUtm } from '@/lib/utm';

// Захват UTM на старте сессии + подключение Яндекс.Метрики (если задан ID).
export function AnalyticsProvider() {
  useEffect(() => {
    captureUtm();
  }, []);

  const ymId = process.env.NEXT_PUBLIC_YM_ID;
  if (!ymId) return null;

  return (
    <Script id="yandex-metrika" strategy="afterInteractive">
      {`
        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
        ym(${Number(ymId)}, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:false });
      `}
    </Script>
  );
}
