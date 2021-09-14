// /* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/styles';

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

const useStyles = makeStyles({
  root: {
    '& .super-app-theme--header': {
      backgroundColor: 'rgba(255, 7, 0, 0.55)',
    },
  },
});

function Customers({customer: customers}) {

  const classes = useStyles();


  const [editRowsModel, setEditRowsModel] = React.useState({});


  const handleEditRowModelChange = React.useCallback((params) => {
    setEditRowsModel(params.model);
  }, []);

  const handleBlur = React.useCallback((params) => {
    console.log(params)
  }, []);

  

  

const columns = [
  { field: 'company', headerClassName: 'super-app-theme--header', headerName: 'ชื่อลูกค้า', width: 180, editable: true },
  { field: 'owner', headerClassName: 'super-app-theme--header', headerName: 'ชื่อเจ้าของบริษัท', width: 180, editable: true },
  {
    field: 'owner_tel',
    headerClassName: 'super-app-theme--header',
    headerName: 'เบอร์โทรศัพท์',
    width: 180,
    editable: true,
  },
  {
    field: 'owner_email',
    headerClassName: 'super-app-theme--header',
    headerName: 'อีเมล์ติดต่อ',
    width: 220,
    editable: true,
  },

  {
    field: "edit",
    headerClassName: 'super-app-theme--header',
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
      <Box display="flex">
         <Button variant="contained" color="primary" href="customers/create">
         เพิ่มบริษัท
         </Button>
      </Box>
      <div style={{ height: 500, width: '73%' }} className={classes.root}>
        <DataGrid
          rows={rowCustomer(customers)}
          columns={columns}
          editRowsModel={editRowsModel}
          onEditRowModelChange={handleEditRowModelChange}
          onCellBlur={handleBlur}
          hideFooterPagination={true}

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