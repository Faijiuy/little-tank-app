import React, { useCallback, useContext, useEffect } from 'react'
import TextField from '@material-ui/core/TextField'
import { StepperContext } from '../../pages/couponMgt/purchaseCoupon'

import Admin from "layouts/Admin.js";
import Typography from "@material-ui/core/Typography";

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



export default function Choose_Company() {
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
  
      let coupons_groupBy_price = groupByKey(coupons_in_company, "amount")
  
      let array_rows = Object.keys(coupons_groupBy_price).map(price => 
                          createRow(price, 
                                    coupons_groupBy_price[price].length))
  
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
    <Grid>
          <FormControl 
            variant="outlined" 
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
          <TableContainer>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ราคาคูปอง</TableCell>
                <TableCell >จำนวนที่เหลือ</TableCell>
                <TableCell >รวม</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.price}>
                  <TableCell component="th" scope="row">
                    {row.price}
                  </TableCell>
                  <TableCell >{row.qty}</TableCell>
                  <TableCell >{row.price * row.qty}</TableCell>
                </TableRow>       
              ))}

              <TableRow>
                <TableCell></TableCell>
                <TableCell>Total</TableCell>

                <TableCell >{total_table}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer> : null
          }
        </Grid>
  )
}
