import { ErrorMessage, Field, Form, Formik } from 'formik';
import { ParsedUrlQuery } from 'querystring';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import SubmitButton from '../../../components/Form/SubmitButton';
import RailgunContext from '../../Railgun/context/railgun';
import { useRouter } from 'next/router';
import { tokens } from '../../Railgun/components/TokenList';
import Image from 'next/image';

interface IFormValues {
  from: string;
  to: string;
  amount: number;
}

const getInitialValuesFromUrl = (query: ParsedUrlQuery): IFormValues => {
  return {
    from: (query['from'] as string) || '',
    to: (query['to'] as string) || '',
    amount: parseInt(query['amount'] as string) || 0,
  };
};

function WithdrawSwapForm() {
  const { account, wallet } = useContext(RailgunContext);
  const router = useRouter();
  const query = router.query;

  if (!wallet?.railgunWalletInfo) {
    return null;
  }

  const initialValues: IFormValues = getInitialValuesFromUrl(query);

  const validationSchema = Yup.object({
    token: Yup.string().required('Please select a token'),
  });

  const onSubmit = async (values: IFormValues, { resetForm }: { resetForm: () => void }) => {
    console.log('values', { values });

    // const sdk = new FusionSDK({
    //   url: 'https://fusion.1inch.io',
    //   network: NetworkEnum.POLYGON,
    // });

    // sdk
    //   .placeOrder({
    //     fromTokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH
    //     toTokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
    //     amount: '50000000000000000', // 0.05 ETH
    //     walletAddress: account?.address as string,
    //     // fee is an optional field
    //     fee: {
    //       takingFeeBps: 100, // 1% as we use bps format, 1% is equal to 100bps
    //       takingFeeReceiver: '0x0000000000000000000000000000000000000000', //  fee receiver address
    //     },
    //   })
    //   .then(console.log);

    toast('Swap done', {
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
      {({ isSubmitting }) => (
        <Form>
          <div className='grid grid-cols-1 gap-6 mb-8'>
            <label className='block relative'>
              <span className='text-gray-200'>From</span>
              <Field
                component='select'
                id='from'
                name='from'
                className='mt-1 block w-full rounded border border-gray-200 bg-endnight shadow-sm focus:ring-opacity-50'
                placeholder='From token..'>
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

            <label className='block relative'>
              <span className='text-gray-200'>To</span>
              <Field
                component='select'
                id='to'
                name='to'
                className='mt-1 block w-full rounded border border-gray-200 bg-endnight shadow-sm focus:ring-opacity-50'
                placeholder='To token..'>
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

            <label className='block relative'>
              <span className='text-gray-200'>Amount</span>
              <Field
                type='number'
                id='amount'
                name={'amount'}
                className='mt-1 mb-1 block w-full rounded border border-gray-200 bg-endnight shadow-sm focus:ring-opacity-50'
                placeholder=''
              />
            </label>

            <SubmitButton isSubmitting={isSubmitting} label='unShield & Swap' />
          </div>
          <div className='flex flex-col items-center justify-center mt-2'>
            <p className='mb-2'>swap powered by</p>
            <Image src={'/images/1inch-logo.png'} width={60} height={60} alt='ZKpay logo' />
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default WithdrawSwapForm;
