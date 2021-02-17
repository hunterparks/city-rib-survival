import { Config } from '../config/config';
import { ConsoleLoggingService as log } from '../service/console-logging-service';
import * as Discord from 'discord.js';
import * as https from 'https';
import { IncomingMessage } from 'http';
import * as path from 'path';
import { BotInfoDbService } from './bot-info-db-service';

const CACHED_ICONS = new Map([
    [
        'skybees.rib.city',
        path.join(__dirname, '../asset/image/skybees.rib.city.png')
    ]
]);
const MAX_WIDTH = 3;
const SERVICE_URL = 'https://api.mcsrvstat.us/2/';

export class StatusService {
    public static updateStatus(channel: Discord.TextChannel): void {
        if (!channel) return;
        Promise.all(
            BotInfoDbService
                .getCommandStatusServers()
                .map(server => StatusService
                    .httpsGetAsync(`${SERVICE_URL}${server}`)
                )
        ).then((results) => {
            channel.bulkDelete(100, true)
                .then(() => results.forEach(embed => {
                    channel.send({ embed });
                }));
        }).catch((error) => {
            console.log(error);
        });
    }
    private static createStatusEmbed(content: any, backupUrl: string): Discord.MessageEmbed {
        const embed = new Discord.MessageEmbed({
            title: `Status - ${content.hostname || backupUrl}`
        });
        if (content.online) {
            embed.setColor('#2f855a');
            embed.setDescription('Online! 🥳');
            embed.addField('Motd', content.motd.clean[0]);
            embed.addField(
                'Minecraft Version',
                `${content.software || 'Forge'} ${content.version}`
            );
            const maxPlayers = content.players.max;
            const onlinePlayers = content.players.online;
            embed.addField(
                'Online Users',
                `${onlinePlayers} of ${maxPlayers} online!`
            );
            if (content.players.online > 0) {
                const listSize = content.players.list.length;
                if (listSize > MAX_WIDTH) {
                    content.players.list = content.players.list.slice(0, 2);
                    const morePlayers = listSize - MAX_WIDTH + 1;
                    content.players.list
                        .push(`And ${morePlayers} more`);
                }
                for (const player of content.players.list) {
                    embed.addField(player, 'online!', true);
                }
            }
            if (content.icon && CACHED_ICONS.get(content.hostname)) {
                const attachment = new Discord.MessageAttachment(
                    CACHED_ICONS.get(content.hostname) as string,
                    'server-icon.png'
                );
                embed.attachFiles([ attachment ]);
                embed.setImage('attachment://server-icon.png');
            }
        } else {
            embed.setTitle(`Status - ${backupUrl}`);
            embed.setColor('#c53030');
            embed.setDescription('Offline! 😭');
            //embed.addField(backupUrl, '\u200B');
        }
        return embed;
    }
    private static httpsGetAsync(url: string): Promise<Discord.MessageEmbed> {
        return new Promise((resolve, reject) => {
            https.get(url,
                (response: IncomingMessage) => {
                    let data = '';
                    response.on('data', (chunk: any) => data += chunk);
                    response.on('end', () => {
                        let res;
                        try {
                            res = JSON.parse(data);
                        } catch(error) {
                            log.error(`Status update failed ->\n${error}`);
                            reject(error);
                        }
                        resolve(StatusService.createStatusEmbed(
                            res,
                            url.replace(SERVICE_URL, '')
                        ));
                    });
                }
            );
        });
    }
}