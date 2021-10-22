import { ObjectId } from 'bson';
import { connectToDatabase } from "../../../util/mongodb";

export default async (req, res) => {
  console.log("item API method ++++++ " + req.method);

  if (req.method === "POST") {
    let data = req.body;

    let {
      company,
      owner,
      owner_tel,
      owner_email,
      contact_name,
      contact_tel,
      contact_email,
      address,
      TIN,
      groupID,
      licensePlate
    } = data;

    const { db } = await connectToDatabase();
    await db.collection("customer").insertOne(
      {
        company: company,
        owner: owner,
        owner_tel: owner_tel,
        owner_email: owner_email,
        contact_name: contact_name,
        contact_tel: contact_tel,
        contact_email: contact_email,
        address: address,
        TIN: TIN,
        groupID: groupID,
        licensePlate: licensePlate
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
    ); // if update non-existing record, insert instead.
  } else if(req.method === 'PUT'){
    let data = req.body;

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
      TIN,
      groupID,
      licensePlate
    } = data;

    const { db } = await connectToDatabase();


    await db.collection("customer").updateOne(
      { _id: ObjectId(_id)},
      {
        $set: {
          company: company,
          owner: owner,
          owner_tel: owner_tel,
          owner_email: owner_email,
          contact_name: contact_name,
          contact_tel: contact_tel,
          contact_email: contact_email,
          address: address,
          TIN: TIN,
          groupID: groupID,
          licensePlate: licensePlate
        }
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
    )
  } else if(req.method === 'DELETE'){
    let data = req.body;

    let {
      _id,
      
    } = data;

    const { db } = await connectToDatabase();

    await db.collection("customer").deleteOne(
      { _id: ObjectId(_id)},

      // callback
      (err, result) => {
        if (err) {
          console.log(err);
          res.json(err);
        } else {
          res.json({
            message: "customer delete",
          });
        }
      }
    )
  }else if(req.method === 'GET'){
    const { db } = await connectToDatabase();
    const customer = await db
      .collection("customer")
      .find({})
      .sort({})
      .limit(0)
      .toArray();
    res.json(customer);
  }
};
