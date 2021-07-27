import Admin from "layouts/Admin.js";
import React, { useState, useEffect } from "react";
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
import TextField from "@material-ui/core/TextField";

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

import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";


import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';

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

  const [expanded, setExpanded] = React.useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const [checked, setChecked] = React.useState([]);
  const [right, setRight] = React.useState([]);
  const [right2, setRight2] = React.useState([]);


  const [company, setCompany] = useState("");
  const [type, setType] = useState();
  const [qty, setQty] = useState();
  const [couponList, setCouponList] = useState([]);
  const [missingList, setMissingList] = useState([])
  const [selectedDate, setSelectedDate] = React.useState(
    new Date().toLocaleString().split(",")[0]
  );

  const [ordered_company, setOrdered_company] = useState([]);

  function compare(a, b) {
    if (a.runningNo < b.runningNo) {
      return -1;
    }
    if (a.runningNo > b.runningNo) {
      return 1;
    }
    return 0;
  }

  function removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }

  useEffect(() => {
    console.log(checked)
  },[checked])

  useEffect(() => {
    let list = [];
    let miss = []

    coupons.map((coupon) => {
      if (
        coupon.companyRef === company._id &&
        !coupon.used &&
        coupon.generatedDate === selectedDate &&
        coupon.amount === type
      ) {
        list.push(coupon);
      }else if(
        coupon.companyRef === company._id &&
        coupon.used === 'missing' &&
        coupon.generatedDate === selectedDate &&
        coupon.amount === type
      ){
        miss.push(coupon)
      }
    });

    setCouponList(list);
    setMissingList(miss)

    let date = new Date();
    let timeSt = date.toLocaleString().split(",")[0];

    let runNo = list.filter((a) => a.generatedDate === timeSt).sort(compare);

    let uniq = removeDuplicates(runNo, "amount");
    setOrdered_company(uniq);
  }, [company, selectedDate, type]);

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

  const leftChecked = intersection(checked, couponList);
  const rightChecked = intersection(checked, right);

  const leftChecked2 = intersection(checked, missingList);
  const rightChecked2 = intersection(checked, right2);

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
              <ListItemText id={labelId} primary={`${value.code}`} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

  const handleDateChange = (date) => {
    let timeSt = date.toLocaleString().split(",")[0];
    setSelectedDate(timeSt);
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
  };

  const onSubmit = (e) => {
    let date = new Date();
    let timeSt = date.toLocaleString().split(",")[0];

    ordered_company.map((coupon) => {
      if (info.amount === coupon.amount) {
        info.runningNo = coupon.runningNo;
      }
    });

    for (let i = 1; i <= qty; i++) {
      info["generatedDate"] = timeSt.split(",")[0];
      info["runningNo"] += 1;
      info["code"] =
        company._id +
        "-" +
        timeSt.split(",")[0] +
        "-" +
        type +
        "-" +
        info["runningNo"];

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
        body: JSON.stringify(info), // body data type must match "Content-Type" header
      })
        .then((response) => response.json())
        .then((data) => {
          alert("Add Item:\nResponse from server " + data.message);
        });
    }
  };

  const onSubmit_missing_coupon = (e) => {
    // console.log("right === ", right)

    right.map((coupon) => {
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
      })
        .then((response) => response.json())
        .then((data) => {
          alert("Add Item:\nResponse from server " + data.message);
          alert("Newly added _id", data._id);
        });
    });
  };

  const onSubmit_found_coupon = (e) => {
    // console.log("right === ", right)

    checked.map((coupon) => {
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
      })
        .then((response) => response.json())
        .then((data) => {
          alert("Add Item:\nResponse from server " + data.message);
          alert("Newly added _id", data._id);
        });
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
                  Company
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
                      <MenuItem value={company}>{company.company}</MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
            <span className={styles}>
              <FormControl variant="outlined" className={classes2.formControl}>
                <InputLabel id="demo-simple-select-outlined-label2">
                  Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label2"
                  id="demo-simple-select-outlined"
                  value={type ? type : ""}
                  defaultValue=""
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
            </span>

            <form className={classes.root} noValidate autoComplete="off">
              <TextField
                id="outlined-basic"
                label="จำนวน"
                variant="outlined"
                onBlur={handleQty}
              />
            </form>

            <Button onClick={() => onSubmit()} color="primary">
              พิมพ์
            </Button>

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
                  Company
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
                      <MenuItem value={company}>{company.company}</MenuItem>
                    );
                  })}
                </Select>
              </FormControl>

              <FormControl variant="outlined" className={classes2.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">
                  Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={type ? type : ""}
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

              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justifyContent="space-around">
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label="Date picker inline"
                    value={selectedDate}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </Grid>
              </MuiPickersUtilsProvider>

              <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="center"
                className={classes.root}
              >
                <Grid item>{customList("Choices", couponList)}</Grid>
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
                <Grid item>{customList("Missing", right)}</Grid>
              </Grid>

              <Button onClick={() => onSubmit_missing_coupon()} color="primary">
                ลบ
              </Button>
            </GridContainer>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        square
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
      >
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
          <Typography>เจอคุปอง</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <GridContainer>
              <FormControl variant="outlined" className={classes2.formControl}>
                <InputLabel id="demo-simple-select-outlined-label2">
                  Company
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
                      <MenuItem value={company}>{company.company}</MenuItem>
                    );
                  })}
                </Select>
              </FormControl>

              <span className={styles.right}>
                <FormControl
                  variant="outlined"
                  className={classes2.formControl}
                >
                  <InputLabel id="demo-simple-select-outlined-label2">
                    Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={type ? type : ""}
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
              </span>

              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justifyContent="space-around">
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date-picker-inline2"
                    label="Date picker inline"
                    value={selectedDate}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </Grid>
              </MuiPickersUtilsProvider>

              <List className={classes.root}>
      {missingList.map((value) => {
        const labelId = `checkbox-list-label-${value._id}`;

        return (
          <ListItem key={value._id} role={undefined} dense button onClick={handleToggle(value)}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={checked.indexOf(value) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': labelId }}
              />
            </ListItemIcon>
            <ListItemText id={labelId} primary={`${value.code}`} />
            
          </ListItem>
        );
      })}
    </List>

              <Button onClick={() => onSubmit_found_coupon()} color="primary">
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
