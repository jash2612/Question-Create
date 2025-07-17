import '../styles/globals.css';
import Script from 'next/script';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Script
        src="https://widget.cloudinary.com/v2.0/global/all.js"
        strategy="beforeInteractive"
        onError={(e) => console.error('Cloudinary script failed to load:', e)}
      />
      <Component {...pageProps} />
    </>
  );
}
