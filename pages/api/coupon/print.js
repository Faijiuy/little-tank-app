import { ObjectID } from "mongodb";
// import { ObjectId } from 'bson';
// import { ObjectId} from "bson";
import { connectToDatabase } from "../../../util/mongodb";

export default async (req, res) => {
  // console.log("item API", req);

  if (req.method === "PUT") {
    let data = req.body;

    //   // จะได้ objectID ถ้าใช้โค้ดล่าง อันบนเหมือนจะสร้าง _id เองได้
    let {
      // _id : "60f01e4d606a532bc094b7f2",
        code,
        companyRef,
        generatedDate,
        amount,
        runningNo,
        used,
        usedDateTime,
        recordedBy,
        printed,
    } = data;

    // console.log("DATA ====> ", data)

    // let _id = ObjectID(data._id);

    const { db } = await connectToDatabase();
    let doc = await db.collection("coupons").updateOne(
      { code: code},
      {
        $set: {
          // _id: ObjectId(_id)
          // _id: _id
          // code: data.code,
          // companyRef: data.companyRef,
          // amount: data.amount,
          printed: printed
        },
      },
      // callback
      (err, result) => {
        if (err) {
          console.log("Update Error", err);
          res.json(err);
        } else {
        //   console.log("Newly Updated");
          res.json({
            message: "Coupon Update",
            data: data,
          });
        }
      }
    ); // if update non-existing record, insert instead.
  }
}