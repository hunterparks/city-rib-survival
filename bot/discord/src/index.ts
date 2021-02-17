import { BotInfoDbService } from './service/bot-info-db-service';
import { CommandService } from './service/command-service';
import { Config } from './config/config';
import { ConsoleLoggingService as log } from './service/console-logging-service';
import { DiscordService } from './service/discord-service';

class RibCityBot {
    private readonly commandService: CommandService;
    private readonly discordService: DiscordService;

    constructor() {
        new BotInfoDbService();
        this.commandService = new CommandService();
        this.discordService = new DiscordService(this.commandService);
        process.on('SIGINT', () => {
            log.info('Bot stopped with SIGINT');
            this.discordService.destroy()
        });
        process.on('SIGTERM', () => {
            log.info('Bot stopped with SIGTERM');
            this.discordService.destroy()
        });
    }
}

const logMotd = `    Starting ${Config.BOT_NAME} version ${Config.VERSION}    `;
const motdLength = Math.ceil(logMotd.length / 2);
const border = new Array(motdLength).fill('- ').join('');
log.info(border, [ '', logMotd, '', border ]);

new RibCityBot();