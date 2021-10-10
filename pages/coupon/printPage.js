import Grid from "./Grid";
import React, {useEffect, useState} from "react";
import Box from '@material-ui/core/Box';
import QRCode from "react-qr-code";
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from "next/router";

const divStyle = {
  fontSize: "15px",
};

const pStyle = {
  fontSize: "12px",
};

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

function getModalStyle() {
  const top = 50 ;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

function PrintPage() {
  // console.log(customers)
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [modalStyle] = React.useState(getModalStyle);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true)
  const [customers, setCustomers] = useState([])
  const [printList, setPrintList] = useState([])

  // const result = dotenv.config()

  useEffect(() => {
    async function fetchData(){
      let response_printList = await fetch("/api/coupon")
      let data_printList = await response_printList.json()
      let filter_printList = data_printList.filter(coupon => coupon.printed === false)
      setPrintList(filter_printList)

      let response_customers = await fetch("/api/customer")
      let data_customers = await response_customers.json()

      setCustomers(data_customers)

      setIsLoading(false)
    }
    fetchData()
  }, [])

  if(isLoading){
    return <h2>Loading..</h2>
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      {/* <h2 id="simple-modal-title"></h2> */}
      <p id="simple-modal-description">
        หากท่านทำการปริ้นท์แล้ว กรุณากดปุ่มยืนยัน หากยังไม่ได้ปริ้น กรุณากดปุ่มยกเลิก
      </p>
      <Button variant="contained" color="primary" onClick={() => handleClick()}>
        ยืนยัน
      </Button>
      <Button variant="contained" color="secondary" onClick={handleClose}>
        ปิด
      </Button>
    </div>
  );

  const handleClick = () => {
    async function toSubmit(){
      for(let i = 0; i < printList.length; i++){
        const promise_fetch = await new Promise(async (resolve) => {
          printList[i].printed = true;
          fetch("/api/coupon/print", {
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
            body: JSON.stringify(printList[i]), // body data type must match "Content-Type" header
          }).then(response => resolve(response))

        })

        Promise.all([promise_fetch]).then(value => {
          console.log(i, value)
        })

      }
      router.push('/couponMgt/couponList')
    }

    toSubmit()
  };

  return (
    <div>
      <Button variant="contained" color="secondary" className="no-print button-left sticky" onClick={() => router.push('/couponMgt/purchaseCoupon')}>
        ย้อนกลับ
      </Button>
      <Button variant="contained" color="primary" className="no-print button-right sticky" onClick={() => {
        window.print()
        setOpen(true)}}
      >
        ปริ้นคูปอง
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
      <br className="no-print" />
      <br className="no-print" />

      <Grid className="full-height-div">
        {printList.map((coupon, index) => {
          return (
            <>
              <div className="box" style={divStyle}>
                <p>บริษัท: {customers.map(customer => {if(coupon.companyRef === customer._id){return customer.company}})}</p>
                <p>ลำดับ: {coupon.runningNo}</p>
                <p>ราคา: {coupon.amount}</p>
                <p>วันที่ผลิต: {coupon.generatedDate}</p>
              </div>
              <div className="box">
                <div className="child left">
                  <p>บริษัท: {customers.map(customer => {if(coupon.companyRef === customer._id){return customer.company}})}</p>
                  <p>ลำดับ: {coupon.runningNo}</p>
                  <p>ราคา: {coupon.amount}</p>
                  <p>วันที่ผลิต: {coupon.generatedDate}</p>
                </div>
                <span className="center" >
                  <p>.......................................</p>
                  <p>อนุมัติโดย</p>
                  
                  <p>.......................................</p>
                  <p>เลขทะเบียนรถ</p>
                </span>
                <span className="right">
                  <QRCode value={coupon.code} size="150" />
                  <p style={pStyle}>{coupon._id}</p>
                </span>
                
              </div>
            </>
          );
        })}
      </Grid>
    </div>
  );
}

export default PrintPage;