import { Command } from '../model/command';

export class Silence extends Command {
    public name = 'silence';
    public description = 'Silence!';
    public authorizedChannels = [];
    public authorizedUsers = [];
    public execute(message: any, args: string[]) {
        message.react('⚠');
    }
}