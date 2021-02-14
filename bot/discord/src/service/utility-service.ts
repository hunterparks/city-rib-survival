import { Config } from '../config/config';
import { ConsoleLoggingService as log } from './console-logging-service';
import * as Discord from 'discord.js';
import * as https from 'https';
import { IncomingMessage } from 'http';

const MAX_WIDTH = 3;
const SERVICE_URL = 'https://api.mcsrvstat.us/2/';

export class UtilityService {
    public static generateUid(): string {
        let firstPart = ((Math.random() * 46656) | 0).toString(36);
        let secondPart = ((Math.random() * 46656) | 0).toString(36);
        firstPart = `000${firstPart}`.slice(-3);
        secondPart = `000${secondPart}`.slice(-3);
        return `${firstPart}${secondPart}`;
    }
    public static getCurrentLogStamp(): string {
        return `[${this.getCurrentDateTimestamp()}]`;
    }
    public static getCurrentDateTimestamp(): string {
        const now = new Date();
        const dateStamp = this.getCurrentDateStamp(now);
        const timeStamp = this.getCurrentTimeStamp(now);
        return `${dateStamp} ${timeStamp}`;
    }
    public static getCurrentDateStamp(date?: Date): string {
        if (!date) date = new Date();
        const month = this.zeroPadLeft(date.getUTCMonth(), 2);
        const day = this.zeroPadLeft(date.getUTCDate(), 2);
        return `${date.getUTCFullYear()}/${month}/${day}`;
    }
    public static getCurrentTimeStamp(date?: Date): string {
        if (!date) date = new Date();
        const hours = this.zeroPadLeft(date.getUTCHours(), 2);
        const minutes = this.zeroPadLeft(date.getUTCMinutes(), 2);
        const seconds = this.zeroPadLeft(date.getUTCSeconds(), 2);
        return `${hours}:${minutes}:${seconds}`;
    }
    public static spacePadLeft(value: string, width: number): string {
        const missingWidth = width - value.length;
        return `${new Array(missingWidth).fill(' ').join('')}${value}`;
    }
    public static updateStatus(channel: Discord.TextChannel): void {
        if (!channel) return;
        https.get(
            `${SERVICE_URL}${Config.MC_SERVER_URL}`, 
            (response: IncomingMessage) => {
                let data = '';
                response.on('data', (chunk: any) => data += chunk);
                response.on('end', () => {
                    let res;
                    try {
                        res = JSON.parse(data);
                    } catch(error) {
                        log.error(`Status update failed ->\n${error}`);
                        return;
                    }
                    const embed = {
                        color: '',
                        title: 'Status',
                        description: '',
                        fields: [] as any[]
                    };
                    if (res.online) {
                        embed.color = '#2f855a';
                        embed.description = 'Online! 🥳';
                        embed.fields.push({
                            name: res.hostname,
                            value: res.motd.clean[0]
                        });
                        embed.fields.push({
                            name: 'Minecraft Version',
                            value: `${res.software} ${res.version}`
                        });
                        const maxPlayers = res.players.max;
                        const onlinePlayers = res.players.online;
                        embed.fields.push({
                            name: 'Online Users',
                            value: `${onlinePlayers} of ${maxPlayers} online!`
                        });
                        if (res.players.online > 0) {
                            const listSize = res.players.list.length;
                            if (listSize > MAX_WIDTH) {
                                res.players.list = res.players.list.slice(0, 2);
                                const morePlayers = listSize - MAX_WIDTH + 1;
                                res.players.list
                                    .push(`And ${morePlayers} more`);
                            }
                            for (const player of res.players.list) {
                                embed.fields.push({
                                    name: player,
                                    value: 'online!',
                                    inline: true
                                });
                            }
                        }
                    } else {
                        embed.color = '#c53030';
                        embed.description = 'Offline! 😭';
                    }
                    channel.bulkDelete(100, true)
                        .then(() => channel.send({ embed }));
            });
        });
    }
    public static zeroPadLeft(value: number, width: number): string {
        const valueString = value.toString();
        const missingWidth = width - valueString.length;
        return `${new Array(missingWidth).fill(0).join('')}${valueString}`;
    }
}