import { useContext } from 'react';
import ProfileForm from '../../components/Form/ProfileForm';
import Steps from '../../components/Steps';
import TalentLayerContext from '../../context/talentLayer';

function EditProfile() {
  const { account, user } = useContext(TalentLayerContext);

  return (
    <div className='max-w-7xl mx-auto text-gray-200 sm:px-4 lg:px-0'>
      <p className='text-5xl font-medium tracking-wider mb-8'>
        Edit your <span className='text-gray-100'>Profile</span>
      </p>

      <Steps />

      {account?.isConnected && user && <ProfileForm />}
    </div>
  );
}

export default EditProfile;
