import { connectToDatabase } from "../../../util/mongodb";

export default async (req, res) => {

  if (req.method === "POST") {
    let data = req.body;

    //   // จะได้ objectID ถ้าใช้โค้ดล่าง อันบนเหมือนจะสร้าง _id เองได้
    let {
      password
    } = data;

    console.log("DATA ====> ", data)

    // let _id = ObjectID(data._id);

    const { db } = await connectToDatabase();
    let doc = await db.collection("password").insertOne(
      
      {
        
        password: data
        
      },
      // callback
      (err, result) => {
        if (err) {
          console.log("Update Error", err);
          res.json(err);
        } else {
        //   console.log("Newly Updated");
          res.json({
            message: "Password Update",
            data: data,
          });
        }
      }
    ); // if update non-existing record, insert instead.
  }else if(req.method === 'GET'){
    const { db } = await connectToDatabase();
    const password = await db
      .collection("password")
      .find({})
      .sort({})
      .limit(0)
      .toArray();
    res.json(password);
  }else if(req.method === 'DELETE'){
    let data = req.body
    let { password } = data;
    const { db } = await connectToDatabase();
    let doc = await db
      .collection('password')
      .deleteOne({ password: password })
    res.json({ delete: true, message: 'Delete data', data: {} })
  }
}