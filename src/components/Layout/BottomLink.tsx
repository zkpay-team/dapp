import { useRouter } from 'next/router';

function BottomLink({ children, href }: { children: React.ReactNode; href: string }) {
  const router = useRouter();
  let className = router.asPath === href ? 'bg-zinc-900 text-white' : 'bg-zinc-800 text-zinc-400';

  className += ' inline-flex flex-col items-center justify-center px-5 hover:bg-zinc-800 group';

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

export default BottomLink;
