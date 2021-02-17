import * as Discord from 'discord.js';

export class UtilityService {
    public static generateReleaseNotesMessageEmbed(
        version: string,
        features: string[],
        fixes: string[]
    ): Discord.MessageEmbed {
        const embed = new Discord.MessageEmbed({
            color: 0x0080FF,
            title: `🚀  ${version} Release Notes  🚀`
        });
        if (features.length) {
            embed.addField(
                'New Features ✨',
                features.map(value => `• ${value}`).join('\n')
            );
        }
        if (fixes.length) {
            embed.addField(
                'Bug Fixes 🐛',
                fixes.map(value => `• ${value}`).join('\n')
            );
        }
        embed.addField(
            '\u200B',
            'See full commit history [on github](https://github.com/hunterparks/city-rib-survival/commits/master)'
        );
        return embed;
    }
    public static generateUid(): string {
        let firstPart = ((Math.random() * 46656) | 0).toString(36);
        let secondPart = ((Math.random() * 46656) | 0).toString(36);
        firstPart = `000${firstPart}`.slice(-3);
        secondPart = `000${secondPart}`.slice(-3);
        return `${firstPart}${secondPart}`;
    }
    public static getCurrentLogStamp(): string {
        return `[${this.getCurrentDateTimestamp()}]`;
    }
    public static getCurrentDateTimestamp(): string {
        const now = new Date();
        const dateStamp = this.getCurrentDateStamp(now);
        const timeStamp = this.getCurrentTimeStamp(now);
        return `${dateStamp} ${timeStamp}`;
    }
    public static getCurrentDateStamp(date?: Date): string {
        if (!date) date = new Date();
        const month = this.zeroPadLeft(date.getUTCMonth(), 2);
        const day = this.zeroPadLeft(date.getUTCDate(), 2);
        return `${date.getUTCFullYear()}/${month}/${day}`;
    }
    public static getCurrentTimeStamp(date?: Date): string {
        if (!date) date = new Date();
        const hours = this.zeroPadLeft(date.getUTCHours(), 2);
        const minutes = this.zeroPadLeft(date.getUTCMinutes(), 2);
        const seconds = this.zeroPadLeft(date.getUTCSeconds(), 2);
        return `${hours}:${minutes}:${seconds}`;
    }
    public static spacePadLeft(value: string, width: number): string {
        const missingWidth = width - value.length;
        return `${new Array(missingWidth).fill(' ').join('')}${value}`;
    }
    public static zeroPadLeft(value: number, width: number): string {
        const valueString = value.toString();
        const missingWidth = width - valueString.length;
        return `${new Array(missingWidth).fill(0).join('')}${valueString}`;
    }
}