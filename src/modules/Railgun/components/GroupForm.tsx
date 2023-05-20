import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import SubmitButton from '../../../components/Form/SubmitButton';
import RailgunContext from '../context/railgun';

export interface Group {
  id: string;
  name: string;
  users: User[];
}

export interface IFormValues {
  name: string;
  users: User[];
}

interface User {
  to: string;
  nickname: string;
}

const getInitialValuesFromUrl = (query: ParsedUrlQuery): IFormValues => {
  if (query.id) {
    const groups = localStorage.getItem('groups')
      ? JSON.parse(localStorage.getItem('groups') as string)
      : [];

    const group = groups.find((group: Group) => group.id === query.id);

    console.log('getInitialValuesFromUrl', { groups, group, query });
    return group;
  }

  return {
    name: (query['name'] as string) || '',
    users: [
      {
        to: (query['to[0]'] as string) || '',
        nickname: (query['nickname[0]'] as string) || '',
      },
      {
        to: (query['to[1]'] as string) || '',
        nickname: (query['nickname[1]'] as string) || '',
      },
    ],
  };
};

function GroupForm() {
  const { wallet } = useContext(RailgunContext);
  const router = useRouter();
  const query = router.query;
  const isEditing = !!query.id;

  if (!wallet?.railgunWalletInfo) {
    return null;
  }

  const initialValues: IFormValues = getInitialValuesFromUrl(query);

  console.log('initialValues', { initialValues });

  const validationSchema = Yup.object({
    name: Yup.string().required('Please select a name'),
  });

  const onSubmit = async (values: IFormValues, { resetForm }: { resetForm: () => void }) => {
    for (let i = values.users.length - 1; i >= 0; i--) {
      if (values.users[i].to === '') {
        values.users.splice(i, 1);
      }
    }

    const groups = localStorage.getItem('groups')
      ? JSON.parse(localStorage.getItem('groups') as string)
      : [];

    if (isEditing) {
      const index = groups.findIndex((group: Group) => group.id === query.id);
      groups[index] = { ...values };
    } else {
      groups.push({ id: Date.now().toString(), ...values });
    }

    localStorage.setItem('groups', JSON.stringify(groups));

    toast(isEditing ? 'Group updated!' : 'Group created!', {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      progress: undefined,
      theme: 'dark',
    });
    resetForm();
    router.push('/groups');
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
      {({ isSubmitting, values }) => (
        <Form>
          <div className='grid grid-cols-1 gap-6 mb-8'>
            <label className='block relative'>
              <span className='text-gray-200'>name</span>
              <Field
                type='text'
                id='name'
                name='name'
                className='mt-1 mb-1 block w-full rounded border border-gray-200 bg-endnight shadow-sm focus:ring-opacity-50'
                placeholder=''
              />
              <p>
                <span className='text-red-500'>
                  <ErrorMessage name='name' />
                </span>
              </p>
            </label>
            <FieldArray name='users'>
              {({ push }) => (
                <div className='mb-2'>
                  {values.users.length > 0 &&
                    values.users.map((recipient, index) => (
                      <div className='row' key={index}>
                        <div className='flex w-full'>
                          <label className='block flex-1 mr-4'>
                            <span className='text-gray-200'>To</span>
                            <Field
                              type='text'
                              id='to'
                              name={`users.${index}.to`}
                              className='mt-1 mb-1 block w-full rounded border border-gray-200 bg-endnight shadow-sm focus:ring-opacity-50 '
                              placeholder=''
                            />
                          </label>
                          <label className='block flex-1'>
                            <span className='text-gray-200'>Nickname</span>
                            <Field
                              type='text'
                              id='nickname'
                              name={`users.${index}.nickname`}
                              className='mt-1 mb-1 block w-full rounded border border-gray-200 bg-endnight shadow-sm focus:ring-opacity-50'
                              placeholder=''
                            />
                          </label>
                        </div>
                        <p>
                          <span className='text-red-500 mt-2'>
                            <ErrorMessage name={`users.${index}.nickname`} />
                          </span>
                          <span className='text-red-500'>
                            <ErrorMessage name={`users.${index}.to`} />
                          </span>
                        </p>
                      </div>
                    ))}
                  <button
                    type='button'
                    className='mt-2 border border-greeny rounded hover:bg-endnight text-white bg-midnight px-5 py-2 w-full'
                    onClick={() => push({ nickname: '', to: '' })}>
                    Add Recipient
                  </button>
                </div>
              )}
            </FieldArray>

            <SubmitButton isSubmitting={isSubmitting} label={isEditing ? 'Udpate' : 'Create'} />
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default GroupForm;
