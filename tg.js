const { TgToken } = require('./config');
const request = require('request');
const urlencode = require('urlencode');
const fs = require('fs');
const VideoBank = require('./dao');

var dao = new VideoBank();

var sendText = function (chat_id, text, reply_id) {
    // building api request
    let url = `https://api.telegram.org/bot${TgToken}/sendMessage?chat_id=${chat_id}&text=${urlencode(
        text
    )}`;

    // if need to reply to other message
    if (reply_id != undefined) url += `&reply_to_message_id=${replyid}`;

    // make request
    request.get(url, { json: true }, (error, response, body) => {
        if (error) console.log(error);
        console.log(JSON.stringify(body));
    });
};

var sendSticker = function (chat_id, sticker, reply_id) {
    // building api request
    let url = `https://api.telegram.org/bot${TgToken}/sendSticker?chat_id=${chat_id}&sticker=${sticker}`;

    // if need to reply to other message
    if (reply_id != undefined) url += `&reply_to_message_id=${replyid}`;

    // make request
    request.get(url, { json: true }, (error, response, body) => {
        if (error) console.log(error);
        console.log(JSON.stringify(body));
    });
};

var sendAudio = function (chat_id, code) {
    // building api request
    let url = `https://api.telegram.org/bot${TgToken}/sendAudio`;

    // send audio
    request.post(
        {
            url: url,
            options: { json: true },
            formData: {
                audio: fs.createReadStream(`./${code}.mp3`),
                chat_id: chat_id,
            },
        },
        function (error, response, body) {
            fs.unlink(`./${code}.mp3`, (err) => {
                if (err) throw err;
                console.log(`${code}.mp3 was deleted`);
            });
            // get the fid and store back to db
            body = JSON.parse(body);
            dao.insertCode(code, body.result.audio.file_id);
            console.log(body);
        }
    );
};

var sendExistedAudio = function (chat_id, file_id) {
    // building api request
    let url = `https://api.telegram.org/bot${TgToken}/sendAudio?chat_id=${chat_id}&audio=${file_id}`;

    // make request
    request.get(url, { json: true }, (error, response, body) => {
        if (error) console.log(error);
        console.log(JSON.stringify(body));
    });
};

exports.sendText = sendText;
exports.sendSticker = sendSticker;
exports.sendAudio = sendAudio;
exports.sendExistedAudio = sendExistedAudio;
