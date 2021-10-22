import { ObjectId } from "bson";
import { connectToDatabase } from "../../../util/mongodb";

export default async (req, res) => {
  console.log("item API method ++++++ " + req.method);

  if (req.method === "PUT") {
    let data = req.body;

    let {
      _id,
      groupID,
    } = data;

    const { db } = await connectToDatabase();

    await db.collection("customer").updateOne(
      { _id: ObjectId(_id) },
      {
        $set: {
          groupID: groupID,
        },
      },
      // callback
      (err, result) => {
        if (err) {
          console.log(err);
          res.json(err);
        } else {
          res.json({
            message: "Customer added",
            _id: result.insertedId,
          });
        }
      }
    );
  } 
};
