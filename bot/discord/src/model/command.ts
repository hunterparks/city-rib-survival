import * as Discord from 'discord.js';

export abstract class Command {
    public abstract name: string;
    public abstract description: string;
    public abstract authorizedChannels: string[];
    public abstract authorizedUsers: string[];
    public abstract execute(message: Discord.Message, args: string[]): void;
}