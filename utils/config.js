const { JWT_SECRET = "hi-youguys" } = process.env;
console.log(JWT_SECRET);
module.exports = { JWT_SECRET };
