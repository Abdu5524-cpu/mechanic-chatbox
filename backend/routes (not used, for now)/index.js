const express = require('express');
const router = require('express').Router();


router.use('/chat',   require('./chat'));   // ->   /api/chat/*

module.exports = router;
