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
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { useGridSelection } from "@material-ui/data-grid";
import router from "next/router";

const LoginForm = () => {
  let users = [];
  let user = {
    _id: "",
    username: "",
    password: "",
    loginStatus: false,
    rememberStatus: false
  };

  useEffect(() => {
    fetch("/api/user", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
    })
      .then((response) => response.json())
      .then((data) => {
        users.push(...data);
        console.log("data ===> ", data);
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
  const [checked, setChecked] = useState(false);
  const [loginStatus, setLoginStatus] = useState(false);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const paperStyle = {
    padding: 20,
    height: "30vh",
    width: 400,
    margin: "50px auto",
  };

  const avatarStyle = {
    backgroundColor: "#3c54c0",
  };

  const formStyle = {
    width: 400,
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

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const onSubmit = () => {
    console.log(
      "Click\nผู้ใช้: " +
        username +
        "\nรหัสผ่าน: " +
        passwordUser +
        "\nCheck: " +
        checked
    );

    let filterUser = users.filter(
      (u) => username === u.username && passwordUser === u.password
    );

    filterUser.map((u) => {
      console.log("u ===>  ", u.username, u.password, u._id)
      user._id = u._id
      user.username = u.username
      user.password = u.password
      if (username == u.username && passwordUser == u.password) {
        setLoginStatus(true);
        console.log("Login Successfully");
        user.loginStatus = true;
        user.rememberStatus = checked;
      } else {
        setLoginStatus(false);
        console.log("error");
        console.log(loginStatus);
        user.loginStatus = false;
        user.rememberStatus = checked;
      }
    });

    console.log("user ===> ", user);

    // setTimeout(() => {
      fetch("/api/user", {
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
        body: JSON.stringify(user), // body data type must match "Content-Type" header
      })
        .then((response) => response.json())
        .then((data) => {
          alert("Update Login Status:\nResponse from server " + data.message);
          console.log(data);
        });
    // }, 2000);
  };

  return (
    <Grid>
      <Paper elevation={10} style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <LockOutlinedIcon />
          </Avatar>
          <h3>
            <b>ลงชื่อเข้าใช้ระบบ</b>
          </h3>
        </Grid>
        <FormControl style={formStyle}>
          <TextField
            label="ชื่อผู้ใช้"
            placeholder="ใส่ชื่อผู้ใช้"
            // id="username"
            onChange={handleChangeUsername}
            fullWidth
            required
          />
          <br />
          <TextField
            label="รหัสผ่าน"
            placeholder="ใส่รหัสผ่าน"
            type="password"
            // id="passwordUser"
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
            ลงชื่อเข้าใช้
          </Button>
          <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle}>
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                fontSize="50"
              >
                {loginStatus ? "Welcome!!      " + username : ""}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {loginStatus
                  ? "Login Successfully."
                  : "Username or Password are wrong."}
              </Typography>
              <div>
                {loginStatus ? (
                  <Button
                    variant="contained"
                    className="right"
                    size="medium"
                    href="/dashboard"
                  >
                    ไปหน้า Dashboard
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    className="right"
                    size="medium"
                    onClick={handleClose}
                  >
                    ปิด
                  </Button>
                )}
              </div>
            </Box>
          </Modal>
        </FormControl>
        {/*<Typography>
          <br />
          <Link href="#"> ลืมรหัสผ่าน</Link>
        </Typography>*/}
      </Paper>
    </Grid>
  );
};

export default LoginForm;
