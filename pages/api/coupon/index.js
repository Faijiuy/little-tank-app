import { ObjectID } from "mongodb";
// import { ObjectId } from 'bson';
// import { ObjectId} from "bson";
import { connectToDatabase } from "../../../util/mongodb";

export default async (req, res) => {
  console.log("item API", req);
  console.log("item API method ++++++ " + req.method);

  if (req.method === "POST") {
    console.log("ADDING ", req.body);
    let data = req.body;

    //   // จะได้ objectID ถ้าใช้โค้ดล่าง อันบนเหมือนจะสร้าง _id เองได้
    let {
        code,
        companyRef,
        amount,
        used,
        usedDateTime,
        recordedBy
    } = data;

    const { db } = await connectToDatabase();
    await db.collection("coupons").insertOne(
      {
        // _id: ObjectId(_id)
        // _id: _id
        code: code,
        companyRef: companyRef,
        amount: amount,
        used: used,
        usedDateTime: usedDateTime,
        recordedBy: recordedBy
      },
      // callback
      (err, result) => {
        if (err) {
          console.log(err);
          res.json(err);
        } else {
          console.log("Newly inserted ID", result.insertedId);
          res.json({
            message: "Customer added",
            _id: result.insertedId,
          });
        }
      }
    ); // if update non-existing record, insert instead.
  } else {
    res.json({ message: "Hello, I am not working with GET method" });
  }
};
