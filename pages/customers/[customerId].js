import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
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
import { ObjectId } from 'bson';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField'


import LicensePlate_List from "../../components/customer/list"
import LicensePlate_modal from "../../components/customer/modal"


export async function getServerSideProps(props) {
  const { db } = await connectToDatabase();
  let id = props.params.customerId

  if(id !== 'create'){  
    const customer = await db
      .collection("customer")
      .findOne(
        { _id: ObjectId(id) }
      )

    return {
      props: {
        customer: JSON.parse(JSON.stringify(customer)),
      },
    };

  }else{
    return {
      props: {
        customer: JSON.parse(null),
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
    height: 40
  }
};

const useStyles2 = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: 400,
    maxWidth: 300,
    backgroundColor: theme.palette.background.paper,
  },
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
  paper2: {
    position: 'absolute',
    width: 200,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxHeight: 500,
    overflow: 'auto',

  },
}));


const LicenseContext = React.createContext()


function CreateCustomer({customer:customers}) {

  console.log("customerers ===> ", customers);


  const [company, setCompany] = useState()
  const [owner, setOwner] = useState()
  const [owner_tel, setOwner_tel] = useState()
  const [owner_email, setOwner_email] = useState()
  const [contact_name, setContact_name] = useState()
  const [contact_tel, setContact_tel] = useState()
  const [contact_email, setContact_email] = useState()

  const [companyError, setCompanyError] = useState(false)
  const [ownerError, setOwnerError] = useState(false)
  const [owner_telError, setOwner_telError] = useState(false)

  const [licensePlate, setLicensePlate] = useState([]);
  const [row, setRow] = useState([]);


  const [address, setAddress] = useState()
  const [TIN, setTIN] = useState()
  const [groupID, setGroupID] = useState()
  const [new_groupID, setNew_GroupID] = useState()


  const router = useRouter()

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
    const customer1 = {
      company: "company",
      owner: "owner",
      owner_tel: "0969641234",
      owner_email: "customer1@gmail.com",
      contact_name: "Contact 1",
      contact_tel: "0969641234",
      contact_email: "customer1@gmail.com",
      address: "address1, address2, Bangkok",
      TIN: "1234567890123",
      groupID: "",
      licensePlate: []
    }

    if (customers !== null) {

      setCompany(customers.company)
      setOwner(customers.owner)
      setOwner_tel(customers.owner_tel)
      setOwner_email(customers.owner_email)
      setContact_name(customers.contact_name)
      setContact_tel(customers.contact_tel)
      setContact_email(customers.contact_email)
      setAddress(customers.address)
      setTIN(customers.TIN)
      setGroupID(customers.groupID)
      setLicensePlate(customers.licensePlate)

    }else{
      setCompany(customer1.company)
      setOwner(customer1.owner)
      setOwner_tel(customer1.owner_tel)
      setOwner_email(customer1.owner_email)
      setContact_name(customer1.contact_name)
      setContact_tel(customer1.contact_tel)
      setContact_email(customer1.contact_email)
      setAddress(customer1.address)
      setTIN(customer1.TIN)
      setGroupID(customer1.groupID)
      setLicensePlate(customer1.licensePlate)

      
    }
  },[])

  const handleChangePass = (e) => {
    setNew_GroupID(e.target.value)
  }

  const handleChange_groupId = () => {
    setGroupID(new_groupID)
    setOpen(false)
    setOpen_new(false)
    console.log(groupID)
  }


  const useStyles = makeStyles(styles);

  const handleSetState = (event) => {
    if (event.target.id === 'company') {
      setCompany(event.target.value)
    } else if (event.target.id === 'owner') {
      setOwner(event.target.value)
    } else if (event.target.id === 'owner_tel') {
      setOwner_tel(event.target.value)
    } else if (event.target.id === 'owner_email') {
      setOwner_email(event.target.value)
    } else if (event.target.id === 'contact_name') {
      setContact_name(event.target.value)
    } else if (event.target.id === 'contact_tel') {
      setContact_tel(event.target.value)
    } else if (event.target.id === 'contact_email') {
      setContact_email(event.target.value)
    } else if (event.target.id === 'address') {
      setAddress(event.target.value)
    } else if (event.target.id === 'TIN') {
      setTIN(event.target.value)
    } else if (event.target.id === 'groupID') {
      setGroupID(event.target.value)
    }
  }


  const info = {
    company: company,
    owner: owner,
    owner_tel: owner_tel,
    owner_email: owner_email,
    contact_name: contact_name,
    contact_tel: contact_tel,
    contact_email: contact_email,
    address: address,
    TIN: TIN,
    groupID: groupID,
    licensePlate: licensePlate
  }

  const onSubmit = (str) => {

    if(str === 'add'){

      fetch('/api/customer', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(info) // body data type must match "Content-Type" header
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          alert("ลงทะเบียนสำเร็จ")
        })
        .then(router.push('/customers'))
      }else if(str === 'update'){
        // console.log(customer._id)
        // let id = ObjectId(customer._id)
        
        info["_id"] = customers._id

        // console.log(id)
        fetch('/api/customer', {
          method: 'PUT', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors', // no-cors, *cors, same-origin
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          credentials: 'same-origin', // include, *same-origin, omit
          headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          redirect: 'follow', // manual, *follow, error
          referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify(info) // body data type must match "Content-Type" header
        })
          .then(response => response.json())
          .then(alert("อัพเดทสำเร็จ"))
          .then(router.push('/customers'))
      }
  }

  const classes = useStyles();
  const classes2 = useStyles2();

  return (
    // <form onSubmit={handleSubmit(onSubmit)}>
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
            {customers === null ? <h4 className={classes.cardTitleWhite}>ลงทะเบียน</h4> : <h4 className={classes.cardTitleWhite}>อัพเดทข้อมูล</h4>}
              <p className={classes.cardCategoryWhite}>กรุณากรอกข้อมูลด้านล่าง</p>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="บริษัทของคุณ"
                    id="company"
                    formControlProps={{
                      fullWidth: true,
                      required: true,
                      error: companyError
                    }}
                    inputProps={{
                      defaultValue: customers !== null ? customers.company : null,
                      // onChange: handleChange,
                      onBlur: handleSetState,      
                    }}
                  />

                </GridItem>
                
              </GridContainer>
              <GridContainer>
              <GridItem xs={12} sm={12} md={5}>
                  <CustomInput
                    labelText="ชื่อเจ้าของบริษัท"
                    id="owner"
                    formControlProps={{
                      fullWidth: true,
                      required: true,
                      error: ownerError
                    }}
                    inputProps={{
                      // onChange: handleChange,
                      defaultValue: customers !== null ? customers.owner : null,
                      onBlur: handleSetState
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <CustomInput
                    labelText="เบอร์โทรศัพท์"
                    id="owner_tel"
                    formControlProps={{
                      fullWidth: true,
                      required: true,
                      error: owner_telError
                    }}
                    inputProps={{
                      // onChange: handleChange,
                      defaultValue: customers !== null ? customers.owner_tel : null,
                      onBlur: handleSetState
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="อีเมล"
                    id="owner_email"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      // onChange: handleChange,
                      defaultValue: customers !== null ? customers.owner_email : null,
                      onBlur: handleSetState
                    }}
                  />
                </GridItem>
              </GridContainer>
              
              <GridContainer>
                <GridItem xs={12} sm={12} md={5}>
                  <CustomInput
                    labelText="ชื่อผู้ติดต่อประสานงาน"
                    id="contact_name"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      // onChange: handleChange,
                      defaultValue: customers !== null ? customers.contact_name : null,
                      onBlur: handleSetState
                    }}
                  />
                </GridItem>

                <GridItem xs={12} sm={12} md={3}>
                  <CustomInput
                    labelText="เบอร์ติดต่อ"
                    id="contact_tel"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      // onChange: handleChange,
                      defaultValue: customers !== null ? customers.contact_tel : null,
                      onBlur: handleSetState
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="อีเมลติดต่อ"
                    id="contact_email"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      // onChange: handleChange,
                      defaultValue: customers !== null ? customers.contact_email : null,
                      onBlur: handleSetState
                    }}
                  />
                </GridItem>
                
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                <CustomInput
                  labelText="ที่อยู่"
                  id="address"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  // fullWidth={true}
                  inputProps={{
                    // onChange: handleChange,
                    defaultValue: customers !== null ? customers.address : null,
                    onBlur: handleSetState
                  }}
                />
                </GridItem>
              </GridContainer>

              <GridContainer>
              <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="เลขประจำตัวผู้เสียภาษี"
                    id="TIN"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      // onChange: handleChange,
                      defaultValue: customers !== null ? customers.TIN : null,
                      onBlur: handleSetState
                    }}
                  />
                </GridItem>

                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="รหัสไลน์กลุ่ม"
                    id="groupID"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      // onChange: handleChange,
                      disabled: customers ? true : false,
                      defaultValue: customers !== null ? customers.groupID : null,
                      value: groupID,
                      onBlur: handleSetState
                    }}
                  />
                </GridItem>
                {customers !== null ? (

                  <div>
                  <Button className={classes.button} style={{ marginTop: 30 }} onClick={handleOpen} >แก้รหัส</Button>
                  <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                  >
                    <div style={modalStyle} className={classes2.paper}>
                      <h2 id="simple-modal-title">แก้ไขรหัส</h2>
                    
                      <form className={classes.root} noValidate autoComplete="off">
                      
                      <TextField name="LINE" label="รหัสไลน์" style={{ width: 350}} defaultValue={customers.groupID} onChange={(e) => handleChangePass(e)} />
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
                            <div style={modalStyle} className={classes2.paper2}>
                            <p id="simple-title">ท่านแน่ใจใช่ไหม</p>

                            <Button variant="contained" color="primary" onClick={handleChange_groupId}>ยืนยัน</Button>
                            <Button variant="contained" color="primary" onClick={handleClose_pass}>ยกเลิก</Button>
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

              <LicenseContext.Provider value={{ licensePlate, setLicensePlate }}>
                
                <LicensePlate_List />

                <LicensePlate_modal />
                
              </LicenseContext.Provider>
            </CardBody>
            <CardFooter>
              <div>
                {customers === null ? <Button onClick={() => onSubmit("add")} color="primary">ลงทะเบียน</Button> : 
                                      <Button onClick={() => onSubmit("update")} color="primary">อัพเดท</Button>}
                  <Button onClick={() => router.push('/customers')} color="rose">ยกเลิก</Button>

              </div>
            </CardFooter>
          </Card>
        </GridItem>
        
      </GridContainer>
      </div>
  );
}

CreateCustomer.layout = Admin;

export {LicenseContext}

export default CreateCustomer;