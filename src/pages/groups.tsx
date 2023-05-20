import GroupsComponent from '../components/Groups/GroupsComponent';

function Groups() {
  return (
    <div className='max-w-7xl mx-auto text-gray-200 sm:px-4 lg:px-0'>
      <p className='text-3xl font-medium mb-8'>
        Manage <span className='text-gray-100'>groups </span>
      </p>

      <GroupsComponent />
    </div>
  );
}

export default Groups;
