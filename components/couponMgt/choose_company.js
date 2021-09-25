import React, { useCallback, useContext, useEffect } from 'react'
import TextField from '@material-ui/core/TextField'
import { StepperContext } from '../../pages/couponMgt/purchaseCoupon'

import Admin from "layouts/Admin.js";
import Typography from "@material-ui/core/Typography";

import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';



// import React, { useState, useEffect } from "react";
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

function thousands_separators(num) {
  var num_parts = num.toString().split(".");
  num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return num_parts.join(".");
}


function priceRow(price, qty) {
    return price * qty;
  }
  
function createRow(key, price, qty, date) {
const total = priceRow(price, qty);
return {key, price, qty, total, date };
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

const useStyles2 = makeStyles((theme) => ({
  select: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function Choose_Company() {
  // const classes2 = useStyles2();

  const { company, setCompany, customers, coupons, tableState, setTableState, classes, rows, setRows, 
            total_table, setTotal_table, total_coupons, setTotal_coupons, text_rows, setText_rows,
            ordered_company, setOrdered_company, date, setDate } = useContext(StepperContext)

  const handleChangeCompany = (event) => {
    setTableState(true);
    setCompany(event.target.value);
    // setcompany_name(event.target.value.company)
  };

  useEffect(() => {
    let coupons_in_company = coupons.filter(coupon => coupon.companyRef === company._id && coupon.used === false)

    
    
      let helper = {};
      let result = coupons_in_company.reduce(function(r, o) {
        let key = o.amount + '-' + o.generatedDate;
        
        if(!helper[key]) {
          helper[key] = Object.assign({}, o); // create a copy of o
          helper[key].qty = 1
          r.push(helper[key]);
        } else {
          helper[key].qty += 1;
        }
  
        return r;
      }, []);
  
      let array_rows = result.map(group => createRow(group._id, Number(group.amount), Number(group.qty), group.generatedDate))
      console.log("rows", rows)
  
      setRows(array_rows)
      
      let sum = subtotal(array_rows);
      setTotal_table(sum)

    

  
    }, [company])


    useEffect(() => {
  
      let filterCoupon = coupons.filter(coupon => coupon.companyRef === company._id && coupon.generatedDate === date)
  
      let groupArray = groupByKey(filterCoupon, "amount")
  
      setOrdered_company(groupArray)  
  
    }, [company])

  return (
    <div>
          <FormControl 
            variant="outlined" 
            className={classes.select}
            >
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

          {tableState ? 
          (rows[0] !== undefined ? 
          <TableContainer style={{marginTop: "15px"}}>
            <p style={{marginLeft: "15px", fontSize: 25}}>ประวัติการซื้อคูปอง</p>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ราคาคูปอง</TableCell>
                <TableCell>วันที่ซื้อ</TableCell>
                <TableCell >จำนวนที่เหลือ</TableCell>
                <TableCell >รวม</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.key}>
                  <TableCell component="th" scope="row">
                    {row.price}
                  </TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell >{row.qty}</TableCell>
                  <TableCell >{thousands_separators(row.price * row.qty)}</TableCell>
                </TableRow>       
              ))}

              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>

                <TableCell>รวม</TableCell>

                <TableCell >{thousands_separators(total_table)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer> : <div style={{marginTop: "15px" ,marginLeft: "15px", fontSize: 20}}>บริษัทนี้ไม่มีประวัติการซื้อคูปอง</div>) : null
          }
        </div>
  )
}