import { connectToDatabase } from "../../../util/mongodb";

export default async (req, res) => {
  console.log("item API method ++++++ " + req.method);

  if (req.method === "PUT") {
    let data = req.body;

    let {
      code,
      used,
      usedDateTime,
      recordedBy: { userID, name },
    } = data;

    const { db } = await connectToDatabase();
    let doc = await db.collection("coupons").updateOne(
      {  code: code},
      {
        $set: {
          used: used,
          usedDateTime: usedDateTime,
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
          res.json({
            message: "Coupon Update",
            data: data,
          });
        }
      }
    ); // if update non-existing record, insert instead.
    res.status(200).json({});

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
