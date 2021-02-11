import * as Canvas from 'canvas';
import { Command } from '../model/command';
import * as Discord from 'discord.js';
import * as fs from 'fs';
import * as path from 'path';
import { UtilityService } from '../service/utility-service';


const AVATAR_IMAGE = '../asset/image/avatar.png';
const AVATAR_SIZE = 128;
const AVATAR_OPTIONS: Discord.ImageURLOptions = {
    format: 'jpeg',
    size: AVATAR_SIZE
};
const SILENCEE_X =  30;
const SILENCEE_Y = 340;
const SILENCER_X = 350;
const SILENCER_Y =  65;
const SILENCE_IMAGE = '../asset/image/silence.png';

export class Silence extends Command {
    public name = 'silence';
    public description = 'Silence!';
    public authorizedChannels = [];
    public authorizedUsers = [];
    public execute(message: Discord.Message, args: string[]) {
        let silencerAvatarUrl = message.author.avatarURL(AVATAR_OPTIONS);
        const silencee = message.mentions.users.first();
        let silenceeAvatarUrl = silencerAvatarUrl;
        if (silencee) {
            silenceeAvatarUrl = silencee.avatarURL(AVATAR_OPTIONS);
        } else {
            silencerAvatarUrl = path.join(__dirname, AVATAR_IMAGE);
        }
        Canvas.loadImage(path.join(__dirname, SILENCE_IMAGE))
            .then((image) => {
                const silenceWidth = image.width;
                const silenceHeight = image.height;
                const canvas = Canvas.createCanvas(silenceWidth, silenceHeight);
                const context = canvas.getContext('2d');
                context.drawImage(image, 0, 0, silenceWidth, silenceHeight);
                Canvas.loadImage(silenceeAvatarUrl as string)
                    .then((silenceeAvatar) => {
                        this.renderAvatar(context, silenceeAvatar, SILENCEE_X, SILENCEE_Y);
                        Canvas.loadImage(silencerAvatarUrl as string)
                            .then((silencerAvatar) => {
                                this.renderAvatar(context, silencerAvatar, SILENCER_X, SILENCER_Y);
                                this.createAndSendImage(canvas, message);
                            });
                    });
            });
    }
    private createAndSendImage(canvas: Canvas.Canvas, message: Discord.Message): void {
        const buffer = canvas.toBuffer('image/jpeg');
        const tempFilename = path.join(__dirname, '../asset', `temp-${UtilityService.generateUid()}.jpg`);
        fs.writeFileSync(tempFilename, buffer);
        message.channel.send('Silence!', {
            files: [{
                attachment: tempFilename,
                name: 'silence.jpg'
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