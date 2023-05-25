const title = 'ZK Pay';
const description =
  'ZK Pay is an infrastructure to support use cases like private bounty and private payroll payments';
const url = 'https://www.zk-pay.io';

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
        url: `https://www.zk-pay.io/images/cover.jpeg`,
        width: 2000,
        height: 1142,
        alt: 'ZKPay profile',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    handle: '@ZKPay',
    site: '@ZKPay',
    cardType: 'summary_large_image',
  },
};
