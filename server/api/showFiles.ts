import mysql2 from 'mysql2/promise';

export default defineEventHandler(async (event) => {

    const connection = await mysql2.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Ячйц16129!',
        database: 'csv_project',
    });

    const [tables] = await connection.query<any[]>('SHOW TABLES');
    const length = tables.length-1;
    const tableName = tables[length]['Tables_in_csv_project'];
    const [rows] = await connection.query(`SELECT * FROM \`${tableName}\``);
    await connection.end();
    return {
        rows: rows,
        tables: tables,
    }
});