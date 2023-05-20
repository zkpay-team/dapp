import { useRouter } from 'next/router';

function SideLink({ children, href }: { children: React.ReactNode; href: string }) {
  const router = useRouter();
  let className =
    router.asPath === href ? 'bg-zinc-800 text-white' : 'text-zinc-100 hover:bg-zinc-900';

  className += ' group flex items-center px-2 py-2 text-base font-medium rounded-md';

  const handleClick = (e: any) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}

export default SideLink;
