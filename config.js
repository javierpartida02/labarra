const PORT = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "1234";
const DB_DATABASE = process.env.DB_DATABASE || "restaurante";
const DB_PORT = process.env.DB_PORT || 3306;


module.exports = {
    DB_PORT,
    PORT,
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_DATABASE
};
