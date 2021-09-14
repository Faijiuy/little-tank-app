import React, { useCallback, useContext, useEffect } from 'react'
import TextField from '@material-ui/core/TextField'
import { StepperContext } from '../../pages/couponMgt/purchaseCoupon'


import Button from '@material-ui/core/Button';

  

function subtotal(items) {
  return items.map(({ total }) => total).reduce((sum, i) => sum + i, 0);
}





export default function Buy_Coupons() {
  const { classes, total_coupons, setTotal_coupons, text_rows, setText_rows } = useContext(StepperContext)

  

  const handleChangeText = (index, e) => {

    // console.log(e.target.name)
    // console.log("index ", index)

    let newRow = [...text_rows];

    if(e.target.name == "price"){
      newRow[index].price = e.target.value
    }else if(e.target.name == "qty"){
      newRow[index].qty = e.target.value
    }


    newRow[index].total = newRow[index].price * newRow[index].qty
    
    setText_rows(newRow)

    // let sum = subtotal(newRow);
    // setTotal_coupons(sum)

  }

  const handleAddRow = () => {
    setText_rows((prevText_rows) => {
      return ([...prevText_rows, {
          price: null,
          qty: null,
          total: null,}] ) 
    })   
  };

  const handleDeleteRow = (index) => {
    let newArray = [...text_rows]
    
    newArray.splice(index, 1)

    setText_rows(newArray)   
  };

  
  useEffect(() => {
    let sum = subtotal(text_rows);
    console.log("sum ", sum)
    setTotal_coupons(sum)

  }, [text_rows])



  return (  
    <form className={classes.root} noValidate autoComplete="off">
      {text_rows.map((row, index) => {
        return (
        <div key={index}>
          <TextField required name="price" type="number" label="ราคา" value={row.price} onChange={(e) => handleChangeText(index, e)}/>
          <TextField required name="qty" type="number" label="จำนวน" value={row.qty} onChange={(e) => handleChangeText(index, e)} />
          <TextField
            name="total"
            label="ราคารวม"
            value={row.price * row.qty}
            InputProps={{
              readOnly: true,
            }}
          />
          <Button variant="contained" color="secondary" onClick={() => handleDeleteRow(index)} className={classes.button_text_rows}>
            ลบ
          </Button>

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
