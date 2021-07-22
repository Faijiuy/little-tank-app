/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import { FormControlLabel, IconButton } from '@material-ui/core';

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

  

  const MatEdit = ({ index }) => {

    const handleEditClick = () => {
        console.log(customers[index]._id)
    }

    return <FormControlLabel control={
        <IconButton href={"/customers/"+customers[index]._id} color="secondary" aria-label="add an alarm" onClick={handleEditClick} >
            <EditIcon />
        </IconButton>
    }
/>
};

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
  {
    field: "actions",
    headerName: "Actions",
    sortable: false,
    width: 140,
    disableClickEventBubbling: true,
    renderCell: (params) => {
        return (
            <div className="d-flex justify-content-between align-items-center" style={{ cursor: "pointer" }}>
                <MatEdit index={params.row.id} />
             </div>
        );
     }
  }
];

  return (
    <div style={{ width: '100%' }}>
      <Box display="flex" flexDirection="row-reverse" p={1} m={1}>
         <Button variant="contained" color="primary" href="customers/create">
         เพิ่มบริษัท
         </Button>
      </Box>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={test(customers)}
          columns={columns}
          editRowsModel={editRowsModel}
          onEditRowModelChange={handleEditRowModelChange}
          onCellBlur={handleBlur}
          // checkboxSelection={handleSelectRow}
          // icons={EditIcon}
          
        />
      </div>
    </div>
  );
}



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