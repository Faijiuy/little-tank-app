import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// layout for this page
import Admin from "layouts/Admin.js";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import { connectToDatabase } from "../../util/mongodb";
import { ObjectId } from "bson";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";


export async function getServerSideProps(props) {
  const { db } = await connectToDatabase();
  let id = props.params.userId;

  if (id !== "create") {
    const user = await db.collection("user").findOne({ _id: ObjectId(id) });

    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
      },
    };
  } else {
    return {
      props: {
        user: JSON.parse(null),
      },
    };
  }
}

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
  button: {
    height: 40,
  },
};

const useStyles2 = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: 400,
    maxWidth: 300,
    backgroundColor: theme.palette.background.paper,
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
  paper2: {
    position: "absolute",
    width: 200,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxHeight: 500,
    overflow: "auto",
  },
}));

const LicenseContext = React.createContext();

function CreateUser({ user: users }) {
  // console.log("users ===> ", users);
  const [username, setUsername] = useState();
  const [passwordUser, setPasswordUser] = useState();
  const [loginStatus, setLoginStatus] = useState(false);
  //   const [owner_email, setOwner_email] = useState()
  //   const [contact_name, setContact_name] = useState()
  //   const [contact_tel, setContact_tel] = useState()
  //   const [contact_email, setContact_email] = useState()

  const [usernameError, setUsernameError] = useState(false);
  const [passwordUserError, setPasswordError] = useState(false);
  //   const [owner_telError, setOwner_telError] = useState(false)

  //   const [licensePlate, setLicensePlate] = useState([]);
  const [row, setRow] = useState([]);

  //   const [address, setAddress] = useState()
  //   const [TIN, setTIN] = useState()
  //   const [groupID, setGroupID] = useState()
  const [new_passwordUser, setNew_PasswordUser] = useState();

  const router = useRouter();

  const [modalStyle] = React.useState(getModalStyle);

  const [open, setOpen] = React.useState(false);
  const [open_new, setOpen_new] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen_pass = () => {
    setOpen_new(true);
  };

  const handleClose_pass = () => {
    setOpen_new(false);
  };

  useEffect(() => {
    const user1 = {
      username: "username",
      password: "password",
      loginStatus: false,
    };

    if (users !== null) {
      setUsername(users.username);
      setPasswordUser(users.password);
      setLoginStatus(users.loginStatus);
    } else {
      setUsername(user1.username);
      setPasswordUser(user1.password);
      setLoginStatus(user1.loginStatus);
    }
  }, []);

  const handleChangePass = (e) => {
    setNew_PasswordUser(e.target.value);
  };

  const handleChange_password = () => {
    setPasswordUser(new_passwordUser);
    setOpen(false);
    setOpen_new(false);
    // console.log(passwordUser);
  };

  const useStyles = makeStyles(styles);

  const handleSetState = (event) => {
    if (event.target.id === "username") {
      setUsername(event.target.value);
    } else if (event.target.id === "password") {
      setPasswordUser(event.target.value);
    } 
    // else if (event.target.id === "groupID") {
    //   setGroupID(event.target.value);
    // }
  };

  const info = {
    username: username,
    password: passwordUser,
    loginStatus: loginStatus,
  };

  const onSubmit = (str) => {
    if (str === "add") {
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
        body: JSON.stringify(info), // body data type must match "Content-Type" header
      })
        .then((response) => response.json())
        .then((data) => {
          // console.log(data);
          alert("ลงทะเบียนสำเร็จ");
        })
        .then(router.push("/users"));
    } else if (str === "update") {
      // console.log(customer._id)
      // let id = ObjectId(customer._id)

      info["_id"] = users._id;

      // console.log(id)
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
        body: JSON.stringify(info), // body data type must match "Content-Type" header
      })
        .then((response) => response.json())
        .then(alert("อัพเดทสำเร็จ"))
        .then(router.push("/users"));
    }
  };

  const classes = useStyles();
  const classes2 = useStyles2();

  return (
    // <form onSubmit={handleSubmit(onSubmit)}>
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              {users === null ? (
                <h4 className={classes.cardTitleWhite}>ลงทะเบียน</h4>
              ) : (
                <h4 className={classes.cardTitleWhite}>อัพเดทข้อมูล</h4>
              )}
              <p className={classes.cardCategoryWhite}>
                กรุณากรอกข้อมูลด้านล่าง
              </p>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="ชื่อผู้ใช้"
                    id="username"
                    formControlProps={{
                      fullWidth: true,
                      required: true,
                      error: usernameError,
                    }}
                    inputProps={{
                      defaultValue: users !== null ? users.username : null,
                      // onChange: handleChange,
                      onBlur: handleSetState,
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                {/*<GridItem xs={12} sm={12} md={5}>
                  <CustomInput
                    labelText="รหัสผ่าน"
                    id="password"
                    formControlProps={{
                      fullWidth: true,
                      required: true,
                      error: passwordUserError,
                    }}
                    inputProps={{
                      // onChange: handleChange,
                      defaultValue: users !== null ? users.password : null,
                      onBlur: handleSetState,
                    }}
                  />
                </GridItem>*/}
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="รหัสผ่าน"
                    id="password"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      // onChange: handleChange,
                      disabled: users ? true : false,
                      defaultValue: users !== null ? users.password : null,
                      value: passwordUser,
                      onBlur: handleSetState,
                    }}
                  />
                </GridItem>
                {users !== null ? (
                  <div>
                    <Button
                      className={classes.button}
                      style={{ marginTop: 30 }}
                      onClick={handleOpen}
                    >
                      แก้รหัส
                    </Button>
                    <Modal
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="simple-modal-title"
                      aria-describedby="simple-modal-description"
                    >
                      <div style={modalStyle} className={classes2.paper}>
                        <h2 id="simple-modal-title">แก้ไขรหัส</h2>

                        <form
                          className={classes.root}
                          noValidate
                          autoComplete="off"
                        >
                          <TextField
                            name="LINE"
                            label="รหัสไลน์"
                            style={{ width: 350 }}
                            defaultValue={users.password}
                            onChange={(e) => handleChangePass(e)}
                          />
                          <div>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleOpen_pass()}
                              // className={classes.button}
                            >
                              ยืนยัน
                            </Button>
                            <Modal
                              open={open_new}
                              onClose={handleClose_pass}
                              aria-labelledby="simple-modal-title"
                              aria-describedby="simple-modal-description"
                            >
                              <div
                                style={modalStyle}
                                className={classes2.paper2}
                              >
                                <p id="simple-title">ท่านแน่ใจใช่ไหม</p>

                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={handleChange_password}
                                >
                                  ยืนยัน
                                </Button>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={handleClose_pass}
                                >
                                  ยกเลิก
                                </Button>
                              </div>
                            </Modal>

                            <Button
                              variant="contained"
                              color="primary"
                              onClick={handleClose}
                              // className={classes.button}
                            >
                              ยกเลิก
                            </Button>
                          </div>
                        </form>
                      </div>
                    </Modal>
                  </div>
                ) : null}
              </GridContainer>

              <br />
            </CardBody>
            <CardFooter>
              <div>
                {users === null ? (
                  <Button onClick={() => onSubmit("add")} color="primary">
                    ลงทะเบียน
                  </Button>
                ) : (
                  <Button onClick={() => onSubmit("update")} color="primary">
                    อัพเดท
                  </Button>
                )}
                <Button onClick={() => router.push("/users")} color="rose">
                  ยกเลิก
                </Button>
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

CreateUser.layout = Admin;

export { LicenseContext };

export default CreateUser;