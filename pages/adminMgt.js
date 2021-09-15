import React, { useState, useEffect, createContext } from "react";
import { useRouter } from "next/router";

import randomString from "@smakss/random-string";
import { connectToDatabase } from "../util/mongodb";
import { DataGrid } from "@material-ui/data-grid";

import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField'

import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';


// layout for this page
import Admin from "layouts/Admin.js";
import Modal from '@material-ui/core/Modal';


export async function getServerSideProps() {
  const { db } = await connectToDatabase();

  const admins = await db
    .collection("admin")
    .find()
    .sort({})
    .limit(20)
    .toArray();

  const customers = await db.collection("customer").find().sort({}).toArray();
  const passwords = await db.collection("password").find().sort({}).toArray();


  return {
    props: {
      admin: JSON.parse(JSON.stringify(admins)),
      customer: JSON.parse(JSON.stringify(customers)),
      password: JSON.parse(JSON.stringify(passwords)),
    },
  };
}

const useStyles2 = makeStyles({
  formControl: {
    // margin: theme.spacing(1),
    minWidth: 100,
  },
  selectEmpty: {
    // marginTop: theme.spacing(2),
  },
  root: {
    '& .super-app-theme--header': {
      backgroundColor: 'rgba(255, 7, 0, 0.55)',
    },
  },
});


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxHeight: 500,
    overflow: 'auto',

  },
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  button_text_rows: {
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(1),
  },
  TextField: {
    marginLeft: theme.spacing(1),
    width: 240
  },
  TextField1: {
    width: 150
  },
  formControl: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    minWidth: 150,
  },
  div: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    maxHeight: 200
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
}));

function groupByKey(array, key) {
  return array.reduce((hash, obj) => {
    if (obj[key] === undefined) return hash;
    return Object.assign(hash, {
      [obj[key]]: (hash[obj[key]] || []).concat(obj),
    });
  }, {});
}

const AdminContext = React.createContext()

function AdminMgt({ admin: admins, customer: customers, password: passwords }) {

  const classes = useStyles();

  // const [password, setPassword] = useState();
  const [status, setStatus] = useState();

  const [company, setCompany] = useState("");
  const [companyError, setCompanyError] = useState(false);

  const [row, setRow] = useState([]);

  // modal
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  // form inside modal
  const [username, setUsername] = useState("")
  const [userId, setUserId] = useState("")

  // form inside modal edit

  const group = groupByKey(customers, "groupID");

  const router = useRouter();

  const handleChangeText = (e) => {
    if(e.target.name === 'name'){
      setUsername(e.target.value)
    }else if(e.target.name === 'USER_ID'){
      setUserId(e.target.value)
    }
  }

  const handleOpen = (name) => {

    // console.log(name.row.userId)
    if(name == "add" || name == "password"){
      setOpen(name);
    }else{
      setUsername(name.row.username)
      setUserId(name.row.userId)
      setOpen(name.row.userId)
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    let array = [];
    admins.map((admin, index) => {
      array.push({
        id: index,
        username: admin.username,
        status: admin.status,
        userId: admin.userId,
        groupId: admin.groupId.map((groupid) =>
          Object.keys(group).includes(groupid)
            ? group[groupid.toString()][0].company
            : null
        ),
      });
    });
    setRow(array);
  }, []);

  const handleChangeCompany = (event) => {
    console.log(company);
    setCompany(event.target.value);
  };

  const handleChangeStatus = (event) => {
    // console.log(company)
    setStatus(event.target.value);
  };

  const classes2 = useStyles2();

  const submit = () => {
    
    fetch("/api/admin", {
      method: "PUT", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify({
        username: username,
        userId: userId,
        status: status,
        groupId: company.groupID,
      }), // body data type must match "Content-Type" header
    })
      .then(alert("ลงทะเบียนสำเร็จ"))
      .then(router.reload());
  };

  const columns = [
    { field: "username", headerClassName: 'super-app-theme--header', headerName: "ชื่อผู้ใช้", width: 150, editable: true },
    {
      field: "status",
      headerName: "สถานะ",
      headerClassName: 'super-app-theme--header',
      width: 200,
      disableClickEventBubbling: true,
      renderCell: function choose(params) {
        // console.log(params)
        if (params.row.edit == true) {
          return (
            <FormControl
              className={classes2.formControl}
              error={companyError}
            >
              <InputLabel id="demo-simple-select-outlined-label1">
                Status
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label1"
                id="demo-simple-select-outlined"
                value={status ? status : ""}
                onChange={handleChangeStatus}
                label="Status"
              >
                <MenuItem key="แคชเชียร์" value="แคชเชียร์">
                  แคชเชียร์
                </MenuItem>
                <MenuItem
                  key="เจ้าของ หรือ ผู้ช่วย"
                  value="เจ้าของ หรือ ผู้ช่วย"
                >
                  เจ้าของ หรือ ผู้ช่วย
                </MenuItem>
                <MenuItem key="ลูกค้า" value="ลูกค้า">
                  ลูกค้า
                </MenuItem>
              </Select>
            </FormControl>
          );
        }
      },
    },
    {
      field: "userId",
      headerName: "User ID",
      headerClassName: 'super-app-theme--header',
      width: 180,
      editable: true,
    },
    {
      field: "groupId",
      headerName: "group",
      headerClassName: 'super-app-theme--header',
      width: 220,
      disableClickEventBubbling: true,
      
    },
    {
      field: "edit",
      headerName: "Edit",
      headerClassName: 'super-app-theme--header',
      // sortable: false,
      width: 130,
      // hide: true,
      disableClickEventBubbling: true,
      renderCell: function edit(params) {
        // console.log(params.row)
        return (
          <div>
            <Button
        onClick={() => handleOpen(params)}
        color="primary"
        variant="contained"
      >
        แก้ไข
      </Button>
      <Modal
        open={open === params.row.userId ? true : false}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <h2 id="simple-modal-title">แก้ไขข้อมูล</h2>
          <p id="simple-modal-description">
            กรอกข้อมูลด้านล่าง
          </p>
          
          
          <TextField className={classes.TextField1} required name="name" label="ชื่อผู้ใช้" value={params.row.username} onChange={(e) => handleChangeText(e)}  />
          <TextField className={classes.TextField} disable required name="USER_ID" label="USER ID" value={params.row.userId} onChange={(e) => handleChangeText(e)}  />

          <div>
            <FormControl
              // variant="outlined"
              className={classes.formControl}
              error={companyError}
            >
              <InputLabel id="demo-simple-select-outlined-label1">
                ชื่อลูกค้า
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label1"
                id="demo-simple-select-outlined"
                value={company ? company : ""}
                onChange={handleChangeCompany}
                label="Company"
              >
                {customers.map((company) => {
                  return (
                    <MenuItem key={company.company} value={company}>
                      {company.company}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <FormControl
              className={classes.formControl}
              error={companyError}
            >
              <InputLabel id="demo-simple-select-outlined-label1">
                Status
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label1"
                id="demo-simple-select-outlined"
                value={status ? status : ""}
                onChange={handleChangeStatus}
                label="Status"
              >
                <MenuItem key="แคชเชียร์" value="แคชเชียร์">
                  แคชเชียร์
                </MenuItem>
                <MenuItem
                  key="เจ้าของ หรือ ผู้ช่วย"
                  value="เจ้าของ หรือ ผู้ช่วย"
                >
                  เจ้าของ หรือ ผู้ช่วย
                </MenuItem>
                <MenuItem key="ลูกค้า" value="ลูกค้า">
                  ลูกค้า
                </MenuItem>
              </Select>
            </FormControl>
          </div>


          <Button className={classes.button} onClick={() => submit()} variant="contained" color="primary" >
            ยืนยัน
          </Button>
          <Button className={classes.button} onClick={handleClose} variant="contained" color="secondary" >
            ยกเลิก
          </Button>
          
        </div>
      </Modal>
          </div>
        )
      },
    },
  ];

  const getPassword = () => {
    let str = randomString(20);

    // if (status == "แคชเชียร์") {
    //   setPassword(str);
    // } else if (status == "เจ้าของ หรือ ผู้ช่วย") {
    //   setPasswordSO(str);
    // } else {
    //   setPasswordEN(str);
    // }

    fetch("/api/admin/password", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify({
        password: str,
        groupId: company.groupID,
        status: status,
      }), // body data type must match "Content-Type" header
    });
  }

  

  return (
    <div>
      <div className={classes.div}>
        รหัสผ่านสำหรับเป็น admin
        {passwords.map((password, index) => {
          return (
            <div key={index}>
              <TextField className={classes.TextField} label="รหัสผ่าน" value={password.password} InputProps={{ readOnly: true, }} />
              <TextField className={classes.TextField} label="สถานะ" value={password.status} InputProps={{ readOnly: true, }}  />
              <TextField className={classes.TextField} label="บริษัท" value={group[password.groupId.toString()][0].company} 
                                                                                InputProps={{ readOnly: true, }}  />
            </div>
          )
        })}

      </div>


      <div style={{ height: 400, width: "72%" }} className={classes2.root}>
        <DataGrid
          rows={row}
          columns={columns}
          hideFooterPagination={true}

          // checkboxSelection={handleSelectRow}
          // icons={EditIcon}
        />
      </div>

      {/* <AdminContext.Provider value={{}}> */}
        {/* <NewAdmin_Form /> */}

      {/* </AdminContext.Provider> */}
      <Button
        onClick={() => handleOpen("add")}
        color="primary"
        variant="contained"
      >
        เพิ่ม admin
      </Button>
      <Modal
        open={open == "add" ? true : false}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <h2 id="simple-modal-title">เพิ่ม Admin</h2>
          <p id="simple-modal-description">
            กรอกข้อมูลด้านล่าง
          </p>
          
          
          <TextField className={classes.TextField1} required name="name" label="ชื่อผู้ใช้" onChange={(e) => handleChangeText(e)}  />
          <TextField className={classes.TextField} required name="USER_ID" label="USER ID" onChange={(e) => handleChangeText(e)}  />

          <div>
            
            <FormControl
              // variant="outlined"
              className={classes.formControl}
              error={companyError}
            >
              <InputLabel id="demo-simple-select-outlined-label1">
                ชื่อลูกค้า
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label1"
                id="demo-simple-select-outlined"
                value={company ? company : ""}
                onChange={handleChangeCompany}
                label="Company"
              >
                {customers.map((company) => {
                  return (
                    <MenuItem key={company.company} value={company}>
                      {company.company}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <FormControl
              className={classes.formControl}
              error={companyError}
            >
              <InputLabel id="demo-simple-select-outlined-label1">
                Status
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label1"
                id="demo-simple-select-outlined"
                value={status ? status : ""}
                onChange={handleChangeStatus}
                label="Status"
              >
                <MenuItem key="แคชเชียร์" value="แคชเชียร์">
                  แคชเชียร์
                </MenuItem>
                <MenuItem
                  key="เจ้าของ หรือ ผู้ช่วย"
                  value="เจ้าของ หรือ ผู้ช่วย"
                >
                  เจ้าของ หรือ ผู้ช่วย
                </MenuItem>
                <MenuItem key="ลูกค้า" value="ลูกค้า">
                  ลูกค้า
                </MenuItem>
              </Select>
            </FormControl>
          </div>


          <Button className={classes.button} onClick={() => submit()} variant="contained" color="primary" >
            ยืนยัน
          </Button>
          <Button className={classes.button} onClick={handleClose} variant="contained" color="secondary" >
            ยกเลิก
          </Button>
          
        </div>
      </Modal>

      <Button
        onClick={() => handleOpen("password")}
        color="primary"
        variant="contained"
      >
        รับ password
      </Button>
      <Modal
        open={open == "password" ? true : false}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <h2 id="simple-modal-title">รับ password</h2>
          <p id="simple-modal-description">
            ระบุข้อมูลด้านล่าง
          </p>
          

          <div>
            <FormControl
              // variant="outlined"
              className={classes.formControl}
              error={companyError}
            >
              <InputLabel id="demo-simple-select-outlined-label1">
                ชื่อลูกค้า
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label1"
                id="demo-simple-select-outlined"
                value={company ? company : ""}
                onChange={handleChangeCompany}
                label="Company"
              >
                {customers.map((company) => {
                  return (
                    <MenuItem key={company.company} value={company}>
                      {company.company}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <FormControl
              className={classes.formControl}
              error={companyError}
            >
              <InputLabel id="demo-simple-select-outlined-label1">
                Status
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label1"
                id="demo-simple-select-outlined"
                value={status ? status : ""}
                onChange={handleChangeStatus}
                label="Status"
              >
                <MenuItem key="แคชเชียร์" value="แคชเชียร์">
                  แคชเชียร์
                </MenuItem>
                <MenuItem
                  key="เจ้าของ หรือ ผู้ช่วย"
                  value="เจ้าของ หรือ ผู้ช่วย"
                >
                  เจ้าของ หรือ ผู้ช่วย
                </MenuItem>
                <MenuItem key="ลูกค้า" value="ลูกค้า">
                  ลูกค้า
                </MenuItem>
              </Select>
            </FormControl>
          </div>


          <Button className={classes.button} onClick={() => getPassword()} variant="contained" color="primary" >
            ยืนยัน
          </Button>
          <Button className={classes.button} onClick={handleClose} variant="contained" color="secondary" >
            ยกเลิก
          </Button>
          
        </div>
      </Modal>

      
      


      
    </div>
  );
}

AdminMgt.layout = Admin;

export { AdminContext }

export default AdminMgt;
