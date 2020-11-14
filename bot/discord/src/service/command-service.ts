import { Command } from "../model/command";
import { Config } from "../config/config";
import * as fs from 'fs';
import * as path from 'path';

export class CommandService {
    private commands: Map<string, Command>;

    constructor() {
        this.commands = new Map<string, Command>();
        this.generateCommands();
    }

    public processCommand(message: any): void {
        const args = message.content.slice(Config.COMMAND_PREFIX.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

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

    public validateChannel(authorizedChannels: string[], message: any): boolean {
        if (authorizedChannels.length === 0) return true;
        if (authorizedChannels.includes(message.channel.id)) return true;
        message.react('🚫');
        return false;
    }

    public validateUser(authorizedUsers: string[], message: any): boolean {
        if (authorizedUsers.length === 0) return true;
        if (authorizedUsers.includes(message.author.id)) return true;
        message.react('🚯');
        return false;
    }

    private generateCommands() {
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
            });
        }
    }
}