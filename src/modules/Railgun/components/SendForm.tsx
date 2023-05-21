import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';
import * as Yup from 'yup';
import SubmitButton from '../../../components/Form/SubmitButton';
import { tokens } from './TokenList';
import { toast } from 'react-toastify';
import { SetStateAction, use, useCallback, useContext, useEffect, useState } from 'react';
import RailgunContext from '../context/railgun';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { Group } from './GroupForm';

interface IFormValues {
  token: string;
  recipients: Recipient[];
}

interface Recipient {
  to: string;
  amount: number;
}

// @dev to test it: ?token=0xdc31ee1784292379fbb2964b3b9c4124d8f89c60&amount[0]=10&to[0]=0zk1qyy6yz7c2h5cxyyrzgxvql9clj2gu6u6f7dszt5trhhn0xm5zug7frv7j6fe3z53laydg6xztk8z5w2y37wmy3u9y64q7fpq53d32cn90tmlra5kveqqjeluam2&amount[1]=30&to[1]=0zk123456789123456789
const getInitialValuesFromUrl = (query: ParsedUrlQuery): IFormValues => {
  if (query.group) {
    const groups = localStorage.getItem('groups')
      ? JSON.parse(localStorage.getItem('groups') as string)
      : [];

    const group: Group = groups.find((group: Group) => group.id === query.group);

    const recipients = [];
    for (let i = group.users.length - 1; i >= 0; i--) {
      recipients.push({
        to: group.users[i].to,
        amount: 0,
      });
    }

    return {
      token: (query['token'] as string) || '',
      recipients: recipients,
    };
  }

  return {
    token: (query['token'] as string) || '',
    recipients: [
      {
        to: (query['to[0]'] as string) || '',
        amount: parseInt(query['amount[0]'] as string) || 0,
      },
      {
        to: (query['to[1]'] as string) || '',
        amount: parseInt(query['amount[1]'] as string) || 0,
      },
    ],
  };
};

function SendForm() {
  const {
    wallet,
    erc20AmountRecipients,
    setErc20AmountRecipients,
    executeChainOfFunctions,
    isPaid,
  } = useContext(RailgunContext);
  const router = useRouter();
  const query = router.query;

  if (!wallet?.railgunWalletInfo) {
    return null;
  }

  const initialValues: IFormValues = getInitialValuesFromUrl(query);

  const validationSchema = Yup.object({
    token: Yup.string().required('Please select a token'),
  });

  // const [recipients, setRecipients] = useState<string[]>([]);
  // const [recipientAmounts, setRecipientAmounts] = useState<number[]>([]);
  // const [tokenAddress, setTokenAddress] = useState<string>('');

  // useEffect(() => {
  //   console.log("logging every update of the 'recipients' state");
  //   console.log({ recipients });
  // }, [recipients]);

  // useEffect(() => {
  //   console.log("logging every update of the 'recipientAmounts' state");
  //   console.log({ recipientAmounts });
  // }, [recipientAmounts]);

  // useEffect(() => {
  //   console.log("logging every update of the 'tokenAddress' state");
  //   console.log({ tokenAddress });
  // }, [tokenAddress]);

  // const updateErc20AmountRecipients = useCallback(() => {
  //   if (!recipients) {
  //     console.error('recipients not found');
  //     return;
  //   }

  //   const updatedErc20AmountRecipients = recipients.map((recipient, index) => {
  //     console.log('first recipient', recipient);
  //     return {
  //       tokenAddress: tokenAddress,
  //       amountString: recipientAmounts[index]?.toString(),
  //       recipientAddress: recipient,
  //     };
  //   });
  //   console.log('setErc20AmountRecipients', { setErc20AmountRecipients });
  //   if (!setErc20AmountRecipients) {
  //     console.error('setErc20AmountRecipients not found');
  //     return;
  //   }
  //   console.log('updatedErc20AmountRecipients', { updatedErc20AmountRecipients });
  //   setErc20AmountRecipients(updatedErc20AmountRecipients);
  // }, [recipients, tokenAddress, recipientAmounts]);
  const [submitted, setSubmitted] = useState(false);
  const onSubmit = async (values: IFormValues, { resetForm }: { resetForm: () => void }) => {
    for (let i = values.recipients.length - 1; i >= 0; i--) {
      if (values.recipients[i].to === '') {
        values.recipients.splice(i, 1);
      }
    }
    console.log('values', { values });

    toast('Please Sign!', {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      progress: undefined,
      theme: 'dark',
    });
    const updatedErc20AmountRecipients = values.recipients.map((recipient, index) => {
      return {
        tokenAddress: values.token,
        amountString: recipient.amount?.toString(),
        recipientAddress: recipient.to,
      };
    });
    if (!setErc20AmountRecipients) {
      console.error('setErc20AmountRecipients not found');
      return;
    }
    setErc20AmountRecipients(updatedErc20AmountRecipients);
    setSubmitted(true);
    resetForm();
  };

  useEffect(() => {
    if (submitted) {
      if (!executeChainOfFunctions) {
        console.log('executeChainOfFunctions does not exist.');
        return;
      }
      executeChainOfFunctions();

      setSubmitted(false);
    }
  }, [submitted, executeChainOfFunctions]);

  useEffect(() => {
    if (isPaid) {
      toast('Money Send!', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        theme: 'dark',
      });
    }
  }, [isPaid]);

  useEffect(() => {
    console.log('logging every update of the erc20AmountRecipients');
    console.log({ erc20AmountRecipients });
  }, [erc20AmountRecipients]);

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
      {({ isSubmitting, values, setFieldValue }) => (
        <Form>
          <div className='grid grid-cols-1 gap-6 mb-8'>
            <label className='block relative'>
              <span className='text-gray-200'>Token</span>
              <Field
                component='select'
                id='token'
                name='token'
                className='mt-1 block w-full rounded border border-gray-200 bg-endnight shadow-sm focus:ring-opacity-50'
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
            <FieldArray name='recipients'>
              {({ push }) => (
                <div className='mb-2'>
                  {values.recipients.length > 0 &&
                    values.recipients.map((recipient, index) => (
                      <div className='row' key={index}>
                        <div className='flex w-full'>
                          <label className='block flex-1 mr-4'>
                            <span className='text-gray-200'>To</span>
                            <Field
                              type='text'
                              id='to'
                              name={`recipients.${index}.to`}
                              className='mt-1 mb-1 block w-full rounded border border-gray-200 bg-endnight shadow-sm focus:ring-opacity-50'
                              placeholder=''
                            />
                          </label>
                          <label className='block flex-1'>
                            <span className='text-gray-200'>Amount</span>
                            <Field
                              type='number'
                              id='amount'
                              name={`recipients.${index}.amount`}
                              className='mt-1 mb-1 block w-full rounded border border-gray-200 bg-endnight shadow-sm focus:ring-opacity-50'
                              placeholder=''
                            />
                          </label>
                        </div>
                        <p>
                          <span className='text-red-500 mt-2'>
                            <ErrorMessage name={`recipients.${index}.amount`} />
                          </span>
                          <span className='text-red-500'>
                            <ErrorMessage name={`recipients.${index}.to`} />
                          </span>
                        </p>
                      </div>
                    ))}
                  <button
                    type='button'
                    className='mt-2 border border-greeny rounded hover:bg-endnight text-white bg-midnight px-5 py-2 w-full'
                    onClick={() => push({ amount: '', to: '' })}>
                    Add Recipient
                  </button>
                </div>
              )}
            </FieldArray>

            <SubmitButton isSubmitting={isSubmitting} label='Send' />
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default SendForm;
