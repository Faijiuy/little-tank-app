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

// import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
// import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemText from '@material-ui/core/ListItemText';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
// import Checkbox from '@material-ui/core/Checkbox';
// import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

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

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}


function CouponMgt({customer: customers, coupon: coupons}){

  // console.log(customers)
  // customers.map(value =>{
  //   console.log(value._id)
  // })

  const [expanded, setExpanded] = React.useState('panel1');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  
  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState([0, 1, 2, 3]);
  const [right, setRight] = React.useState([4, 5, 6, 7]);

  const [company, setCompany] = useState(0);
  const [type, setType] = useState();
  const [qty, setQty] = useState();
  const [couponList, setCouponList] = useState([]);

  useEffect(() => {
    

    if (process.env.NODE_ENV === 'development') {
      setCompany(customers[0])
      setType(500)
      setQty(3)
      
    }
  },[])

  useEffect(() =>{
    let list = []

    coupons.map(coupon => {
      if(coupon.customer === company._id){
        console.log(coupon)
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

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

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

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const customList = (title, items) => (
    <Card>
      <CardHeader
        className={classes.cardHeader}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
            disabled={items.length === 0}
            inputProps={{ 'aria-label': 'all items selected' }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List className={classes.list} dense component="div" role="list">
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItem key={value} role="listitem" button onClick={handleToggle(value)}>
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`List item ${value + 1}`} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

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
          <Typography>พิมพ์คูปอง</Typography>
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
          <Typography>คูปองหาย</Typography>
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

              
                  <List className={classes.root}>
                {couponList.map((value, index) => {
                  console.log(value.coupon_no)
                  const labelId = `${index}`;

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
                      <ListItemText id={labelId} primary={`${value.coupon_no}`} />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="comments">
                          <CommentIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
              </List>

              <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="center"
                className={classes.root}
              >
                <Grid item>{customList('Choices', left)}</Grid>
                <Grid item>
                  <Grid container direction="column" alignItems="center">
                    <Button
                      variant="outlined"
                      size="small"
                      className={classes.button}
                      onClick={handleCheckedRight}
                      disabled={leftChecked.length === 0}
                      aria-label="move selected right"
                    >
                      &gt;
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      className={classes.button}
                      onClick={handleCheckedLeft}
                      disabled={rightChecked.length === 0}
                      aria-label="move selected left"
                    >
                      &lt;
                    </Button>
                  </Grid>
                </Grid>
                <Grid item>{customList('Chosen', right)}</Grid>
              </Grid>
               

              

            </GridContainer>
          </Typography>
        </AccordionDetails>
      </Accordion>
      
    </div>
  );

}

CouponMgt.layout = Admin

export default CouponMgt