import { connectToDatabase } from "../../../util/mongodb";

export default async (req, res) => {

  if (req.method === "PUT") {
    let data = req.body;

    let {
        code,
        printed,

    } = data;

    const { db } = await connectToDatabase();
    let doc = await db.collection("coupons").updateOne(
      { code: code},
      {
        $set: {
          printed: printed
        },
      },
      // callback
      (err, result) => {
        if (err) {
          console.log("Update Error", err);
          res.json(err);
        } else {
          res.json({
            message: "Coupon Update",
          });
        }
      }
    ); // if update non-existing record, insert instead.
  }

}