import React, { useState, useEffect } from "react";
import { connectToDatabase } from "../util/mongodb";
import { format } from 'date-fns'
import { DataGrid } from "@material-ui/data-grid";
import { makeStyles } from "@material-ui/core/styles";

import GridContainer from "components/Grid/GridContainer.js";

import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";
import { Box } from "@material-ui/core";
import { Bar, Line } from 'react-chartjs-2'

export async function getServerSideProps() {
  const { db } = await connectToDatabase();

  const customers = await db.collection("customer").find().sort({}).toArray();

  const coupons = await db.collection("coupons").find().sort({}).toArray();

  // const users = await db.collection("user").find().sort({}).toArray();

  return {
    props: {
      customer: JSON.parse(JSON.stringify(customers)),
      coupon: JSON.parse(JSON.stringify(coupons)),
      // user: JSON.parse(JSON.stringify(users)),
    },
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    // alignContent: "center",
    '& .super-app-theme--header': {
      backgroundColor: 'rgba(255, 7, 0, 0.55)',
    },
    textAlign: 'center',
    // position: "relative",
    
    width: 700,
    backgroundColor: theme.palette.background.paper,
    // border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxHeight: 400,
    overflow: "auto",
    marginTop: 10,
    marginLeft: 10,
    borderRadius: 10
  },
  paper_totalAmount: {
    // alignContent: "center",
    textAlign: 'center',
    // position: 'absolute',
    // top: '10%',
    // left: '70%',
    // position: "relative",
    width: 250,
    backgroundColor: theme.palette.background.paper,
    // border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxHeight: 200,
    overflow: "auto",
    marginTop: 10,
    marginLeft: 10,
    borderRadius: 10
  },
  paper_lineChart: {
    // alignContent: "center",
    textAlign: 'center',
    // position: "relative",
    
    width: 700,
    backgroundColor: theme.palette.background.paper,
    // border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxHeight: 370,
    overflow: "auto",
    marginTop: 10,
    marginLeft: 10,
    borderRadius: 10
  },
  
}));


function groupByKey(array, key) {
  return array.reduce((hash, obj) => {
    if (obj[key] === undefined) return hash;
    return Object.assign(hash, {
      [obj[key]]: (hash[obj[key]] || []).concat(obj),
    });
  }, {});
}

function getDaysAgoData(data, daysAgo) {
  // Get current date
  let today = new Date();
  // Create UTC date for daysAgo
  let previousDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() - daysAgo)).getTime();
  // Filter and sort data
  return data.filter(item => new Date(reformatDate(item.usedDateTime)).getTime() >= previousDate && new Date(reformatDate(item.usedDateTime)).getTime() <= today.getTime())
            //  .sort((a, b) => new Date(reformatDate(a.usedDateTime)).getTime() >= (new Date(reformatDate(b.usedDateTime)).getTime()))
            //  .reverse()
}

function reformatDate(date) {
  let split_date = date.split('/')

  // console.log("12/10/2021: ", split_date[1] + '/' + split_date[0] + '/' + split_date[2])
  return split_date[1] + '/' + split_date[0] + '/' + split_date[2]
}

function getLabelDate() {
  let today = new Date();
  let maxDate = new Date().getTime();
  let minDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() - 30)).getTime();

  let labels = [],
      currentDate = minDate,
      d;

  while (currentDate <= maxDate) {
      d = new Date(currentDate);
      // todayDate = format(d, "dd/MM/yyyy"); 

      labels.push(format(d, "dd/MM/yyyy"));
      currentDate += (24 * 60 * 60 * 1000); // add one day
  }

  // console.log('labels: ', labels)

  return labels
}

function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getCompanyName(key, customers) {
  let name = ''
  customers.map(customer => {
    if(customer._id === key){
      name = customer.company
    } 
  })
  return name
}

function fill_date_gaps(obj, customers) {
  let datasets = []
  let today = new Date();
  
  for (let [key, value] of Object.entries(obj)) {
    // console.log(key, value) // 616d24c53c2c57000883ed04 [{…}]
    
    let maxDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())).getTime();
    let minDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() - 30)).getTime();

    let currentDate = minDate, 
        d

    while (currentDate <= maxDate) {
      d = new Date(currentDate);
      // todayDate = format(d, "dd/MM/yyyy"); 
      let previous = format(d, "dd/MM/yyyy")

      // let sort_array = []
      
      if(!value.some(coupon => coupon.usedDateTime === previous)){
        value.push({amount: 0, usedDateTime: previous})
      }

      // labels.push(format(d, "dd/MM/yyyy"));
      currentDate += (24 * 60 * 60 * 1000); // add one day
    }
    // value.sort((a, b) => new Date(reformatDate(a.usedDateTime)).getTime() < (new Date(reformatDate(b.usedDateTime)).getTime()))

    // console.log('value: ', value)
    
    var holder = {};

    value.forEach(function(d) {
      if (holder.hasOwnProperty(d.usedDateTime)) {
        holder[d.usedDateTime] = holder[d.usedDateTime] + d.amount;
      } else {
        holder[d.usedDateTime] = d.amount;
      }
    });

    var obj2 = [];

    for (var prop in holder) {
      obj2.push({ usedDateTime: prop, amount: holder[prop] });
    }

    
    obj2.sort((a,b) => new Date(reformatDate(a.usedDateTime)).getTime() - (new Date(reformatDate(b.usedDateTime)).getTime()))
    
    // console.log('obj2: ', obj2);

    let sort_array = []
    obj2.map((obj, index) => {
      // sort_array.push(obj.amount)
      sort_array[index] = obj.amount
    })
    

    datasets.push({
      label: getCompanyName(key, customers),
      data: sort_array,
      fill: false,
      borderColor: getRandomColor(),
      tension: 0.1
    })
    
  }
  // console.log(obj)

  return datasets
}

function groupByKeys(arr) {
  var helper = {};
  var result = arr.reduce(function(r, o) {
    var key = o.generatedDate + '-' + o.companyRef + '-' + o.amount;
    let i = 0
    
    if(!helper[key]) {
      helper[key] = Object.assign({}, o); // create a copy of o
      helper[key].id = key
      helper[key].count = 1
      r.push(helper[key]);
      
    } else {
      helper[key].count += 1;
      // helper[key].instances += o.instances;
    }

    return r;
  }, []);

  return result
} 

function groupByKeys_customer_remain(arr) {
  var helper = {};
  var result = arr.reduce(function(r, o) {
    var key = o.companyRef;
    
    if(!helper[key]) {
      helper[key] = Object.assign({}, o); // create a copy of o
      helper[key].id = key
      r.push(helper[key]);
      
    } else {
      helper[key].amount += o.amount;
    }

    return r;
  }, []);

  return result
} 

function Dashboard({ customer: customers, coupon: coupons }) {
  const classes = useStyles()
  const [sortCoupons, setSortCoupons] = useState([])
  const [labelDate, setLabelDate] = useState([])
  const [datasets, setDatasets] = useState([])

  const [oldest_coupon_group, setOldest_coupon_group] = useState([])
  const [customer_ramain_group, setCustomer_ramain_group] = useState([])
  const [totalamount, setTotalamount] = useState(0)

  
const oldest_coupon_group_columns = [
  {
    field: "generatedDate",
    headerClassName: "super-app-theme--header",
    headerName: "วันที่ซื้อ",
    width: 120,
  //   editable: true,
  },
  {
    field: "companyRef",
    headerClassName: "super-app-theme--header",
    headerName: "ลูกค้า",
    width: 180,
    renderCell: function comapanyName(params){
      let company = ''
      
      customers.map(customer => {
        if(customer._id === params.row.companyRef){
          company = customer.company
        }
      })
      
      return <div>{company}</div>
    }
    
  //   editable: true,
  },
  {
    field: "amount",
    headerClassName: "super-app-theme--header",
    headerName: "คูปอง",
    width: 120,
  //   editable: true,
  },
  {
    field: "count",
    headerClassName: "super-app-theme--header",
    headerName: "จำนวนที่เหลือ",
    width: 170,
  //   editable: true,
  }, 
];

const customer_remain_columns = [
  {
    field: "companyRef",
    headerClassName: "super-app-theme--header",
    headerName: "ลูกค้า",
    width: 180,
    renderCell: function comapanyName(params){
      let company = ''
      
      customers.map(customer => {
        if(customer._id === params.row.companyRef){
          company = customer.company
        }
      })
      
      return <div>{company}</div>
    }
    
  //   editable: true,
  },
  {
    field: "amount",
    headerClassName: "super-app-theme--header",
    headerName: "คูปอง",
    width: 120,
  //   editable: true,
  },
];

  useEffect(() => {

    // let coupons = []
    setLabelDate(getLabelDate())
    let used_coupons = coupons.filter(coupon => coupon.used === true)
    let unused_coupons = coupons.filter(coupon => coupon.used === false)

    // console.log(used_coupons)

    let sort_coupon_byDate = getDaysAgoData(used_coupons, 30)

    let group_by_companyRef = groupByKey(sort_coupon_byDate, 'companyRef')

    // console.log('group_by_companyRef: ', group_by_companyRef)

    // console.log(fill_date_gaps(group_by_companyRef))
    setDatasets(fill_date_gaps(group_by_companyRef, customers))

    setOldest_coupon_group(groupByKeys(coupons))

    setCustomer_ramain_group(groupByKeys_customer_remain(unused_coupons))

    let total = unused_coupons.reduce((total, coupon) => {
      return total += coupon.amount
    }, 0)

    setTotalamount(total)
    console.log(total)

  }, [])



  // useEffect(() => {

  //   const sdk = new ChartsEmbedSDK({
  //     baseUrl: "https://charts.mongodb.com/charts-little-tank-jnblp",
  //   });
  //   const chart = sdk.createChart({
  //     chartId: "b91605a3-b18c-4782-a755-bb0d6ae0cc27",
  //     width: 600,
  //     height: 220,
  //     theme: "dark",
  //   });

  //   const couponsRemain = sdk.createChart({
  //     chartId: "eea67d55-e0a7-4cc7-9eba-77cc25a48a7b",
  //     width: 630,
  //     height: 380,
  //     theme: "dark",
  //   });

  //   const lineChart = sdk.createChart({
  //     chartId: "4c2a3639-147b-4532-b6a0-321ab9eec6fb",
  //     width: 600,
  //     height: 390,
  //     theme: "dark",
  //   });

  //   const oldestCoupon = sdk.createChart({
  //     chartId: "9188d9fb-81e8-49f2-b939-d724888136e7",
  //     width: 630,
  //     height: 390,
  //     theme: "dark",
  //   });

  //   chart
  //     .render(document.getElementById("chart"))
  //     .catch(() => window.alert("Chart failed to initialise"));

  //   couponsRemain
  //     .render(document.getElementById("chart2"))
  //     .catch(() => window.alert("Chart failed to initialise"));

  //   lineChart
  //     .render(document.getElementById("chart3"))
  //     .catch(() => window.alert("Chart failed to initialise"));

  //   oldestCoupon
  //     .render(document.getElementById("chart4"))
  //     .catch(() => window.alert("Chart failed to initialise"));

  // }, []);

  return (
    <GridContainer style={{margin: 10}}>
      {/* <span>
        <Box className="left" id="chart3" />
        <Box className="left" id="chart4" />
      </span>
      <span>
        <Box className="left" id="chart" />
        <Box className="left" id="chart2" />
      </span> */}
      {/* test */}

      <Box className={classes.paper_lineChart}>
        <p style={{textDecoration: 'underline'}}>ยอดการใช้คูปองรายวัน</p>
        <Line
          data={{
            labels: labelDate,
            datasets: datasets
          }}
          width={700}
          height={200}
          options={{ maintainAspectRatio: false }}
        />
      </Box>

      <Box className={classes.paper_totalAmount}>
        <p style={{textDecoration: 'underline'}}>ยอดเงินคูปองที่ยังไม่ได้ใช้ทั้งหมด</p>
        <h1>{totalamount}</h1>
      </Box>

          
      <Box className={classes.paper} style={{ height: 300, width: "43%" }}>
        <p style={{textDecoration: 'underline'}}>คูปองอายุเก่าสุด</p>
        <DataGrid 
          rows={oldest_coupon_group}
          columns={oldest_coupon_group_columns}
          hideFooterPagination={true}
        />   
      </Box>

      <Box className={classes.paper} style={{ height: 300, width: "23%" }}>
        <p style={{textDecoration: 'underline'}}>ยอดเงินคูปองที่ยังไม่ได้ใช้ต่อลูกค้า</p>
        <DataGrid 
          rows={customer_ramain_group}
          columns={customer_remain_columns}
          hideFooterPagination={true}
        />   
      </Box>
      
    </GridContainer>
  );
}

export default Dashboard;
