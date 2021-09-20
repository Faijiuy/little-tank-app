import React, { useState, useEffect, Component } from "react";
// react plugin for creating charts
import { makeStyles } from "@material-ui/core/styles";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import LoginForm from "components/loginForm.js";
import SignUpForm from "components/signupForm.js";

// layout for this page
import Admin from "layouts/Admin.js";
// core components
import GridItem from "components/Grid/GridItem.js";

function Login() {

  const firstStyle = {
    margin: "10px 50px auto",
    fontWeight: "bold"
  }
  // let users = []

  // useEffect(() => {
  //   let user = fetch("/api/user", {
  //     method: "GET", // *GET, POST, PUT, DELETE, etc.
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       users.push(...data);
  //       console.log(data);
  //     });
  //   console.log("user ====> ", users);
  // });

  return (
    <div>
      <h2 style={firstStyle}>Little-Tank Coupon Management</h2>
      <LoginForm />
      <SignUpForm />
    </div>
  );
}

// Login.layout = Admin;

export default Login;
