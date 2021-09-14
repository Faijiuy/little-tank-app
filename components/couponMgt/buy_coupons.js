import React, { useCallback, useContext, useEffect } from 'react'
import TextField from '@material-ui/core/TextField'
import { StepperContext } from '../../pages/couponMgt/purchaseCoupon'


import Button from '@material-ui/core/Button';



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



export default function Buy_Coupons() {
  const { company, setCompany, customers, coupons, tableState, setTableState, classes, rows, setRows, 
            total_table, setTotal_table, total_coupons, setTotal_coupons, text_rows, setText_rows } = useContext(StepperContext)

  

  const handleChangeText = (e) => {
    let newRow = text_rows;

    if(e.target.id.split(" ")[1] == "price"){
      newRow[Number(e.target.id.split(" ")[0])].price = e.target.value
    }else if(e.target.id.split(" ")[1] == "qty"){
      newRow[e.target.id.split(" ")[0]].qty = e.target.value
    }

    newRow[e.target.id.split(" ")[0]].total = newRow[e.target.id.split(" ")[0]].price * newRow[e.target.id.split(" ")[0]].qty
    
    setText_rows(newRow)

    let sum = subtotal(newRow);
    setTotal_coupons(sum)

  }

  
  const handleAddRow = () => {

    setText_rows((prevText_rows) => {
      return ([...prevText_rows, {
          price: 0,
          qty: 0,
          total: 0,}] )
      
    })
    
  };

  return (
      
        <form className={classes.root} noValidate autoComplete="off">
          {text_rows.map((row, index) => {
            return (
            <div>
              <TextField required id={`${index} price`} label="ราคา" defaultValue={row.price} onChange={(e) => handleChangeText(e)}/>
              <TextField required id={`${index} qty`} label="จำนวน" defaultValue={row.qty} onChange={(e) => handleChangeText(e)} />
              <TextField
                id={`${index} total`}
                label="ราคารวม"
                value={row.price * row.qty}
                InputProps={{
                  readOnly: true,
                }}
              />

            </div>
            )

          })}
          <div>มูลค่ารวม {total_coupons} บาท</div>
            <div>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddRow}
                className={classes.button}
              >
                เพิ่ม
              </Button>
            </div>
        </form>
  )
}
