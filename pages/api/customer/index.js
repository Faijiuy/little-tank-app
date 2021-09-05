// // import { ObjectID } from "mongodb";
// // import { ObjectId } from 'bson';
// // import { ObjectId} from "bson";
// import { ObjectId } from "bson";
// import { connectToDatabase } from "../../../util/mongodb";

// export default async (req, res) => {
//   // console.log("item API", req);
//   if (req.method === "GET") {
//     const { db } = await connectToDatabase();
//     const customer = await db
//       .collection("customer")
//       .find({})
//       .sort({})
//       .limit(0)
//       .toArray();
//     res.json(customer);
//   }
// };
