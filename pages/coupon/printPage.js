// import Grid from "./Grid";
// import React from "react";
// import Box from '@material-ui/core/Box';
// import QRCode from "react-qr-code";
// import Modal from '@material-ui/core/Modal';
// import Button from '@material-ui/core/Button';
// import { makeStyles } from '@material-ui/core/styles';
// import { useRouter } from "next/router";


// import { connectToDatabase } from "../../util/mongodb";

// export async function getServerSideProps() {
//   const { db } = await connectToDatabase();

//   const coupons = await db.collection("coupons").find().sort({}).toArray();
//   const customers = await db.collection("customer").find().sort({}).toArray();


//   let printList = coupons.filter((coupon) => coupon.printed === false);

//   return {
//     props: {
//       coupon: JSON.parse(JSON.stringify(printList)),
//       customer: JSON.parse(JSON.stringify(customers)), 
//     },
//   };
// }

// const divStyle = {
//   fontSize: "15px",
// };

// const pStyle = {
//   fontSize: "12px",
// };

// const useStyles = makeStyles((theme) => ({
//   paper: {
//     position: 'absolute',
//     width: 400,
//     backgroundColor: theme.palette.background.paper,
//     border: '2px solid #000',
//     boxShadow: theme.shadows[5],
//     padding: theme.spacing(2, 4, 3),
//     '& > *': {
//       margin: theme.spacing(1),
//     },
//   },
// }));

// function getModalStyle() {
//   const top = 50 ;
//   const left = 50;

//   return {
//     top: `${top}%`,
//     left: `${left}%`,
//     transform: `translate(-${top}%, -${left}%)`,
//   };
// }

// function PrintPage({ coupon: printList, customer: customers }) {
//   // console.log(customers)
//   const classes = useStyles();
//   const [open, setOpen] = React.useState(false);
//   const [modalStyle] = React.useState(getModalStyle);
//   const router = useRouter();


//   const handleOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const body = (
//     <div style={modalStyle} className={classes.paper}>
//       {/* <h2 id="simple-modal-title"></h2> */}
//       <p id="simple-modal-description">
//         หากกดยืนยันแล้ว จะไม่สามารถกลับไปปริ้นได้อีก หากคุณยังไม่ได้ปริ้น ปิดแล้วกด Ctrl + P เพื่อปริ้น
//       </p>
//       <Button variant="contained" color="primary" onClick={() => handleClick()}>
//         ยืนยัน
//       </Button>
//       <Button variant="contained" color="secondary" onClick={handleClose}>
//         ปิด
//       </Button>
//     </div>
//   );

//   const handleClick = async () => {

//     await printList.map((coupon) => {
//       coupon.printed = true;
//       fetch("/api/coupon/print", {
//         method: "PUT", // *GET, POST, PUT, DELETE, etc.
//         mode: "cors", // no-cors, *cors, same-origin
//         cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
//         credentials: "same-origin", // include, *same-origin, omit
//         headers: {
//           "Content-Type": "application/json",
//           // 'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         redirect: "follow", // manual, *follow, error
//         referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
//         body: JSON.stringify(coupon), // body data type must match "Content-Type" header
//       })
//         .then((response) => response.json())
//         // .then((data) => {
//         //   console.log();
//         //   // alert("Add Item:\nResponse from server " + data._id);
//         // });
//     });

//     // router.reload();
//     router.push('/couponMgt')

//   };

//   return (
//     <div>
//       <Button variant="contained" color="primary" className="no-print" onClick={handleOpen}>
//         ปริ้นสำเร็จ
//       </Button>
//       <Modal
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="simple-modal-title"
//         aria-describedby="simple-modal-description"
//       >
//         {body}
//       </Modal>

//       <Box className="no-print" bgcolor="secondary.main" color="secondary.contrastText" p={2}>
//         กด ctrl + P เพื่อปริ้น หลังจากนั้นกดปุ่มยืนยันด้านบน หากรูปแสดงตัวอย่างตกขอบ กดปุ่ม Refresh หรือ F5
//       </Box>

//       <Grid>
//         {printList.map((coupon, index) => {
//           return (
//             <>
//               <div className="box" style={divStyle}>
//                 <p>บริษัท: {customers.map(customer => {if(coupon.companyRef === customer._id){return customer.company}})}</p>
//                 <p>ลำดับ: {coupon.runningNo}</p>
//                 <p>ราคา: {coupon.amount}</p>
//                 <p>วันที่ผลิต: {coupon.generatedDate}</p>
//               </div>
//               <div className="box">
//                 <div className="child left">
//                   <p>บริษัท: {customers.map(customer => {if(coupon.companyRef === customer._id){return customer.company}})}</p>
//                   <p>ลำดับ: {coupon.runningNo}</p>
//                   <p>ราคา: {coupon.amount}</p>
//                   <p>วันที่ผลิต: {coupon.generatedDate}</p>
//                 </div>
//                 <span className="center" >
//                   <p>.......................................</p>
//                   <p>อนุมัติโดย</p>
                  
//                   <p>.......................................</p>
//                   <p>เลขทะเบียนรถ</p>
//                 </span>
//                 <span className="right">
//                   <QRCode value={coupon.code} size="150" />
//                   <p style={pStyle}>{coupon._id}</p>
//                 </span>
                
//               </div>
//             </>
//           );
//         })}
//       </Grid>
//     </div>
//   );
// }

// export default PrintPage;

// import logo from './logo.svg';
// import './App.css';
// import "./Box.css";
// import './Grid.css'

import Grid from "./Grid";
import React from "react";
// import Box from '@material-ui/core/Box';
import QRCode from "react-qr-code";
// import Modal from '@material-ui/core/Modal';
// import Button from '@material-ui/core/Button';
// import { makeStyles } from '@material-ui/core/styles';
// import { useRouter } from "next/router";

// import Grid from "./Grid";
// import React from "react";
// import Box from '@material-ui/core/Box';
// import QRCode from "react-qr-code";
// import Modal from '@material-ui/core/Modal';
// import Button from '@material-ui/core/Button';
// import { makeStyles } from '@material-ui/core/styles';
// import { useRouter } from "next/router";



const printList = [{companyId: "3565464646255365465463242344", companyName: "companyName", generatedDate: "9/5/2021", amount: 500 } ]

for(let i=0; i<=200; i++){
  printList.push({companyId: "3565464646255365465463242344", companyName: "companyName", generatedDate: "9/5/2021", amount: 500+i })
}

const divStyle = {
  fontSize: "15px",
};

const pStyle = {
  fontSize: "12px",
};

function App() {
  return (
    <Grid>
        {printList.map((coupon, index) => {
          return (
            <>
              <div className="box" style={divStyle}>
                <p>บริษัท: {coupon.companyName}</p>
                <p>ลำดับ: {index}</p>
                <p>ราคา: {coupon.amount}</p>
                <p>วันที่ผลิต: {coupon.generatedDate}</p>
              </div>
              <div className="box">
                <div className="child left">
                  <p>บริษัท: {coupon.companyName}</p>
                  <p>ลำดับ: {index}</p>
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
                  <QRCode value={coupon.companyName + index + coupon.amount + coupon.generatedDate} size="150" />
                  <p style={pStyle}>{coupon.companyId}</p>
                </span>
                
              </div>
            </>
          );
        })}
      </Grid>
  );
}

export default App;
