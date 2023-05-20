import Steps from './Steps';

function Onboarding() {
  return (
    <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
      <p className='text-3xl font-medium tracking-wider mb-8'>
        Setup <span className='text-zinc-600'>your wallet </span>
      </p>

      <Steps />
    </div>
  );
}

export default Onboarding;
