const PORT= process.env.PORT || 3306
const DB_HOST= process.env.DB_HOST || "mysql.railway.internal";
const DB_USER= process.env.DB_USER || "root";
const DB_PASSWORD= process.env.DB_PASSWORD || "trhKjygWDnafQSMqykOkifLeAmhZThwL";
const DB_DATABASE= process.env.DB_DATABASE || "railway";



module.exports = {
    PORT,
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_DATABASE

}
