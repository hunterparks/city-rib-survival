import { Config as AppConfig } from "../config/config";
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';
import { JsonDB } from 'node-json-db';
import * as path from 'path';

export class DatabaseService {
    private _db: JsonDB;
    constructor(databaseName: string) {
        this._db = new JsonDB(new Config(path.join(__dirname, '../data', databaseName), true, AppConfig.BOT_ENV === 'DEV', '/'));
    }
    public getDb(): JsonDB {
        return this._db;
    }
}