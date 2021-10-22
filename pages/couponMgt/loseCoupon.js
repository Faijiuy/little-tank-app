import Admin from "layouts/Admin.js";
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

function CouponMgt({ customer: customers, coupon: coupons }) {
  const [expanded, setExpanded] = React.useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div style={boxStyle}>
      <MissingCoupon customers={customers} coupons={coupons} />
    </div>
  );
}

CouponMgt.layout = Admin;

export default CouponMgt;
