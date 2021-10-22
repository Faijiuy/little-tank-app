import React, { useContext } from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { StepperContext } from '../../../pages/couponMgt/purchaseCoupon'

function thousands_separators(num) {
  var num_parts = num.toString().split(".");
  num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return num_parts.join(".");
}

export default function Confirm(){
    const { company, classes, total_coupons, text_rows } = useContext(StepperContext)

    return (
        <form>
                <p style={{marginTop: "15px" ,marginLeft: "15px", fontSize: 20}}>บริษัท {company.company}</p>

                <TableContainer>
                <p style={{marginLeft: "15px", fontSize: 16}}>คูปองที่ต้องการซื้อ</p>
                  <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>คูปอง</TableCell>
                        <TableCell >จำนวน</TableCell>
                        <TableCell >รวม</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {text_rows.map((row) => (
                        <TableRow key={row.price}>
                          <TableCell component="th" scope="row">
                            {row.price}
                          </TableCell>
                          <TableCell >{row.qty}</TableCell>
                          <TableCell >{thousands_separators(row.price * row.qty)}</TableCell>
                        </TableRow>       
                      ))}

                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell>Total</TableCell>

                        <TableCell >{thousands_separators(total_coupons)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </form>
    )
}
