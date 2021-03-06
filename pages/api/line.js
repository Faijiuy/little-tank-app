import { format } from 'date-fns'
var QrCode = require("qrcode-reader");
var Jimp = require("jimp");

const line = require("@line/bot-sdk");
const request = require("request");
const { Readable } = require("stream");

require("dotenv").config();

export default async function test(req, res) {
  if (req.body.events.length === 0) {
    res.status(200).json({});
    reply("Hello"); // can reply anything
    return;
  }

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

  let tStp = "";
  tStp += date.getDate() + "/";
  tStp += date.getMonth() + 1 + "/";
  tStp += date.getFullYear();

  if (event.message.text && event.message.text.includes("ขอเป็น admin")) {
    let parts = event.message.text.split(" ");

    let passwords = await fetch(process.env.API + "/admin/password", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
    }).then((response) => response.json());

    if(GID === undefined){
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
                  },
                  redirect: "follow", // manual, *follow, error
                  referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                  body: JSON.stringify({ password: password.password }),
                }) // body data type must match "Content-Type" header
              );
          }
        })
    }

  } else if (event.message.text == "สอบถามไอดี") {
    reply(reply_token, "ไอดีของคุณคือ " + id)
  }
  else if (event.message.text == "สอบถามรหัสไลน์กลุ่ม") {
    let customers = await fetch(process.env.API + "/customer", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
    }).then((response) => response.json());

    let customer = customers.filter((customer) => customer.groupID === GID);

    if (customer[0] === undefined) {
      let replyCheckGroupID = "รหัสไลน์กลุ่ม คือ " + GID;
      reply(reply_token, replyCheckGroupID);
    } else {
      let replyCheckGroupID = "ไลน์กลุ่มนี้มีในระบบแล้ว และจะไม่สามารถใช้คำสั่งนี้ได้อีก";
      reply(reply_token, replyCheckGroupID);
    }
  } else if (event.message.text == "สอบถามยอด") {
    let admins = await fetch(process.env.API + "/admin", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
    }).then((response) => response.json());

    let customers = await fetch(process.env.API + "/customer", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
    }).then((response) => response.json());

    let admin = await admins.filter(
      (admin) => admin.userId === id && admin.groupId.includes(GID)
    );

    let today = new Date()
    let todayDate = ""

    if(today.getFullYear >= 2564){
      todayDate = format(today, "dd/MM") + "/" + (today.getFullYear() - 543); 
    }else{
      todayDate = format(today, "dd/MM/yyyy"); 
    }

    if (
      admin[0].status == "แคชเชียร์" ||
      admin[0].status == "เจ้าของ หรือ ผู้ช่วย" ||
      admin[0].status == "ลูกค้า"
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

      let couponToday = await coupons.filter((coupon) =>  coupon.companyRef === customer[0]._id &&
                                                          coupon.used === true &&
                                                          coupon.usedDateTime === todayDate
                                                      );

      console.log('couponToday: ', couponToday)

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

    if (admin[0].status == "เจ้าของ หรือ ผู้ช่วย" || admin[0].status == "แคชเชียร์") {
      replyCommand =
        "สอบถามยอด : สอบถามยอดคงเหลือคูปอง\nสอบถาม groupid : เช็คเลข GroupID ของ LINE Group นี้\nไอดีของฉัน : เช็ค ID ของผู้ถาม";
    } else {
      replyCommand = "สอบถามยอด : สอบถามยอดคงเหลือคูปอง";
    }
    reply(reply_token, replyCommand);
  } else if(event.message.text == "ทะเบียนรถ"){
    let admins = await fetch(process.env.API + "/admin", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
    }).then((response) => response.json());

    let customers = await fetch(process.env.API + "/customer", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
    }).then((response) => response.json());

    let admin = await admins.filter(
      (admin) => admin.userId === id && admin.groupId.includes(GID)
    );

    if (admin[0].status == "แคชเชียร์" || admin[0].status == "เจ้าของ หรือ ผู้ช่วย" || admin[0].status == "ลูกค้า"){
      let replyCommand = "ทะเบียนรถ: "

      let customer = await customers.filter((customer) => customer.groupID === GID);

      if(!customer[0].licensePlate){
        reply(reply_token, "ขออภัย ขณะนี้ยังไม่มีเลขทะเบียนรถที่ลงทะเบียนไว้")
      }else{
        customer[0].licensePlate.map(license => {
          replyCommand += "\n" + license
        })
        reply(reply_token, replyCommand)
      }
    }
  }else if (event.message.type == "image") {
    console.log("yes")
    let admins = await fetch(process.env.API + "/admin", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
    }).then((response) => response.json());

    let admin = admins.filter(
      (admin) => admin.userId === id && admin.groupId.includes(GID)
    );

    if (admin[0].status == "แคชเชียร์" || admin[0].status == "เจ้าของ หรือ ผู้ช่วย") {
      let customers = await fetch(process.env.API + "/customer", {
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
          buffer1 = Buffer.concat(newArr);
          
        });

        stream.on("end", function () {
          
          Jimp.read(buffer1, function (err, image) {
            if (err) {
              console.error(err);
              // TODO handle error
            }

            var qr = new QrCode();
            qr.callback = function (err, value) {
              if (value) {
                let today = new Date()
                let recordDate = format(today, "dd/MM/yyyy"); 
                let recordDate2 = format(today, "dd/MM"); 

            

                let codeDetect = value.result.split("-");

                if (
                  couponUsed["false"] &&
                  couponUsed["false"].some(
                    (coupon) => coupon.code === value.result
                  )
                ) {
                  

                  let checkValue = couponUsed["false"].filter(
                    (coupon) => coupon.code !== value.result
                  );

                  let botReply =
                    "น้องรถถังสามารถอ่าน QR-code จากคูปองได้. \n--------------------------------------------------- \nชื่อบริษัท: " +
                    customer[0].company +
                    "\nคูปองราคา: " +
                    codeDetect[2] +
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
                    },
                    redirect: "follow", // manual, *follow, error
                    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                    body: JSON.stringify({
                      code: value.result,
                      used: true,
                      usedDateTime: today.getFullYear() >= 2564 ? recordDate2 + "/" + (today.getFullYear() - 543) : recordDate,
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
              }
            };
            qr.decode(image.bitmap);
          });
        });
      });
    }
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