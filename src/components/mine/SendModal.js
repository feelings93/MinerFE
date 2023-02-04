import { Input, Modal, Spin } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

const SendModal = (props) => {
  const { onClose } = props;
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const { isLoading, mutate: send } = useMutation(
    (info) =>
      axios.post(`http://localhost:4500/bitcoin/sendToAddress`, info, {
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    {
      onSuccess: () => {
        toast.success('Send successfully');
      },
      onError: (error) => {
        if (Array.isArray(error.response.data.error)) {
          error.data.error.forEach((el) =>
            toast.error(el.message, {
              position: 'top-right',
            })
          );
        } else {
          toast.error(error.response.data.message?.message, {
            position: 'top-right',
          });
        }
      },
    }
  );

  return (
    <Modal
      title='Send to address'
      open={true}
      onOk={() => {
        send({ address, amount: Number(amount) });
        onClose();
      }}
      onCancel={onClose}
      okButtonProps={{
        disabled:
          !address || !amount || isNaN(Number(amount)) || Number(amount) <= 0,
      }}
    >
      <Input
        onChange={(e) => setAddress(e.target.value)}
        placeholder='Address'
        style={{ marginBottom: '8px' }}
      />
      <Input
        onChange={(e) => setAmount(e.target.value)}
        placeholder='Amount'
      />
    </Modal>
  );
};

export default SendModal;
