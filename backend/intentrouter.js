const express = require('express');
const router = require('express').Router();


router.use('/chat',   require('../controllers/chat'));   // ->   /chat/*

module.exports = router;
