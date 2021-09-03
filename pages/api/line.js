import fs from "fs";

var QrCode = require("qrcode-reader");
var Jimp = require("jimp");

require("dotenv").config();

const line = require("@line/bot-sdk");
const { Readable } = require('stream');

import { uploadFile } from "../../util/googledrive";

const request = require("request");

const { Readable } = require("stream");

export default async function test(req, res) {
  if (req.body.events.length === 0) {
    res.status(200).json({});
    reply("Hello"); // can reply anything
    return;
  }

  // let admins =  await fetch(process.env.API + "/admin", {
  //               method: "GET", // *GET, POST, PUT, DELETE, etc.
  //               }).then((response) => response.json())

  // let customers = await fetch(process.env.API + "/toDB", {
  //                 method: "GET", // *GET, POST, PUT, DELETE, etc.
  //               })
  //                 .then((response) => response.json())

  // let coupons = await fetch(process.env.API + "/coupon/used", {
  //                 method: "GET", // *GET, POST, PUT, DELETE, etc.
  //               })
  //                 .then((response) => response.json())

  // console.log(admins)
  const client = new line.Client({
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  });

  let event = req.body.events[0];

  let id = event.source.userId;
  let GID = event.source.groupId;

  let reply_token = event.replyToken;

  let newArr = [];

  let getTimeSt = event.timestamp;
  var date = new Date(getTimeSt);
  // let timeSt = date.toLocaleString();
  let tStp = "";
  tStp += date.getDate() + "/";
  tStp += date.getMonth() + 1 + "/";
  tStp += date.getFullYear();

  if (event.message.text && event.message.text.includes("ขอเป็น admin")) {
    let parts = event.message.text.split(" ");
    // console.log(passwords)
    // console.log("part == ", parts)

    let passwords = await fetch(process.env.API + "/admin/password", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
    }).then((response) => response.json());

    if (
      await passwords.some((password) => {
        if (password.password === parts[2]) {
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
                  status: password.status,
                  groupId: password.groupId,
                }), // body data type must match "Content-Type" header
              }).then(reply(reply_token, "เอา admin ไป"));
            })
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
                body: JSON.stringify({ password: password.password }),
              }) // body data type must match "Content-Type" header
            );
        }
      })
    ) {
      // if(part[3]){
      // }
      // reply(reply_token, "เอา admin ไป")
    }

    // reply(reply_token, [admins[0].status, customers[0].company, coupons[0].amount])
    // reply(reply_token, [parts[0], parts[1], parts[2]])
  } else if (event.message.text == "สอบถาม groupid") {
    let customers = await fetch(process.env.API + "/toDB", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
    }).then((response) => response.json());

    let customer = customers.filter((customer) => customer.groupID === GID);

    if (customer[0] === undefined) {
      let replyCheckGroupID = "GroupID คือ " + GID;
      reply(reply_token, replyCheckGroupID);
    } else {
      let replyCheckGroupID = "ไลน์กลุ่มนี้มีในระบบแล้ว และจะไม่สามารถใช้คำสั่งนี้ได้อีก";
      reply(reply_token, replyCheckGroupID);
    }
  } else if (event.message.text == "สอบถามยอด") {
    let admins = await fetch(process.env.API + "/admin", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
    }).then((response) => response.json());

    let customers = await fetch(process.env.API + "/toDB", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
    }).then((response) => response.json());

    let admin = await admins.filter(
      (admin) => admin.userId === id && admin.groupId.includes(GID)
    );
    // console.log(admin.groupId.includes(GID))
    console.log("admins ", admins);
    console.log("admin ", admin);
    console.log(GID);

    let tDate = new Date();
    let todayDate = "";
    todayDate += tDate.getDate() + "/";
    todayDate += tDate.getMonth() + 1 + "/";
    todayDate += tDate.getFullYear();

    if (
      admin[0].status == "SA" ||
      admin[0].status == "SO" ||
      admin[0].status == "EN"
    ) {
      let coupons = await fetch(process.env.API + "/coupon/used", {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
      }).then((response) => response.json());

      let customer = await customers.filter(
        (customer) => customer.groupID === GID
      );

      let couponUsed = await coupons.filter(
        (coupon) =>
          coupon.companyRef === customer[0]._id && coupon.used === false
      );

      let group = await groupByKey(couponUsed, "amount");

      let couponToday = await coupons.filter(
        (coupon) =>
          coupon.companyRef === customer[0]._id &&
          coupon.used === true &&
          coupon.usedDateTime === todayDate
      );

      let group2 = groupByKey(couponToday, "amount");

      let result = 0;
      let textpart = "";
      Object.keys(group).map((type) => {
        result += Number(type) * group[type].length;
        textpart +=
          "คูปองมูลค่า " +
          thousands_separators(Number(type)) +
          " จำนวน " +
          group[type].length +
          " ใบ (" +
          thousands_separators(Number(type) * group[type].length) +
          ")\n";
      });

      let resultUsedCoupon = 0;
      let textpartUsedCoupon = "";
      Object.keys(group2).map((type) => {
        resultUsedCoupon += Number(type) * group2[type].length;
        textpartUsedCoupon +=
          "คูปองมูลค่า " +
          thousands_separators(Number(type)) +
          " จำนวน " +
          group2[type].length +
          " ใบ (" +
          thousands_separators(Number(type) * group2[type].length) +
          ")\n";
      });

      let text =
        "ยอดมูลค่าคูปองใช้ไปในวันนี้ ทั้งหมด " +
        thousands_separators(resultUsedCoupon) +
        " บาท.\n\n" +
        textpartUsedCoupon +
        "---------------------------------------------------\nยอดมูลค่าคูปอง คงเหลือทั้งหมด " +
        thousands_separators(result) +
        " บาท.\n\n" +
        textpart;

      reply(reply_token, text);
    }
  } else if (event.message.text == "คำสั่งบอท") {
    let admins = await fetch(process.env.API + "/admin", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
    }).then((response) => response.json());

    let admin = admins.filter(
      (admin) => admin.userId === id && admin.groupId.includes(GID)
    );

    let replyCommand = "";

    if (admin[0].status == "SO" || admin[0].status == "SA") {
      replyCommand =
        "สอบถามยอด : สอบถามยอดคงเหลือคูปอง\nสอบถาม GroupID : เช็คเลข GroupID ของ LINE Group นี้";
    } else {
      replyCommand = "สอบถามยอด : สอบถามยอดคงเหลือคูปอง";
    }
    reply(reply_token, replyCommand);
  } else if (event.message.type == "image") {
    let admins = await fetch(process.env.API + "/admin", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
    }).then((response) => response.json());

    let admin = admins.filter(
      (admin) => admin.userId === id && admin.groupId.includes(GID)
    );

    if (admin[0].status == "SA" || admin[0].status == "SO") {
      let customers = await fetch(process.env.API + "/toDB", {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
      }).then((response) => response.json());

      let coupons = await fetch(process.env.API + "/coupon/used", {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
      }).then((response) => response.json());

      let customer = await customers.filter(
        (customer) => customer.groupID === GID
      );

      let couponInCom = await coupons.filter(
        (coupon) => coupon.companyRef === customer[0]._id
      );

      let couponUsed = await groupByKey(couponInCom, "used");

      let recordby = "";

      await client
        .getProfile(id)
        .then((profile) => {
          recordby = profile.displayName;
        })
        .catch((err) => {
          console.error(err);
        });

      await client.getMessageContent(event.message.id).then((stream) => {
        let buffer1 = "";
        stream.on("data", (chunk) => {
          newArr.push(chunk);
        });

        stream.on("error", (err) => {
          console.log("Error", err);
        });

        stream.on("end", function () {
          var buffer = Buffer.concat(newArr);
          buffer1 = Buffer.concat(newArr);
          // fs.writeFileSync(path, buffer, function (err) {
          //   if (err) throw err;
          //   console.log("File saved.");

          // });
        });

        stream.on("end", function () {
          // const imageFile = "./public/img/QR-Code.png";

          // var buffer = fs.readFileSync(imageFile);
          // buffer2 = fs.readFileSync(imageFile)

          // buffer1 == buffer2 ? console.log("buffer eq") : console.log("nahhhhh")
          // console.log("path ==> ", fs.createReadStream(path))
          let stream = Readable.from(buffer1);

          Jimp.read(buffer1, function (err, image) {
            if (err) {
              console.error(err);
              // TODO handle error
            }

            var qr = new QrCode();
            qr.callback = function (err, value) {
              if (value) {
                // temp = value.result;

                let codeDetect = value.result.split("-");

                if (
                  couponUsed["false"] &&
                  couponUsed["false"].some(
                    (coupon) => coupon.code === value.result
                  )
                ) {
                  uploadFile(
                    customer[0].company +
                      "-" +
                      codeDetect[3] +
                      "-" +
                      codeDetect[2] +
                      "-" +
                      tStp,
                    stream
                  );

                  let checkValue = couponUsed["false"].filter(
                    (coupon) => coupon.code !== value.result
                  );

                  let botReply =
                    "น้องรถถังสามารถอ่าน QR-code จากคูปองได้. \n--------------------------------------------------- \nชื่อบริษัท: " +
                    customer[0].company +
                    // "\nQR-Code: " +
                    // value.result +
                    // "\nวันที่ถูกพิมพ์: " +
                    // splitT[1] +
                    "\nคูปองราคา: " +
                    codeDetect[2] +
                    // "\nเลขคูปองที่: " +
                    // splitT[3] +
                    // "\nวันและเวลาที่บันทึก: " +
                    // timeSt +
                    // "\nบันทึกโดย: " +
                    // recordby +
                    "\n--------------------------------------------------- \nคูปองนี้ได้ถูกบันทึกแล้ว";

                  console.log("Picture API", process.env.API + "/coupon/used");

                  check(checkValue) >= 3000
                    ? reply(reply_token, botReply)
                    : reply(reply_token, [
                        botReply,
                        "ยอดคงเหลือของคุณ เหลือ\n" +
                          thousands_separators(check(checkValue)) +
                          " บาท กรุณาเติมเงิน",
                      ]);

                  fetch(process.env.API + "/coupon/used", {
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
                      code: value.result,
                      used: true,
                      usedDateTime: tStp,
                      recordedBy: {
                        userID: id,
                        name: recordby,
                      },
                    }), // body data type must match "Content-Type" header
                  });
                } else if (
                  couponUsed["true"] &&
                  couponUsed["true"].some(
                    (coupon) => coupon.code === value.result
                  )
                ) {
                  let botReply = "คูปองนี้ได้ถูกใช้แล้ว.";
                  reply(reply_token, botReply);
                } else if (codeDetect[0] !== customer[0]._id) {
                  let botReply = "คูปองนี้ไม่ใช่ของลูกค้าไลน์กลุ่มนี้.";
                  reply(reply_token, botReply);
                } else if (
                  couponUsed["missing"] &&
                  couponUsed["missing"].some(
                    (coupon) => coupon.code === value.result
                  )
                ) {
                  let botReply = "คูปองนี้ถูกบันทึกว่าสูญหาย.";
                  reply(reply_token, botReply);
                } else {
                  let botReply = "คูปองนี้ไม่สามารถใช้ในกลุ่มนี้ได้";
                  reply(reply_token, botReply);
                }
              } else if (err) {
                console.error(err);

                reply(
                  reply_token,
                  "น้องรถถังไม่สามารถอ่าน QR-code จากคูปองได้. ขอคุณช่วยถ่ายรูปใหม่อีกที."
                );
                // TODO handle error
              }
            };
            qr.decode(image.bitmap);
          });
        });
      });
    }
  } else {
    console.log("Trivial API", process.env.API);
    reply(
      reply_token,
      "ขอโทษค่ะ น้องรถถังไม่เข้าสิ่งที่คุณพิมพ์. คุณอาจจะพิมพ์ผิด. ได้โปรดพิมพ์ใหม่อีกครั้งหนึ่ง"
    );
  }
}

async function reply(reply_token, msg) {
  console.log("replying");

  let headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer {" + process.env.CHANNEL_ACCESS_TOKEN + "}",
  };

  let body = JSON.stringify({
    replyToken: reply_token,
    messages: Array.isArray(msg)
      ? msg.map((message) => ({ type: "text", text: message }))
      : [{ type: "text", text: msg }],
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

function groupByKey(array, key) {
  return array.reduce((hash, obj) => {
    if (obj[key] === undefined) return hash;
    return Object.assign(hash, {
      [obj[key]]: (hash[obj[key]] || []).concat(obj),
    });
  }, {});
}

function thousands_separators(num) {
  var num_parts = num.toString().split(".");
  num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return num_parts.join(".");
}

function check(Arr) {
  let group = groupByKey(Arr, "amount");

  let result = 0;
  Object.keys(group).map((type) => {
    result += Number(type) * group[type].length;
  });

  return result;
}
