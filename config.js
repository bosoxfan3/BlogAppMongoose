let PORT = process.env.PORT || 8080;
let DATABASE_URL = process.env.DATABASE_URL ||
									global.DATABASE_URL ||
									'mongodb://localhost/blog-app';
module.exports = {PORT, DATABASE_URL};