// Recursive sanitization of keys starting with '$' or containing '.'
const cleanObject = (obj) => {
  if (!obj || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map(cleanObject);
  }

  const cleaned = {};
  for (const key of Object.keys(obj)) {
    if (!key.startsWith("$") && !key.includes(".")) {
      cleaned[key] = cleanObject(obj[key]);
    }
  }
  return cleaned;
};

const mongoSanitize = (req, res, next) => {
  if (req.body) req.body = cleanObject(req.body);
  if (req.query) req.query = cleanObject(req.query);
  if (req.params) req.params = cleanObject(req.params);
  next();
};

module.exports = mongoSanitize;
