import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

import { connectToDatabase } from "../../util/mongodb";
import { ObjectId } from 'bson';


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
  },
  list: {
    marginTop: "10px",
    marginLeft: "10px",
    width: '100%',
    maxWidth: 200,
    backgroundColor: 'rgba(242, 246, 245, 1)',
    position: 'relative',
    overflow: 'auto',
    maxHeight: 300,
  },
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
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
    width: 400,
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
  const useStyles = makeStyles(styles);

  const classes = useStyles();
  const classes2 = useStyles2();

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
  const [tin_error, setTin_error] = useState(false)
  const [contact_tel_Error, setContact_tel_Error] = useState(false)

  const [licensePlate, setLicensePlate] = useState([]);

  const [address, setAddress] = useState()
  const [TIN, setTIN] = useState()
  const [groupID, setGroupID] = useState()
  const [new_groupID, setNew_GroupID] = useState()


  const router = useRouter()

  const [modalStyle] = React.useState(getModalStyle);

  const [open, setOpen] = React.useState(false);
  const [open_new, setOpen_new] = React.useState(false);
  const [openLicensePlateModal, setOpenLicensePlateModal] = useState(false)

  const [loading, setLoading] = useState(false)
  const [loading_update, setLoading_update] = useState(false)

  const [registerComplete, setRegisterComplete] = useState(false)

  const [edit_linegroup_id, setEdit_linegroup_id] = useState(false)

  const handleChangeText = (index, e) => {
    let newRow = [...licensePlate];

    newRow[index] = e.target.value
    setLicensePlate(newRow)
  }

  const handleAddRow = () => {
      setLicensePlate((prevRows) => {
          return ([...prevRows, ""])
      })
  }

  const handleDeleteRow = (index) => {
    let newArray = [...licensePlate]
    
    newArray.splice(index, 1)

    setLicensePlate(newArray)   
  };

  const handleOpenLicensePlate = () => {
    setOpenLicensePlateModal(true);
  };
  

  const handleCloseLicensePlate = () => {
    setOpenLicensePlateModal(false);
  };

  const body = (
    <div style={modalStyle} className={classes2.paper}>
      <h2 id="simple-modal-title">ป้ายทะเบียนรถ</h2>
      <p id="simple-modal-description">
        กรอกเลขทะเบียนรถด้านล่าง กดปุ่ม "เพิ่ม" เพื่อเพิ่มช่อง
      </p>
  
      <form className={classes.root} noValidate autoComplete="off">
      {licensePlate.map((row, index) => {
        return (
        <div key={index}>
          <TextField required name="price" label="เลขทะเบียนรถ" value={row} onChange={(e) => handleChangeText(index, e)} />
          
          <Button variant="contained" color="secondary" onClick={() => handleDeleteRow(index)} className={classes.button_text_rows}>
            ลบ
          </Button>
  
        </div>
        )
  
      })}
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleAddRow()}
            className={classes.button}
          >
            เพิ่ม
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCloseLicensePlate}
            className={classes.button}
          >
            สำเร็จ
          </Button>
        </div>
    </form>
  
    </div>
  );



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
    }
  },[])

  const handleSetState = (event) => {
    if (event.target.id === 'company') {
      setCompanyError(false)
      setCompany(event.target.value)
    } else if (event.target.id === 'owner') {
      setOwnerError(false)
      setOwner(event.target.value)
    } else if (event.target.id === 'owner_tel') {
      if(isNaN(event.target.value) || event.target.value.length !== 10){
        setOwner_telError(true)
      }else{
        setOwner_telError(false)
        setOwner_tel(event.target.value)
      }
    } else if (event.target.id === 'owner_email') {
      setOwner_email(event.target.value)
    } else if (event.target.id === 'contact_name') {
      setContact_name(event.target.value)
    } else if (event.target.id === 'contact_tel') {
      if(isNaN(event.target.value) || event.target.value.length !== 10){
        setContact_tel_Error(true)
      }else{
        setContact_tel(event.target.value)
      }
    } else if (event.target.id === 'contact_email') {
      setContact_email(event.target.value)
    } else if (event.target.id === 'address') {
      setAddress(event.target.value)
    } else if (event.target.id === 'TIN') {
      if(isNaN(event.target.value)){
        setTin_error(true)
      }else{
        setTin_error(false)
        setTIN(event.target.value)
      }
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

  function error_detect(){
    let error = []
    if(!company || companyError){
      error.push("error")
      setCompanyError(true)
    }

    if(!owner || ownerError){
      error.push("error")
      setOwnerError(true)
    }

    if(error[0] !== undefined) return true
    return false
  }

  const onSubmit = (str) => {
    if(error_detect() === true){

    }else{
      if(str === 'add'){
        setLoading(true)
  
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
          .then(function(response){
            setRegisterComplete(true)
            router.push("/customers")
          }) 
          
        }else if(str === 'update'){
          setLoading_update(true)
          
          info["_id"] = customers._id
  
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
          .then(function(response){
            setRegisterComplete(true)
            router.push("/customers")
          }) 
        }
    }
  }

  return (
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
                    labelText="ชื่อบริษัทลูกค้า"
                    id="company"
                    formControlProps={{
                      fullWidth: true,
                      required: true,
                      error: companyError
                    }}
                    inputProps={{
                      defaultValue: customers !== null ? customers.company : null,
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
                      error: owner_telError
                    }}
                    inputProps={{
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
                      defaultValue: customers !== null ? customers.owner_email : null,
                      onBlur: handleSetState
                    }}
                  />
                </GridItem>
              </GridContainer>
              
              <GridContainer>
                <GridItem xs={12} sm={12} md={5}>
                  <CustomInput
                    labelText="ชื่อผู้ประสานงาน"
                    id="contact_name"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
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
                      error: contact_tel_Error
                    }}
                    inputProps={{
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
                  inputProps={{
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
                      error: tin_error
                    }}
                    inputProps={{
                      defaultValue: customers !== null ? customers.TIN : null,
                      onBlur: handleSetState
                    }}
                  />
                </GridItem>

                {customers !== null ? (
                  <>
                    <GridItem xs={12} sm={12} md={6}>
                      <CustomInput
                        labelText="รหัสไลน์กลุ่ม"
                        id="groupID"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          disabled: edit_linegroup_id ? false : true,
                          defaultValue: customers !== null ? customers.groupID : null,
                          onBlur: handleSetState
                        }}
                      />
                    </GridItem>
                    

                    <div>
                      <Button className={classes.button} style={{ marginTop: 30 }} onClick={handleOpen} >แก้รหัส</Button>
                      <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                      >
                        <div style={modalStyle} className={classes2.paper}>
                          <p>ท่านต้องการแก้ไขรหัสไลน์กลุ่มใช่หรือไม่</p>
                          <Button variant="contained" color="primary" className={classes.button} onClick={() => {setEdit_linegroup_id(true) 
                                                                                                                 handleClose()}}>
                            ใช่
                          </Button>
                          <Button variant="contained" color="secondary" className={classes.button} onClick={() => handleClose()}>
                            ไม่ใช่
                          </Button>

                        </div>
                      </Modal>
                    </div>
                  </>

                ) : (<GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="รหัสไลน์กลุ่ม"
                    id="groupID"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      defaultValue: customers !== null ? customers.groupID : null,
                      onBlur: handleSetState
                    }}
                  />
                </GridItem>)}

              </GridContainer>

              <GridContainer>

                <br />      
                <List className={classes.list} subheader={<li />}>
                  <ListSubheader>เลขทะเบียนรถ</ListSubheader>
                    {licensePlate.map((row, index) => (
                        <ListItem key={index}>
                        <ListItemText primary={row} />
                        </ListItem>

                    ))} 
                </List>

                  <Button style={{marginTop: 10, marginLeft: 10, height: 40}} onClick={() => setOpenLicensePlateModal(true)}>
                    {licensePlate[0] !== undefined ? "แก้ไขเลขทะเบียนรถ" : "แก้ไข/เพิ่มเลขทะเบียนรถ"} 
                  </Button>
                  <Modal
                    open={openLicensePlateModal}
                    onClose={handleCloseLicensePlate}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                  >
                    {body}
                  </Modal>
                </GridContainer>
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

      <Modal
        open={loading}
        onClose={handleClose_pass}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div
          style={modalStyle}
          className={classes2.paper2}
        >
          {registerComplete ? <h2 style={{alignContent: "center"}}>ลงทะเบียนสำเร็จ</h2> :
              loading ? <h2 style={{alignContent: "center"}}>Loading</h2> : null
          }
          
        </div>
      </Modal>

      <Modal
        open={loading_update}
        onClose={handleClose_pass}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div
          style={modalStyle}
          className={classes2.paper2}
        >
          {registerComplete ? <h2 style={{alignContent: "center"}}>อัพเดทสำเร็จ</h2> :
              loading_update ? <h2 style={{alignContent: "center"}}>Loading</h2> : null
          }
          
        </div>
      </Modal>
      </div>
  );
}

export {LicenseContext}

export default CreateCustomer;