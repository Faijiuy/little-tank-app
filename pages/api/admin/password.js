import { connectToDatabase } from "../../../util/mongodb";

export default async (req, res) => {

  if (req.method === "POST") {
    let data = req.body;

    let {
      password,
      groupId,
      status
    } = data;

    const { db } = await connectToDatabase();
    let doc = await db.collection("password").insertOne(
      
      {
        
        password: password,
        groupId: groupId,
        status: status
        
      },
      // callback
      (err, result) => {
        if (err) {
          console.log("Update Error", err);
          res.json(err);
        } else {
          console.log("Newly Updated");
        }
      }
      
    ); // if update non-existing record, insert instead.
    res.status(200).json({});

  }else if(req.method === 'GET'){
    const { db } = await connectToDatabase();
    const password = await db
      .collection("password")
      .find({})
      .sort({})
      .limit(0)
      .toArray();
    res.json(password);
  }else if(req.method === 'DELETE'){
    let data = req.body
    let { password } = data;
    const { db } = await connectToDatabase();
    let doc = await db
      .collection('password')
      .deleteOne({ password: password })
    res.json({ delete: true, message: 'Delete data', data: {} })
  }

}