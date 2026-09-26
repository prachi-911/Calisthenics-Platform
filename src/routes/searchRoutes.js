const express = require("express");
const { searchAll } = require("../controllers/searchController");

const router = express.Router();

// GET /api/v1/search?q=pull-up&type=all&limit=5
router.get("/", searchAll);

module.exports = router;
