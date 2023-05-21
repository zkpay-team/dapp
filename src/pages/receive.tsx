import RailgunAddress from '../modules/Railgun/components/RailgunAddress';
import ReceiveForm from '../modules/Railgun/components/ReceiveForm';

function Receive() {
  return (
    <div className='max-w-7xl mx-auto text-gray-200 sm:px-4 lg:px-0'>
      <p className='text-3xl font-medium mb-8'>
        Receive <span className='text-gray-100'>privately</span>
      </p>

      <RailgunAddress />

      <hr />

      <div className='mt-10'>
        <ReceiveForm />
      </div>
    </div>
  );
}

export default Receive;
