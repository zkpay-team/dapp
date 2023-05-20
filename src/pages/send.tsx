import { useContext } from 'react';
import RailgunContext from '../modules/Railgun/context/railgun';

function Send() {
  const { account } = useContext(RailgunContext);
  console.log({ account });

  return (
    <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
      <p className='text-3xl font-medium tracking-wider mb-8'>
        Payroll <span className='text-zinc-600'>multisend </span>
      </p>
    </div>
  );
}

export default Send;
