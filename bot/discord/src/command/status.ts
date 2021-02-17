import { BotInfoDbService } from '../service/bot-info-db-service';
import { Config } from '../config/config';
import { Command } from '../model/command';
import { StatusService } from '../service/status-service';

export class Status extends Command {
    public name = 'status';
    public description = 'Gets status of minecraft server.';
    public authorizedChannels = [ Config.CHANNEL.ServerStatus ];
    public authorizedUsers = [];
    public execute(message: any, args: string[]) {
        if (args.length) {
            if (args.length > 2) {
                this.reactFailure(message);
                return;
            }
            const command = args[0];
            switch(command) {
                case 'add': {
                    const address = args[1];
                    const isValidAddress = this.validateServerAddress(address);
                    if (!isValidAddress) {
                        this.reactFailure(message);
                        return;
                    }
                    if (BotInfoDbService.addCommandStatusServers(address)) {
                        this.reactSuccess(message);
                    } else {
                        this.reactFailure(message);
                    }
                    break;
                }
                case 'list': {
                    const servers = BotInfoDbService.getCommandStatusServers();
                    let data = '```Status Servers\n';
                    if (!servers.length) {
                        data += '  No servers added'
                    }
                    servers.forEach(server => data += `  ${server}\n`);
                    data += '```'
                    message.channel.send(data);
                    this.reactSuccess(message);
                    break;
                }
                case 'rm': {
                    const address = args[1];
                    if (BotInfoDbService.removeCommandStatusServers(address)) {
                        this.reactSuccess(message);
                    } else {
                        this.reactFailure(message);
                    }
                    break;
                }
                default: {
                    this.reactFailure(message);
                    break;
                }
            }
        } else {
            StatusService.updateStatus(message.channel);
        }
    }
    private reactFailure(message: any): void {
        message.react('❎');
    }
    private reactSuccess(message: any): void {
        message.react('✅');
    }
    private validateServerAddress(address: string): boolean {
        const isIpAddress = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(address);
        const isUrl = /^([\w-]+\.)+([a-z]|[A-Z]|[0-9]){2,6}$/.test(address);
        return isIpAddress || isUrl;
    }
}