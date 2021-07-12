/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import { connectToDatabase } from "../../util/mongodb";
import Admin from "layouts/Admin.js";

export async function getServerSideProps() {
  const { db } = await connectToDatabase();

  const customers = await db
    .collection("customer")
    .find()
    .sort({})
    .limit(20)
    .toArray();

  return {
    props: {
      customer: JSON.parse(JSON.stringify(customers)),
    },
  };
}

function Customers({customer: customers}) {

  const [editRowsModel, setEditRowsModel] = React.useState({});

  const handleEditRowModelChange = React.useCallback((params) => {
    setEditRowsModel(params.model);
  }, []);

  const handleBlur = React.useCallback((params) => {
    console.log(params)
  }, []);

  return (
    <div style={{ width: '100%' }}>
      <Box display="flex" flexDirection="row-reverse" p={1} m={1}>
         <Button variant="contained" color="primary" href="/admin/createCustomer">
         เพิ่มบริษัท
         </Button>
      </Box>
      <code>editRowsModel: {JSON.stringify(editRowsModel)}</code>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={test(customers)}
          columns={columns}
          editRowsModel={editRowsModel}
          onEditRowModelChange={handleEditRowModelChange}
          onCellBlur={handleBlur}
        />
      </div>
    </div>
  );
}

const columns = [
  { field: 'company', headerName: 'Company', width: 180, editable: true },
  { field: 'owner', headerName: 'Owner', width: 180, editable: true },
  {
    field: 'owner_tel',
    headerName: 'Phone number',
    width: 180,
    editable: true,
  },
  {
    field: 'owner_email',
    headerName: 'E-mail',
    width: 220,
    editable: true,
  },
];

const test = (props) => {
  let row = []
  props.map((customer, index) =>{
    row.push({
      id: index,
      company: customer.company,
      owner: customer.owner,
      owner_tel: customer.owner_tel,
      owner_email: customer.owner_email

    })
  })

  return row
}

Customers.layout = Admin;

export default Customers;