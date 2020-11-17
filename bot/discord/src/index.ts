import { CommandService } from './service/command-service';
import { DiscordService } from './service/discord-service';

class RibCityBot {
    private readonly commandService: CommandService;
    private readonly discordService: DiscordService;

    constructor() {
        this.commandService = new CommandService();
        this.discordService = new DiscordService(this.commandService);
        process.on('SIGINT', () => this.discordService.destroy());
        process.on('SIGTERM', () => this.discordService.destroy());
    }
}

new RibCityBot();