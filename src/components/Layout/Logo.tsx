import Image from 'next/image';
import Link from 'next/link';

function Logo({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  return (
    <h1 className={`text-1xl ${theme == 'light' ? 'text-white' : 'text-greeny'}`}>
      <Link href='/' className='flex items-center'>
        <Image src={'/logo.jpg'} width={50} height={50} alt='ZKpay logo' className='-ml-4' />
        <span
          className={`text-1xl md:text-2xl font-medium -ml-2 ${
            theme == 'light' ? 'text-zinc-300' : 'text-greeny'
          }`}>
          ZKPay
        </span>
      </Link>
    </h1>
  );
}

export default Logo;
