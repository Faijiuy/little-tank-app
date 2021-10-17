// import { ObjectID } from "mongodb";
// import { ObjectId } from 'bson';
// import { ObjectId} from "bson";
import { ObjectId } from "bson";
import { connectToDatabase } from "../../../util/mongodb";

export default async (req, res) => {
  // console.log("item API", req);
  console.log("item API method ++++++ " + req.method);

  if (req.method === "POST") {
    let data = req.body;

    //   // จะได้ objectID ถ้าใช้โค้ดล่าง อันบนเหมือนจะสร้าง _id เองได้
    let { username, id, password, loginStatus, status} = data;

    const { db } = await connectToDatabase();
    await db.collection("user").insertOne(
      {
        // _id: ObjectId(_id)
        // _id: _id
        id: id,
        username: username,
        password: password,
        loginStatus: loginStatus,
        status: status
      },
      // callback
      (err, result) => {
        if (err) {
          console.log(err);
          res.json(err);
        } else {
          // console.log("Newly inserted ID", result.insertedId);
          res.json({
            message: "User added",
            _id: result.insertedId,
          });
        }
      }
    ); // if update non-existing record, insert instead.
  } else if (req.method === "PUT") {
    let data = req.body;

    //   // จะได้ objectID ถ้าใช้โค้ดล่าง อันบนเหมือนจะสร้าง _id เองได้
    let {
      _id,
      username,
      id,
      password,
      loginStatus,
      status
    } = data;

    // let _id = ObjectId(data._id)
    // delete data._id

    console.log(data);
    // console.log(data)
    const { db } = await connectToDatabase();

    await db.collection("user").updateOne(
      { _id: ObjectId(_id) },
      {
        $set: {
            username: username,
            id: id,
            password: password,
            status: status
        },
      },
      // callback
      (err, result) => {
        if (err) {
          console.log(err);
          res.json(err);
        } else {
          // console.log("Newly inserted ID", result.insertedId);
          res.json({
            message: "User Information Updated",
            _id: result.insertedId,
          });
        }
      }
    );
  } else if (req.method === "DELETE") {
    let data = req.body;

    //   // จะได้ objectID ถ้าใช้โค้ดล่าง อันบนเหมือนจะสร้าง _id เองได้
    let { _id } = data;

    // let _id = ObjectId(data._id)
    // delete data._id

    console.log("data ==> ", data);
    // console.log(data)
    const { db } = await connectToDatabase();

    await db.collection("user").deleteOne(
      { _id: ObjectId(_id) },
      // { company: company},

      // callback
      (err, result) => {
        if (err) {
          console.log(err);
          res.json(err);
        } else {
          // console.log("Newly inserted ID", result.insertedId);
          res.json({
            message: "delete complete",
          });
        }
      }
    );
  } else if (req.method === "GET") {
    const { db } = await connectToDatabase();
    const user = await db
      .collection("user")
      .find({})
      .sort({})
      .limit(0)
      .toArray();
    res.json(user);
  }
};
