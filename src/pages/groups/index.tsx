import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Group } from '../../modules/Railgun/components/GroupForm';

function Groups() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const localstorageGroups = localStorage.getItem('groups')
      ? JSON.parse(localStorage.getItem('groups') as string)
      : [];
    setGroups(localstorageGroups);
  }, []);

  return (
    <div className='max-w-7xl mx-auto text-gray-200 sm:px-4 lg:px-0'>
      <p className='text-3xl font-medium mb-8'>
        Manage <span className='text-gray-100'>groups </span>
      </p>

      <button
        onClick={() => {
          router.push('/groups/create');
        }}
        type='button'
        className='grow px-5 py-2 rounded bg-greeny text-midnight hover:bg-midnight hover:text-white w-full'>
        {'Create a new one'}
      </button>

      <hr className='my-8' />

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
        {groups.map(group => (
          <div
            key={group.id}
            className='border border-gray-200 shadow rounded p-4 flex items-center bg-endnight'
            onClick={() => {
              router.push(`/groups/${group.id}`);
            }}>
            <div>
              <p className='font-bold'>{group.name}</p>
              <p>{group.users.length} users</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Groups;