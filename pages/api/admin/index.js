import { connectToDatabase } from "../../../util/mongodb";

export default async (req, res) => {
  if (req.method === "PUT") {
    let data = req.body;

    //   // จะได้ objectID ถ้าใช้โค้ดล่าง อันบนเหมือนจะสร้าง _id เองได้
    let { username, userId, status, groupId } = data;

    console.log("DATA ====> ", data);

    // let _id = ObjectID(data._id);

    const { db } = await connectToDatabase();

    let doc = await db.collection("admin").find({ userId: userId }).toArray();

    if(doc[0].groupId.some(id => id == groupId)){
      await db.collection("admin").updateOne(
        { userId: userId },
        { $set: {
          username: username,
          userId: userId,
          status: status,
        },      
       },
        {
          new: true,
          runValidators: true,
          upsert: true,
        },
  
        // callback
        (err, result) => {
          if (err) {
            console.log("Update Error", err);
            res.json(err);
          } else {
            //   console.log("Newly Updated");
            res.json({
              message: "Password Update",
              data: data,
            });
          }
        }
      ); // if update non-existing record, insert instead.
      
      
    } else {
      await db.collection("admin").updateOne(
        { userId: userId },
        { $set: {
          username: username,
          userId: userId,
          status: status,
        },
          $push: {groupId : groupId}
       },
        {
          new: true,
          runValidators: true,
          upsert: true,
        },
  
        // callback
        (err, result) => {
          if (err) {
            console.log("Update Error", err);
            res.json(err);
          } else {
            //   console.log("Newly Updated");
            res.json({
              message: "Password Update",
              data: data,
            });
          }
        }
      ); // if update non-existing record, insert instead.

    }

    res.status(200);

  } else if (req.method === "GET") {
    const { db } = await connectToDatabase();
    const admin = await db
      .collection("admin")
      .find({})
      .sort({})
      .limit(0)
      .toArray();
    res.json(admin);
  }
};
