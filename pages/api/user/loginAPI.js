import { ObjectId } from 'bson';
import { connectToDatabase } from "../../../util/mongodb";

export default async (req, res) => {
   if (req.method === 'PUT'){
    let data = req.body;
    let {
      _id,
      // loginStatus,
      loginTime
    } = data

    const { db } = await connectToDatabase();


    await db.collection("user").updateOne(
      { _id: ObjectId(_id)},
      {
        $set: {
          // loginStatus: loginStatus,
          loginTime: loginTime
        }
      },
      // callback
      (err, result) => {
        if (err) {
          console.log(err);
          res.json(err);
        } else {
          res.json({
            message: data._id,
            data: data
          });
        }
      }
    )
  }
};
