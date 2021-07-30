import './Box.css'
import Grid from './Grid'
import React from "react";
import QRCode from "react-qr-code";
import { connectToDatabase } from "../../util/mongodb";


export async function getServerSideProps() {
  const { db } = await connectToDatabase();

  const coupons = await db.collection("coupons").find().sort({}).toArray();

  let printList = coupons.filter(coupon => coupon.printed === false)

  return {
    props: {
      coupon: JSON.parse(JSON.stringify(printList)),
    },
  };
}



const divStyle = {
    fontSize: '15px',
  };

export default function PrintPage({coupon: printList}){

  
  const handleClick = () => {
  //   window.old_print=window.print
  //   window.print=function() {
  //     alert('doing things');
  //     window.old_print();
  // }
    window.print()

    printList.map(coupon => {
      coupon.printed = true
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
        body: JSON.stringify(coupon), // body data type must match "Content-Type" header
      })
        .then((response) => response.json())
        .then((data) => {
          console.log()
          // alert("Add Item:\nResponse from server " + data._id);
        });
      
    })

  }



  

    return(

      <div>
        <button className="no-print" onClick={() => handleClick()}>Print</button>
        <Grid>
            {printList.map((coupon, index) => {
                return (<>

                    <div className="box" style={divStyle}>
                      <p>ID 5 ตัวท้าย: {coupon._id.substr(coupon._id.length - 5)}</p>
                      <p>ลำดับ: {coupon.runningNo}</p>
                      <p>ราคา: {coupon.amount}</p>
                      <p>วันที่ผลิต: {coupon.generatedDate}</p>
                    </div>
                    <div className="box" >
                        <p className="child"> ID: {coupon._id}
                        <p>ลำดับ: {coupon.runningNo}</p>
                        <p>ราคา: {coupon.amount}</p>
                        <p>วันที่ผลิต: {coupon.generatedDate}</p>
                        <div>
                        <QRCode className="child" value={coupon.code} size="160" />   

                        </div>
                        </p>    
                    </div>
                </>)
            })}
        
        </Grid>

        </div>
    )
}

