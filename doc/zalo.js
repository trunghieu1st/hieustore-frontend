const axios = require('axios').default; // npm install axios
const CryptoJS = require('crypto-js'); // npm install crypto-js
const express = require('express'); // npm install express
const bodyParser = require('body-parser'); // npm install body-parser
const moment = require('moment'); // npm install moment
const qs = require('qs');
const cors = require('cors');
const app = express();

// APP INFO, STK TEST: 4111 1111 1111 1111
const config = {
    app_id: '2553',
    key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
    key2: 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
    endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
};


app.use(cors()); 
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
// {
//     "app_user": "user123",
//     "amount": 200,
//     "description": "Lazada - Payment for the order #123456",
//     "bank_code": ""
//   }
app.post('/zalo/payment', async (req, res) => {
    const { app_user, amount, description, bank_code } = req.body;

    const embed_data = {
        redirecturl: 'http://127.0.0.1:5500/hieustore_user/user_order.html',
    };

    const items = [];
    const transID = Math.floor(Math.random() * 1000000);

    const order = {
        app_id: config.app_id,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
        app_user: app_user || 'user123',
        app_time: Date.now(),
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: amount || 200,
        callback_url: 'https://your_ngrok_url.ngrok.io/callback', // Thay bằng URL của bạn
        description: description || `Lazada - Payment for the order #${transID}`,
        bank_code: bank_code || '',
    };

    const data =
        config.app_id +
        '|' +
        order.app_trans_id +
        '|' +
        order.app_user +
        '|' +
        order.amount +
        '|' +
        order.app_time +
        '|' +
        order.embed_data +
        '|' +
        order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
        const result = await axios.post(config.endpoint, null, { params: order });
        return res.status(200).json(result.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Payment creation failed' });
    }
});

app.post('/zalo/callback', (req, res) => {
    let result = {};
    try {
        const { data, mac: reqMac } = req.body;

        const mac = CryptoJS.HmacSHA256(data, config.key2).toString();

        if (reqMac !== mac) {
            result.return_code = -1;
            result.return_message = 'mac not equal';
        } else {
            const dataJson = JSON.parse(data);
            console.log("update order's status = success where app_trans_id =", dataJson['app_trans_id']);

            result.return_code = 1;
            result.return_message = 'success';
        }
    } catch (ex) {
        console.error('Error:', ex.message);
        result.return_code = 0;
        result.return_message = ex.message;
    }

    res.json(result);
});



app.post('/zalo/check-status-order', async (req, res) => {
    const { app_trans_id } = req.body;

    let postData = {
        app_id: config.app_id,
        app_trans_id,
    };

    let data = postData.app_id + '|' + postData.app_trans_id + '|' + config.key1;
    postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    let postConfig = {
        method: 'post',
        url: 'https://sb-openapi.zalopay.vn/v2/query',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify(postData),
    };

    try {
        const result = await axios(postConfig);
        return res.status(200).json(result.data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Order status check failed' });
    }
});

app.listen(8888, () => {
    console.log('Server is listening at port 8888');
});
