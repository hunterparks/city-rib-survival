export abstract class Command {
    public abstract name: string;
    public abstract description: string;
    public abstract authorizedChannels: string[];
    public abstract authorizedUsers: string[];
    public abstract execute(message: any, args: string[]): void;
}