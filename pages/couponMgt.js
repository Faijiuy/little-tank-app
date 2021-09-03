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

const useStyles2 = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
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

  const [expanded, setExpanded] = React.useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const [checked, setChecked] = React.useState([]);
  const [right, setRight] = React.useState([]);

  const [company, setCompany] = useState("");
  const [type, setType] = useState();
  const [qty, setQty] = useState();
  const [couponList, setCouponList] = useState([]);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [date, setDate] = useState();

  const [ordered_company, setOrdered_company] = useState([]);
  const [tableState, setTableState] = useState(false);

  const [row, setRow] = useState([]);
  const [totalCoupon, setTotalCoupon] = useState(0);

  const router = useRouter();

  const handleBlur = (params) => {
    let newRow = row;
    newRow[params.id].type = params.row.type;
    newRow[params.id].qty = params.row.qty;
    newRow[params.id].total = params.row.type * params.row.qty;

    let total = 0;
    newRow.forEach((row) => (total += Number(row.qty) * Number(row.type)));

    setRow(newRow);
    setTotalCoupon(total);
  };

  const handleAddRow = () => {
    let newArr = [];
    row.map((value, index) => {
      newArr.push({
        id: index,
        type: value.type,
        qty: value.qty,
        total: value.total,
      });
    });
    newArr.push({
      id: row.length,
      type: 0,
      qty: 0,
      total: 0,
    });
    setRow(newArr);
  };

  const columns = [
    {
      field: "type",
      headerName: "ราคา",
      width: 120,
      editable: true,
    },
    {
      field: "qty",
      headerName: "จำนวน",
      width: 120,
      editable: true,
    },
    {
      field: "total",
      headerName: "รวม",
      width: 120,
      renderCell: function total(params) {
        return params.row.type * params.row.qty;
      },
    },
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
    let list = [];
    let miss = [];

    coupons.map((coupon) => {
      if (
        coupon.companyRef === company._id &&
        !coupon.used &&
        coupon.generatedDate === date
      ) {
        console.log(coupon);

        list.push(coupon);
      } else if (
        coupon.companyRef === company._id &&
        coupon.used === "missing" &&
        coupon.generatedDate === date
      ) {
        miss.push(coupon);
      }
    });

    setCouponList(list);
    setRight(miss);

  }, [company, date]);

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

  const handleChangeCompany = (event) => {
    setTableState(true);
    setCompany(event.target.value);
  };

  const handleChangeType = (event) => {
    setType(event.target.value);
  };

  const useStyles = makeStyles(styles);
  const classes = useStyles();

  //List toggle component

  const leftChecked = intersection(checked, couponList);
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
    setCouponList(not(couponList, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setCouponList(couponList.concat(rightChecked));
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
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{ "aria-label": "all items selected" }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List className={classes.list} dense component="div" role="list">
        {items.map((value, index) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItem
              key={index}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={`${value.generatedDate}-${value.amount}-${value.runningNo}`}
              />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

  const handleDateChange = (selectedDate) => {
    let todayDate = format(selectedDate, "dd/MM/yyyy"); 

    if(selectedDate.getFullYear() >= 2564){
      let thaiDate = format(selectedDate, "dd/MM");
      let mountDate = format(selectedDate, "MM/dd");

      setDate(thaiDate + "/" + (selectedDate.getFullYear() - 543))
      setSelectedDate(mountDate + "/" + (selectedDate.getFullYear() - 543))
    }else{
      let mountDate = format(selectedDate, "MM/dd/yyyy");

      setDate(todayDate);
      setSelectedDate(mountDate)
    }

  };

  const info = {
    code: "",
    companyRef: company._id,
    generatedDate: "",
    amount: type,
    runningNo: 0,
    used: false, // missing, true, false
    usedDateTime: "",
    recordedBy: "",
    printed: false,
  };

  const onSubmit = () => {
    // let date = new Date();
    // let timeSt = date.toLocaleString().split(" ")[0];
    // let runNo = 0

    row.map((row) => {
      if (Object.keys(ordered_company).includes(row.type.toString())) {
        let runNo = ordered_company[row.type.toString()].length;
        // console.log(ordered_company[row.type.toString()].length)
        for (let i = 1; i <= Number(row.qty); i++) {
          fetch("/api/coupon", {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
              "Content-Type": "application/json",
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify({
              code:
                company._id + "-" + date + "-" + row.type + "-" + (runNo + i),
              companyRef: company._id,
              generatedDate: date,
              amount: Number(row.type),
              runningNo: runNo + i,
              used: false,
              usedDateTime: "",
              recordedBy: "",
              printed: false,
            }), // body data type must match "Content-Type" header
          });
          if (i == Number(row.qty)) {
            alert("สร้างคูปอง " + row.type + " บาท สำเร็จ");
          }
        }
      } else {
        console.log(
          "type ======================================================================",
          row.type
        );
        for (let i = 1; i <= Number(row.qty); i++) {
          fetch("/api/coupon", {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
              "Content-Type": "application/json",
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify({
              code: company._id + "-" + date + "-" + row.type + "-" + i,
              companyRef: company._id,
              generatedDate: date,
              amount: Number(row.type),
              runningNo: i,
              used: false,
              usedDateTime: "",
              recordedBy: "",
              printed: false,
            }), // body data type must match "Content-Type" header
          });
          if (i == Number(row.qty)) {
            alert("สร้างคูปอง " + row.type + " บาท สำเร็จ");
          }
        }
      }
    });

    router.reload();
    // setRow([])
    // setCompany("")
  };

  const onSubmit_missing_coupon = (e) => {
    // console.log("right === ", right)

    right.map((coupon) => {
      if (coupon["used"] == false) {
        coupon["used"] = "missing";

        fetch("/api/coupon", {
          method: "PUT", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          redirect: "follow", // manual, *follow, error
          referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify(coupon), // body data type must match "Content-Type" header
        }).then((response) => response.json());
        // .then((data) => {
        //   alert("Add Item:\nResponse from server " + data.message);
        //   alert("Newly added _id", data._id);
        // });
      }
    });

    couponList.map((coupon) => {
      if (coupon["used"] == "missing") {
        coupon["used"] = false;

        fetch("/api/coupon", {
          method: "PUT", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          redirect: "follow", // manual, *follow, error
          referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify(coupon), // body data type must match "Content-Type" header
        }).then((response) => response.json());
        // .then((data) => {
        //   alert("Add Item:\nResponse from server " + data.message);
        //   alert("Newly added _id", data._id);
        // });
      }
    });
  };

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
            {/* <GridContainer> */}
            <div>
              <FormControl variant="outlined" className={classes2.formControl}>
                <InputLabel id="demo-simple-select-outlined-label1">
                  ชื่อลูกค้า
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label1"
                  id="demo-simple-select-outlined"
                  value={company ? company : ""}
                  onChange={handleChangeCompany}
                  label="Company"
                >
                  {customers.map((company) => {
                    return (
                      <MenuItem key={company.company} value={company}>
                        {company.company}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              
              <Button href="/coupon/printPage" color="primary">
                หน้าปริ้น
              </Button>

            </div>
              {tableState ? (
                <div>
                  
                <div style={{ height: 300, width: "200%" }}>
                <DataGrid
                  rows={row}
                  columns={columns}
                  onCellBlur={handleBlur}
                  hideFooterPagination={true}
                  />
                  </div>
            <div>
              <Button onClick={() => handleAddRow()}>เพิ่มคูปอง</Button>
              &emsp;คูปองที่ต้องการพิมพ์ทั้งหมด มูลค่ารวม {totalCoupon}
            </div>
            <Button onClick={() => onSubmit()} color="primary">
              ยืนยัน
            </Button>
            &emsp;
            
                </div>
                  
              ) : null}
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
            <GridContainer>
              <FormControl variant="outlined" className={classes2.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">
                  ชื่อลูกค้า
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={company ? company : ""}
                  onChange={handleChangeCompany}
                  label="Company"
                >
                  {customers.map((company) => {
                    return (
                      <MenuItem key={company.company} value={company}>
                        {company.company}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              

              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label="เลือกวันที่ที่ต้องการ"
                    onChange={handleDateChange}
                    // defaultValue={date}
                    value={selectedDate}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
              </MuiPickersUtilsProvider>


              <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="center"
                className={classes.root}
              >
                <Grid item>{customList("คูปองคงเหลือ", couponList)}</Grid>
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
                <Grid item>{customList("คูปองสูญหาย", right)}</Grid>
              </Grid>

              <Button onClick={() => onSubmit_missing_coupon()} color="primary">
                ยืนยัน
              </Button>
            </GridContainer>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

CouponMgt.layout = Admin;

export default CouponMgt;
