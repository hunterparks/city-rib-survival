import { Config } from '../config/config';
import { Command } from '../model/command';
import { UtilityService } from '../service/utility-service';

const MAX_WIDTH = 3;
const SERVICE_URL = 'https://api.mcsrvstat.us/2/';

export class Status extends Command {
    public name = 'status';
    public description = 'Gets status of minecraft server.';
    public authorizedChannels = [ Config.CHANNEL.ServerStatus ];
    public authorizedUsers = [];
    public execute(message: any, args: string[]) {
        UtilityService.updateStatus(message.channel);
    }
}