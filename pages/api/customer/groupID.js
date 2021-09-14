// import { ObjectID } from "mongodb";
// import { ObjectId } from 'bson';
// import { ObjectId} from "bson";
import { ObjectId } from "bson";
import { connectToDatabase } from "../../../util/mongodb";

export default async (req, res) => {
  // console.log("item API", req);
  console.log("item API method ++++++ " + req.method);

  if (req.method === "PUT") {
    let data = req.body;

    //   // จะได้ objectID ถ้าใช้โค้ดล่าง อันบนเหมือนจะสร้าง _id เองได้
    let {
      _id,
      company,
      owner,
      owner_tel,
      owner_email,
      contact_name,
      contact_tel,
      contact_email,
      address,
      groupID,
    } = data;

    // let _id = ObjectId(data._id)
    // delete data._id

    console.log(data);
    // console.log(data)
    const { db } = await connectToDatabase();

    await db.collection("customer").updateOne(
      { _id: ObjectId(_id) },
      {
        // _id: ObjectId(_id)
        // _id: _id
        $set: {
        //   company: company,
        //   owner: owner,
        //   owner_tel: owner_tel,
        //   owner_email: owner_email,
        //   contact_name: contact_name,
        //   contact_tel: contact_tel,
        //   contact_email: contact_email,
        //   address: address,
          groupID: groupID,
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
            message: "Customer added",
            _id: result.insertedId,
          });
        }
      }
    );
  } 
  // else if (req.method === "GET") {
  //   const { db } = await connectToDatabase();
  //   const customer = await db
  //     .collection("customer")
  //     .find({})
  //     .sort({})
  //     .limit(0)
  //     .toArray();
  //   res.json(customer);
  // }
};
