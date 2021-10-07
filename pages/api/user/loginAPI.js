import { ObjectId } from 'bson';
import { connectToDatabase } from "../../../util/mongodb";

export default async (req, res) => {
   if (req.method === 'PUT'){
    let data = req.body;
    let {
      _id,
      username,
      id,
      password,
      loginStatus,
      loginTime
      // rememberStatus
    } = data

    console.log("this is data: ", data)
    const { db } = await connectToDatabase();


    await db.collection("user").updateOne(
      { _id: ObjectId(_id)},
      {
        // _id: ObjectId(_id)
        // _id: _id
        $set: {
          loginStatus: loginStatus,
          loginTime: loginTime
          // rememberStatus: rememberStatus
        }
      },
      // callback
      (err, result) => {
        if (err) {
          console.log(err);
          res.json(err);
        } else {
          // console.log("Newly inserted ID", result.insertedId);
          res.json({
            message: data._id,
            data: data
          });
        }
      }
    )
  }
};
