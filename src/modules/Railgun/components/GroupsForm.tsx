import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';
import * as Yup from 'yup';
import type { Group } from '../utils/types';

interface GroupsSelectorProps {
    groups: Group[];
    onGroupChange: (index: number, name: string) => void;
    onAddGroup: () => void;
    onAddressChange: (groupIndex: number, addressIndex: number, address: string, nickname: string, amount: number) => void;
    onAddAddress: (groupIndex: number) => void;
}

interface GroupsIForm {
    groups: Group[];
    groupIndex: number;
}

const getInitialValues = (groups: Group[]): GroupsIForm => {
    const index = groups.findIndex((group) => group.selected);
    return {
        groups: groups,
        groupIndex: index
    }
}

function GroupsForm({ groups, onGroupChange, onAddGroup, onAddressChange, onAddAddress }: GroupsSelectorProps) {

  const validationSchema = Yup.object({
    token: Yup.string().required('Please select a token'),
  });

  const initialValues: GroupsIForm = getInitialValues(groups);

  return (
    <Formik initialValues={initialValues} onSubmit={onAddGroup} validationSchema={validationSchema}>
      {({ isSubmitting, values }) => (
        <Form>
          <div className='grid grid-cols-1 gap-6 mb-8'>
            <label className='block relative'>
              <span className='text-gray-200'>Groupname</span>
                <Field
                  type="text"
                  id="groupName"
                  name={`groups.${values.groupIndex}.name`}
                  className="mt-1 mb-1 block w-full rounded border border-gray-200 bg-endnight shadow-sm focus:border-zinc-300 focus:ring focus:ring-zinc-200 focus:ring-opacity-50"
                  placeholder="Groupname"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onGroupChange(values.groupIndex, e.target.value)}
                />
                <button
                  id='addGroupButton'
                  type='button'
                  className='mt-2 border border-greeny rounded hover:bg-endnight text-white bg-midnight px-5 py-2 w-full'
                  onClick={() => onAddGroup()}>
                  Add New Group
                </button>
                <Field
                    type='text'
                    id='groupName'
                    name={`${values.groups[values.groupIndex]}.name`}
                    className='mt-1 mb-1 block w-full rounded border border-gray-200 bg-endnight shadow-sm focus:border-zinc-300 focus:ring focus:ring-zinc-200 focus:ring-opacity-50'
                    placeholder='Groupname'
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      onGroupChange(values.groupIndex, e.target.value)}
                />
                <Field
                  component='select'
                  id='group'
                  name='group'
                  className='mt-1 block w-full rounded border border-gray-200 bg-endnight shadow-sm focus:border-zinc-300 focus:ring focus:ring-zinc-200 focus:ring-opacity-50'
                  placeholder='Choose a Group'>
                  {groups.map((group, index) => (
                    <option key={index} value={group.name}>
                      {group.name}
                    </option>
                  ))}
                </Field>
              <p>
                <span className='text-red-500'>
                  <ErrorMessage name='token' />
                </span>
              </p>
            </label>
            <FieldArray name='addresses'>
              {({ push }) => (
                <div className='mb-2'>
                  {values.groups[values.groupIndex].addresses.length > 0 &&
                    values.groups[values.groupIndex].addresses.map((address, index) => (
                      <div className='row' key={index}>
                        <div className='flex'>
                          <label className='block mr-4'>
                            <span className='text-gray-200'>Railgun Address</span>
                            <Field
                              type='text'
                              id='address'
                              name={`${address}.address`}
                              className='mt-1 mb-1 block w-full rounded border border-gray-200 bg-endnight shadow-sm focus:border-zinc-300 focus:ring focus:ring-zinc-200 focus:ring-opacity-50'
                              placeholder='Railgun Address (0zk...)'
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                onAddressChange(values.groupIndex, index, e.target.value, address.nickname, address.amount)}
                            />
                          </label>
                          <label className='block'>
                            <span className='text-gray-200'>Nickname</span>
                            <Field
                              type='text'
                              id='nickname'
                              name={`${address}.nickname`}
                              className='mt-1 mb-1 block w-full rounded border border-gray-200 bg-endnight shadow-sm focus:border-zinc-300 focus:ring focus:ring-zinc-200 focus:ring-opacity-50'
                              placeholder='Railgun Address (0zk...)'
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                onAddressChange(values.groupIndex, index, address.address, e.target.value, address.amount)}
                            />
                          </label>
                        </div>
                        <p>
                          <span className='text-red-500 mt-2'>
                            <ErrorMessage name={`${address}.address`} />
                          </span>
                          <span className='text-red-500'>
                            <ErrorMessage name={`${address}.nickname`} />
                          </span>
                        </p>
                      </div>
                    ))}
                  <button
                    type='button'
                    className='mt-2 border border-greeny rounded hover:bg-endnight text-white bg-midnight px-5 py-2 w-full'
                    onClick={() => {
                      onAddAddress(values.groupIndex)
                    }}>
                    Add Railgun Address
                  </button>
                </div>
              )}
            </FieldArray>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default GroupsForm;
