const PayOS = require('@payos/node');
const express = require('express');

const payos = new PayOS('460f7d0c-3484-481a-b32f-2516bcaa4226','e2969f8d-e7d9-48c9-935b-9f85e9204c16','1a58b965626f6432ad4687edd071f232ff3f93eeadf8dfdd876f651436e51a27');
const app = express();

app.use(express.static('public'));
app.use(express.json());

const yourdomain = 'http://localhost:3000';

app.post('/create-payment-link', async (req, res) => {
    const order = {
        amount: 10000,
        description: 'Hi',
        orderCode: 13,
        cancelUrl: `${yourdomain}/cancel.html`,
        returnUrl: `${yourdomain}/success.html`
    };

    try {
        const paymentLink = await payos.createPaymentLink(order);
        res.redirect(303, paymentLink.checkoutUrl);
    } catch (error) {
        console.error('Error creating payment link:', error);
        res.status(500).send('Internal Server Error');
    }
});

// https://7058-14-177-254-106.ngrok-free.app/receive-hook
app.post("/receive-hook", async(req,res) =>{
    console.log(req.body);
    res.json();
 })
 
app.listen(3000, () => console.log('Running on port 3000'));