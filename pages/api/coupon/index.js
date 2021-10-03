import { ObjectId } from "bson";
import { connectToDatabase } from "../../../util/mongodb";

export default async (req, res) => {

  if (req.method === "POST") {
    let data = req.body;

    let {
        code,
        companyRef,
        generatedDate,
        amount,
        runningNo,
        used,
        usedDateTime,
        recordedBy,
        printed,
        generatedBy
    } = data;

    console.log("data ", data)


    const { db } = await connectToDatabase();
    await db.collection("coupons").insertOne(
      {
        
        code: code,
        companyRef: companyRef,
        generatedDate: generatedDate,
        amount: amount,
        runningNo: runningNo,
        used: used,
        usedDateTime: usedDateTime,
        recordedBy: recordedBy,
        printed: printed,
        generatedBy: generatedBy
      },
      // callback
      (err, result) => {
        if (err) {
          console.log(err);
          res.json(err);
        } else {

          // res.status(200).json({});
          res.json({
            message: "Customer added",
            _id: result.insertedId,
          });
        }
      }
    ); // if update non-existing record, insert instead.

  } else if(req.method === "PUT"){
    let data = req.body;

    //   // จะได้ objectID ถ้าใช้โค้ดล่าง อันบนเหมือนจะสร้าง _id เองได้
    let {
        code,
        companyRef,
        amount,
        used,
        usedDateTime,
        recordedBy
    } = data;


    const { db } = await connectToDatabase();
    await db.collection("coupons").updateOne(
      { code: code},
      {
        $set: {
          // _id: ObjectId(_id)
          // _id: _id
          
          used: used,
          
        },
      },
      // callback
      (err, result) => {
        if (err) {
          console.log(err);
          res.json(err);
        } else {
          res.json({
            message: "coupon updated",
            _id: result.insertedId,
          });
        }
      }
    );
  }else if(req.method === "DELETE"){
    let data = req.body;

    //   // จะได้ objectID ถ้าใช้โค้ดล่าง อันบนเหมือนจะสร้าง _id เองได้
    let {
      _id,
      
    } = data;

    // let _id = ObjectId(data._id)
    // delete data._id

    console.log("data ==> ", data)
    // console.log(data)
    const { db } = await connectToDatabase();


    await db.collection("coupons").deleteOne(
      { _id: ObjectId(_id)},
      // { company: company},

      // callback
      // (err, result) => {
      //   if (err) {
      //     console.log(err);
      //     res.json(err);
      //   } else if(result){
      //     console.log("result: ", result)
      //     res.json({
      //       message: "coupon updated",
      //     });
      //   }
      // }
      res.json({ delete: true, message: 'Delete data', data: {} })

      
    )

  }else if (req.method === "GET") {
    const { db } = await connectToDatabase();
    const coupons = await db
      .collection("coupons")
      .find({})
      .sort({})
      .limit(0)
      .toArray();
    res.json(coupons);
  }
  // res.status(200).json({});

};