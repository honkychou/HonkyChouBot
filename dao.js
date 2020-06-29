const sqlite3 = require('better-sqlite3');
const db_path = './ssss';

var VideoBank = function () {
    // connect if not exist then create
    let db = new sqlite3(db_path, { verbose: console.log });
    // create table if not exist
    let sql =
        'CREATE TABLE IF NOT EXISTS VideoBank (id INTEGER PRIMARY KEY AUTOINCREMENT, ytcode STRING, file_id STRING);';
    db.prepare(sql).run();

    this.checkCode = function (code) {
        const stmt = db.prepare(
            'SELECT file_id FROM VideoBank WHERE ytcode = ?'
        );
        const row = stmt.get(code);

        return row ? row.file_id : false;
    };

    this.insertCode = function (code, file) {
        const stmt = db.prepare(
            'INSERT INTO VideoBank (ytcode, file_id) VALUES (?, ?)'
        );
        const info = stmt.run(code, file);
    };
};

module.exports = VideoBank;
