import { Config } from '../config/config';
import { ConsoleLoggingService as log } from './console-logging-service';
import { DatabaseService } from './database-service';
import * as Discord from 'discord.js';
import { JsonDB } from 'node-json-db';

const DATABASE_NAME = 'bot-info';
const RELEASE_NOTES: Map<string, Discord.MessageEmbed> = new Map([
    [
        '1.1.4', new Discord.MessageEmbed({
            color: 0x0080FF,
            description: '',
            fields: [
                {
                    name: 'New Features ✨',
                    value: [
                        'Display release note information',
                        'Added more logging (still not enough 🙃)',
                        'Created new utility functions'
                    ].map(value => `• ${value}`).join('\n')
                },
                {
                    name: 'Bug Fixes 🐛',
                    value: [
                        'Catch exceptions when getting MC server status'
                    ].map(value => `• ${value}`).join('\n')
                },
                {
                    name: '\u200B',
                    value: 'See full commit history [on github](https://github.com/hunterparks/city-rib-survival/commits/master)'
                }
            ],
            title: '🚀  1.1.4 Release Notes  🚀'
        })
    ]
]);

export class BotInfoDbService {
    private _db: JsonDB;
    constructor() {
        this._db = new DatabaseService(DATABASE_NAME).getDb();
    }
    public postReleaseNotes(channel: Discord.TextChannel): void {
        let storedVersion;
        try {
            storedVersion = this._db.getData('/version');
        } catch (error) {
            storedVersion = '0.0.0';
        }
        if (storedVersion === Config.VERSION) return;
        const releaseNotes = RELEASE_NOTES
            .get(Config.VERSION) as Discord.MessageEmbed;
        if (!releaseNotes) return;
        log.info(`Publishing ${Config.VERSION} release notes`);
        channel.send(releaseNotes).then(() => {
            this._db.push('/version', Config.VERSION, true);
        });
    }
}