import BottomLink from './BottomLink';
import { navigation } from './navigation';

function MenuBottom() {
  return (
    <div className='md:hidden fixed bottom-0 left-0 z-50 w-full h-16 border-t bg-zinc-800 border-zinc-600'>
      <div className={`grid h-full max-w-lg grid-cols-${navigation.length} mx-auto font-medium`}>
        {navigation.map(item => (
          <BottomLink key={item.name} href={item.href}>
            <item.icon className='w-6 h-6 mb-1 ' />
            <span className='text-sm '>{item.name}</span>
          </BottomLink>
        ))}
      </div>
    </div>
  );
}

export default MenuBottom;
