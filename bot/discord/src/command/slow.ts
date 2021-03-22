import * as Canvas from 'canvas';
import { Command } from '../model/command';
import { Config } from '../config/config';
import * as Discord from 'discord.js';
import * as fs from 'fs';
import * as path from 'path';
import { UtilityService } from '../service/utility-service';

const AVATAR_SIZE = 64;
const AVATAR_OPTIONS: Discord.ImageURLOptions = {
    format: 'jpeg',
    size: AVATAR_SIZE
};
const SLOW_X = 185;
const SLOW_Y = 185;
const SLOW_IMAGE = '../asset/image/slow_children.png';

export class Slow extends Command {
    public name = 'slow';
    public description = "Slow children!";
    public authorizedChannels = [];
    public authorizedUsers = [];
    public execute(message: Discord.Message, args: string[]) {
        let slowerAvatarUrl = message.author.avatarURL(AVATAR_OPTIONS);
        const slowee = message.mentions.users.first();
        let sloweeAvatarUrl = slowerAvatarUrl;
        if (slowee) {
            sloweeAvatarUrl = slowee.avatarURL(AVATAR_OPTIONS);
        }
        Canvas.loadImage(
            (slowee && slowee.id === Config.BRIAN_ID)
            ? path.join(__dirname, '../asset/image/beta_male.png')
            : path.join(__dirname, SLOW_IMAGE))
            .then((image) => {
                const slowWidth = image.width;
                const slowHeight = image.height;
                const canvas = Canvas.createCanvas(slowWidth, slowHeight);
                const context = canvas.getContext('2d');
                context.drawImage(image, 0, 0, slowWidth, slowHeight);
                Canvas.loadImage(sloweeAvatarUrl as string)
                    .then((sloweeAvatar) => {
                        this.renderAvatar(context, sloweeAvatar, SLOW_X, SLOW_Y);
                        this.createAndSendImage(canvas, message);
                    });
            });
    }
    private createAndSendImage(canvas: Canvas.Canvas, message: Discord.Message): void {
        const buffer = canvas.toBuffer('image/jpeg');
        const tempFilename = path.join(__dirname, '../asset', `temp-${UtilityService.generateUid()}.jpg`);
        fs.writeFileSync(tempFilename, buffer);
        message.channel.send('', {
            files: [{
                attachment: tempFilename,
                name: 'slow_children.jpg'
            }]
        })
        .then(() => {
            fs.unlinkSync(tempFilename);
        });
    }
    private renderAvatar(context: Canvas.CanvasRenderingContext2D, avatar: Canvas.Image, xPos: number, yPos: number): void {
        context.save();
        context.beginPath();
        context.arc(
            xPos + (avatar.width / 2),
            yPos + (avatar.height / 2),
            AVATAR_SIZE / 2, 0, 6.28, false
        );
        context.clip();
        context.closePath();
        context.drawImage(avatar, xPos, yPos, avatar.width, avatar.height);
        context.restore();
    }
}