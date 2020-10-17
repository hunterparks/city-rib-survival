const execute = require('./execute.js');

function players(message, hoverMessage) {
    playersColor(message, hoverMessage, 'grey');
}

function playersColor(message, hoverMessage, color) {
    if (!hoverMessage) hoverMessage = '';
    //const commandParts = [
    //    '\\"\\"',
    //    `{\\"text\\":\\"[${process.env.BOT_NAME}] \\",\\"color\\":\\"gray\\",\\"italic\\":true}`,
    //    `{\\"text\\":\\"${message}\\",\\"color\\":\\"${color}\\",\\"italic\\":true,\\"hoverEvent\\":{\\"action\\":\\"show_text\\",\\"value\\":{\\"text\\":\\"\\",\\"extra\\":[{\\"text\\":\\"${hoverMessage}\\"}]}}}`
    //];
    const commandParts = [
        '""',
        `{"text":"[${process.env.BOT_NAME}] ","color":"gray","italic":true}`,
        `{"text":"${message}","color":"${color}","italic":true,"hoverEvent":{"action":"show_text","value":{"text":"","extra":[{"text":"${hoverMessage}"}]}}}`
    ];
    execute.mcCommand(`tellraw @a [${commandParts.join(',')}]`);
}

function playersError(message, hoverMessage) {
    playersColor(message, hoverMessage, 'red');
}

function playersSuccess(message, hoverMessage) {
    playersColor(message, hoverMessage, 'green');
}

module.exports = {
    players,
    playersColor,
    playersError,
    playersSuccess
};
