const sql = require('mssql/msnodesqlv8')

const config = {
    server : 'FLUTTER3\\SQLEXPRESS',
    database: 'employees',
    driver : 'msnodesqlv8',
    user : 'parth',
    password : '1234',
    options: {
        trustedConnection : true
    }
  };
  
  async function DB_connection() {
    try {
        const result = await sql.connect(config);
        console.log('DB connected');
    } catch (error) {
        if (error.code === 'ETIMEOUT') {
            console.error('Connection timeout:', error);
        } else if (error.code === 'ELOGIN') {
            console.error('Authentication failed:', error);
        } else if (error.code === 'ESERVERNOTFOUND') {
            console.error('Server not found:', error);
        } else {
            console.error('Other error:', error);
        }
    }
}

module.exports = {DB_connection}