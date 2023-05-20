const title = 'ZK Pay';
const description =
  'ZK Pay is an infrastructure to support use cases like private bounty and private payroll payments';
const url = 'https://zkpay.io';

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
