import mysql from "mysql2";

export const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

const keepConnectionAlive = () => {
    db.query("SELECT 1", (err) => {
        if (err) {
            console.error("Error keeping the connection alive:", err);
        }
    });
};

const keepAliveInterval = setInterval(keepConnectionAlive, 5 * 60 * 1000);

export function endDatabaseConnection() {
    clearInterval(keepAliveInterval);
    db.end((err) => {
        if (err) {
            console.error("Error while closing the database connection:", err);
        } else {
            console.log("Database connection closed.");
        }
    });
}