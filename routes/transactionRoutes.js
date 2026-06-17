const express = require("express");
const router = express.Router();
const { validateTransactionRequest } = require("../middleware/transactionValidation");

const {
  createTransaction,
  getTransactionById
} = require("../controllers/transactionController");

router.post("/", validateTransactionRequest, createTransaction);
router.get("/:id", getTransactionById);

module.exports = router;
