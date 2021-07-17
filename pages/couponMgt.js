import Admin from "layouts/Admin.js";
import React, {useState, useEffect} from 'react';
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from "@material-ui/core/styles";
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import GridContainer from "components/Grid/GridContainer.js";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
import Button from "components/CustomButtons/Button.js";

import { connectToDatabase } from "../util/mongodb";


export async function getServerSideProps() {
  const { db } = await connectToDatabase();

  const customers = await db
    .collection("customer")
    .find()
    .sort({})
    .limit(20)
    .toArray();

  const coupons = await db
    .collection("coupons")
    .find()
    .sort({})
    .limit(20)
    .toArray();


  return {
    props: {
      customer: JSON.parse(JSON.stringify(customers)),
      coupon: JSON.parse(JSON.stringify(coupons)),
    },
  };
}

const Accordion = withStyles({
    root: {
      border: '1px solid rgba(0, 0, 0, .125)',
      boxShadow: 'none',
      '&:not(:last-child)': {
        borderBottom: 0,
      },
      '&:before': {
        display: 'none',
      },
      '&$expanded': {
        margin: 'auto',
      },
    },
    expanded: {},
  })(MuiAccordion);

const AccordionSummary = withStyles({
    root: {
      backgroundColor: 'rgba(0, 0, 0, .03)',
      borderBottom: '1px solid rgba(0, 0, 0, .125)',
      marginBottom: -1,
      minHeight: 56,
      '&$expanded': {
        minHeight: 56,
      },
    },
    content: {
      '&$expanded': {
        margin: '12px 0',
      },
    },
    expanded: {},
  })(MuiAccordionSummary);
  
const AccordionDetails = withStyles((theme) => ({
    root: {
      padding: theme.spacing(2),
    },
  }))(MuiAccordionDetails);


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


function CouponMgt({customer: customers, coupon: coupons}){

  // console.log(customers)
  // customers.map(value =>{
  //   console.log(value._id)
  // })

  const [expanded, setExpanded] = React.useState('panel1');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const [company, setCompany] = useState(0);
  const [type, setType] = useState();
  const [qty, setQty] = useState();
  const [couponList, setCouponList] = useState([]);

  useEffect(() =>{
    let list = []
    coupons.map(coupon => {
      if(coupon._id === company._id){
        list.push(coupon)
      }
    })
    setCouponList(list)

  }, [company])

  const handleChangeCompany = (event) => {
    setCompany(event.target.value);
  };

  const handleChangeType = (event) => {
    setType(event.target.value);
  };

  const handleQty = (event) => {
    setQty(event.target.value);
  };
  
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  //List toggle component
  const [checked, setChecked] = React.useState([0]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const info = {
    code: "",
    companyRef: company._id,
    amount: type,
    used: false,
    usedDateTime: "",
    recordedBy: ""


  }

  const onSubmit = (e) => {
    console.log('onSubmit', qty);


    for(let i=0; i < qty; i++){
      fetch('/api/coupon', {
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

    }
  }




  return (
    <div>
      <Accordion square expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography>Create Coupon</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <GridContainer>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">Company</InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={company}
                  
                  onChange={handleChangeCompany}
                  label="Company"
                >
                  
                  {customers.map(company =>{
                    return <MenuItem value={company}>{company.company}</MenuItem>
                  })}
                  
                </Select>
              </FormControl>

             

              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">Type</InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={type}
                  onChange={handleChangeType}
                  label="type"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={500}>500</MenuItem>
                  <MenuItem value={1000}>1,000</MenuItem>
                </Select>
              </FormControl>

              <form className={classes.root} noValidate autoComplete="off">
               <TextField id="outlined-basic" label="จำนวน" variant="outlined" onBlur={handleQty} />
              </form>

              <Button onClick={() => onSubmit()} color="primary">พิมพ์</Button>

            </GridContainer>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion square expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
          <Typography>Delete Coupon</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          <GridContainer>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">Company</InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={company}
                  
                  onChange={handleChangeCompany}
                  label="Company"
                >
                  
                  {customers.map(company =>{
                    return <MenuItem value={company}>{company.company}</MenuItem>
                  })}
                  
                </Select>
              </FormControl>

              {useEffect(() => {

                console.log("testing")
                return (
                  <List className={classes.root}>
                {couponList.map((value) => {
                  const labelId = `${value.coupon_no}`;

                  return (
                    <ListItem key={value} role={undefined} dense button onClick={handleToggle(value)}>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={checked.indexOf(value) !== -1}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </ListItemIcon>
                      <ListItemText id={labelId} primary={`Line item ${value + 1}`} />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="comments">
                          <CommentIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
              </List>
                )
              }),[couponList]}

              

            </GridContainer>
          </Typography>
        </AccordionDetails>
      </Accordion>
      
    </div>
  );

}

CouponMgt.layout = Admin

export default CouponMgt