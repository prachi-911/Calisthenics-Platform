class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    this.paginationMeta = {};
  }

  // 1. Filtering
  filter(searchFields = []) {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields", "search", "q"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Handle search query
    const searchTerm = this.queryString.search || this.queryString.q;
    if (searchTerm && searchFields.length > 0) {
      queryObj.$or = searchFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      }));
    }

    // Advanced filtering for gte, gt, lte, lt
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  // 2. Sorting
  sort(defaultSort = "-createdAt") {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort(defaultSort);
    }
    return this;
  }

  // 3. Field Limiting
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  // 4. Pagination
  async paginate() {
    const page = Math.max(1, parseInt(this.queryString.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(this.queryString.limit, 10) || 10));
    const skip = (page - 1) * limit;

    // Clone query to count documents matching the filter
    const totalCount = await this.query.model.countDocuments(this.query.getQuery());
    const totalPages = Math.ceil(totalCount / limit);

    this.query = this.query.skip(skip).limit(limit);

    this.paginationMeta = {
      page,
      limit,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    return this;
  }
}

module.exports = APIFeatures;
