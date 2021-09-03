// /* eslint-disable @typescript-eslint/no-use-before-define */
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

  

//   const MatEdit = ({ index }) => {

//     const handleEditClick = () => {
//         console.log(customers[index]._id)
//     }

//     return <FormControlLabel control={
//         <IconButton href={"/customers/"+customers[index]._id} color="secondary" aria-label="add an alarm" onClick={handleEditClick} >
//             <EditIcon />
//         </IconButton>
//     }
// />
// };

const columns = [
  { field: 'company', headerName: 'ชื่อลูกค้า', width: 180, editable: true },
  { field: 'owner', headerName: 'ชื่อเจ้าของบริษัท', width: 180, editable: true },
  {
    field: 'owner_tel',
    headerName: 'เบอร์โทรศัพท์',
    width: 180,
    editable: true,
  },
  {
    field: 'owner_email',
    headerName: 'อีเมล์ติดต่อ',
    width: 220,
    editable: true,
  },

  {
    field: "edit",
    headerName: "แก้ไขข้อมูล",
    sortable: false,
    width: 130,
    disableClickEventBubbling: true,
    renderCell: function edit(params){
      return (
        <Button href={"/customers/"+customers[params.row.id]._id} variant="contained" color="primary" startIcon={<EditIcon />}>
          แก้ไข
        </Button>
      );
    }
  },

  
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
          rows={rowCustomer(customers)}
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



const rowCustomer = (props) => {
  let row = []
  props.map((customer, index) =>{
    row.push({
      id: index,
      company: customer.company,
      owner: customer.owner,
      owner_tel: customer.owner_tel,
      owner_email: customer.owner_email,
    })
  })

  return row
}

Customers.layout = Admin;

export default Customers;