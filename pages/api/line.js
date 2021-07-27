import { useEffect, useState } from "react";
import fs, { read } from "fs";

import axios from "axios";
var QrCode = require("qrcode-reader");
var Jimp = require("jimp");

const request = require("request");
require("dotenv").config();

// const redis = require('redis')
// const client = redis.createClient();

// client.on("error", function(error) {s
//   console.error(error);
// });

// client.set("key", "value", redis.print);
// client.get("key", redis.print);
let count = 0;

const cal_state = [];

let calState = false;
//

const line = require("@line/bot-sdk");

let botReply = "";

let customerData = [];
let couponData = [];

export default function test(req, res) {
  const couponInfo = {
    // _id : "60f01e4d606a532bc094b7f2",
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

  let arr = [];
  let path = "./public/img/QR-Code.png";

  let id = event.source.userId;

  let getTimeSt = event.timestamp;
  var date = new Date(getTimeSt);
  let timeSt = date.toLocaleString();

  console.log("couponInfo_Before ===>", couponInfo);

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

  if (event.message.type !== "text") {
    
    const client = new line.Client({
      channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    });

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
            // console.log("customerData ===> ", customerData);
            // console.log("couponData ===> ", couponData);

            couponInfo.code = value.result;
            couponInfo.companyRef = splitT[0];
            couponInfo.generatedDate = splitT[1];
            couponInfo.amount = parseInt(splitT[2]);
            couponInfo.runningNo = parseInt(splitT[3]);

            couponData.map( couD => {
              if (couponInfo.code == couD.code) {
                couponInfo.used = couD.used
              }
            })

            if (couponInfo.used == false) {
              if (detectCode == true && splitT.length == 4) {
                // console.log(value);

                //Assign input to  couponInfo & Check Code Form

                // if (splitT.length == 4) {
                couponInfo.used = true;
                couponInfo.usedDateTime = timeSt;
                // } else {
                //   resultData.result =
                //   "น้องรถถังไม่สามารถอ่าน QR-code จากคูปองได้. \nขอคุณช่วยถ่ายรูปใหม่อีกที.";
                // }

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
                  couponInfo.recordedBy.name;

                reply(reply_token, botReply);

                const message = {
                  type: "text",
                  text: "คูปองนี้ได้ถูกบันทึกแล้ว",
                };

                client
                  .pushMessage(id, message)
                  .then(() => {})
                  .catch((err) => {
                    // error handling
                  });
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
              botReply =
                    "คูปองนี้ได้ถูกใช้แล้ว.";
              reply(reply_token, botReply);
            } else if (couponInfo.used == 'missing') {
              botReply =
                    "คูปองนี้ได้ถูกบันทึกว่า สูญหาย.";
              reply(reply_token, botReply);
            }
            // if (err) {
            //     console.error(err);
            //     // TODO handle error
            // }
            console.log("couponInfo_After ===>", couponInfo);
          } 
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
  } else {
    postToDialogflow(req);
  }
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
  console.log("reply =============> ", body);

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

const postToDialogflow = (req) => {
  req.headers.host = "dialogflow.cloud.google.com";
  axios({
    url: "https://dialogflow.cloud.google.com/v1/integrations/line/webhook/e8cc963c-2816-4340-892f-f424247eb2f5",
    headers: req.headers,
    method: "post",
    data: req.body,
  });
};
