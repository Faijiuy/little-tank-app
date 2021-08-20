import fs, { read } from "fs";

var QrCode = require("qrcode-reader");
var Jimp = require("jimp");

const request = require("request");
require("dotenv").config();

const line = require("@line/bot-sdk");

import { uploadFile } from "../../util/googledrive";




export default async function test(req, res) {

  // handle LINE BOT webhook verification
  // The verification message does not contain any event, so length is zero.
  if (req.body.events.length === 0) {
    res.status(200).json({});
    reply("Hello"); // can reply anything
    return;
  }

  let event = req.body.events[0];

  let reply_token = event.replyToken;

  let newArr = [];
  let path = "./public/img/QR-Code.png";

  let id = event.source.userId;
  let GID = event.source.groupId;

  let getTimeSt = event.timestamp;
  var date = new Date(getTimeSt);
  let timeSt = date.toLocaleString();


  const client = new line.Client({
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  });


  if (event.message.type !== "text") {
    let admins = await fetch(process.env.API + "/admin", {
                method: "GET", // *GET, POST, PUT, DELETE, etc.
                }).then((response) => response.json())

    let admin = admins.filter(admin => admin.userId === id && admin.groupId.includes(GID))


    if (admin[0].status == "SA" || admin[0].status == "SO") {
      let customers = await fetch(process.env.API + "/toDB", {
                        method: "GET", // *GET, POST, PUT, DELETE, etc.
                      })
                        .then((response) => response.json())

      let coupons = await fetch(process.env.API + "/coupon/used", {
                        method: "GET", // *GET, POST, PUT, DELETE, etc.
                      })
                        .then((response) => response.json())

      let customer = await customers.filter(customer => customer.groupID === GID)

      let couponInCom = await coupons.filter(coupon => coupon.companyRef === customer[0]._id)

      let couponUsed = await groupByKey(couponInCom, "used")

      let recordby = ""

        await client
          .getProfile(id)
          .then((profile) => {
            recordby = profile.displayName;
          })
          .catch((err) => {
            console.error(err);
          });

        await client.getMessageContent(event.message.id).then((stream) => {
          stream.on("data", (chunk) => {
            newArr.push(chunk);
          });
  
          stream.on("error", (err) => {
            console.log("Error", err);
          });
  
          stream.on("end", function () {    
            var buffer = Buffer.concat(newArr);
            fs.writeFileSync(path, buffer, function (err) {
              if (err) throw err;
              console.log("File saved.");

            });
          });
  
          stream.on("end", function () {
            const imageFile = "./public/img/QR-Code.png";


  
            var buffer = fs.readFileSync(imageFile);
            Jimp.read(buffer, function (err, image) {
              if (err) {
                console.error(err);
                // TODO handle error
              }
  
              var qr = new QrCode();
              qr.callback = function (err, value) {
                if (value) {
                  // temp = value.result;
                  

                  if(couponUsed['false'].some(coupon => coupon.code === value.result)){

                    let splitT = value.result.split("-");

                    uploadFile(customer[0].company+"-"+splitT[3]+"-"+splitT[2]+"-"+timeSt.split(',')[0], fs.createReadStream(path))

                    let checkValue = couponUsed['false'].filter(coupon => coupon.code !== value.result)

                    let botReply =
                      "น้องรถถังสามารถอ่าน QR-code จากคูปองได้. \n--------------------------------------------------- \nชื่อบริษัท: " +
                      customer[0].company +
                      "\nQR-Code: " +
                      value.result +
                      "\nวันที่ถูกพิมพ์: " +
                      splitT[1] +
                      "\nคูปองราคา: " +
                      splitT[2] +
                      "\nเลขคูปองที่: " +
                      splitT[3] +
                      "\nวันและเวลาที่บันทึก: " +
                      timeSt +
                      "\nบันทึกโดย: " +
                      recordby +
                      "\n--------------------------------------------------- \nคูปองนี้ได้ถูกบันทึกแล้ว";
                    
                      console.log("Picture API", process.env.API + "/coupon/used")
                    
                    check(checkValue) >= 3000 ? reply(reply_token, botReply) : 
                                                  reply(reply_token, [botReply, "ยอดคงเหลือของคุณ เหลือ\n" + thousands_separators(check(checkValue)) + " บาท กรุณาเติมเงิน"])
                                                  
                    fetch(process.env.API + '/coupon/used', {
                        method: 'PUT', // *GET, POST, PUT, DELETE, etc.
                        mode: 'cors', // no-cors, *cors, same-origin
                        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                        credentials: 'same-origin', // include, *same-origin, omit
                        headers: {
                          'Content-Type': 'application/json'
                          // 'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        redirect: 'follow', // manual, *follow, error
                        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                        body: JSON.stringify({
                          code: value.result,
                          used: true,
                          usedDateTime: timeSt.split(',')[0],
                          recordedBy: {
                            userID: id,
                            name: recordby,
                          },
                        }) // body data type must match "Content-Type" header
                      })                            
                    
                  }else if(couponUsed['true'].some(coupon => coupon.code === value.result)){
                    let botReply = "คูปองนี้ได้ถูกใช้แล้ว.";
                    reply(reply_token, botReply);
                  }else{
                    let botReply = "คูปองนี้ไม่มีในระบบ";
                    reply(reply_token, botReply);
                  }

                } else if (err) {
                  console.error(err);

                  reply(reply_token, "น้องรถถังไม่สามารถอ่าน QR-code จากคูปองได้. ขอคุณช่วยถ่ายรูปใหม่อีกที.")
                  // TODO handle error
                }

                
              };
              qr.decode(image.bitmap);
  
        
            });
          });
        });


    }

  } else if (event.message.type == "text") {

    if (event.message.text == "สอบถาม GroupID") {
      console.log("GroupID API", process.env.API + "/toDB")

        let customers = await fetch(process.env.API + "/toDB", {
                        method: "GET", // *GET, POST, PUT, DELETE, etc.
                        }).then((response) => response.json())

        let customer = customers.filter(customer => customer.groupID === GID)

        if(customer[0] === undefined){
          let replyCheckGroupID = "GroupID คือ " + GID;
          reply(reply_token, replyCheckGroupID);
        }
    } else if (event.message.text == "สอบถามยอด") {
      console.log("Total API", process.env.API + "/admin")


      let admins = await fetch(process.env.API + "/admin", {
                      method: "GET", // *GET, POST, PUT, DELETE, etc.
                      }).then((response) => response.json())

      let admin = admins.filter(admin => admin.userId === id && admin.groupId.includes(GID))


      if (admin[0].status == "SA" || admin[0].status == "SO" || admin[0].status == "EN") {
        let customers = await fetch(process.env.API + "/toDB", {
                        method: "GET", // *GET, POST, PUT, DELETE, etc.
                      })
                        .then((response) => response.json())

        let coupons = await fetch(process.env.API + "/coupon/used", {
                        method: "GET", // *GET, POST, PUT, DELETE, etc.
                      })
                        .then((response) => response.json())

        let customer = await customers.filter(customer => customer.groupID === GID)

        let couponUsed = await coupons.filter(coupon => coupon.companyRef === customer[0]._id && 
                                                        coupon.used === false)


        let group = await groupByKey(couponUsed, "amount")
        
        console.log("group length ", Object.keys(group))

        let result = 0
        let textpart = ""
        Object.keys(group).map(type => {
          result += Number(type) * group[type].length
          textpart += "คูปองมูลค่า " + thousands_separators(Number(type)) + " จำนวน " + group[type].length + " ใบ (" + 
                    thousands_separators(Number(type) * group[type].length) + ")\n"  
        })

        let text =  "ยอดมูลค่าคูปอง คงเหลือทั้งหมด " + thousands_separators(result) + " บาท.\n\n" +
                    textpart

        reply(reply_token, text)
        
      } 
    } else if (event.message.text == "คำสั่งบอท") {
      console.log("Bot Command API", process.env.API + "/admin")
      let admins = await fetch(process.env.API + "/admin", {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        }).then((response) => response.json())

      

      let admin = admins.filter(admin => admin.userId === id && admin.groupId.includes(GID))

      console.log("admin ", admins)


      let replyCommand = "";

      if (admin[0].status == "SO" || admin[0].status == "SA") {
        replyCommand =
          "สอบถามยอด : สอบถามยอดคงเหลือคูปอง\nสอบถาม GroupID : เช็คเลข GroupID ของ LINE Group นี้";
      } else {
        replyCommand = "สอบถามยอด : สอบถามยอดคงเหลือคูปอง";
      }


      reply(reply_token, replyCommand);
    } else if (event.message.text.includes("ขอเป็น admin")) {

        if(GID === undefined){
          fetch(process.env.API + "/admin/password", {
                method: "GET", // *GET, POST, PUT, DELETE, etc.
              })
                .then((response) => response.json())
                .then((data) => {
                  console.log("data ",data)
                  data.map(data => {
                    if(event.message.text.includes(data.password)){
  
                      client
                        .getProfile(id)
                        .then((profile) => {
                          fetch(process.env.API + "/admin", {
                            method: "PUT", // *GET, POST, PUT, DELETE, etc.
                            mode: "cors", // no-cors, *cors, same-origin
                            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                            credentials: "same-origin", // include, *same-origin, omit
                            headers: {
                              "Content-Type": "application/json",
                              // 'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            redirect: "follow", // manual, *follow, error
                            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                            body: JSON.stringify({
                              username: profile.displayName,
                              userId: id,
                              status: data.status,
                              groupId: data.groupId,
                            }), // body data type must match "Content-Type" header
                          }).then(reply(reply_token, "เอา admin ไป"))
                          .then(
                            fetch(process.env.API + "/admin/password", {
                              method: "DELETE", // *GET, POST, PUT, DELETE, etc.
                              mode: "cors", // no-cors, *cors, same-origin
                              cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                              credentials: "same-origin", // include, *same-origin, omit
                              headers: {
                                "Content-Type": "application/json",
                                // 'Content-Type': 'application/x-www-form-urlencoded',
                              },
                              redirect: "follow", // manual, *follow, error
                              referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                              body: JSON.stringify({ password: data.password }),
                            }) // body data type must match "Content-Type" header
                          )
                        })
                    }
                  })
                })
      }   
    } else {
      console.log("Trivial API", process.env.API)
      reply(
        reply_token,
        "ขอโทษค่ะ น้องรถถังไม่เข้าสิ่งที่คุณพิมพ์. คุณอาจจะพิมพ์ผิด. ได้โปรดพิมพ์ใหม่อีกครั้งหนึ่ง"
      );  
    }
  }
    
  
  res.status(200).json({});
}

function thousands_separators(num) {
  var num_parts = num.toString().split(".");
  num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return num_parts.join(".");
}

function groupByKey(array, key) {
  return array
    .reduce((hash, obj) => {
      if(obj[key] === undefined) return hash; 
      return Object.assign(hash, { [obj[key]]:( hash[obj[key]] || [] ).concat(obj)})
    }, {})
}



async function reply(reply_token, msg) {
  console.log("replying")
  
  let headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer {" + process.env.CHANNEL_ACCESS_TOKEN + "}",
  };
  
  let body = JSON.stringify({
              replyToken: reply_token,
              messages: Array.isArray(msg) ? msg.map(message => ({type: "text", text: message})) : 
                                            [{type: "text", text: msg,},]
             });

  request.post(
    {
      url: "https://api.line.me/v2/bot/message/reply",
      headers: headers,
      body: body,
    },
    (err, res, body) => {
      // console.log('status = ' + res.statusCode);
    }
  );
}

function check(Arr) {
  let group = groupByKey(Arr, "amount")
         
  let result = 0
  Object.keys(group).map(type => {
    result += Number(type) * group[type].length
  })

  return result
}

// const request = require("request");

// export default async function test(req, res) {
//     if (req.body.events.length === 0) {
//         res.status(200).json({});
//         reply("Hello"); // can reply anything
//         return;
//       }

//     let admins =  await fetch(process.env.API + "/admin", {
//                   method: "GET", // *GET, POST, PUT, DELETE, etc.
//                   }).then((response) => response.json())

//     console.log(admins)

//     let event = req.body.events[0];
  
//     let reply_token = event.replyToken;

//     if(event.message.text.includes("ขอเป็น admin")) {
//       reply(reply_token, admins[0].status)

//     }  
// }

// async function reply(reply_token, msg) {
//     console.log("replying")
    
//     let headers = {
//       "Content-Type": "application/json",
//       Authorization: "Bearer {" + process.env.CHANNEL_ACCESS_TOKEN + "}",
//     };
    
//     let body = JSON.stringify({
//                 replyToken: reply_token,
//                 messages: Array.isArray(msg) ? msg.map(message => ({type: "text", text: message})) : 
//                                               [{type: "text", text: msg,},]
//                });
  
//     request.post(
//       {
//         url: "https://api.line.me/v2/bot/message/reply",
//         headers: headers,
//         body: body,
//       },
//       (err, res, body) => {
//         // console.log('status = ' + res.statusCode);
//       }
//     );
//   }