import { ObjectId } from 'bson';
import { connectToDatabase } from "../../../util/mongodb";

export default async (req, res) => {
  if (req.method === "GET") {
    const { db } = await connectToDatabase();
    const user = await db
      .collection("user")
      .find({})
      .sort({})
      .limit(20)
      .toArray();
    res.json(user);
  } else if(req.method === 'PUT'){
    let data = req.body;
    let {
      _id,
      username,
      password,
      loginStatus,
      rememberStatus
    } = data

    console.log(data)
    const { db } = await connectToDatabase();


    await db.collection("user").updateOne(
      { _id: ObjectId(_id)},
      {
        // _id: ObjectId(_id)
        // _id: _id
        $set: {
          loginStatus: loginStatus,
          rememberStatus: rememberStatus
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
  } else if (req.method === 'POST'){
    let data = req.body;
    //   // จะได้ objectID ถ้าใช้โค้ดล่าง อันบนเหมือนจะสร้าง _id เองได้
    let {
      username,
      password,
      loginStatus,
      rememberStatus
    } = data;

    const { db } = await connectToDatabase();
    await db.collection("user").insertOne(
      {
        // _id: ObjectId(_id)
        // _id: _id
        username: username,
        password: password,
        loginStatus: loginStatus,
        rememberStatus: rememberStatus
      },
      // callback
      (err, result) => {
        if (err) {
          console.log(err);
          res.json(err);
        } else {
          // console.log("Newly inserted ID", result.insertedId);
          res.json({
            message: "New User added",
            _id: result.insertedId,
          });
        }
      }
    ); // if update non-existing record, insert instead.
  }
};
