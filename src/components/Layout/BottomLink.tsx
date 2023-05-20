import { useRouter } from 'next/router';

function BottomLink({ children, href }: { children: React.ReactNode; href: string }) {
  const router = useRouter();
  let className =
    router.asPath === href ? 'bg-greeny text-midnight font-medium' : 'bg-midnight font-light';

  className += ' inline-flex flex-col items-center justify-center px-5 hover:bg-greeny group  ';

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
