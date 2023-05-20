import Link from 'next/link';

function Logo({ theme = 'light' }: { theme?: 'dark' | 'light' }) {
  return (
    <h1 className={`text-2xl ${theme == 'light' ? 'text-white' : 'text-black'}`}>
      <Link href='/'>
        ZK
        <span className={`text-2xl ${theme == 'light' ? 'text-zinc-300' : 'text-zinc-700'}`}>
          Pay
        </span>
      </Link>
    </h1>
  );
}

export default Logo;
