// import { useEffect, useState } from "react";
import fs, { read } from "fs";



import axios from "axios";
// import admin from "./admin";
var QrCode = require("qrcode-reader");
var Jimp = require("jimp");

const request = require("request");
require("dotenv").config();

const line = require("@line/bot-sdk");

import { uploadFile } from "../../util/googledrive";


export default function test(req, res) {
  const couponInfo = {
    _id: "",
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

  const adminInfo = {
    _id: "",
    username: "",
    userId: "",
    groupId: [],
    status: "",
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

  const message = {
    type: "text",
    text: "",
  };


  processMessage();

  async function processMessage() {
    if (event.message.type !== "text") {

      
      let adminList = await fetch(process.env.API + "/admin", {
                      method: "GET", // *GET, POST, PUT, DELETE, etc.
                      }).then((response) => response.json())

      await adminList.map(admin => {
        if(id === admin.userId && admin.groupId.includes(GID)){
        // console.log("admin status ",admin.status)
          adminInfo.status = admin.status
          adminInfo.username = admin.username
        }
      })


      if (adminInfo.status == "SA" || adminInfo.status == "SO") {
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


        // console.log("couponUsed ",couponNotUsed)

          await client
            .getProfile(id)
            .then((profile) => {
              // couponInfo.recordedBy.userID = profile.userId;
              couponInfo.recordedBy.name = profile.displayName;
              // console.log(profile.displayName);
              // console.log(profile.userId);
              // console.log("TimeStamp ==> ", timeSt);
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
              //fs.writeFile('logo.png', imagedata, 'binary', function(err){
    
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
                        couponInfo.recordedBy.name +
                        "\n--------------------------------------------------- \nคูปองนี้ได้ถูกบันทึกแล้ว";
                      
                      check(checkValue) >= 3000 ? reply(reply_token, botReply) : 
                                                    reply(reply_token, [botReply, "ยอดคงเหลือของคุณ เหลือ\n" + thousands_separators(check(checkValue)) + " บาท กรุณาเติมเงิน"])

                      fetch(process.env.API+'/coupon/used', {
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
                              name: couponInfo.recordedBy.name,
                            },
                          }) // body data type must match "Content-Type" header
                        })                            
                      
                    }else if(couponUsed['true'].some(coupon => coupon.code === value.result)){
                      let botReply = "คูปองนี้ได้ถูกใช้แล้ว.";
                      reply(reply_token, botReply);
                    }else if(couponUsed['missing'].some(coupon => coupon.code === value.result)){
                      let botReply = "คูปองนี้ได้ถูกบันทึกว่า สูญหาย.";
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
        if (adminInfo.status == "SA" || adminInfo.status == "SO") {
          console.log("admin status inside  ", adminInfo.status)

          let replyCheckGroupID = "GroupID คือ " + GID;

          reply(reply_token, replyCheckGroupID);
          
        } else {
          reply(reply_token, "คุณไม่มีสิทธิใช้คำสั่งนี้ค่ะ");
        }
      } else if (event.message.text == "สอบถามยอด") {
        if (adminInfo.status == "SA" || adminInfo.status == "SO" || adminInfo.status == "EN") {
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
            // console.log(result, type, group[type].length)
          })

          let text =  "ยอดมูลค่าคูปอง คงเหลือทั้งหมด " + thousands_separators(result) + " บาท.\n\n" +
                     textpart

          reply(reply_token, text)
          
        } 
      } else if (event.message.text == "คำสั่งบอท") {
        let replyCommand = "";
        if (adminInfo.status == "SO") {
          replyCommand =
            "สอบถามยอด : สอบถามยอดคงเหลือคูปอง\nสอบถาม GroupID : เช็คเลข GroupID ของ LINE Group นี้ \nขอเป็น admin 'xxxxxxxxxx' : พิมพ์คำสั่งแล้วใส่ password 10 หลัก เพื่อขอเป็น Admin ของ LINE Group นี้\n";
        } else if (adminInfo.status == "SA") {
          replyCommand =
            "สอบถาม GroupID : เช็คเลข GroupID ของ LINE Group นี้ \nขอเป็น admin 'xxxxxxxxxx' : พิมพ์คำสั่งแล้วใส่ password 10 หลัก เพื่อขอเป็น Admin ของ LINE Group นี้\n";
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
        // console.log("this is GID  ", GID)
        reply(
          reply_token,
          "ขอโทษค่ะ น้องรถถังไม่เข้าสิ่งที่คุณพิมพ์. คุณอาจจะพิมพ์ผิด. ได้โปรดพิมพ์ใหม่อีกครั้งหนึ่ง"
        );
        
      }
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



function reply(reply_token, msg) {
  
  
  if(Array.isArray(msg)){
    
      let headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer {" + process.env.CHANNEL_ACCESS_TOKEN + "}",
      };

      let body = JSON.stringify({
      replyToken: reply_token,
      messages: 
        
        msg.map(message => ({type: "text", text: message})),

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
  
  }else{

    let headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer {" + process.env.CHANNEL_ACCESS_TOKEN + "}",
    };
    
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
  // console.log('msg:', msg)
  
}

function check(Arr) {
  let group = groupByKey(Arr, "amount")
         
  let result = 0
  Object.keys(group).map(type => {
    result += Number(type) * group[type].length
  })

  return result
}
