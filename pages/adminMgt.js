import React, {useState, useEffect} from "react";
import randomString from '@smakss/random-string';
import { connectToDatabase } from "../util/mongodb";
import { DataGrid } from '@material-ui/data-grid';

import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

import { makeStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';




// layout for this page
import Admin from "layouts/Admin.js";
import { FormatColorResetTwoTone } from "@material-ui/icons";


export async function getServerSideProps() {
    const { db } = await connectToDatabase();
  
    const admins = await db
      .collection("admin")
      .find()
      .sort({})
      .limit(20)
      .toArray();

    const customers = await db.collection("customer").find().sort({}).toArray();

  
    return {
      props: {
        admin: JSON.parse(JSON.stringify(admins)),
        customer: JSON.parse(JSON.stringify(customers)),
      },
    };
  }


const useStyles2 = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));  

function AdminMgt({admin : admins, customer: customers}) {
  

    console.log(admins)

    const [randomStateSA, setRandomStateSA] = useState(false)
    const [passwordSA, setPasswordSA] = useState()

    const [password, setPassword] = useState()
    const [status, setStatus] = useState()


    const [randomStateSO, setRandomStateSO] = useState(false)
    const [passwordSO, setPasswordSO] = useState()

    const [randomStateEN, setRandomStateEN] = useState(false)
    const [passwordEN, setPasswordEN] = useState()

    const [company, setCompany] = useState("");
    const [companyError, setCompanyError] = useState(false);

    const [row, setRow] = useState([]);

    useEffect(() => {
      let array = []
      admins.map((admin, index) =>{
        array.push({
          id: index,
          username: admin.username,
          status: admin.status,
          userId: admin.userId,
          groupId: admin.groupId,
          edit: false,
    
        })
      })
      setRow(array)
    }, [])


    const handleChangeCompany = (event) => {
      console.log(company)
      setCompany(event.target.value);
    };

    const handleChangeStatus = (event) => {
      // console.log(company)
      setStatus(event.target.value);
    };


    const classes2 = useStyles2();

    const log = (params) => {
      console.log("params == ", params)
      console.log(company)

      fetch("/api/admin", {
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
        body: JSON.stringify({username: params.row.username,
                              userId: params.row.userId,
                              status: status,
                              groupId : company.groupID}), // body data type must match "Content-Type" header
      }).then(alert(data._id))
    }

    const columns = [
      { field: 'username', headerName: 'ชื่อผู้ใช้', width: 180, editable: true },
      { field: 'status', headerName: 'สถานะ', width: 180, 
        disableClickEventBubbling: true,
        renderCell: function choose(params){
          // console.log(params)
          if(params.row.edit == true){
            return (
              <FormControl variant="outlined" className={classes2.formControl} error={companyError} >
                <InputLabel id="demo-simple-select-outlined-label1">
                  Status
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label1"
                  id="demo-simple-select-outlined"
                  value={status ? status : ""}
                  onChange={handleChangeStatus}
                  label="Status"
                >
                  
                      <MenuItem key="SA" value="SA">SA</MenuItem>
                      <MenuItem key="SO" value="SO">SO</MenuItem>
                      <MenuItem key="EN" value="EN">EN</MenuItem>
                   
                </Select>
              </FormControl>
            );

          }
        }
      },
      {
        field: 'userId',
        headerName: 'User ID',
        width: 180,
        editable: true
      },
      {
        field: 'groupId',
        headerName: 'groupID',
        width: 220,
        disableClickEventBubbling: true,
        renderCell: function choose(params){
          // console.log(params)
          if(params.row.edit == true){
            return (
              <FormControl variant="outlined" className={classes2.formControl} error={companyError} >
                <InputLabel id="demo-simple-select-outlined-label1">
                  Company
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label1"
                  id="demo-simple-select-outlined"
                  value={company ? company : ""}
                  onChange={handleChangeCompany}
                  label="Company"
                >
                  {customers.map((company) => {
                    return (
                      <MenuItem key={company.company} value={company}>{company.company}</MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            );
  
          }
        }
      },
      {
        field: "edit",
        headerName: "Edit",
        // sortable: false,
        width: 130,
        disableClickEventBubbling: true,
        renderCell: function edit(params){
          // console.log(params)
          if(params.row.edit == true){
            return (
              <Button onClick={() => log(params)} variant="contained" color="primary">
                แก้ไข
              </Button>
            );
  
          }
        }
      },
      
    ];

    



    function getPassword(status, num){
      let str = randomString(num)

      if(status == "SA"){
        setPassword(str)
      }else if(status == "SO"){
        setPasswordSO(str)
      }else{
        setPasswordEN(str)
      }

      fetch("/api/admin/password", {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify({password: str,
                              groupId: company.groupID,
                              status: status}), // body data type must match "Content-Type" header
      })

    }
    

    const handleClick = async (value) =>{
      if(company == ""){
          setCompanyError(true)
      }else{
        // let pass = password
        if(value == "SA"){
          getPassword("SA", 10)
          setRandomStateSA(true)
        }else if(value == "SO"){
          getPassword("SO", 11)
          setRandomStateSO(true)
        }else{
          getPassword("EN", 12)
          setRandomStateEN(true)
        }

        
      }
}

    const handleEdit = () => {

      let newArr = []
      row.map((admin, index) =>{
        newArr.push({
          id: index,
          username: admin.username,
          status: admin.status,
          userId: admin.userId,
          groupId: admin.groupId,
          edit: false,
    
        })
      })
      newArr.push({
        id: "index",
        username: "admin.username",
        status: "admin.status",
        userId: "admin.userId",
        groupId: "admin.groupId",
        edit: true,
        // edit: function edit(){
        //     return (
        //       <button>
        //         แก้ไข
        //       </button>
        //     );
        //   }
      })
      setRow(newArr)

      // console.log(row)
      // let newArr = row

      // newArr.push({
      //   id: "index",
      //   username: "admin.username",
      //   status: "admin.status",
      //   userId: "admin.userId",
      //   groupId: "admin.groupId"
      // })

      // setRow(newArr)
      // 
      // console.log("working ", row)
      // setEditState(true)
    }

    const passSO = new Promise(function(resolve, reject){
      let str = randomString(11)
      resolve(str) // ถ้าได้ค่า str resolve จะทำงาน
    })

    const handleClickSO = () =>{

      if(company == ""){
        setCompanyError(true)
      }else{
        console.log(company)
      // setRandomStateSO(true)

      // passSO.then(function(done){
      //     setPasswordSO(done)

      //     fetch("/api/admin/password", {
      //     method: "POST", // *GET, POST, PUT, DELETE, etc.
      //     mode: "cors", // no-cors, *cors, same-origin
      //     cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      //     credentials: "same-origin", // include, *same-origin, omit
      //     headers: {
      //       "Content-Type": "application/json",
      //       // 'Content-Type': 'application/x-www-form-urlencoded',
      //     },
      //     redirect: "follow", // manual, *follow, error
      //     referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      //     body: JSON.stringify({password: done,
      //                           status: "SO"}), // body data type must match "Content-Type" header
      //   })
      // })

      }
    }

    const passEN = new Promise(function(resolve, reject){
      let str = randomString(12)
      resolve(str) // ถ้าได้ค่า str resolve จะทำงาน
  })

  const handleClickEN = () =>{
    if(company == ""){
      setCompanyError(true)
    }else{
      console.log(company)
      // setRandomStateEN(true)

      // passEN.then(function(done){
      //     setPasswordEN(done)

      //     fetch("/api/admin/password", {
      //     method: "POST", // *GET, POST, PUT, DELETE, etc.
      //     mode: "cors", // no-cors, *cors, same-origin
      //     cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      //     credentials: "same-origin", // include, *same-origin, omit
      //     headers: {
      //       "Content-Type": "application/json",
      //       // 'Content-Type': 'application/x-www-form-urlencoded',
      //     },
      //     redirect: "follow", // manual, *follow, error
      //     referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      //     body: JSON.stringify({password: done,
      //                           status: "EN"}), // body data type must match "Content-Type" header
      //   })
      // })

    }
}

  

  return (
    <div>
      <div>
        <FormControl variant="outlined" className={classes2.formControl} error={companyError} >
          <InputLabel id="demo-simple-select-outlined-label1">
            Company
          </InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label1"
            id="demo-simple-select-outlined"
            value={company ? company : ""}
            onChange={handleChangeCompany}
            label="Company"
          >
            {customers.map((company) => {
              return (
                <MenuItem key={company.company} value={company}>{company.company}</MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </div>


      <button onClick={() => handleClick("SA")}>รับ password SA</button>
      {randomStateSA ? password : null}

    <div>
      <button onClick={() => handleClick("SO")}>รับ password SO</button>
      {randomStateSO ? passwordSO : null}
    </div>

    <div>
      <button onClick={() => handleClick("EN")}>รับ password EN</button>
      {randomStateEN ? passwordEN : null}
    </div>


      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={row}
          columns={columns}
          // checkboxSelection={handleSelectRow}
          // icons={EditIcon}
          
        />
      </div>
      <button onClick={() => handleEdit()}>เพิ่ม admin</button>
      
    </div>
  );
}

AdminMgt.layout = Admin;

export default AdminMgt;
