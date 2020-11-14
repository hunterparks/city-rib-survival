import { Command } from '../model/command';

export class Beep extends Command {
    public name = 'beep';
    public description = 'Beep!';
    public authorizedChannels = [];
    public authorizedUsers = [];
    public execute(message: any, args: string[]) {
        message.channel.send('Boop!');
    }
}