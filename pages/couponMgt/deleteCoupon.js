import Admin from "layouts/Admin.js";
import React, {useContext, useEffect} from "react";

import { withStyles } from "@material-ui/core/styles";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";

import { connectToDatabase } from "../../util/mongodb";
import DeleteCoupon from "../../components/couponMgt/delete_coupon";
import AuthContext from "../../stores/authContext";

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
  const { user2, setUser2 } = useContext(AuthContext)

  // useEffect(() => {
  //   setUser2(sessionStorage.getItem('user2'))
  // }, [])

//   useEffect(() => {
//     if (sessionStorage.getItem('user2')) {
//        setUser2(sessionStorage.getItem('user2'));
//        }
//     }, []);

//  useEffect(() => {
//     sessionStorage.setItem('user2', user2);
//  }, [user2]);

  console.log("user2: ", user2)

  const [expanded, setExpanded] = React.useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div style={boxStyle}>
      <DeleteCoupon customers={customers} coupons={coupons} />
    </div>
  );
}

CouponMgt.layout = Admin;

export default CouponMgt;
