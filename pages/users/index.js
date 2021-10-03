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
import AuthContext from "../../stores/authContext";

// import UserProfile from "components/UserProfile";

export async function getServerSideProps() {
  const { db } = await connectToDatabase();

  const users = await db.collection("user").find().sort({}).limit(20).toArray();

  return {
    props: {
      user: JSON.parse(JSON.stringify(users)),
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

function Users({ user: users }) {
  const classes = useStyles();
  const router = useRouter();

  // console.log('users ===>  ', users)

  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = React.useState("");
  const [loginStatus, setLoginStatus] = React.useState(false);

  const { user2, status } = React.useContext(AuthContext)


  

  const handleOpen = (params) => {
    // console.log(params)
    setUser(params.row);
    setOpen(true);
  };

  const handleOpenLogout = () => setOpen(true);

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

  const handleDelete = () => {
    fetch("/api/user", {
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
      body: JSON.stringify(user), // body data type must match "Content-Type" header
    })
      .then((response) => response.json())
      .then(router.reload());
  };

  const signOut = () => {
    let signOutUser = {
      _id: "",
      username: "",
      password: "",
      loginStatus: "",
    };
    // let locateUser = users.filter((u) => value == u.username);
    users.map((u) => {
      if (u.loginStatus == true) {
        signOutUser._id = u._id;
        signOutUser.username = u.username;
        signOutUser.password = u.password;
        signOutUser.loginStatus = loginStatus;
      }
    });
    console.log("signOutUser ===> ", signOutUser);
    fetch("/api/user/loginAPI", {
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
      body: JSON.stringify(signOutUser), // body data type must match "Content-Type" header
    })
      .then((response) => response.json())
      // .then((data) => {
      //   alert("Update Login Status:\nResponse from server " + data.message);
      //   console.log(data);
      // })
      .then(router.reload());
  };

  const columns = [
    {
      field: "username",
      headerClassName: "super-app-theme--header",
      headerName: "ชื่อผู้ใช้",
      width: 180,
      // editable: true,
    },
    // { field: 'password', headerClassName: 'super-app-theme--header', headerName: 'รหัสผ่าน', width: 180, editable: true },
    {
      field: "loginTime",
      headerClassName: "super-app-theme--header",
      headerName: "เวลาที่เข้าใช้",
      width: 180,
      // editable: true,
    },
    {
      field: "edit",
      headerClassName: "super-app-theme--header",
      headerName: "แก้ไขข้อมูล",
      sortable: false,
      width: 200,
      disableClickEventBubbling: true,
      renderCell: function edit(params) {
        return (
          <div>
            <Button
              href={"/users/" + users[params.row.id]._id}
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
              open={user.username == params.row.username ? open : false}
              onClose={handleClose}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
            >
              <div style={modalStyle} className={classes.paper}>
                <h2 id="simple-modal-title">ยืนยันการลบ</h2>
                <p id="simple-modal-description">
                  ท่านต้องการลบผู้ใช้ {user.username} ใช่ไหม
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
    <div style={{ width: "100%" }}>
      {/* {(sessionStorage.getItem('status') === "root" || sessionStorage.getItem('status') === "admin") ? ( */}
        <Box style={boxStyle}>
          <Box display="flex">
            <Button variant="contained" color="primary" href="users/create">
              เพิ่มผู้ใช้
            </Button>
          </Box>
          <br />
          <div style={{ height: 400, width: "50%" }} className={classes.root}>
            <DataGrid
              rows={rowUser(users)}
              columns={columns}
              editRowsModel={editRowsModel}
              onEditRowModelChange={handleEditRowModelChange}
              hideFooterPagination={true}

              // checkboxSelection={handleSelectRow}
              // icons={EditIcon}
            />
          </div>
          <br />
          <Box display="flex">
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenLogout}
            >
              ออกจากระบบ
            </Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
            >
              <div style={modalStyle} className={classes.paper}>
                <h2 id="simple-modal-title">ยืนยันการออกจากระบบ</h2>
                <p id="simple-modal-description">ท่านต้องการออกจากระบบใช่ไหม</p>

                <Button
                  onClick={() => signOut()}
                  variant="contained"
                  color="primary"
                  href="/login"
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
          </Box>
        </Box>

      {/* ) : <div>ขออภัย คุณไม่มีสิทธิในการเข้าถึงหน้านี้</div> } */}
    </div>
  );
}

const rowUser = (props) => {
  let row = [];
  props.map((user, index) => {
    row.push({
      id: index,
      _id: user._id,
      username: user.username,
      password: user.password,
      loginStatus: user.loginStatus,
      loginTime: user.loginTime
    });
  });

  return row;
};

Users.layout = Admin;

export default Users;
