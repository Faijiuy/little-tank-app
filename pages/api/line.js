// import { useEffect, useState } from "react";
import fs, { read } from "fs";
import { connectToDatabase } from "../../util/mongodb";

import axios from "axios";
var QrCode = require("qrcode-reader");
var Jimp = require("jimp");

const request = require("request");
require("dotenv").config();

const line = require("@line/bot-sdk");

let botReply = "";

let customerData = [];
let couponData = [];

export default function test(req, res) {

  

  const couponInfo = {
    _id : "",
    code: "",
    companyRef: "",
    generatedDate: "",
    amount: 0,
    runningNo: 0,
    used: false,
    usedDateTime: "",
    recordedBy: {
      userID: "",
      name: "",
    },
  };

  const customerInfo = {
    _id: "",
    company: "",
    owner: "",
    owner_tel: "",
    owner_email: "",
    contact_name: "",
    contact_tel: "",
    contact_email: "",
    address: "",
    groupID: "",
  };

  // handle LINE BOT webhook verification
  // The verification message does not contain any event, so length is zero.
  if (req.body.events.length === 0) {
    res.status(200).json({});
    // console.log("hello")
    reply("Hello"); // can reply anything
    return;
  }

  let event = req.body.events[0];

  let reply_token = event.replyToken;

  // useEffect(() => {
  //   reply(reply_token, notification)
  // }, [])

  let arr = [];
  let path = "./public/img/QR-Code.png";

  let id = event.source.userId;
  let GID = event.source.groupId;

  let getTimeSt = event.timestamp;
  var date = new Date(getTimeSt);
  let timeSt = date.toLocaleString();

  fetch(process.env.API + "/toDB", {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
  })
    .then((response) => response.json())
    .then((data) => {
      data.map((d) => {
        customerData.push(d);
      });
      // console.log("data ==> ",data);
    });

  fetch(process.env.API + "/coupon/used", {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
  })
    .then((response) => response.json())
    .then((data) => {
      data.map((d) => {
        couponData.push(d);
      });
      // console.log("data ==> ",data);
    });

  const client = new line.Client({
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  });

  const message = {
    type: "text",
    text: "",
  };

  // setTimeout(() => {
  processMessage();
  // }, 3000);

  function processMessage() {
    if (event.message.type !== "text") {
      console.log("couponInfo_Before ===>", couponInfo);
      console.log("customerData ===> ", customerData);
      console.log("couponData ===> ", couponData);

      client
        .getProfile(id)
        .then((profile) => {
          couponInfo.recordedBy.userID = profile.userId;
          couponInfo.recordedBy.name = profile.displayName;
          // console.log(profile.displayName);
          // console.log(profile.userId);
          // console.log("TimeStamp ==> ", timeSt);
        })
        .catch((err) => {
          console.error(err);
        });

      client.getMessageContent(event.message.id).then((stream) => {
        stream.on("data", (chunk) => {
          // console.log(chunk);
          arr.push(chunk);
        });

        stream.on("error", (err) => {
          console.log("Error", err);
        });

        stream.on("end", function () {
          //fs.writeFile('logo.png', imagedata, 'binary', function(err){

          var buffer = Buffer.concat(arr);
          fs.writeFileSync(path, buffer, function (err) {
            if (err) throw err;
            console.log("File saved.");
          });
        });

        stream.on("end", function () {
          console.log("Read Pic");
          const imageFile = "./public/img/QR-Code.png";
          // var qr = new QrCode();

          var buffer = fs.readFileSync(imageFile);
          Jimp.read(buffer, function (err, image) {
            if (err) {
              console.error(err);
              // TODO handle error
            }

            let temp = "";
            let detectCode = false;

            var qr = new QrCode();
            qr.callback = function (err, value) {
              if (value) {
                detectCode = true;
                temp = value.result;
                console.log(value);
              } else if (err) {
                detectCode = false;
                console.error(err);
                // TODO handle error
              }

              //Split Code
              let splitT = temp.split("-");
              couponInfo.code = value.result;
              couponInfo.companyRef = splitT[0];
              couponInfo.generatedDate = splitT[1];
              couponInfo.amount = parseInt(splitT[2]);
              couponInfo.runningNo = parseInt(splitT[3]);

              couponData.map((couD) => {
                if (couponInfo.code == couD.code) {
                  couponInfo.used = couD.used;
                  couponInfo._id = couD._id
                }
              });

              if (couponInfo.used == false) {
                if (detectCode == true && splitT.length == 4) {
                  // console.log(value);

                  //Assign input to  couponInfo & Check Code Form
                  couponInfo.used = true;
                  couponInfo.usedDateTime = timeSt;

                  let companyName = "";

                  customerData.map((cusD) => {
                    if (couponInfo.companyRef == cusD._id) {
                      companyName = cusD.company;
                      // console.log("companyName ===>  ", companyName)
                    }
                  });

                  //Print Detected Code in Console
                  console.log("resultData ====> ", value.result);
                  console.log("splitT ===> ", splitT);

                  //Send Code to LINE to Reply
                  //   reply(reply_token, value.result);

                  console.log("Test  ",couponInfo.companyRef)

                  
                  botReply =
                  "น้องรถถังสามารถอ่าน QR-code จากคูปองได้. \n--------------------------------------------------- \nชื่อบริษัท: " +
                  companyName +
                  "\nQR-Code: " +
                  couponInfo.code +
                  "\nวันที่ถูกพิมพ์: " +
                  couponInfo.generatedDate +
                  "\nคูปองราคา: " +
                  couponInfo.amount +
                  "\nเลขคูปองที่: " +
                  couponInfo.runningNo +
                  "\nวันและเวลาที่บันทึก: " +
                  couponInfo.usedDateTime +
                  "\nบันทึกโดย: " +
                  couponInfo.recordedBy.name +
                  "\n--------------------------------------------------- \nคูปองนี้ได้ถูกบันทึกแล้ว";
                  
                  if(notification(couponInfo.companyRef)){
                    botReply += "\n--------------------------------------------------- \nยอดคูปองของคุณเหลือ " + notification(couponInfo.companyRef)+
                    " กรุณาเติมเงิน"
                    // reply(reply_token, "Test notification")
                  }else{
                    console.log("false")
                  }

                  reply(reply_token, botReply);
                  
                  

                  // const message = {
                  //   type: "text",
                  //   text: "คูปองนี้ได้ถูกบันทึกแล้ว",
                  // };

                  // client
                  //   .pushMessage(id, message)
                  //   .then(() => {})
                  //   .catch((err) => {
                  //     // error handling
                  //   });
                } else if (detectCode == true && splitT.length != 4) {
                  botReply =
                    "รูปที่คุณถ่ายมาไม่ใช่คูปอง. \nขอคุณช่วยถ่ายรูปใหม่อีกที.";
                  reply(reply_token, botReply);
                } else if (detectCode == false) {
                  botReply =
                    "น้องรถถังไม่สามารถอ่าน QR-code จากคูปองได้. ขอคุณช่วยถ่ายรูปใหม่อีกที.";
                  reply(reply_token, botReply);
                }
              } else if (couponInfo.used == true) {
                botReply = "คูปองนี้ได้ถูกใช้แล้ว.";
                reply(reply_token, botReply);
              } else if (couponInfo.used == "missing") {
                botReply = "คูปองนี้ได้ถูกบันทึกว่า สูญหาย.";
                reply(reply_token, botReply);
              }
              // if (err) {
              //     console.error(err);
              //     // TODO handle error
              // }
              console.log("couponInfo_After ===>", couponInfo);
            };
            qr.decode(image.bitmap);

            // fetch(process.env.API+'/coupon/used', {
            //     method: 'PUT', // *GET, POST, PUT, DELETE, etc.
            //     mode: 'cors', // no-cors, *cors, same-origin
            //     cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            //     credentials: 'same-origin', // include, *same-origin, omit
            //     headers: {
            //       'Content-Type': 'application/json'
            //       // 'Content-Type': 'application/x-www-form-urlencoded',
            //     },
            //     redirect: 'follow', // manual, *follow, error
            //     referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            //     body: JSON.stringify(couponInfo) // body data type must match "Content-Type" header
            //   })
            //     .then(response => response.json())
            //     .then(data => {
            //       console.log(data);
            //       // alert("Update:\nResponse from server " + data.message)
            //       // alert("Update", data._id)
            //     });
          });
        });
      });

      // reply(reply_token, event.message.text);
    } else if (event.message.type == "text") {
      // console.log("customerData ===> ", customerData);
      if (event.message.text == "สอบถาม GroupID") {
        // let GID = event.source.groupId;
        // message.text = "ได้โปรดใส่ชื่อบริษัทของคุณ";
        // client
        //   .pushMessage(GID, message)
        //   .then(() => {})
        //   .catch((err) => {
        //     // error handling
        //   });

        for (var i = 0; i < customerData.length; i++) {
          if (GID == customerData[i].groupID) {
            let replyCheckGroupID = "GroupID คือ " + GID;
            reply(reply_token, replyCheckGroupID);
            break;
          } else if (GID !== customerData[i].groupID) {
            reply(
              reply_token,
              "บริษัทของคุณยังไม่ได้ทำการบันทึก LINE GroupID. \nได้โปรดใส่ชื่อบริษัทของคุณ หลังเส้นขีด. Example: GroupID-ABC"
            );
            continue;
          }
        }

      } else if (event.message.text == "สอบถามยอด") {
        console.log("Inquire for total of coupon.");
        // console.log("couponData ===> ", couponData);
        customerData.map((cusD) => {
          if (GID == cusD.groupID) {
            let tempComRef = cusD._id;
            console.log("tempComRef", tempComRef);
            let totalLeft = 0;
            let typeCoupon = [];
            let couponValue = []

            // for (var i = 0; i < couponData.length; i++) {
            //   typeCoupon.push(couponData[i].amount);
            // }

            couponData.map((couD) => {
              typeCoupon.push(couD.amount)
            })

            let tempTypeCoupon = new Set(typeCoupon)
            typeCoupon = [...tempTypeCoupon]

            console.log("typeCoupon ======> ", typeCoupon)

            for (var i = 0; i < typeCoupon.length; i++) {
              couponValue.push({ID: i+1, type: typeCoupon[i], unit: 0, value: 0})
            }
            console.log("couponValue Before ==> ", couponValue)

            couponData.map((couD) => {
              if (tempComRef == couD.companyRef && couD.used == false) {
                // totalLeft += couD.amount;
                couponValue.map((v) => {
                  if (couD.amount == v.type) {
                    v.unit += 1
                  }
                })
              }
            });

            couponValue.map((v) => {
              v.value = v.type * v.unit
              totalLeft += v.value
            })
            console.log("couponValue After ==> ", couponValue)

            let couponReply = []
            couponValue.map((cv) => {
              couponReply.push({replyID: cv.ID, reply: 'คูปองมูลค่า ' + cv.type + ' บาท. จำนวน ' + cv.unit + ' ใบ. (' + cv.value + ' บาท)'})
            })
            console.log("couponReply ==> ", couponReply)

            let replyLeftCoupon =
              "ยอดมูลค่าคูปอง คงเหลือทั้งหมด " +
              totalLeft +
              " บาท.\n\n" + printCouponReply(couponReply)
            reply(reply_token, replyLeftCoupon);
          }
        });
      } else if (event.message.text == "คำสั่งบอท") {
        let replyCommand =
          "สอบถามยอด : สอบถามยอดคงเหลือคูปอง\nสอบถาม GroupID : เช็คเลข GroupID ของ LINE Group นี้";
        reply(reply_token, replyCommand);
      } else {
        // Maybe do not need this since groupID remain the same even delete group chat. But when new company is registerd.
        let tempText = event.message.text;
        let splitTempText = tempText.split("-");
        if (splitTempText.length == 2 && splitTempText[0] == "GroupID") {
          customerInfo.company = splitTempText[1];
          for (var i = 0; i < customerData.length; i++) {
            if (customerInfo.company == customerData[i].company) {
              customerInfo._id = customerData[i]._id;
              customerInfo.owner = customerData[i].owner;
              customerInfo.owner_tel = customerData[i].owner_tel;
              customerInfo.owner_email = customerData[i].owner_email;
              customerInfo.contact_name = customerData[i].contact_name;
              customerInfo.contact_tel = customerData[i].contact_tel;
              customerInfo.contact_email = customerData[i].contact_email;
              customerInfo.address = customerData[i].address;
              customerInfo.groupID = GID;
              break;
            }
          }
          console.log("customerInfo", customerInfo);
          // fetch(process.env.API + "/toDB", {
          //   method: "PUT", // *GET, POST, PUT, DELETE, etc.
          //   mode: "cors", // no-cors, *cors, same-origin
          //   cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          //   credentials: "same-origin", // include, *same-origin, omit
          //   headers: {
          //     "Content-Type": "application/json",
          //     // 'Content-Type': 'application/x-www-form-urlencoded',
          //   },
          //   redirect: "follow", // manual, *follow, error
          //   referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          //   body: JSON.stringify(customerInfo), // body data type must match "Content-Type" header
          // })
          //   .then((response) => response.json())
          //   .then((data) => {
          //     console.log(data);
          //     // alert("Update:\nResponse from server " + data.message)
          //     // alert("Update", data._id)
          //   });

          let confirmGIDReply = 'บันทึก GroupID ใหม่ไปที่ Database แล้ว. \nGroupID คือ ' + customerInfo.groupID 
          reply(reply_token, confirmGIDReply);
        } else { 
          reply(reply_token, 'ขอโทษค่ะ น้องรถถังไม่เข้าสิ่งที่คุณพิมพ์. คุณอาจจะพิมพ์ผิด. ได้โปรดพิมพ์ใหม่อีกครั้งหนึ่ง')
        }
      }
    }
    // else {
    //   postToDialogflow(req);
    // }
  }
}

function printCouponReply(arr) {
  var string = ''
  arr.map((cr) => {
    string = string + cr.reply + '\n'
  })
  return string
}

function reply(reply_token, msg) {
  let headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer {" + process.env.CHANNEL_ACCESS_TOKEN + "}",
  };

  // console.log('msg:', msg)
  let body = JSON.stringify({
    replyToken: reply_token,
    messages: [
      {
        type: "text",
        text: msg,
      },
    ],
  });

  request.post(
    {
      url: "https://api.line.me/v2/bot/message/reply",
      headers: headers,
      body: body,
    },
    (err, res, body) => {
      // console.log('status = ' + res.statusCode);
      // console.log("body ====> ", res.body)
    }
  );
}



function notification(companyRef){
  let amount = 0

  couponData.map(coupon => {
    if(coupon.companyRef === companyRef && coupon.used === false){
      amount += coupon.amount
    }
  })
  
  if(amount <= 3000){
    return amount
  }
}
