import React, { useEffect, useState } from 'react';
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
import { connectToDatabase } from "../../util/mongodb";
import { ObjectId } from 'bson';


const customer1 = {
  company: "company",
  owner: "owner",
  owner_tel: "0969641234",
  owner_email: "customer1@gmail.com",
  contact_name: "Contact 1",
  contact_tel: "0969641234",
  contact_email: "customer1@gmail.com",
  address: "address1, address2, Bangkok"
}

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

function CreateCustomer({customer:customer}) {


  const [company, setCompany] = useState()
  const [owner, setOwner] = useState()
  const [owner_tel, setOwner_tel] = useState()
  const [owner_email, setOwner_email] = useState()
  const [contact_name, setContact_name] = useState()
  const [contact_tel, setContact_tel] = useState()
  const [contact_email, setContact_email] = useState()
  const [address, setAddress] = useState()


  useEffect(() => {
    const customer1 = {
      company: "company",
      owner: "owner",
      owner_tel: "0969641234",
      owner_email: "customer1@gmail.com",
      contact_name: "Contact 1",
      contact_tel: "0969641234",
      contact_email: "customer1@gmail.com",
      address: "address1, address2, Bangkok"
    }

    if (customer !== null) {
      setCompany(customer.company)
      setOwner(customer.owner)
      setOwner_tel(customer.owner_tel)
      setOwner_email(customer.owner_email)
      setContact_name(customer.contact_name)
      setContact_tel(customer.contact_tel)
      setContact_email(customer.contact_email)
      setAddress(customer.address)
    }else{
      setCompany(customer1.company)
      setOwner(customer1.owner)
      setOwner_tel(customer1.owner_tel)
      setOwner_email(customer1.owner_email)
      setContact_name(customer1.contact_name)
      setContact_tel(customer1.contact_tel)
      setContact_email(customer1.contact_email)
      setAddress(customer1.address)
    }
  },[])

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

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
    // console.log('onSubmit', info);

    const submitterId = e.target.id;

    // console.log(submitterId)

    if(submitterId === 'add'){
      fetch('/api/toDB', {
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
          alert("Add Item:\nResponse from server " + data.message)
          alert("Newly added _id", data._id)
        });
      }else if(submitterId === 'update'){
        // console.log(customer._id)
        // let id = ObjectId(customer._id)
        info["_id"] = customer._id

        // console.log(id)
        fetch('/api/toDB', {
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
          .then(data => {
            // console.log(data);
            alert("Add Item:\nResponse from server " + data.message)
            alert("Newly added _id", data._id)
          });
      }
  }

  const classes = useStyles();
  return (
    // <form onSubmit={handleSubmit(onSubmit)}>
    <div>
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
                      defaultValue: customer !== null ? customer.company : customer1.company,
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
                      defaultValue: customer !== null ? customer.owner : customer1.owner,
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
                      defaultValue: customer !== null ? customer.owner_tel : customer1.owner_tel,
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
                      defaultValue: customer !== null ? customer.owner_email : customer1.owner_email,
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
                      defaultValue: customer !== null ? customer.contact_name : customer1.contact_name,
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
                      defaultValue: customer !== null ? customer.contact_tel : customer1.contact_tel,
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
                      defaultValue: customer !== null ? customer.contact_email : customer1.contact_email,
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
                      defaultValue: customer !== null ? customer.address : customer1.address,
                      onBlur: handleSetState
                    }}
                  />
                </GridItem>
              </GridContainer>
              
            </CardBody>
            <CardFooter>
             {customer === null ? <Button onClick={(e) => onSubmit(e)} id="add" color="primary">ลงทะเบียน</Button> : <Button onClick={(e) => onSubmit(e)} id="update" color="primary">อัพเดท</Button>}
            </CardFooter>
          </Card>
        </GridItem>
        
      </GridContainer>
      </div>
  );
}

CreateCustomer.layout = Admin;

export default CreateCustomer;