import React from "react";

import { connectToDatabase } from "../../util/mongodb";
import MissingCoupon from "../../components/LITTLE_TANK_COMPONENTS/COUPON_MGT/missingCoupon";

export async function getServerSideProps() {
  const { db } = await connectToDatabase();

  const customers = await db.collection("customer").find().sort({}).toArray();

  const coupons = await db.collection("coupons").find().sort({}).toArray();

  return {
    props: {
      customer: JSON.parse(JSON.stringify(customers)),
      coupon: JSON.parse(JSON.stringify(coupons)),
    },
  };
}


const boxStyle = {
  padding: 30,
  margin: "50px",
};

function LoseCoupon({ customer: customers, coupon: coupons }) {

  return (
    <div style={boxStyle}>
      <MissingCoupon customers={customers} coupons={coupons} />
    </div>
  );
}

export default LoseCoupon;
