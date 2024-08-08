import express from 'express';
import axios from 'axios';
import cors from 'cors';

const router = express.Router();
router.use(cors());

function headerRequestTransbank() {
    return {
        "Authorization": "Token",
        "Tbk-Api-Key-Id": "597055555532",
        "Tbk-Api-Key-Secret": "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        'Referrer-Policy': 'origin-when-cross-origin'
    };
}

router.post('/transaction/create', async (req, res) => {
    const data = req.body;
    const url = "https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions";
    const headers = headerRequestTransbank();

    try {
        const response = await axios.post(url, data, { headers });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating transaction' });
    }
});

router.put('/transaction/commit/:tokenws', async (req, res) => {
    const tokenws = req.params.tokenws;
    const url = `https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions/${tokenws}`;
    const headers = headerRequestTransbank();

    try {
        const response = await axios.put(url, {}, { headers });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error committing transaction' });
    }
});

router.post('/transaction/reverse-or-cancel/:tokenws', async (req, res) => {
    const tokenws = req.params.tokenws;
    const data = req.body;
    const url = `https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions/${tokenws}/refunds`;
    const headers = headerRequestTransbank();

    try {
        const response = await axios.post(url, data, { headers });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error reversing or cancelling transaction' });
    }
});

export default router;