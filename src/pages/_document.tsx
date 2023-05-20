import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <meta
          name='viewport'
          content='width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no'></meta>
      </Head>
      <body className='text-white bg-midnight'>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
