require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const { MONGO_URL, MONGO_DB } = process.env;

const app = express();

mongoose.set('strictQuery', true);
mongoose.connect(`${MONGO_URL}/${MONGO_DB}`, () => {
  console.log(`Connected to MongoDB. Database: ${MONGO_DB}`);
});

module.exports = app;
