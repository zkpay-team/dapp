import BottomLink from './BottomLink';
import { navigation } from './navigation';

function MenuBottom() {
  return (
    <div className='menuBottom md:hidden fixed bottom-0 left-0 z-50 w-full h-16 border-t border-greeny'>
      <div className={`grid h-full max-w-lg grid-cols-5 font-medium`}>
        {navigation.map(item => (
          <BottomLink key={item.name} href={item.href}>
            <item.icon className='w-6 h-6 mb-1 ' />
            <span className='text-xs'>{item.name}</span>
          </BottomLink>
        ))}
      </div>
    </div>
  );
}

export default MenuBottom;
