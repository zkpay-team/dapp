import GroupsComponent from '../components/Groups/GroupsComponent';

function Groups() {
  return (
    <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
      <p className='text-3xl font-medium tracking-wider mb-8 font-space-grotesk-light'>
        Manage <span className='text-zinc-600'>groups </span>
      </p>

      <GroupsComponent />
    </div>
  );
}

export default Groups;
