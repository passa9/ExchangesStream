/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();

router.get('/index', (req, res) => {
    res.render('stream/index');
});

exports.router = router;