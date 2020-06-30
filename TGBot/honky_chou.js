const request = require('request');
const YoutubeMp3Downloader = require('youtube-mp3-downloader');
const { sendText, sendSticker, sendAudio, sendExistedAudio } = require('./tg');
const VideoBank = require('./dao');

var checkLink = function (url) {
    var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    return url.match(p) ? RegExp.$1 : false;
};

var YD = new YoutubeMp3Downloader({
    ffmpegPath: '/usr/bin/ffmpeg',
    outputPath: './',
    youtubeVideoQuality: 'highest',
    queueParallelism: 2,
    progressTimeout: 30000,
});

var dao = new VideoBank();

var TGRouter = function (req) {
    console.log(req.body);
    if (req.body.message.text) {
        let code = checkLink(req.body.message.text);
        if (code) {
            // check code if it had dealed
            let fid = dao.checkCode(code);
            if (fid) {
                sendText(req.body.message.from.id, '這個我看過～');
                sendExistedAudio(req.body.message.from.id, fid);
            } else {
                YD.download(code, `${code}.mp3`);
                sendText(req.body.message.from.id, '正在下載...');
                YD.on('finished', function (err, data) {
                    sendText(req.body.message.from.id, '下載完成，上傳中...');
                    sendAudio(req.body.message.from.id, code);
                });
            }
        }
    } else {
        sendSticker(
            req.body.message.from.id,
            'CAACAgIAAxkBAANPXvnZwYrS7F828UgSXFC4iB628hQAAgIAA-2OeS4aqNP_vjUFJxoE'
        );
    }
};

exports.TGRouter = TGRouter;
