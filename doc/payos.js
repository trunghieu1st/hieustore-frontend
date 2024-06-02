const cors = require('cors');
const express = require('express');
const PayOS = require('@payos/node');
const CryptoJS = require('crypto-js'); // npm install crypto-js
const bodyParser = require('body-parser'); // npm install body-parser
const axios = require('axios').default; // npm install axios
const moment = require('moment'); // npm install moment
const qs = require('qs');

const payos = new PayOS('460f7d0c-3484-481a-b32f-2516bcaa4226', 'e2969f8d-e7d9-48c9-935b-9f85e9204c16', '1a58b965626f6432ad4687edd071f232ff3f93eeadf8dfdd876f651436e51a27');
const app = express();

app.use(cors()); // This will allow all domains by default. For production, configure it appropriately.
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const baseUrl = 'http://127.0.0.1:5500';

app.post('/create-payment-link', async (req, res) => {
    const { amount, description, orderCode } = req.body;
    const order = {
        amount: amount,
        description: description,
        orderCode: orderCode,
        cancelUrl: baseUrl + `/frontend/doc/user_order.html`,
        returnUrl: baseUrl + `/frontend/doc/user_order.html`
    };

    try {
        const paymentLink = await payos.createPaymentLink(order);
        if (paymentLink && paymentLink.checkoutUrl) {
            res.json({ checkoutUrl: paymentLink.checkoutUrl });
        } else {
            console.error('No checkout URL returned');
            res.status(500).send('Error creating payment link');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating payment link: ' + error.message);
    }
});

app.post("/receive-hook", async (req, res) => {
    console.log(req.body);
    res.json();
});

// ZAlo payment
const config = {
    app_id: '2553',
    key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
    key2: 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
    endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
};

app.post('/zalo/payment', async (req, res) => {
    const { app_user, amount, description, bank_code } = req.body;

    const embed_data = {
        redirecturl: baseUrl + '/frontend/doc/user_order.html',
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
        callback_url: baseUrl + '/callback', // Thay bằng URL của bạn
        description: description || `HieuStore -Thanh toán đơn hàng #${transID}`,
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

app.listen(3000, () => console.log('Running on port 3000'));
