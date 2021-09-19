/*!

=========================================================
* * NextJS Material Dashboard v1.1.0 based on Material Dashboard React v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nextjs-material-dashboard
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/nextjs-material-dashboard/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import Unarchive from "@material-ui/icons/Unarchive";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,

    // layout: "/admin",
  },
  // {
  //   collapse: true, 
  //   name: "Name of the collapse group", 
  //   icon: "Icon of the collapse group", 
  //   state: "string", 
  //   views: [arrayOfRoutes]
  // },

  {
    path: "/customers",
    name: "การจัดการลูกค้า",
    icon: Person,

    // layout: "/admin",
  },
  {
    path: "/couponMgt",
    name: "การจัดการคูปอง",
    pathArr: [{path: "/couponMgt/purchaseCoupon", name: "ซื้อคูปอง"}, {path: "/couponMgt/loseCoupon", name: "คูปองหาย"}, {path: "/coupon/printPage", name: "หน้าปริ้นคูปอง"}],
    icon: Unarchive,

    // layout: "/admin",
  },
  {
    path: "/adminMgt",
    name: "การจัดการแอดมิน",
    icon: Person,

    // layout: "/admin",
  },
 
  
];

export default dashboardRoutes;