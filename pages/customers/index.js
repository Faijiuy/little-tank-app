// /* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from "react";
import { DataGrid } from "@material-ui/data-grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import { makeStyles } from "@material-ui/core/styles";

import { connectToDatabase } from "../../util/mongodb";
import Admin from "layouts/Admin.js";
import { useRouter } from "next/router";
import Modal from "@material-ui/core/Modal";
import AddIcon from '@mui/icons-material/Add';

import AuthContext from "../../stores/authContext";


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

const useStyles = makeStyles((theme) => ({
  root: {
    "& .super-app-theme--header": {
      backgroundColor: "rgba(255, 7, 0, 0.55)",
    },
  },
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxHeight: 500,
    overflow: "auto",
  },
}));

const boxStyle = {
  padding: 30,
  margin: "50px",
};

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

function Customers({ customer: customers }) {
  const classes = useStyles();
  const router = useRouter();

  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [company, setCompany] = React.useState("");
  const [deleteComplete, setDeleteComplate] = React.useState(false)

  const [loading, setLoading] = React.useState(false)

  const { user2, status, auth, setAuth } = React.useContext(AuthContext)

  console.log("user2: ", user2)


  const handleOpen = (params) => {
    // console.log(params)
    setCompany(params.row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [editRowsModel, setEditRowsModel] = React.useState({});


  const handleEditRowModelChange = React.useCallback((params) => {
    setEditRowsModel(params.model);
  }, []);

  // const handleBlur = React.useCallback((params) => {
  //   console.log(params)
  // }, []);
  const redirect = (path) => {
    router.push(path)
  }

  const handleDelete = async () => {
    setLoading(true)

    await fetch("/api/customer", {
      method: "DELETE", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(company), // body data type must match "Content-Type" header
    })
      .then(function(response){
        setDeleteComplate(true)
        router.reload()

      })
  };

  const columns = [
    {
      field: "company",
      headerClassName: "super-app-theme--header",
      headerName: "ชื่อลูกค้า",
      width: 180,
      editable: true,
    },
    {
      field: "owner",
      headerClassName: "super-app-theme--header",
      headerName: "ชื่อเจ้าของบริษัท",
      width: 180,
      editable: true,
    },
    {
      field: "owner_tel",
      headerClassName: "super-app-theme--header",
      headerName: "เบอร์โทรศัพท์",
      width: 180,
      editable: true,
    },
    {
      field: "owner_email",
      headerClassName: "super-app-theme--header",
      headerName: "อีเมล์ติดต่อ",
      width: 220,
      editable: true,
    },

    {
      field: "edit",
      headerClassName: "super-app-theme--header",
      headerName: "แก้ไขข้อมูล",
      sortable: false,
      width: 330,
      disableClickEventBubbling: true,
      renderCell: function edit(params) {
        return (
          <div>
            <Button
              // href={"/customers/" + customers[params.row.id]._id}
              onClick={() => redirect("/customers/" + customers[params.row.id]._id)}
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
            >
              แก้ไข
            </Button>
            <Button
              onClick={() => handleOpen(params)}
              variant="contained"
              color="secondary"
              startIcon={<EditIcon />}
            >
              ลบ
            </Button>
            <Modal
              open={company.company == params.row.company ? open : false}
              onClose={handleClose}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
            >
              <div style={modalStyle} className={classes.paper}>
                <h2 id="simple-modal-title">ยืนยันการลบ</h2>
                <p id="simple-modal-description">
                  ท่านต้องการลบบริษัท {company.company} ใช่ไหม
                </p>

                <Button
                  onClick={() => handleDelete()}
                  variant="contained"
                  color="primary"
                >
                  ยืนยัน
                </Button>
                <Button
                  onClick={handleClose}
                  variant="contained"
                  color="secondary"
                >
                  ยกเลิก
                </Button>
              </div>
            </Modal>
          </div>
        );
      },
    },
  ];

  return (
    <div>
        <Box style={boxStyle}>
          <h3>รายชื่อลูกค้า
          {/* <Box display="flex" > */}
            {/* <Button variant="contained" color="primary" href="customers/create" style={{position: "relative", left: 610, width: 200, height: 50}}> */}
            <Button variant="contained" color="primary" onClick={()=> redirect("/customers/create")} style={{float: "right", width: 200, height: 50}}> 
              <AddIcon />เพิ่มบริษัท
            </Button>
          {/* </Box> */}
            
          </h3>
          <div style={{ width: "100%" }}>
            {/* <Box style={boxStyle}> */}
              {/* <br /> */}
              <div style={{ height: 500, width: "100%" }} className={classes.root}>
                <DataGrid
                  rows={rowCustomer(customers)}
                  columns={columns}
                  editRowsModel={editRowsModel}
                  onEditRowModelChange={handleEditRowModelChange}
                  hideFooterPagination={true}

                  // checkboxSelection={handleSelectRow}
                  // icons={EditIcon}
                />
              </div>
            {/* </Box> */}
          </div>

        </Box>

        <Modal
          open={loading}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >


            <div style={modalStyle} className={classes.paper}>

          {deleteComplete ? 
            <h2 style={{alignContent: "center"}}>ลบสำเร็จ</h2> :
            
            loading ? <h2 style={{alignContent: "center"}}>Loading</h2> : null

            }

            </div> 
          
        </Modal>
    </div>
  );
}

const rowCustomer = (props) => {
  let row = [];
  props.map((customer, index) => {
    row.push({
      id: index,
      _id: customer._id,
      company: customer.company,
      owner: customer.owner,
      owner_tel: customer.owner_tel,
      owner_email: customer.owner_email,
    });
  });

  return row;
};

Customers.layout = Admin;

export default Customers;
