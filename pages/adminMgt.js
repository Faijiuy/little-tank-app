import React, { useState, useEffect, createContext } from "react";
import { useRouter } from "next/router";

import randomString from "@smakss/random-string";
import { connectToDatabase } from "../util/mongodb";
import { DataGrid } from "@material-ui/data-grid";

import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

// layout for this page
import Admin from "layouts/Admin.js";
import NewAdmin_Form from "../components/adminMgt/modal";

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

const useStyles2 = makeStyles({
  formControl: {
    // margin: theme.spacing(1),
    minWidth: 100,
  },
  selectEmpty: {
    // marginTop: theme.spacing(2),
  },
  root: {
    '& .super-app-theme--header': {
      backgroundColor: 'rgba(255, 7, 0, 0.55)',
    },
  },
});

function groupByKey(array, key) {
  return array.reduce((hash, obj) => {
    if (obj[key] === undefined) return hash;
    return Object.assign(hash, {
      [obj[key]]: (hash[obj[key]] || []).concat(obj),
    });
  }, {});
}

const AdminContext = React.createContext()

function AdminMgt({ admin: admins, customer: customers }) {
  console.log(admins);

  const [randomStateSA, setRandomStateSA] = useState(false);

  const [password, setPassword] = useState();
  const [status, setStatus] = useState();

  const [randomStateSO, setRandomStateSO] = useState(false);
  const [passwordSO, setPasswordSO] = useState();

  const [randomStateEN, setRandomStateEN] = useState(false);
  const [passwordEN, setPasswordEN] = useState();

  const [company, setCompany] = useState("");
  const [companyError, setCompanyError] = useState(false);

  const [row, setRow] = useState([]);

  const group = groupByKey(customers, "groupID");

  const router = useRouter();

  useEffect(() => {
    let array = [];
    admins.map((admin, index) => {
      array.push({
        id: index,
        username: admin.username,
        status: admin.status,
        userId: admin.userId,
        groupId: admin.groupId.map((groupid) =>
          Object.keys(group).includes(groupid)
            ? group[groupid.toString()][0].company
            : null
        ),
        edit: false,
      });
    });
    setRow(array);
  }, []);

  const handleChangeCompany = (event) => {
    console.log(company);
    setCompany(event.target.value);
  };

  const handleChangeStatus = (event) => {
    // console.log(company)
    setStatus(event.target.value);
  };

  const classes2 = useStyles2();

  const log = (params) => {
    console.log("params == ", params);
    console.log(company);

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
      body: JSON.stringify({
        username: params.row.username,
        userId: params.row.userId,
        status: status,
        groupId: company.groupID,
      }), // body data type must match "Content-Type" header
    })
      .then(alert("ลงทะเบียนสำเร็จ"))
      .then(router.reload());
  };

  const columns = [
    { field: "username", headerClassName: 'super-app-theme--header', headerName: "ชื่อผู้ใช้", width: 150, editable: true },
    {
      field: "status",
      headerName: "สถานะ",
      headerClassName: 'super-app-theme--header',
      width: 200,
      disableClickEventBubbling: true,
      renderCell: function choose(params) {
        // console.log(params)
        if (params.row.edit == true) {
          return (
            <FormControl
              className={classes2.formControl}
              error={companyError}
            >
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
                <MenuItem key="แคชเชียร์" value="แคชเชียร์">
                  แคชเชียร์
                </MenuItem>
                <MenuItem
                  key="เจ้าของ หรือ ผู้ช่วย"
                  value="เจ้าของ หรือ ผู้ช่วย"
                >
                  เจ้าของ หรือ ผู้ช่วย
                </MenuItem>
                <MenuItem key="ลูกค้า" value="ลูกค้า">
                  ลูกค้า
                </MenuItem>
              </Select>
            </FormControl>
          );
        }
      },
    },
    {
      field: "userId",
      headerName: "User ID",
      headerClassName: 'super-app-theme--header',
      width: 180,
      editable: true,
    },
    {
      field: "groupId",
      headerName: "group",
      headerClassName: 'super-app-theme--header',
      width: 220,
      disableClickEventBubbling: true,
      renderCell: function choose(params) {
        // console.log(params)
        if (params.row.edit == true) {
          return (
            <FormControl
              className={classes2.formControl}
              error={companyError}
            >
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
                    <MenuItem key={company.company} value={company}>
                      {company.company}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          );
        }
      },
    },
    {
      field: "edit",
      headerName: "Edit",
      headerClassName: 'super-app-theme--header',
      // sortable: false,
      width: 130,
      // hide: true,
      disableClickEventBubbling: true,
      renderCell: function edit(params) {
        // console.log(params)
        if (params.row.edit == true) {
          return (
            <Button
              onClick={() => log(params)}
              variant="contained"
              color="primary"
            >
              ยืนยัน
            </Button>
          );
        }else{
          return (<div></div>)
        }
      },
    },
  ];

  function getPassword(status, num) {
    let str = randomString(num);

    if (status == "แคชเชียร์") {
      setPassword(str);
    } else if (status == "เจ้าของ หรือ ผู้ช่วย") {
      setPasswordSO(str);
    } else {
      setPasswordEN(str);
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
      body: JSON.stringify({
        password: str,
        groupId: company.groupID,
        status: status,
      }), // body data type must match "Content-Type" header
    });
  }

  const handleClick = async (value) => {
    if (company == "") {
      setCompanyError(true);
    } else {
      // let pass = password
      if (value == "SA") {
        getPassword("แคชเชียร์", 10);
        setRandomStateSA(true);
      } else if (value == "SO") {
        getPassword("เจ้าของ หรือ ผู้ช่วย", 11);
        setRandomStateSO(true);
      } else {
        getPassword("ลูกค้า", 12);
        setRandomStateEN(true);
      }
    }
  };

  const handleAddRow = () => {
    let newArr = [];
    row.map((admin, index) => {
      newArr.push({
        id: index,
        username: admin.username,
        status: admin.status,
        userId: admin.userId,
        groupId: admin.groupId,
        edit: false,
      });
    });
    newArr.push({
      id: "index",
      username: "",
      status: "admin.status",
      userId: "",
      groupId: "admin.groupId",
      edit: true,
    });
    setRow(newArr);
  };

  return (
    <div>
      <div>
        <FormControl
          variant="outlined"
          className={classes2.formControl}
          error={companyError}
        >
          <InputLabel id="demo-simple-select-outlined-label1">
            ชื่อลูกค้า
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
                <MenuItem key={company.company} value={company}>
                  {company.company}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </div>

      <Button onClick={() => handleClick("SA")} variant="contained">
        รับ password ให้แคชเชียร์
      </Button>
      {randomStateSA ? password : null}

      <div>
        <Button onClick={() => handleClick("SO")} variant="contained">
          รับ password ให้เจ้าของ หรือ ผู้ช่วย
        </Button>
        {randomStateSO ? passwordSO : null}
      </div>

      <div>
        <Button onClick={() => handleClick("EN")} variant="contained">
          รับ password ให้ลูกค้า
        </Button>
        {randomStateEN ? passwordEN : null}
      </div>

      <div style={{ height: 400, width: "72%" }} className={classes2.root}>
        <DataGrid
          rows={row}
          columns={columns}
          hideFooterPagination={true}

          // checkboxSelection={handleSelectRow}
          // icons={EditIcon}
        />
      </div>

      {/* <AdminContext.Provider value={{}}> */}
        <NewAdmin_Form />

      {/* </AdminContext.Provider> */}

      <Button
        onClick={() => handleAddRow()}
        color="primary"
        variant="contained"
      >
        เพิ่ม admin
      </Button>
    </div>
  );
}

AdminMgt.layout = Admin;

export { AdminContext }

export default AdminMgt;
