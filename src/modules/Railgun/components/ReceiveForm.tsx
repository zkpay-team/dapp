import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import SubmitButton from '../../../components/Form/SubmitButton';
import { tokens } from './TokenList';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import RailgunContext from '../context/railgun';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';

interface IFormValues {
  token: string;
  amount: number;
}

const initialValues: IFormValues = {
  token: '',
  amount: 0,
};

function ReceiveForm() {
  const { wallet } = useContext(RailgunContext);

  if (!wallet?.railgunWalletInfo) {
    return null;
  }

  const validationSchema = Yup.object({
    token: Yup.string().required('Please select a token'),
    amount: Yup.number().required('Please provide an amount'),
  });

  const generateLink = (values: IFormValues): string => {
    return `https://www.zk-pay.io/send?token=${values.token}&to[0]=${wallet.railgunWalletInfo?.railgunAddress}&amount[0]=${values.amount}`;
  };

  const onSubmit = async (values: IFormValues, { resetForm }: { resetForm: () => void }) => {
    const text = generateLink(values);
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
      {({ isSubmitting, errors, values }) => (
        <Form>
          <div className=''>
            <div className='flex'>
              <label className='block flex-1 mr-4'>
                <span className='text-gray-200'>Amount</span>
                <Field
                  type='number'
                  id='amount'
                  name='amount'
                  className='mt-1 mb-1 block w-full rounded border border-gray-200 bg-endnight shadow-sm focus:ring-opacity-50'
                  placeholder=''
                />
              </label>
              <label className='block relative'>
                <span className='text-gray-200'>Token</span>
                <Field
                  component='select'
                  id='token'
                  name='token'
                  className='mt-1 block w-full rounded border border-gray-200 bg-endnight shadow-sm focus:ring-opacity-50'
                  placeholder=''>
                  <option value=''>Token</option>
                  {tokens.map((token, index) => (
                    <option key={index} value={token.address}>
                      {token.code}
                    </option>
                  ))}
                </Field>
              </label>
            </div>

            {(errors.amount || errors.token) && (
              <p>
                <span className='text-red-500 mt-2'>
                  <ErrorMessage name='amount' />
                </span>
                <span className='text-red-500'>
                  <ErrorMessage name='token' />
                </span>
              </p>
            )}

            <div className='pt-8'>
              <SubmitButton isSubmitting={isSubmitting} label='Copy share link to clipboard' />
            </div>
          </div>
          <div>
            <p className='py-8 block text-center'>or scan it</p>
            <div className='flex justify-center'>
              <QRCodeSVG
                value={generateLink(values)}
                size={200}
                bgColor='#11FEB7'
                fgColor='#0A0A18'
                level='L'
                includeMargin={true}
              />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default ReceiveForm;
