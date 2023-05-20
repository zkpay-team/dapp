import GroupForm from '../../modules/Railgun/components/GroupForm';

function Update() {
  return (
    <div className='max-w-7xl mx-auto text-gray-200 sm:px-4 lg:px-0'>
      <p className='text-3xl font-medium mb-8'>
        Update <span className='text-gray-100'>group</span>
      </p>

      <GroupForm />
    </div>
  );
}

export default Update;