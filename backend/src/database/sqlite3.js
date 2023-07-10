import Sqlite3 from 'sqlite3';
const sqlite = Sqlite3.verbose();
import path from 'path';
import fsAsync from 'fs/promises'

export class Sqlite3DataSource {

    constructor(dirPath, fileName) {
        this.dirPath = dirPath;
        this.dbName = fileName;
    }

    async createDatabase() {
        const targetPath = path.join(this.dirPath, this.dbName);

        let isAlreadyExist = false;

        try {
            await fsAsync.access(targetPath, fsAsync.constants.R_OK | fsAsync.constants.W_OK)
            isAlreadyExist = true;
        } catch {}

        if (isAlreadyExist) {
            throw new ReferenceError(`${this.dbName} is already exist in the path [${this.dirPath}]`);
        }

        this.dbClient = new sqlite.Database(
            path.join(this.dirPath, this.dbName),
        )
    }

    
}

(async()=>{
    const {ESM} = await import('../common/esm.js')
    const esm = new ESM(import.meta.url);
    const dataSource = new Sqlite3DataSource(esm.dirPath, "test.db");
    await dataSource.createDatabase();


})()