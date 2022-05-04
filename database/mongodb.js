const mongoose = require('mongoose')
const logger = require('../utils/logger')
const url = process.env.MONGODB_URI

logger.info("Connecting to mongoDB...")

mongoose
  .connect(url)
  .then(() => {
    logger.info("Successfully connected to MongoDB!")
  }).catch(err => {
  logger.error("Failed to connect to MongoDB: ", err.message)
})