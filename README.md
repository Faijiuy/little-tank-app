# little-tank-app

how to setup
1. create 4 collections in MongoDB: 
    1) admin 
    2) coupons 
    3) customer 
    4) user

![image](https://user-images.githubusercontent.com/51190092/138553568-fefe0334-6da3-4b1f-8786-d7e418542704.png)

2. deploy to VERCEL and add following Environment Variables in to vercel setting:
    1) API: using deployed website URL follow by /api e.g. https://little-tank-app.vercel.app/api
    2) MONGODB_URI
    3) MONGODB_DB
    4) CHANNEL_SECRET (from LINE messaging API)
    5) CHANNEL_ACCESS_TOKEN (from LINE messaging API)

![image](https://user-images.githubusercontent.com/51190092/138554401-4c24cfae-315a-4d75-91ed-37f4df893175.png)

3. change webhook URL in LINE Messaging API (LINE BOT) use the same URL as 2.1) API but follow by /line

![image](https://user-images.githubusercontent.com/51190092/138554481-4f659acb-889b-4ef7-9b24-8b0032937a74.png)
