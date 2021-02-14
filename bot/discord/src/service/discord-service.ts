import { BotInfoDbService } from './bot-info-db-service';
import { CommandService } from './command-service';
import { Config } from '../config/config';
import * as Discord from 'discord.js';
import { UtilityService } from './utility-service';

export class DiscordService {
    private readonly discord: Discord.Client;
    private onlineMessage!: Discord.Message;

    constructor(private botInfoDbService: BotInfoDbService, private commandService: CommandService) {
        this.discord = new Discord.Client();
        this.discord.on('message', (message: Discord.Message) => this.parseMessage(message));
        this.discord.on('ready', () => this.ready());
        this.discord.login(Config.BOT_TOKEN)
            .then(() => {
                this.discord.channels.fetch(Config.CHANNEL.ServerStatus)
                    .then((channel: Discord.Channel) => {
                        UtilityService.updateStatus(channel as Discord.TextChannel);
                        this.discord.setInterval(UtilityService.updateStatus, 5.5 * 60 * 1000, channel);
                    });
            });
    }

    public destroy(): void {
        if (Config.BOT_ENV === 'DEV') process.exit(0);
        this.onlineMessage.edit(`🔴 ${Config.BOT_NAME} version ${Config.VERSION} offline!`)
            .then(() => {
                this.discord.destroy();
                process.exit(0);
            });
    }

    private parseMessage(message: Discord.Message): void {
        if (message.author.bot) return;
        if (message.author.username === Config.BOT_NAME) return;
        if (!message.content.startsWith(Config.COMMAND_PREFIX)) return;
        this.commandService.processCommand(message);
    }

    private ready(): void {
        this.discord.channels.fetch(Config.CHANNEL.General)
            .then((channel: Discord.Channel) => {
                this.botInfoDbService.postReleaseNotes(channel as Discord.TextChannel);
            });
        if (Config.BOT_ENV === 'DEV') return;
        this.discord.channels.fetch(Config.CHANNEL.RibCityBot)
            .then((channel: Discord.Channel) => {
                (channel as Discord.TextChannel).send(`🟢 ${Config.BOT_NAME} version ${Config.VERSION} online!`)
                .then((message: Discord.Message) => this.onlineMessage = message);
            });
    }
}