import * as Canvas from 'canvas';
import { Command } from '../model/command';
import * as fs from 'fs';
import * as path from 'path';
import { UtilityService } from '../service/utility-service';

const AVATAR_IMAGE = '../asset/image/avatar.png';
const AVATAR_SIZE = 128;
const AVATAR_OPTIONS = {
    format: 'jpeg',
    size: AVATAR_SIZE
}
const BONKEE_X = 480;
const BONKEE_Y = 255;
const BONKER_X = 180;
const BONKER_Y = 110;
const BONK_IMAGE = '../asset/image/bonk.jpg';

export class Bonk extends Command {
    public name = 'bonk';
    public description = 'Bonk!';
    public authorizedChannels = [];
    public authorizedUsers = [];
    public execute(message: any, args: string[]) {
        let bonkerAvatarUrl = message.author.avatarURL(AVATAR_OPTIONS);
        const bonkee = message.mentions.users.first();
        let bonkeeAvatarUrl = bonkerAvatarUrl;
        if (bonkee) {
            bonkeeAvatarUrl = bonkee.avatarURL(AVATAR_OPTIONS);
        } else {
            bonkerAvatarUrl = path.join(__dirname, AVATAR_IMAGE);
        }
        Canvas.loadImage(path.join(__dirname, BONK_IMAGE))
            .then((image) => {
                const bonkWidth = image.width;
                const bonkHeight = image.height;
                const canvas = Canvas.createCanvas(bonkWidth, bonkHeight);
                const context = canvas.getContext('2d');
                context.drawImage(image, 0, 0, bonkWidth, bonkHeight);
                Canvas.loadImage(bonkeeAvatarUrl)
                    .then((bonkeeAvatar) => {
                        this.renderAvatar(context, bonkeeAvatar, BONKEE_X, BONKEE_Y);
                        Canvas.loadImage(bonkerAvatarUrl)
                            .then((bonkerAvatar) => {
                                this.renderAvatar(context, bonkerAvatar, BONKER_X, BONKER_Y);
                                this.createAndSendImage(canvas, message);
                            });
                    });
            });
    }
    private createAndSendImage(canvas: Canvas.Canvas, message: any) {
        const buffer = canvas.toBuffer('image/jpeg');
        const tempFilename = path.join(__dirname, '../asset', `temp-${UtilityService.generateUid()}.jpg`);
        fs.writeFileSync(tempFilename, buffer);
        message.channel.send('Bonk!', {
            files: [{
                attachment: tempFilename,
                name: 'bonk.jpg'
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