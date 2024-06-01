const { urlencoded } = require('body-parser');
const express = require('express');
const app = express();
const axios = require('axios');
const crypto = require('crypto');

app.use(express.json());
app.use(urlencoded({ extended: true }));

const accessKey = 'F8BBA842ECF85';
const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
const redirectUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
const ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
const autoCapture = true;
const lang = 'vi';
const partnerCode = 'MOMO';
const requestType = "payWithMethod";
const orderId = partnerCode + new Date().getTime();
const requestId = orderId;

const orderInfo = 'pay with MoMo';
const amount = '50000';
const extraData = '';
const orderGroupId = '';

app.post("/payment", async (req, res) => {


    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');

    const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        partnerName: "Test",
        storeId: "MomoTestStore",
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        lang: lang,
        requestType: requestType,
        autoCapture: autoCapture,
        extraData: extraData,
        orderGroupId: orderGroupId,
        signature: signature
    });

    const options = {
        method: 'POST',
        url: "https://test-payment.momo.vn/v2/gateway/api/create",
        headers: {
            'Content-Type': 'application/json',
            "Content-Length": Buffer.byteLength(requestBody),
            'Access-Control-Allow-Origin': '*', // Cho phép truy cập từ mọi nguồn
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS', // Cho phép các phương thức
            'Access-Control-Allow-Headers': 'Content-Type, Authorization' // Cho phép các headers
        },
        data: requestBody,
    };

    try {
        const result = await axios(options);
        return res.status(200).json(result.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            statusCode: 500,
            message: "Server error"
        });
    }
});

// app.post('/callback', async (req, res) => {
//     /**
//       resultCode = 0: giao dịch thành công.
//       resultCode = 9000: giao dịch được cấp quyền (authorization) thành công .
//       resultCode <> 0: giao dịch thất bại.
//      */
//     console.log('callback: ');
//     console.log(req.body);
//     /**
//      * Dựa vào kết quả này để update trạng thái đơn hàng
//      * Kết quả log:
//      * {
//           partnerCode: 'MOMO',
//           orderId: 'MOMO1712108682648',
//           requestId: 'MOMO1712108682648',
//           amount: 10000,
//           orderInfo: 'pay with MoMo',
//           orderType: 'momo_wallet',
//           transId: 4014083433,
//           resultCode: 0,
//           message: 'Thành công.',
//           payType: 'qr',
//           responseTime: 1712108811069,
//           extraData: '',
//           signature: '10398fbe70cd3052f443da99f7c4befbf49ab0d0c6cd7dc14efffd6e09a526c0'
//         }
//      */

//     return res.status(204).json(req.body);
// });

app.post('/check-status-transaction', async (req, res) => {
    const { orderId } = req.body;

    // const signature = accessKey=$accessKey&orderId=$orderId&partnerCode=$partnerCode
    // &requestId=$requestId
    var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    var accessKey = 'F8BBA842ECF85';
    const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;

    const signature = crypto
        .createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');

    const requestBody = JSON.stringify({
        partnerCode: 'MOMO',
        requestId: orderId,
        orderId: orderId,
        signature: signature,
        lang: 'vi',
    });

    // options for axios
    const options = {
        method: 'POST',
        url: 'https://test-payment.momo.vn/v2/gateway/api/query',
        headers: {
            'Content-Type': 'application/json',
        },
        data: requestBody,
    };

    const result = await axios(options);

    return res.status(200).json(result.data);
});

app.listen(5000, () => {
    console.log("Server is running at port 5000");
});
