import mysql from 'mysql2/promise';

export default defineEventHandler(async (event) => {

    const body = await readBody(event);
    const data = body.data;

    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Ячйц16129!',
        database: 'csv_project',
    });

    const dateYear = new Date().getFullYear();
    const dateMonth = new Date().getMonth() + 1;
    const dateDay = new Date().getDate();

    const tableName = `upload_${dateYear}-${dateMonth}-${dateDay}|${Date.now()}`;

    await connection.execute(
        `CREATE TABLE\`${tableName}\` (
        row_id INT AUTO_INCREMENT PRIMARY KEY,
        id INT,
        name VARCHAR(50),
        date DATE,
        value1 FLOAT,
        value2 FLOAT,
        status ENUM('active', 'inactive', 'pending'))`
    );

    const insertQuery =
    `INSERT INTO \`${tableName}\` (id, name, date, value1, value2, status) VALUES (?, ?, ?, ?, ?, ?)`;

    for (const row of data) {
        await connection.execute(insertQuery, [
            row.id,
            row.name,
            row.date,
            row.value1,
            row.value2,
            row.status
        ]);
    }
});