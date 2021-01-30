import { Config } from '../config/config';
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
    public static updateStatus(channel: Discord.TextChannel): void {
        if (!channel) return;
        https.get(`${SERVICE_URL}${Config.MC_SERVER_URL}`, (response: IncomingMessage) => {
            let data = '';
            response.on('data', (chunk: any) => data += chunk);
            response.on('end', () => {
                const res = JSON.parse(data);
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
                    embed.fields.push({
                        name: 'Online Users',
                        value: `${res.players.online} of ${res.players.max} online!`
                    });
                    if (res.players.online > 0) {
                        const listSize = res.players.list.length;
                        if (listSize > MAX_WIDTH) {
                            res.players.list = res.players.list.slice(0, 2);
                            res.players.list.push(`And ${listSize - MAX_WIDTH + 1} more`)
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
}