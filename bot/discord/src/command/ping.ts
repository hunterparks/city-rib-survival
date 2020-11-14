import { Command } from '../model/command';

export class Ping extends Command {
    public name = 'ping';
    public description = 'Ping!';
    public authorizedChannels = [];
    public authorizedUsers = [];
    public execute(message: any, args: string[]) {
        message.channel.send('Pong!');
    }
}