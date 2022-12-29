/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import Router from 'next/router';
import RouteNames from '../../routes/RouteNames';

// eslint-disable-next-line react/prop-types
function BatcheListResults({ products, ...rest }) {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleSelectAll = (event) => {
    let newSelectedCustomerIds;

    if (event.target.checked) {
      // eslint-disable-next-line react/prop-types
      newSelectedCustomerIds = products.map((product) => product.id);
    } else {
      newSelectedCustomerIds = [];
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCustomerIds.indexOf(id);
    let newSelectedCustomerIds = [];

    if (selectedIndex === -1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        selectedCustomerIds,
        id
      );
    } else if (selectedIndex === 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        selectedCustomerIds.slice(1)
      );
    } else if (selectedIndex === selectedCustomerIds.length - 1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        selectedCustomerIds.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        selectedCustomerIds.slice(0, selectedIndex),
        selectedCustomerIds.slice(selectedIndex + 1)
      );
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <Card {...rest}>
      <Box sx={{ minWidth: 1050 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedCustomerIds.length === products.length}
                  color="primary"
                  indeterminate={
                    selectedCustomerIds.length > 0 &&
                    selectedCustomerIds.length < products.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              {/* <TableCell>Id</TableCell> */}
              <TableCell>Medicine</TableCell>
              <TableCell>Distributor</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Expiry</TableCell>
              <TableCell>MFG</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Batch</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.slice(0, limit).map((product, index) => (
              <TableRow
                hover
                key={product.id}
                selected={selectedCustomerIds.indexOf(product.id) !== -1}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCustomerIds.indexOf(product.id) !== -1}
                    onChange={(event) => handleSelectOne(event, product.id)}
                    value="true"
                  />
                </TableCell>
                <TableCell>
                  <Typography color="textPrimary" variant="body1">
                    {product.medicine}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textPrimary" variant="body1">
                    {product.distributor}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textPrimary" variant="body1">
                    {product.quantity}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textPrimary" variant="body1">
                    {product.expiry}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textPrimary" variant="body1">
                    {product.mfg}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textPrimary" variant="body1">
                    {product.created}
                  </Typography>
                </TableCell>
                <TableCell>
                  {/* <Button variant="contained">Create Batch</Button>{' '} */}
                  <Button
                    variant="contained"
                    color="info"
                    onClick={() => {
                      Router.push(RouteNames.seeBatch);
                    }}
                  >
                    See Batch
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <TablePagination
        component="div"
        count={products.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}

export default BatcheListResults;
