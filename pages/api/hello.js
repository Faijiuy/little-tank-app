// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

async function handler() {

  let customer = await fetch(process.env.API + "/toDB", {
                  method: "GET", // *GET, POST, PUT, DELETE, etc.
                  }).then((response) => response.json())
                  .then((data) => data.filter(customer => customer.groupID === "sgfgdhgregt"))

  // let adminList = await fetch(process.env.API + "/admin", {
  //                 method: "GET", // *GET, POST, PUT, DELETE, etc.
  //                 }).then((response) => response.json())
  //                 .then((data) => data.filter(admin => admin.userId === "U9107b671ef33307935ca0e7d2efbacf7" 
  //                 && admin.groupId.includes("C9113664fae478241ed5a8690e2ce0202")))

  // adminList.map(admin => {
  //   if(id === admin.userId && admin.groupId.includes(GID)){
  //   // console.log("admin status ",admin.status)
  //     adminInfo.status = admin.status
  //     adminInfo.username = admin.username
  //   }
  // })
  // res.status(200).json({ name: 'John Doe' })

  if(customer[0] === undefined){
    console.log("surpriseee")
  }else{
    console.log(customer)

  }
}


handler()