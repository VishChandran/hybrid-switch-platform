const express = require("express");
const router = express.Router();

const {
  createTransaction,
  getTransactionById
} = require("../controllers/transactionController");

router.post("/", createTransaction);
router.get("/:id", getTransactionById);

module.exports = router;