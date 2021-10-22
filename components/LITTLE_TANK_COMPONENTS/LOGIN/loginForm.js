import React, { useState, useEffect, useContext } from "react";
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
import AuthContext from "../../../stores/authContext";
import { format } from "date-fns";

import moment from 'moment';

moment().format();
// import UserProfile from './UserProfile';

const LoginForm = () => {
  const [loginTime, setLoginTime] = useState()



  let users = [];
  let user = {
    _id: "",
    username: "",
    id: "",
    password: "",
    status: "",
    loginStatus: false,
    loginTime: loginTime
    // rememberStatus: false
  };

  useEffect(() => {
    fetch("/api/user", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
    })
      .then((response) => response.json())
      .then((data) => {
        users.push(...data);
        // console.log("data ===> ", data);
      });
    // console.log("users ====> ", users);
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
  const { auth, setUser_id, setAuth, setStatus, status, setLoading } = useContext(AuthContext)


  const [username, setUsername] = useState("");
  const [id, setId] = useState("");
  const [passwordUser, setPasswordUser] = useState("");
  // const [checked, setChecked] = useState(false);
  const [loginStatus, setLoginStatus] = useState(false);


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

  const handleChangeId = (event) => {
    setId(event.target.value);
  };

  const handleChangePasswordUser = (event) => {
    setPasswordUser(event.target.value);
  };

  // const handleChange = (event) => {
  //   setChecked(event.target.checked);
  // };

  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      handleOpen();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    console.log(
      "Click\nผู้ใช้: " + username
      // +
      // "\nรหัสผ่าน: " +
      // passwordUser
      // +
      // "\nCheck: " +
      // checked
    );

    let filterUser = users.filter(
      (u) => id === u.id && passwordUser === u.password
    );

    filterUser.map((u) => {
      user._id = u._id;
      user.id = u.id;
      user.password = u.password;
      // UserProfile.setName(u.username);
      // console.log("UserProfile.getName() ==> ",UserProfile.getName())
      if (id == u.id && passwordUser == u.password) {
        let today = new Date()
        let time = moment(today, "DD/MM/YYYY hh:mm:ss")
        let split = time.format().split("T")

        let todayDate = format(today, "dd/MM/yyyy");

        if (today.getFullYear() >= 2564) {
          let thaiDate = format(today, "dd/MM");
          todayDate = thaiDate + "/" + (new Date().getFullYear() - 543);
        } 
     

        setLoginStatus(true);
        setAuth(true)
        setUser_id(u._id)
        setStatus(u.status)
        setLoginTime(todayDate + " " + split[1].split("+")[0])
        setLoading(true)

        sessionStorage.setItem('auth', true)
        sessionStorage.setItem('user_id', u._id)
        sessionStorage.setItem('status', u.status)

        console.log("Login Successfully");
        user.loginStatus = true;
        user.loginTime = todayDate + " " + split[1].split("+")[0]
        // user.rememberStatus = checked;
      } else {
        setLoginStatus(false);
        console.log("error");
        console.log(loginStatus);
        user.loginStatus = false;
        // user.rememberStatus = checked;
      }
    });

    // setTimeout(() => {
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
      body: JSON.stringify(user), // body data type must match "Content-Type" header
    })
      .then((response) => response.json())
      .then(router.push("/dashboard"))
      // .then((data) => {
      //   alert("Update Login Status:\nResponse from server " + data.message);
      //   console.log(data);
      // })
      ;
    // }, 2000);
    // loginStatus ?  : null
  };

  return (
    <Grid>
      <Paper style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <LockOutlinedIcon />
          </Avatar>
          <h4>
            <b>ลงชื่อเข้าใช้ระบบ</b>
          </h4>
        </Grid>
        <FormControl style={formStyle}>
          <TextField
            label="เบอร์โทรศัพท์หรืออีเมล"
            placeholder="ใส่เบอร์โทรศัพท์หรืออีเมล"
            // id="username"
            onChange={handleChangeId}
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
                // handleOpen();
                handleSubmit();
              }
              // () => onSubmit()
              // alert("ผู้ใช้: " + username + "\nรหัสผ่าน: " + passwordUser + "\nCheck: " + checked)
            }
            fullWidth
            onKeyPress={handleKeypress}
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
