import './Box.css'
import Grid from './Grid'
import React from "react";
import QRCode from "react-qr-code";
import { connectToDatabase } from "../../util/mongodb";


export async function getServerSideProps() {
  const { db } = await connectToDatabase();

  const coupons = await db.collection("coupons").find().sort({}).toArray();

  return {
    props: {
      coupon: JSON.parse(JSON.stringify(coupons)),
    },
  };
}



const divStyle = {
    fontSize: '15px',
  };

export default function PrintPage({coupon: coupons}){

    return(
        <Grid>
            {coupons.map((coupon, index) => {
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
                        <QRCode className="child" value={coupon.code} size="160" />   
                        </p>    
                    </div>
                </>)
            })}
        
        </Grid>
    )
}

