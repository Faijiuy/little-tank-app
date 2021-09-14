import Admin from "layouts/Admin.js";
import Typography from "@material-ui/core/Typography";

import Grid from '@material-ui/core/Grid';


import { connectToDatabase } from "../../util/mongodb";
import GenerateCoupon from "../../components/couponMgt/generateCoupon";
import MissingCoupon from "../../components/couponMgt/missingCoupon";

import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { DataGrid } from "@material-ui/data-grid";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import TextField from '@material-ui/core/TextField';



import { format } from 'date-fns'
import Choose_Company from "../../components/couponMgt/choose_company";
import Buy_Coupons from "../../components/couponMgt/buy_coupons";
import Confirm from "../../components/couponMgt/confirm";


export async function getServerSideProps() {
  const { db } = await connectToDatabase();

  const customers = await db.collection("customer").find().sort({}).toArray();

  const coupons = await db.collection("coupons").find().sort({}).toArray();

  return {
    props: {
      customer: JSON.parse(JSON.stringify(customers)),
      coupon: JSON.parse(JSON.stringify(coupons)),
    },
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  root_stepper: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
  table: {
    maxWidth: 500,
  },
}));

// Stepper
function getSteps() {
  return ['เลือกบริษัท', 'ซื้อคูปอง', 'ยืนยัน'];
}

// Table
function priceRow(price, qty) {
  return price * qty;
}

function createRow( price, qty) {
  const total = priceRow(price, qty);
  return { price, qty, total };
}

function subtotal(items) {
  return items.map(({ total }) => total).reduce((sum, i) => sum + i, 0);
}

function groupByKey(array, key) {
  return array
    .reduce((hash, obj) => {
      if(obj[key] === undefined) return hash; 
      return Object.assign(hash, { [obj[key]]:( hash[obj[key]] || [] ).concat(obj)})
    }, {})
}



function getStepContent(step) {
  // const classes = useStyles();
  
  // const [company, setCompany] = useState("");
  // const [rows, setRows] = useState([]);
  // const [tableState, setTableState] = useState(false);
  // const [total_table, setTotal_table] = useState();
  // const [total_coupons, setTotal_coupons] = useState();
  // const [company_name, setcompany_name] = useState("");

  // const [text_rows, setText_rows] = useState([{ price: 0, qty: 0, total: 0,}])



  

  // const handleAddRow = () => {

  //   setText_rows((prevText_rows) => {
  //     return ([...prevText_rows, {
  //         price: 0,
  //         qty: 0,
  //         total: 0,}] )
      
  //   })
    
  // };

  // const handleChangeText = (e) => {
  //   let newRow = text_rows;

  //   if(e.target.id.split(" ")[1] == "price"){
  //     newRow[Number(e.target.id.split(" ")[0])].price = e.target.value
  //   }else if(e.target.id.split(" ")[1] == "qty"){
  //     newRow[e.target.id.split(" ")[0]].qty = e.target.value
  //   }

  //   newRow[e.target.id.split(" ")[0]].total = newRow[e.target.id.split(" ")[0]].price * newRow[e.target.id.split(" ")[0]].qty
    
  //   setText_rows(newRow)

  //   let sum = subtotal(newRow);
  //   setTotal_coupons(sum)

  // }

  // useEffect(() => {
  //   let coupons_in_company = coupons.filter(coupon => coupon.companyRef === company._id && coupon.used === false)

  //   let coupons_groupBy_price = groupByKey(coupons_in_company, "amount")

  //   let array_rows = Object.keys(coupons_groupBy_price).map(price => 
  //                       createRow(price, 
  //                                 coupons_groupBy_price[price].length))

  //   setRows(array_rows)
    
  //   let sum = subtotal(array_rows);
  //   setTotal_table(sum)

  // }, [company])


  switch (step) {
    case 0:
      return <Choose_Company />
    case 1:
      return <Buy_Coupons />
        // 
      
    case 2:
      // const [test, setTest] = useState()

      // if(company_name == ""){
      //   let value = company_name
      //   console.log("value ", value)
      // }else{
      //   setTest(company_name)
      //   console.log("test ", test)
      // }

      return <Confirm />
      // (<form>
      //           บริษัท {test}

               

      //           <TableContainer>
      //             <Table className={classes.table} aria-label="simple table">
      //               <TableHead>
      //                 <TableRow>
      //                   <TableCell>คูปอง</TableCell>
      //                   <TableCell >จำนวน</TableCell>
      //                   <TableCell >รวม</TableCell>
      //                 </TableRow>
      //               </TableHead>
      //               <TableBody>
      //                 {text_rows.map((row) => (
      //                   <TableRow key={row.price}>
      //                     <TableCell component="th" scope="row">
      //                       {row.price}
      //                     </TableCell>
      //                     <TableCell >{row.qty}</TableCell>
      //                     <TableCell >{row.price * row.qty}</TableCell>
      //                   </TableRow>       
      //                 ))}

      //                 <TableRow>
      //                   <TableCell></TableCell>
      //                   <TableCell>Total</TableCell>

      //                   <TableCell >{total_coupons}</TableCell>
      //                 </TableRow>
      //               </TableBody>
      //             </Table>
      //           </TableContainer>
      //         </form>);
    default:
      return 'Unknown step';
  }
}


const StepperContext = React.createContext()


function PurchaseCoupon({ customer: customers, coupon: coupons }) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const [company, setCompany] = useState("");
  const [rows, setRows] = useState([]);
  const [tableState, setTableState] = useState(false);
  const [total_table, setTotal_table] = useState();
  const [total_coupons, setTotal_coupons] = useState();
  const [company_name, setcompany_name] = useState("");
  const [text_rows, setText_rows] = useState([{ price: 0, qty: 0, total: 0,}])

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  
  


  return (
    <StepperContext.Provider 
          value={{company, setCompany, customers, coupons, tableState, setTableState, classes, rows, setRows, 
                  total_table, setTotal_table, total_coupons, setTotal_coupons, text_rows, setText_rows }}
    
    >
      <Grid container>
        <div className={classes.root_stepper}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                <Typography>{getStepContent(index)}</Typography>
                {/* {company.company} */}
                <div className={classes.actionsContainer}>
                  <div>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      className={classes.button}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      className={classes.button}
                    >
                      {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                  </div>
                </div>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} className={classes.resetContainer}>
            <Typography>All steps completed - you&apos;re finished</Typography>
            <Button onClick={handleReset} className={classes.button}>
              Reset
            </Button>
          </Paper>
        )}
      </div>
        
      </Grid>

    </StepperContext.Provider>
  );
}

PurchaseCoupon.layout = Admin;

export { StepperContext };

export default PurchaseCoupon;