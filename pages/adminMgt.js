import React, {useState} from "react";
import randomString from '@smakss/random-string';
import { connectToDatabase } from "../util/mongodb";
import { DataGrid } from '@material-ui/data-grid';


// layout for this page
import Admin from "layouts/Admin.js";
import { set } from "react-hook-form";


export async function getServerSideProps() {
    const { db } = await connectToDatabase();
  
    const admins = await db
      .collection("admin")
      .find()
      .sort({})
      .limit(20)
      .toArray();
  
    return {
      props: {
        admin: JSON.parse(JSON.stringify(admins)),
      },
    };
  }

  const columns = [
    { field: 'username', headerName: 'ชื่อผู้ใช้', width: 180 },
    { field: 'status', headerName: 'สถานะ', width: 180},
    {
      field: 'userId',
      headerName: 'User ID',
      width: 180,
    },
    {
      field: 'groupId',
      headerName: 'groupID',
      width: 220,
    },
    
  ];

  const rowAdmin = (props) => {
    let row = []
    props.map((admin, index) =>{
      row.push({
        id: index,
        username: admin.username,
        status: admin.status,
        userId: admin.userId,
        groupId: admin.groupId
  
      })
    })
  
    return row
  }

  
function AdminMgt({admin : admins}) {

    const [randomState, setRandomState] = useState(false)
    const [password, setPassword] = useState()

    const pass = new Promise(function(resolve, reject){
        let str = randomString(10)
        resolve(str) // ถ้าได้ค่า str resolve จะทำงาน
    })

    const handleClick = () =>{
        setRandomState(true)

        pass.then(function(done){
            setPassword(done)

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
            body: JSON.stringify(done), // body data type must match "Content-Type" header
          })
        })
}
  

  return (
    <div>
      <button onClick={() => handleClick()}>รับ password</button>
      {randomState ? password : null}

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rowAdmin(admins)}
          columns={columns}
          // checkboxSelection={handleSelectRow}
          // icons={EditIcon}
          
        />
      </div>
      
      
    </div>
  );
}

AdminMgt.layout = Admin;

export default AdminMgt;