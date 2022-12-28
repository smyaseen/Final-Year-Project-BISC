/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import Head from 'next/head';
import { Box } from '@mui/material';
import BatchDetail from '../../components/manufacturer/BatchDetail';

function CreateBatch() {
  return (
    <>
      <Head>
        <title>Create Batch</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 2,
          m: 4,
        }}
      >
        <BatchDetail />
      </Box>
    </>
  );
}

export default CreateBatch;