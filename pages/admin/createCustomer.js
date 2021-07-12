import React, { useState } from 'react';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
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

import { useForm } from "react-hook-form";

import avatar from "assets/img/faces/marc.jpg";

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
};

function CreateCustomer() {

  const [company, setCompany] = useState()
  const [owner, setOwner] = useState()
  const [owner_tel, setOwner_tel] = useState()
  const [owner_email, setOwner_email] = useState()
  const [contact_name, setContact_name] = useState()
  const [contact_tel, setContact_tel] = useState()
  const [contact_email, setContact_email] = useState()
  const [address, setAddress] = useState()



  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  
  const useStyles = makeStyles(styles);

  const handleSetState = (event) =>{
    if(event.target.id === 'company'){
      setCompany(event.target.value)
    }else if(event.target.id === 'owner'){
      setOwner(event.target.value)
    }else if(event.target.id === 'owner_tel'){
      setOwner_tel(event.target.value)
    }else if(event.target.id === 'owner_email'){
      setOwner_email(event.target.value)
    }else if(event.target.id === 'contact_name'){
      setContact_name(event.target.value)
    }else if(event.target.id === 'contact_tel'){
      setContact_tel(event.target.value)
    }else if(event.target.id === 'contact_email'){
      setContact_email(event.target.value)
    }else if(event.target.id === 'address'){
      setAddress(event.target.value)
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
    address: address
    

  }
  
  const onSubmit = (e) => {
    console.log(info);

    fetch('/admin/toDB', {
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
      // .then(response => response.json())
      // .then(data => {
      //   console.log(data);
      //   alert("Add Item:\nResponse from server " + data.message)
      //   alert("Newly added _id", data._id)
      // });
  }

  const classes = useStyles();
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>ลงทะเบียน</h4>
              <p className={classes.cardCategoryWhite}>กรุณากรอกข้อมูลด้านล่าง</p>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={5}>
                  <CustomInput
                    labelText="บริษัทของคุณ"
                    id="company"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      // onChange: handleChange,
                      onBlur: handleSetState
                 }}
                    
                    
                    
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <CustomInput
                    labelText="ชื่อเจ้าของบริษัท"
                    id="owner"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      // onChange: handleChange,
                      onBlur: handleSetState
                 }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="เบอร์โทรศัพท์"
                    id="owner_tel"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      // onChange: handleChange,
                      onBlur: handleSetState
                 }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="อีเมล"
                    id="owner_email"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      // onChange: handleChange,
                      onBlur: handleSetState
                 }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="ชื่อ"
                    id="contact_name"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      // onChange: handleChange,
                      onBlur: handleSetState
                 }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="เบอร์ติดต่ออื่น"
                    id="contact_tel"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      // onChange: handleChange,
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
                      onBlur: handleSetState
                 }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="ที่อยู่"
                    id="address"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      // onChange: handleChange,
                      onBlur: handleSetState
                 }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <InputLabel style={{ color: "#AAAAAA" }}>About me</InputLabel>
                  <CustomInput
                    labelText="Lamborghini Mercy, Your chick she so thirsty, I'm in that two seat Lambo."
                    id="about-me"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      multiline: true,
                      rows: 5,
                    }}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button type="submit" color="primary">ลงทะเบียน</Button>
            </CardFooter>
          </Card>
        </GridItem>
        {/* <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            <CardAvatar profile>
              <a href="#pablo" onClick={(e) => e.preventDefault()}>
                <img src={avatar} alt="..." />
              </a>
            </CardAvatar>
            <CardBody profile>
              <h6 className={classes.cardCategory}>CEO / CO-FOUNDER</h6>
              <h4 className={classes.cardTitle}>Alec Thompson</h4>
              <p className={classes.description}>
                Don{"'"}t be scared of the truth because we need to restart the
                human foundation in truth And I love you like Kanye loves Kanye
                I love Rick Owens’ bed design but the back is...
              </p>
              <Button color="primary" round>
                Follow
              </Button>
            </CardBody>
          </Card>
        </GridItem> */}
      </GridContainer>
    </form>
  );
}

CreateCustomer.layout = Admin;

export default CreateCustomer;
