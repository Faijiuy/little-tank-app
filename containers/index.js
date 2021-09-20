import { Tabs, Paper, Tab, Box, Typography } from "@material-ui/core";
import React, { useState, useEffect } from "react";
// import PropTypes from 'prop-types';
import LoginForm from "../components/loginForm";
import SignUpForm from "components/signupForm.js";

const SignInOutContainer = () => {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const paperStyle = {
    width: 320,
    margin: "50px auto",
  };

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  //   TabPanel.propTypes = {
  //     children: PropTypes.node,
  //     index: PropTypes.any.isRequired,
  //     value: PropTypes.any.isRequired,
  //   };

  return (
    <div>
      <Paper elevation={20} style={paperStyle}>
        <Tabs
          value={value}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
          aria-label="disabled tabs example"
        >
          <Tab label="ลงชื่อเข้าใช้" />
          <Tab label="สร้างบัญชีใหม่" />
        </Tabs>
        <TabPanel value={value} index={0}>
          <LoginForm />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <SignUpForm />
        </TabPanel>
      </Paper>
    </div>
  );
};

export default SignInOutContainer;
