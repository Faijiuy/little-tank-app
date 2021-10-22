import { connectToDatabase } from "../../../util/mongodb";

export default async (req, res) => {
  if (req.method === "PUT") {
    let data = req.body;

    let { username, userId, status, groupId } = data;

    const { db } = await connectToDatabase();

    if(Array.isArray(groupId)){
      await db.collection("admin").updateOne(
        { userId: userId },
        { $set: {
          username: username,
          userId: userId,
          status: status,
          groupId: groupId
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
            res.json({
              message: "Password Update",
              data: data,
            });
          }
        }
      ); // if update non-existing record, insert instead.
    }else{
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
              res.json({
                message: "Password Update",
                data: data,
              });
            }
          }
        ); // if update non-existing record, insert instead.
  
      }

    }


    res.status(200);

  } else if(req.method === "DELETE"){
    let data = req.body;

    let {
      userId,
      
    } = data;

    const { db } = await connectToDatabase();


    await db.collection("admin").deleteOne(
      { userId: userId},

      // callback
      (err, result) => {
        if (err) {
          console.log("Update Error", err);
          res.json(err);
        } else {
          res.json({
            message: "delete complete",
          });
        }
      }
    )

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