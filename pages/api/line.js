import { useEffect, useState } from 'react';
import fs, { read } from 'fs'

import axios from 'axios';
var QrCode = require('qrcode-reader');
var Jimp = require("jimp");

const request = require('request')
require('dotenv').config()

// const redis = require('redis')
// const client = redis.createClient();

// client.on("error", function(error) {s
//   console.error(error);
// });


// client.set("key", "value", redis.print);
// client.get("key", redis.print);
let count = 0

const cal_state = []

let calState = false
// 

const line = require('@line/bot-sdk');

let resultData = {}

export default function test(req, res) {


    // handle LINE BOT webhook verification
    // The verification message does not contain any event, so length is zero.
    if (req.body.events.length === 0) {
        res.status(200).json({})
        // console.log("hello")
        reply("Hello")   // can reply anything
        return
    }

    let event = req.body.events[0];

    let reply_token = event.replyToken

    let arr = []
    let path = './public/img/QR-Code.png'

    let id = event.source.userId


    if (event.message.type !== 'text') {

        const client = new line.Client({
            channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
        });

        client.getMessageContent(event.message.id)
            .then((stream) => {
                stream.on('data', (chunk) => {
                    console.log(chunk)
                    // let size = Buffer.byteLength(chunk)
                    // stream.push(chunk)
                    arr.push(chunk)
                    // stream.read(size)
                    // fs.writeFile('/public/img/logo.png', chunk, function (err) {
                    //     if (err) throw err
                    //     console.log('File saved.')
                    // })
                    // let imageDataY = new Uint8ClampedArray(arr);
                    // console.log('imageDataY', imageDataY)
                    // const code = jsQR(arr, 200, 200)
                    // if (code) {
                    //     console.log("Found QR code", code);
                    //     console.log("Result", code.data);
                    // } else {
                    //     console.log("Do not detect code.")
                    // }
                });

                stream.on('error', (err) => {
                    console.log("Error", err)
                });

                stream.on('end', function () {

                    //fs.writeFile('logo.png', imagedata, 'binary', function(err){

                    var buffer = Buffer.concat(arr)
                    fs.writeFileSync(path, buffer, function (err) {
                        if (err) throw err
                        console.log('File saved.')
                    })
                })

                stream.on('end', function () {
                    console.log("Read Pic")
                    const imageFile = './public/img/QR-Code.png'
                    var qr = new QrCode();

                    var buffer = fs.readFileSync(imageFile);
                    Jimp.read(buffer, function (err, image) {
                        if (err) {
                            console.error(err);
                            // TODO handle error
                        }
                        var qr = new QrCode();
                        qr.callback = function (err, value) {
                            if (err) {
                                console.error(err);
                                // TODO handle error
                            }
                            resultData = value
                            console.log(value);
                            console.log('resultData ====> ', resultData.result)
                            reply(reply_token, resultData.result)
                        };
                        qr.decode(image.bitmap);
                    });
                })
            });

        reply(reply_token, event.message.text)


    } else {
        postToDialogflow(req)
    }

}

// function readPic() {
//     console.log("Read Pic")
//     const imageFile = './public/img/QR-Code.png'
//     var qr = new QrCode();

//     var buffer = fs.readFileSync(imageFile);
//     Jimp.read(buffer, function(err, image) {
//         if (err) {
//             console.error(err);
//             // TODO handle error
//         }
//         var qr = new QrCode();
//         qr.callback = function(err, value) {
//             if (err) {
//                 console.error(err);
//                 // TODO handle error
//             }
//             resultData = value
//             // console.log(value);
//             console.log('resultData ====> ', resultData)
//         };
//         qr.decode(image.bitmap);
//     });

//     return {
//         resultData
//     }
// }

function reply(reply_token, msg) {


    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer {' + process.env.CHANNEL_ACCESS_TOKEN + '}'
    }

    // console.log('msg:', msg)
    let body = JSON.stringify({
        replyToken: reply_token,
        messages: [{
            type: 'text',
            text: msg
        }]
    })
    console.log("reply =============> ", body)

    request.post({
        url: 'https://api.line.me/v2/bot/message/reply',
        headers: headers,
        body: body
    }, (err, res, body) => {
        // console.log('status = ' + res.statusCode);

        // console.log("body ====> ", res.body)
    });
}

const postToDialogflow = req => {
    req.headers.host = "dialogflow.cloud.google.com"
    axios({
        url: "https://dialogflow.cloud.google.com/v1/integrations/line/webhook/e8cc963c-2816-4340-892f-f424247eb2f5",
        headers: req.headers,
        method: "post",
        data: req.body
    })
}
