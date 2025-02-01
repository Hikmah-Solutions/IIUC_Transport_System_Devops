const express = require('express');  
const router = express.Router();
const { Support } = require('../../models');


router.get('/', async (req, res) => {
    try {
        const support = await Support.findAll();
        res.json(support);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;


