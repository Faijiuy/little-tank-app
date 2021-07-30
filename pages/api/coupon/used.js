import { ObjectID } from "mongodb";
// import { ObjectId } from 'bson';
// import { ObjectId} from "bson";
import { connectToDatabase } from "../../../util/mongodb";

export default async (req, res) => {
  // console.log("item API", req);
  console.log("item API method ++++++ " + req.method);

  if (req.method === "PUT") {
    console.log("UPDATE", req.body);
    let data = req.body;

    //   // จะได้ objectID ถ้าใช้โค้ดล่าง อันบนเหมือนจะสร้าง _id เองได้
    let {
      _id,
      code,
      companyRef,
      generated,
      amount,
      runningNo,
      used,
      usedDateTime,
      recordedBy: { userID, name },
    } = data;

    console.log("DATA ====> ", data)

    let id = ObjectID(data._id);

    const { db } = await connectToDatabase();
    let doc = await db.collection("coupons").updateOne(
      {  _id: id},
      {
        $set: {
          used: data.used,
          usedDateTime: data.usedDateTime,
          recordedBy: { userID: data.recordedBy.userID, name: data.recordedBy.name },
        },
      },
      // callback
      (err, result) => {
        if (err) {
          console.log("Update Error", err);
          res.json(err);
        } else {
          console.log("Newly Updated");
          // res.json({
          //   message: "Coupon Update",
          //   data: data,
          // });
        }
      }
    ); // if update non-existing record, insert instead.
  } else if(req.method === 'GET'){
    const { db } = await connectToDatabase();
    const coupon = await db
      .collection("coupons")
      .find({})
      .sort({})
      .limit(0)
      .toArray();
    res.json(coupon);
  }
};
