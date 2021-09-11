import Admin from "layouts/Admin.js";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import GridContainer from "components/Grid/GridContainer.js";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { DataGrid } from "@material-ui/data-grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "components/CustomButtons/Button.js";


import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";

import { format } from 'date-fns'
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import { connectToDatabase } from "../util/mongodb";
import { object } from "prop-types";
import MissingCoupon from "../components/couponMgt/missingCoupon";
import GenerateCoupon from "../components/couponMgt/generateCoupon";

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

const Accordion = withStyles({
  root: {
    border: "1px solid rgba(0, 0, 0, .125)",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: "rgba(0, 0, 0, .03)",
    borderBottom: "1px solid rgba(0, 0, 0, .125)",
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);



const useStyles2 = makeStyles((theme) => ({
  formControl: {
    // margin: theme.spacing(1),
    marginLeft: theme.spacing(2),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

const useStyles3 = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },

}));



function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}


function CouponMgt({ customer: customers, coupon: coupons }) {
  const classes2 = useStyles2();
  const classes3 = useStyles3();
  const classes4 = useStyles4();

  const [expanded, setExpanded] = React.useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const [checked, setChecked] = React.useState([]);
  const [right, setRight] = React.useState([]);

  const [company, setCompany] = useState("");
  const [type, setType] = useState();
  const [typeList, setTypeList] = useState([]);

  const [qty, setQty] = useState();
  const [couponList, setCouponList] = useState([]);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [date, setDate] = useState();

  const [ordered_company, setOrdered_company] = useState([]);
  const [tableState, setTableState] = useState(false);

  const [rows, setRows] = useState([]);
  const [totalCoupon, setTotalCoupon] = useState(0);

  const router = useRouter();

  const handleBlur = (params) => {
    let newRow = rows;
    newRow[params.id].type = params.row.type;
    newRow[params.id].qty = params.row.qty;
    newRow[params.id].total = params.row.type * params.row.qty;
    newRow[params.id].action = params.row.action;


    let total = 0;
    newRow.forEach((row) => (total += Number(row.qty) * Number(row.type)));

    setRows(newRow);
    setTotalCoupon(total);
  };

  const handleAddRow = () => {
    let newArr = [];
    rows.map((value, index) => {
      newArr.push({
        id: index,
        type: value.type,
        qty: value.qty,
        total: value.total,
        // action: value.action
      });
    });
    newArr.push({
      id: rows.length,
      type: 0,
      qty: 0,
      total: 0,
      // action: true
    });
    setRows(newArr);
  };

  const handleDelete = (params) => {
    let newRows = rows.filter(row => row.id !== params.row.id)
    
    setRows(newRows)
  }

  const columns = [
    {
      field: "type",
      headerName: "ราคา",
      headerClassName: 'super-app-theme--header',
      type: "number",
      width: 120,
      editable: true,
      renderCell: (cellValue) => {
        return (
          <div
            style={
              cellValue.value < 500 ? 
              {color: "red"} : null
            }
          >
            {cellValue.value}
          </div>
        )
      }  
    },
    {
      field: "qty",
      headerName: "จำนวน",
      headerClassName: 'super-app-theme--header',
      type: "number",
      width: 120,
      editable: true,
      renderCell: (cellValue) => {
        return (
          <div
            style={
              cellValue.value == 0 ? 
              {color: "red"} : null
            }
          >
            {cellValue.value}
          </div>
        )
      }  
    },
    {
      field: "total",
      headerName: "รวม",
      headerClassName: 'super-app-theme--header',
      headerAlign: 'right',
      width: 120,
      type: "number",
      renderCell: (cellValue) => {
        return (
          <div>
            {cellValue.row.type * cellValue.row.qty}
          </div>
        )
      } 
    },
    {
      field: "",
      headerName: "action",
      headerClassName: 'super-app-theme--header',
      width: 120,
      disableClickEventBubbling: true,
      renderCell: function delete_row(params) {
          return (<button
          onClick={() => handleDelete(params)}
        >
          ลบ
        </button>)     
      },
    }
  ];

  useEffect(() => {
    let todayDate = format(new Date(), "dd/MM/yyyy"); 

    if(new Date().getFullYear() >= 2564){
      let thaiDate = format(new Date(), "dd/MM"); 
      setDate(thaiDate + "/" + (new Date().getFullYear() - 543))
    }else{
      setDate(todayDate);
    }
    
  }, []);

  useEffect(() => {
    let couponsOfCompany = coupons.filter(coupon => coupon.companyRef === company._id)
    let types = groupByKey(couponsOfCompany, "amount")

    setTypeList(Object.keys(types))

  }, [company])

  useEffect(() => {
    let activeList = coupons.filter(coupon => coupon.companyRef === company._id &&
                                              !coupon.used &&
                                              coupon.generatedDate === date && (type ? coupon.amount === Number(type) : true)) 
    let missingList = coupons.filter(coupon => coupon.companyRef === company._id &&
                                                coupon.used === "missing" &&
                                                coupon.generatedDate === date && (type ? coupon.amount === Number(type) : true))  

    setCouponList(activeList);
    setRight(missingList);

  }, [company, date, type]);

  function groupByKey(array, key) {
    return array
      .reduce((hash, obj) => {
        if(obj[key] === undefined) return hash; 
        return Object.assign(hash, { [obj[key]]:( hash[obj[key]] || [] ).concat(obj)})
      }, {})
  }

  useEffect(() => {
  
    let filterCoupon = coupons.filter(coupon => coupon.companyRef === company._id && coupon.generatedDate === date)

    let groupArray = groupByKey(filterCoupon, "amount")

    setOrdered_company(groupArray)

    console.log("groupArr", groupArray)


  }, [company])

  

  //List toggle component

  

  
  

  

  return (
    <div>
      <Accordion
        square
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography>พิมพ์คูปอง</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <GenerateCoupon />
            {/* </GridContainer> */}
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        square
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
          <Typography>คูปองหาย</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <MissingCoupon />
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

CouponMgt.layout = Admin;

export default CouponMgt;