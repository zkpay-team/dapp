import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import SubmitButton from '../../../components/Form/SubmitButton';
import { tokens } from './TokenList';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import RailgunContext from '../context/railgun';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';

interface IFormValues {
  to: string;
  token: string;
  amount: number;
}

const getInitialValuesFromUrl = (query: ParsedUrlQuery): IFormValues => {
  return {
    to: (query.to as string) || '',
    token: (query.token as string) || '',
    amount: parseInt(query.amount as string) || 0,
  };
};

function SendForm() {
  const { wallet } = useContext(RailgunContext);
  const router = useRouter();
  const query = router.query;
  console.log({ query });

  if (!wallet?.railgunWalletInfo) {
    return null;
  }

  const initialValues: IFormValues = getInitialValuesFromUrl(query);

  const validationSchema = Yup.object({
    token: Yup.string().required('Please select a token'),
    amount: Yup.number().required('Please provide an amount'),
    to: Yup.number().required('Please provide a recipient'),
  });

  const onSubmit = async (values: IFormValues, { resetForm }: { resetForm: () => void }) => {
    console.log(values);
    const text = `https://zkpay.herokuapp.com/send?to=${wallet.railgunWalletInfo?.railgunAddress}&token=${values.token}&amount=${values.amount}`;
    navigator.clipboard.writeText(text);
    toast('Share link copied', {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      progress: undefined,
      theme: 'dark',
    });
    resetForm();
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
      {({ isSubmitting, errors }) => (
        <Form>
          <div className='grid grid-cols-1 gap-6 mb-8'>
            <label className='block relative'>
              <span className='text-gray-200'>Token</span>
              <Field
                component='select'
                id='token'
                name='token'
                className='mt-1 block w-full rounded border border-gray-200 bg-endnight shadow-sm focus:border-zinc-300 focus:ring focus:ring-zinc-200 focus:ring-opacity-50'
                placeholder='Choose a token..'>
                <option value=''></option>
                {tokens.map((token, index) => (
                  <option key={index} value={token.address}>
                    {token.code}
                  </option>
                ))}
              </Field>
              <p>
                <span className='text-red-500'>
                  <ErrorMessage name='token' />
                </span>
              </p>
            </label>
            <div className='flex'>
              <label className='block mr-4'>
                <span className='text-gray-200'>To</span>
                <Field
                  type='text'
                  id='to'
                  name='to'
                  className='mt-1 mb-1 block w-full rounded border border-gray-200 bg-endnight shadow-sm focus:border-zinc-300 focus:ring focus:ring-zinc-200 focus:ring-opacity-50'
                  placeholder=''
                />
              </label>
              <label className='block'>
                <span className='text-gray-200'>Amount</span>
                <Field
                  type='number'
                  id='amount'
                  name='amount'
                  className='mt-1 mb-1 block w-full rounded border border-gray-200 bg-endnight shadow-sm focus:border-zinc-300 focus:ring focus:ring-zinc-200 focus:ring-opacity-50'
                  placeholder=''
                />
              </label>
            </div>

            {(errors.amount || errors.token) && (
              <p>
                <span className='text-red-500 mt-2'>
                  <ErrorMessage name='amount' />
                </span>
                <span className='text-red-500'>
                  <ErrorMessage name='to' />
                </span>
              </p>
            )}

            <SubmitButton isSubmitting={isSubmitting} label='Send' />
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default SendForm;
