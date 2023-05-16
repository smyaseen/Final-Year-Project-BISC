/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  TextField,
  Typography,
} from '@mui/material';

import { useSession } from 'next-auth/react';

import { useQuery } from 'react-query';
import {
  ACCESS_CONTROL_CONTRACT_ADDRESS,
  fetchBatchIdsForPharmacy,
} from '../../../utility/utils';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import AccessControl from '../../../contracts/AccessControl.json';
import { bytes32Roles, RoleTypes } from '../../../utility/roles';

const CreateBatch = () => {
  const [values, setValues] = useState({
    batchId: '',
    remaining: 0,
    quantity: 0,
  });

  const [saving, setSaving] = useState(false);
  const { data } = useSession() as any;

  const {
    data: batchIds,
    isFetching: fetchingBatchIds,
    refetch: refetchBatchIds,
  } = useQuery('batchIds', async () => fetchBatchIdsForPharmacy(data.name), {
    staleTime: Infinity,
    retryOnMount: true,
    onSuccess(ids: [{ batchId: string; quantity: number; sold: number }]) {
      ids.length &&
        setValues({
          ...values,
          batchId: ids[0].batchId,
          remaining: ids[0].quantity - ids[0].sold,
          quantity: ids[0].quantity,
        });
    },
  });

  const args = [
    0,
    'Sold To Customer(s)',
    bytes32Roles['pharmacy' as keyof RoleTypes],
  ];

  const { config, isFetched, isFetchedAfterMount } = usePrepareContractWrite({
    address: ACCESS_CONTROL_CONTRACT_ADDRESS,
    abi: AccessControl,
    functionName: 'updateStatus',
    args,
  });

  const { writeAsync } = useContractWrite(config);

  const handleChange = (name: string, value: string, remaining?: number) => {
    setValues({
      ...values,
      [name]: value,
      ...(remaining ? { remaining } : {}),
    });
  };

  const saveOrder = async () => {
    setSaving(true);
    const { batchId, quantity } = values;

    if (batchId && quantity) {
      try {
        await fetch('/api/order?role=pharmacy', {
          method: 'POST',
          body: JSON.stringify({
            pharmacy: data.name,
            batchId,
            quantity,
          }),
          headers: { 'Content-Type': 'application/json' },
        });

        const { hash } = await writeAsync?.();

        const transactions = batchIds?.find(
          (b) => b.batchId === batchId
        ).transactions;

        await fetch('/api/batch', {
          method: 'PUT',
          body: JSON.stringify({
            status: 'Sold To Customer(s)',
            transactions: [...transactions, hash],
            batchId,
          }),
          headers: { 'Content-Type': 'application/json' },
        });

        await refetchBatchIds();
      } catch (err) {
        //
      }
    }
    setSaving(false);
  };
  return (
    <form autoComplete="off" noValidate>
      <Card>
        <>
          <CardHeader
            subheader="Create Order from Batches"
            title="Create Order"
          />
          <Divider />
          {fetchingBatchIds || saving ? (
            <Box
              sx={{
                display: 'flex',
              }}
              justifyContent="center"
              mt={2}
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Select Batch Id"
                      name="batchId"
                      onChange={({ target: { name, value } }) => {
                        const batch = batchIds?.find(
                          ({ batchId }) => batchId === value
                        );
                        handleChange(
                          name,
                          value,
                          batch?.quantity - batch?.sold
                        );
                      }}
                      required
                      select
                      SelectProps={{ native: true }}
                      variant="outlined"
                      value={values.batchId}
                    >
                      {batchIds?.map((option) => (
                        <option key={option.batchId} value={option.batchId}>
                          {option.batchId}
                        </option>
                      ))}
                    </TextField>
                    <Typography variant="h6">
                      Remaining: {values.remaining}
                    </Typography>
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Quantity"
                      name="quantity"
                      onChange={({ target: { name, value } }) =>
                        handleChange(name, value)
                      }
                      required
                      variant="outlined"
                      value={values.quantity}
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <Divider />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  p: 2,
                }}
              >
                <Button
                  color="primary"
                  variant="contained"
                  disabled={
                    !batchIds?.length ||
                    values.quantity > values.remaining ||
                    !values.remaining ||
                    !values.quantity ||
                    !values.batchId ||
                    saving
                  }
                  onClick={saveOrder}
                >
                  Create Order
                </Button>
              </Box>
            </>
          )}
        </>
      </Card>
    </form>
  );
};

export default CreateBatch;
