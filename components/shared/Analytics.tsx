import Script from 'next/script';

export function Analytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const src = process.env.NEXT_PUBLIC_UMAMI_SRC;

  if (!websiteId || !src) {
    return null;
  }

  return (
    <Script
      defer
      src={src}
      data-website-id={websiteId}
      strategy="lazyOnload"
    />
  );
}
