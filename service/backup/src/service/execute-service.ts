import * as childProcess from 'child_process';
import { Config } from '../config/config';
import * as util from 'minecraft-server-util';

export class ExecuteService {
    public static linuxCommand(command: string): void {
        if (Config.DEBUG) {
            // logger.info(`Command -> ${command});
        }
        try {
            let buffer = childProcess.execSync(command);
            // logger.info(buffer);
        } catch (ex) {
            // logger.info(ex);
        }
    }
    public static async mcCommand(command: string): Promise<void> {
        if (Config.USE_SCREEN) {
            this.userCommand(`screen -p 0 -S ${Config.MC_SCREEN} -X stuff "${command}^M"`, Config.MC_USER)
        } else {
            const rcon = new util.RCON(Config.MC_SERVER_URL, { port: 25575, password: Config.MC_RCON_PASSWORD })
            await rcon.connect();
            await rcon.run(command);
            await rcon.close();
        }
    }
    public static userCommand(command: string, username: string) {
        this.linuxCommand(`sudo -u ${username} ${command}`);
    }
}