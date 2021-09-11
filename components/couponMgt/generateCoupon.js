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

export default function GenerateCoupon(){


    const onSubmit = () => {
        let test = groupByKey(rows, "type")
    
    
        if(Object.keys(test).some(type => test[type].length > 1)){
          alert("กรุณาระบุราคาเดียวกันในช่องเดียวกัน")
        }else{
    
          if(rows.some(row => Number(row.type) < 500 || (Number(row.type) % 100 !== 0 && Number(row.type) % 100 !== 50))){
            alert("กรุณาระบุราคาคูปองไม่ต่ำกว่า 500 และไม่ควรมีเศษ")  
    
          }else{
    
            rows.map((row) => {
        
              if (Object.keys(ordered_company).includes(row.type.toString())) {
        
                let runNo = ordered_company[row.type.toString()].length;
        
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
            })
            
            router.reload()
          }
           
    
    
        }
    
        // Object.keys(test).some(type => test[type].length > 1) ? alert("กรุณาระบุราคาเดียวกันในช่องเดียวกัน") :
        
            
      };
      
    return (
        <div>
            <GridContainer className={classes2.formControl}>
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
    
                  <FormControl variant="outlined" className={classes2.formControl}>
                    <Button href="/coupon/printPage" color="primary">
                      หน้าปริ้น
                    </Button>
                  </FormControl>
                  
    
                </GridContainer>
                
    
                
                  {tableState ? (
                    <div>
                      
                    <div style={{ height: 300, width: "120%" }} className={classes4.root}>
                    <DataGrid
                      rows={rows}
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

        </div>
    )
}