import Admin from "layouts/Admin.js";
import { DataGrid } from "@material-ui/data-grid";
import SearchBar from 'material-ui-search-bar';
import { makeStyles } from "@material-ui/core/styles";

import TextField from '@material-ui/core/TextField'

import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';

import { connectToDatabase } from "../../util/mongodb";
import { useContext, useEffect, useState } from "react";

import AuthContext from '../../stores/authContext'

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";


export async function getServerSideProps() {
  const { db } = await connectToDatabase();

  const customers = await db.collection("customer").find().sort({}).toArray();

  const coupons = await db.collection("coupons").find().sort({}).toArray();

  const users = await db.collection("user").find().sort({}).toArray();

  return {
    props: {
      customer: JSON.parse(JSON.stringify(customers)),
      coupon: JSON.parse(JSON.stringify(coupons)),
      user: JSON.parse(JSON.stringify(users)),
    },
  };
}

const useStyles = makeStyles((theme) => ({
    root: {
      "& .super-app-theme--header": {
        backgroundColor: "rgba(255, 7, 0, 0.55)",
      },
    },
    paper: {
      position: "absolute",
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      maxHeight: 500,
      overflow: "auto",
    },
  }));

const boxStyle = {
  padding: 30,
  margin: "50px",
};

const columns = [
    {
      field: "id",
      headerClassName: "super-app-theme--header",
      headerName: "ID",
      width: 250,
    //   editable: true,
    },
    {
      field: "companyRef",
      headerClassName: "super-app-theme--header",
      headerName: "บริษัท",
      width: 180,
    //   editable: true,
    },
    {
      field: "amount",
      headerClassName: "super-app-theme--header",
      headerName: "ราคา",
      width: 120,
    //   editable: true,
    },
    {
      field: "generatedDate",
      headerClassName: "super-app-theme--header",
      headerName: "วันที่ผลิต",
      width: 130,
    //   editable: true,
    },

    {
      field: "runningNo",
      headerClassName: "super-app-theme--header",
      headerName: "ลำดับที่",
      width: 120,

      
      
    },
    {
      field: "generatedBy",
      headerClassName: "super-app-theme--header",
      headerName: "สร้างโดย",
      width: 150,

      
      
  },
    {
        field: "used",
        headerClassName: "super-app-theme--header",
        headerName: "สถานะ",
        width: 120,

        
        
    },
    {
        field: "usedDateTime",
        headerClassName: "super-app-theme--header",
        headerName: "วันที่ถูกใช้",
        width: 220,

    
    
    },
  ];

function groupByKey(array, key) {
    return array.reduce((hash, obj) => {
        if (obj[key] === undefined) return hash;
        return Object.assign(hash, {
        [obj[key]]: (hash[obj[key]] || []).concat(obj),
        });
    }, {});
}

function CouponList({ customer: customers, coupon: coupons, user: users }) {

    const hello = useContext(AuthContext)
    const classes = useStyles();

    // console.log(hello)

    const [rows, setRows] = useState([])
    const [id, setId] = useState("")
    const [company, setCompany] = useState("");
    const [type, setType] = useState("");
    const [typeList, setTypeList] = useState([]);
  
    const [selectedDate, setSelectedDate] = useState("");
    const [status, setStatus] = useState("");

    const [user, setUser] = useState("")

    

    useEffect(() => {
        let couponsOfCompany = coupons.filter(
          (coupon) => coupon.companyRef === company._id
        );
        let types = groupByKey(couponsOfCompany, "amount");
    
        setTypeList(Object.keys(types));
      }, [company]);


    useEffect(() => {
        
        let init_rows = []

        let filtered_coupons = coupons.filter(coupon => (id  ? coupon._id.includes(id) : true) && 
                                                        (company  ? coupon.companyRef === company._id : true) && 
                                                        (type  ? coupon.amount === Number(type) : true) && 
                                                        (selectedDate  ? coupon.generatedDate.includes(selectedDate) : true) &&
                                                        (status !== "" ? coupon.used === status : true) && 
                                                        (user ? coupon.generatedBy === user : true))
        
        filtered_coupons.map(coupon => {
            let obj = {id: coupon._id, companyRef: "", amount: coupon.amount, generatedDate: coupon.generatedDate,
                runningNo: coupon.runningNo, used: coupon.used, usedDateTime: coupon.usedDateTime, generatedBy: coupon.generatedBy}

            customers.map(customer => {
                if(customer._id === coupon.companyRef){
                    obj.companyRef = customer.company
                }
            })

            init_rows.push(obj)
        })

        setRows(init_rows)
        
    }, [id, company, type, selectedDate ,status, user])

    const handleSearch = (e) => {
        setId(e.target.value)
    }
   
    const handleChangeCompany = (event) => {
        setCompany(event.target.value);
    };

    const handleChangeType = (event) => {
        setType(event.target.value);
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value)
    };

    const handleChangeStatus = (e) => {
        console.log(e.target.value)
        setStatus(e.target.value)
    };

    const handleChangeUser = (event) => {
      setUser(event.target.value);
  };

    return (
    <div>
        <br />
        <Paper
        component="form"
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
        >
        <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="พิมพ์รหัส id เพื่อค้นหา"
            inputProps={{ 'aria-label': 'search google maps' }}
            onChange={(e) => handleSearch(e)}
        />
        <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
        </IconButton>
        
        </Paper>
        <FormControl style={{width: 120, marginRight: 10}}>
            <InputLabel id="demo-simple-select-outlined-label">
              ชื่อลูกค้า
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={company ? company : ""}
              onChange={handleChangeCompany}
              label="Company"
            >
              {customers.map((company) => {
                return (
                  <MenuItem key={company.company} value={company}>
                    {company.company}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <FormControl style={{width: 120, marginRight: 10}}>
            <InputLabel id="demo-simple-select-outlined-label">ราคา</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={type ? type : ""}
              onChange={handleChangeType}
              label="Company"
            >
              {typeList.map((type) => {
                return (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <FormControl style={{width: 120, marginRight: 10}}>
            <InputLabel id="demo-simple-select-outlined-label">สถานะ</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={status !== "" ? status : ""}
              onChange={handleChangeStatus}
              label="Company"
            >
              
            <MenuItem key={false} value={false}>
            ยังไม่ถูกใช้
            </MenuItem>
            <MenuItem key={true} value={true}>
            ถูกใช้แล้ว
            </MenuItem>
            <MenuItem key={"missing"} value={"missing"}>
            หาย
            </MenuItem>
                
            </Select>
          </FormControl>

          <FormControl style={{width: 200, marginRight: 10}}>
            <TextField label="วัน/เดือน/ปี" value={selectedDate} onChange={(e) => handleDateChange(e)}/>

          </FormControl>

          <FormControl style={{width: 120, marginRight: 10}}>
            <InputLabel id="demo-simple-select-outlined-label">
              ถูกสร้างโดย
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={user ? user : ""}
              onChange={handleChangeUser}
              label="ชื่อผู้สร้าง"
            >
              {users.map((user) => {
                return (
                  <MenuItem key={user.username} value={user.username}>
                    {user.username}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          

        <div style={{ height: 500, width: "100%" }} className={classes.root}>
        <br />
            <DataGrid
              rows={rows}
              columns={columns}
            //   hideFooterPagination={true}
            />
          </div>
    </div>);
}

CouponList.layout = Admin;


export default CouponList;
