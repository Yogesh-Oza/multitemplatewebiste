'use client'

import Script from 'next/script'

export default function GoogleTranslateLoader() {
  return (
    <>
      <Script
        id="google-translate-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            function googleTranslateElementInit() {
              if (typeof google === 'undefined' || !google.translate) return;
              new google.translate.TranslateElement({
                pageLanguage: 'mr',
                includedLanguages: 'en,mr',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE
              }, 'google_translate_element');
            }
          `,
        }}
      />
      <Script
        id="google-translate-loader"
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </>
  )
}


