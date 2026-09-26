const { globalSearchService } = require("../services/searchService");

const searchAll = async (req, res) => {
  try {
    const result = await globalSearchService(req.query);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  searchAll,
};
