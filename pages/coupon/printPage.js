import "./Box.css";
import Grid from "./Grid";
import React from "react";
import QRCode from "react-qr-code";
import { connectToDatabase } from "../../util/mongodb";

export async function getServerSideProps() {
  const { db } = await connectToDatabase();

  const coupons = await db.collection("coupons").find().sort({}).toArray();
  const customers = await db.collection("customer").find().sort({}).toArray();


  let printList = coupons.filter((coupon) => coupon.printed === false);

  return {
    props: {
      coupon: JSON.parse(JSON.stringify(printList)),
      customer: JSON.parse(JSON.stringify(customers)), 
    },
  };
}

const divStyle = {
  fontSize: "15px",
};

const pStyle = {
  fontSize: "12px",
};

export default function PrintPage({ coupon: printList, customer: customers }) {
  // console.log(customers)

  const handleClick = () => {
    //   window.old_print=window.print
    //   window.print=function() {
    //     alert('doing things');
    //     window.old_print();
    // }
    window.print();

    printList.map((coupon) => {
      coupon.printed = true;
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
          console.log();
          // alert("Add Item:\nResponse from server " + data._id);
        });
    });
  };

  return (
    <div>
      <button className="no-print" onClick={() => handleClick()}>
        Print
      </button>
      <Grid>
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
