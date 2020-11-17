import { CommandService } from "./command-service";
import { Config } from "../config/config";

const Discord = require('discord.js');

export class DiscordService {
    private readonly discord: any;
    private onlineMessage: any;

    constructor(private commandService: CommandService) {
        this.discord = new Discord.Client();
        this.discord.on('message', (message: any) => this.parseMessage(message));
        this.discord.on('ready', () => this.ready());
        this.discord.login(Config.BOT_TOKEN).then(/* Do nothing - do not care! */);
    }

    public destroy(): void {
        this.onlineMessage.edit(`🔴 ${Config.BOT_NAME} version ${Config.VERSION} offline!`)
            .then(() => {
                this.discord.destroy();
                process.exit(0);
            });
    }

    private parseMessage(message: any): void {
        if (message.author.bot) return;
        if (message.author.username === Config.BOT_NAME) return;
        if (!message.content.startsWith(Config.COMMAND_PREFIX)) return;
        this.commandService.processCommand(message);
    }

    private ready(): void {
        this.discord.channels.fetch(Config.CHANNEL.RibCityBot)
            .then((channel: any) => {
                channel.send(`🟢 ${Config.BOT_NAME} version ${Config.VERSION} online!`)
                .then((message: any) => this.onlineMessage = message);
            });
    }
}