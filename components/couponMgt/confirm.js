import React, { useCallback, useContext, useEffect } from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { StepperContext } from '../../pages/couponMgt/purchaseCoupon'



export default function Confirm(){
    const { company, setCompany, customers, coupons, tableState, setTableState, classes, rows, setRows, 
        total_table, setTotal_table, total_coupons, setTotal_coupons, text_rows, setText_rows } = useContext(StepperContext)

    return (
        <form>
                บริษัท {company.company}

                <TableContainer>
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
                          <TableCell >{row.price * row.qty}</TableCell>
                        </TableRow>       
                      ))}

                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell>Total</TableCell>

                        <TableCell >{total_coupons}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </form>
    )
}
