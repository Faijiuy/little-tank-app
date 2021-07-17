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

let resultData = {};

const couponInfo = {
  // _id : "60f01e4d606a532bc094b7f2",
  code: "",
  companyRef: "",
  amount: 1000,
  used: false,
  usedDateTime: "",
  recordedBy: {
    userID: "",
    name: "",
  },
};

export default function test(req, res) {
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
  let timeSt = event.timestamp;

  console.log('couponInfo_Before ===>', couponInfo)

  if (event.message.type !== "text") {
    const client = new line.Client({
      channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    });

    client
.getProfile(id)
      .then((profile) => {
        couponInfo.recordedBy.userID = profile.userId;
        couponInfo.recordedBy.name = profile.displayName;
        couponInfo.usedDateTime = timeSt
        console.log(profile.displayName);
        console.log(profile.userId);
        console.log("TimeStamp ==> ", timeSt);
      })
      .catch((err) => {
        console.error(err);
      });

    client.getMessageContent(event.message.id).then((stream) => {
      stream.on("data", (chunk) => {
        console.log(chunk);
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

          let t,ComRef,AM,Num = ''
          let detectCode = false;

          var qr = new QrCode();
          qr.callback = function (err, value) {
            if (value) {
              detectCode = true;
            } else if (err) {
              detectCode = false;
              console.error(err);
              // TODO handle error
            }

            if (detectCode == true) {
              console.log(value);

              //Split Code
              t = value.result
              let splitT = t.split("-")
              if (splitT.length == 3) {
                ComRef = splitT[0].slice(6)
                AM = splitT[1].slice(2)
                Num = splitT[2].slice(3)
              } else {
                ComRef = ''
                AM = 0
                Num = ''
              }

              //Assign input to  couponInfo
              couponInfo.code = value.result;
              couponInfo.used = true;
              couponInfo.companyRef = ComRef;
              couponInfo.amount = parseInt(AM);

              //Print Detected Code in Console
              console.log("resultData ====> ", value.result);
              console.log("splitT ===> ", splitT)
            //   console.log("comRef ==> ", ComRef)
            //   console.log("AM ==> ", AM)
            //   console.log("num ==> ", Num)

              //Send Code to LINE to Reply
            //   reply(reply_token, value.result);
              resultData.result =
                "Code detected.";
              reply(reply_token, resultData.result);
            } else if (detectCode == false) {
              resultData.result =
                "Code not detected. Please take a new picture again.";
              reply(reply_token, resultData.result);
            }
            // if (err) {
            //     console.error(err);
            //     // TODO handle error
            // }
            // resultData = value
            // console.log(value);
            // console.log('resultData ====> ', resultData.result)
            // reply(reply_token, resultData.result)
            console.log('couponInfo_After ===>', couponInfo)
            
          };
          qr.decode(image.bitmap);
          fetch('/api/coupon', {
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
              body: JSON.stringify(couponInfo) // body data type must match "Content-Type" header
            })
              .then(response => response.json())
              .then(data => {
                console.log(data);
                // alert("Update:\nResponse from server " + data.message)
                // alert("Update", data._id)
              });
        });
      });
    });

    reply(reply_token, event.message.text);
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

export async function getServerSideProps() {
  const { db } = await connectToDatabase();

  const coupons = await db
    .collection("coupons")
    .find()
    .sort({})
    .limit(20)
    .toArray();

  return {
    props: {
      coupon: JSON.parse(JSON.stringify(coupons)),
    },
  };
}
