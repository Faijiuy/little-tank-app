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

    // const { db } = await connectToDatabase();
    // let doc = await db.collection("password").insertOne(
      
    //   {
        
    //     password: password
        
    //   },
    //   // callback
    //   (err, result) => {
    //     if (err) {
    //       console.log("Update Error", err);
    //       res.json(err);
    //     } else {
    //     //   console.log("Newly Updated");
    //       res.json({
    //         message: "Password Update",
    //         data: data,
    //       });
    //     }
    //   }
    // ); // if update non-existing record, insert instead.
  }
}