const title = 'ZK Pay';
const description = 'ZK Pay is a freelance marketplace where privacy is everywhere';
const url = 'https://zkpay.io';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title,
  description,
  canonical: url,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    site_name: 'ZK Pay',
    title,
    description,
    images: [
      {
        url: `https://zkpay.io/images/cover.jpeg`,
        width: 2000,
        height: 1142,
        alt: 'Zkwork profile',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    handle: '@ZKWork',
    site: '@ZKWork',
    cardType: 'summary_large_image',
  },
};
