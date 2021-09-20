import React, { useState, useEffect } from "react";
import { Modal, Box } from "@material-ui/core";
import {
  Avatar,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  Link,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import { useGridSelection } from "@material-ui/data-grid";
import router from "next/router";

const SignUpForm = () => {
  let users = [];
  let user = {
    username: "",
    password: "",
    loginStatus: false,
    rememberStatus: false,
  };

  useEffect(() => {
    fetch("/api/user", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
    })
      .then((response) => response.json())
      .then((data) => {
        users.push(...data);
        console.log(data);
      });
    console.log("users ====> ", users);
  });

  // let user = fetch(process.env.API + "/user", {
  //   method: "GET", // *GET, POST, PUT, DELETE, etc.
  // })
  //   .then((response) => response.json())
  //   .then((data) => {
  //     users.push(data);
  //     console.log(data);
  //   });
  // console.log("user ====> ", users);;

  const [username, setUsername] = useState("");
  const [passwordUser, setPasswordUser] = useState("");
  const [dulplicateUser, setDulplicateUser] = useState(false);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const paperStyle = {
    padding: 20,
    height: "50vh",
    width: 280,
    margin: "0 auto",
  };

  const avatarStyle = {
    backgroundColor: "#3c54c0",
  };

  const formStyle = {
    width: 280,
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const handleChangeUsername = (event) => {
    setUsername(event.target.value);
  };

  const handleChangePasswordUser = (event) => {
    setPasswordUser(event.target.value);
  };

  const onSubmit = () => {
    console.log("Click\nผู้ใช้: " + username + "\nรหัสผ่าน: " + passwordUser);

    let filterUser = users.filter((u) => username === u.username);

    console.log("filterUser ===> ", filterUser);

    if (filterUser.length == 0) {
      setDulplicateUser(false);
      user.username = username;
      user.password = passwordUser;
    } else {
      setDulplicateUser(true);
      console.log("Dulplicated Username");
    }

    // setTimeout(() => {
    fetch("/api/user", {
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
      body: JSON.stringify(user), // body data type must match "Content-Type" header
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Insert New User:\nResponse from server " + data.message);
        console.log(data);
      });
    // }, 2000);
  };

  console.log("dulplicateUser ===> ", dulplicateUser);

  return (
    <Grid>
      <Paper style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <AddCircleOutlineOutlinedIcon />
          </Avatar>
          <h4>
            <b>สร้างบัญชีใหม่</b>
          </h4>
        </Grid>
        <FormControl style={formStyle}>
          <TextField
            label="ชื่อผู้ใช้"
            placeholder="ใส่ชื่อผู้ใช้"
            id="username"
            onChange={handleChangeUsername}
            fullWidth
            required
          />
          <br />
          <TextField
            label="รหัสผ่าน"
            placeholder="ใส่รหัสผ่าน"
            type="password"
            id="passwordUser"
            onChange={handleChangePasswordUser}
            fullWidth
            required
          />
          <br />
          {/*<FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={handleChange}
                name="checkedB"
                color="primary"
              />
            }
            label="จดจำฉันไว้ในระบบ"
        />*/}
          <Button
            type="submit"
            color="primary"
            variant="contained"
            onClick={
              () => {
                handleOpen();
                onSubmit();
              }
              // () => onSubmit()
              // alert("ผู้ใช้: " + username + "\nรหัสผ่าน: " + passwordUser + "\nCheck: " + checked)
            }
            fullWidth
          >
            ลงทะเบียน
          </Button>
          <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle}>
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                fontSize="50"
              >
                {dulplicateUser ? "" : "Welcome!!      " + username}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {dulplicateUser
                  ? "ชิ่อผู้ใช้ซ้ำ.\n กรุณาเปลี่ยนชื่อ."
                  : "คลิกปิดเพื่อลงชื่อเข้าใช้."}
              </Typography>
              <Button
                variant="contained"
                className="right"
                size="medium"
                href="/login"
              >
                ปิด
              </Button>
            </Box>
          </Modal>
        </FormControl>
      </Paper>
    </Grid>
  );
};

export default SignUpForm;
