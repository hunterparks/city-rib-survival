import { Config } from '../config/config';
import { ConsoleLoggingService as log } from './console-logging-service';
import { DatabaseService } from './database-service';
import * as Discord from 'discord.js';
import { JsonDB } from 'node-json-db';
import { UtilityService } from './utility-service';

const DATABASE_NAME = 'bot-info';
const RELEASE_NOTES_OBJECTS = [
    UtilityService.generateReleaseNotesMessageEmbed(
        '1.2.1',
        [ ],
        [ 'Github actions a bit more managable' ]
    ),
    UtilityService.generateReleaseNotesMessageEmbed(
        '1.1.10',
        [ 'Moved release notes to bot channel 🤖' ],
        [ ]
    ),
    UtilityService.generateReleaseNotesMessageEmbed(
        '1.1.9',
        [ 'Simplified release note processing 📝' ],
        [ ]
    ),
    UtilityService.generateReleaseNotesMessageEmbed(
        '1.1.6',
        [
            'Update `!status` command',
            'Create `StatusService`',
            'Remove `MC_SERVER_URL` from config',
            'Support multiline console logging'
        ],
        [ 'Catch more exceptions!' ]
    ),
    UtilityService.generateReleaseNotesMessageEmbed(
        '1.1.5',
        [ 'Added icon to status, if available 🖼' ],
        [ ]
    ),
    UtilityService.generateReleaseNotesMessageEmbed(
        '1.1.4',
        [
            'Display release note information',
            'Added more logging (still not enough 🙃)',
            'Created new utility functions'
        ],
        [ 'Catch exceptions when getting MC server status' ]
    )
];
const RELEASE_NOTES = new Map(RELEASE_NOTES_OBJECTS.map(note => [
    note.title?.replace('🚀  ', '').replace(' Release Notes  🚀', '') as string,
    note
]));

export class BotInfoDbService {
    private static _db: JsonDB;
    constructor() {
        BotInfoDbService._db = new DatabaseService(DATABASE_NAME).getDb();
    }
    public static addCommandStatusServers(server: string): boolean {
        const currentServers = BotInfoDbService.getCommandStatusServers();
        if (currentServers.includes(server)) return true;
        const before = BotInfoDbService._db.count('/command/status/servers');
        BotInfoDbService._db.push(`/command/status/servers[]`, { url: server });
        const after = BotInfoDbService._db.count('/command/status/servers');
        return after === before + 1;
    }
    public static getCommandStatusServers(): string[] {
        try {
            const servers = BotInfoDbService._db
                .getData('/command/status/servers');
            return (servers as any[]).map(server => server.url as string);
        } catch(error) {
            log.error('Error reading status servers', [ error ]);
        }
        return [];
    }
    public static postReleaseNotes(channel: Discord.TextChannel): void {
        let storedVersion;
        try {
            storedVersion = BotInfoDbService._db.getData('/version');
        } catch (error) {
            storedVersion = '0.0.0';
        }
        if (storedVersion === Config.VERSION) return;
        const releaseNotes = RELEASE_NOTES
            .get(Config.VERSION) as Discord.MessageEmbed;
        if (!releaseNotes) return;
        log.info(`Publishing ${Config.VERSION} release notes`);
        channel.send({ embed: releaseNotes }).then(() => {
            this._db.push('/version', Config.VERSION, true);
        });
    }
    public static removeCommandStatusServers(server: string): boolean {
        const before = BotInfoDbService._db.count('/command/status/servers');
        const index = BotInfoDbService._db.getIndex(
            '/command/status/servers',
            server,
            'url'
        );
        if (index < 0) return false;
        BotInfoDbService._db.delete(`/command/status/servers[${index}]`);
        const after = BotInfoDbService._db.count('/command/status/servers');
        return after + 1 === before;
    }
}