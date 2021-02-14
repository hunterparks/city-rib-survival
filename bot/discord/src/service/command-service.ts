import { Command } from "../model/command";
import { Config } from "../config/config";
import { ConsoleLoggingService as log } from "../service/console-logging-service";
import * as Discord from 'discord.js';
import * as fs from 'fs';
import * as path from 'path';

export class CommandService {
    private commands: Map<string, Command>;

    constructor() {
        this.commands = new Map<string, Command>();
        this.generateCommands();
    }

    public processCommand(message: Discord.Message): void {
        const args = message.content.slice(Config.COMMAND_PREFIX.length).trim().split(/ +/);
        const command = args.shift()?.toLowerCase() || '';

        const selectedCommand = this.commands.get(command);
        if (!selectedCommand) {
            message.react('⛔');
            return;
        }

        if (this.validateUser(selectedCommand.authorizedUsers, message)
            && this.validateChannel(selectedCommand.authorizedChannels, message)) {
            selectedCommand.execute(message, args);
        }
    }

    public validateChannel(authorizedChannels: string[], message: Discord.Message): boolean {
        if (authorizedChannels.length === 0) return true;
        if (authorizedChannels.includes(message.channel.id)) return true;
        message.react('🚫');
        return false;
    }

    public validateUser(authorizedUsers: string[], message: Discord.Message): boolean {
        if (authorizedUsers.length === 0) return true;
        if (authorizedUsers.includes(message.author.id)) return true;
        message.react('🚯');
        return false;
    }

    private generateCommands() {
        log.info('Generating commands for use');
        const commandPath = path.join(__dirname, Config.COMMAND_LOCATION);
        const commandFiles = fs.readdirSync(commandPath)
            .filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            let fileCommand = file.replace('.js', '');
            fileCommand = `${fileCommand.charAt(0).toUpperCase()}${fileCommand.slice(1)}`;
            import(path.join(__dirname, Config.COMMAND_LOCATION, file))
            .then((rawCommand) => {
                const command: Command = new rawCommand[fileCommand];
                this.commands.set(command.name, command);
                log.info(`  Added command '${command.name}'`);
            });
        }
    }
}