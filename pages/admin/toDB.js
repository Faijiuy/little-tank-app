// import { ObjectID } from "mongodb";
// import { ObjectId } from 'bson';
// import { ObjectId} from "bson";
// import { connectToDatabase } from "../../util/mongodb";

export default async (req, res) => {
  console.log("item API method ++++++ " + req.method)

    if (req.method === 'POST') {
      console.log("ADDING ", req.body)
      let data = req.body;
      

    //   // จะได้ objectID ถ้าใช้โค้ดล่าง อันบนเหมือนจะสร้าง _id เองได้
      // let { product_name, code, brand, model, avi_model, purchase_price, qty, minStock, barcode_id, date } = data;

      // const { db } = await connectToDatabase();
      // await db
      //   .collection('item')
      //   .insertOne(
      //     {
      //       // _id: ObjectId(_id)
      //       // _id: _id
      //       product_name: product_name,
      //       code: code,
      //       brand: brand,
      //       model: model,
      //       avi_model: avi_model,
      //       purchase_price: Number(purchase_price),
      //       qty: Number(qty),
      //       minStock: Number(minStock),
      //       barcode_id: barcode_id,
      //       date: date
      //     },
      //     // callback
      //     (err, result) => {
      //       if (err) {
      //         console.log(err)
      //         res.json(err)
      //       } else {
      //         console.log('Newly inserted ID', result.insertedId)
      //         res.json({
      //           message: 'Item added',
      //           _id: result.insertedId
      //         });
      //       }
      //     }
      //   ) // if update non-existing record, insert instead.
        
    } 
    
}