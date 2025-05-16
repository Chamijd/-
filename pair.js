const { makeid } = require('./gen-id');
const express = require('express');
const fs = require('fs');
let router = express.Router();
const pino = require("pino");
const {
    default: makeWASocket,
    useMultiFileAuthState,
    delay,
    Browsers,
    makeCacheableSignalKeyStore
} = require('@whiskeysockets/baileys');
const { upload } = require('./mega');

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;

    async function GIFTED_MD_PAIR_CODE() {
        const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);
        try {
            const items = ["Safari"];
            const randomItem = items[Math.floor(Math.random() * items.length)];

            let sock = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                printQRInTerminal: false,
                generateHighQualityLinkPreview: true,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                syncFullHistory: false,
                browser: Browsers.macOS(randomItem)
            });

            if (!sock.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await sock.requestPairingCode(num);
                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            sock.ev.on('creds.update', saveCreds);

            sock.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;

                if (connection == "open") {
                    await delay(5000);
                    let rf = __dirname + `/temp/${id}/creds.json`;

                    function generateRandomText() {
                        const prefix = "3EB";
                        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                        let randomText = prefix;
                        for (let i = prefix.length; i < 22; i++) {
                            const randomIndex = Math.floor(Math.random() * characters.length);
                            randomText += characters.charAt(randomIndex);
                        }
                        return randomText;
                    }

                    const randomText = generateRandomText();

                    try {
                        const mega_url = await upload(fs.createReadStream(rf), `${sock.user.id}.json`);
                        const string_session = mega_url.replace('https://mega.nz/file/', '');
                        let md = "CHAMA-MD=" + string_session;

                        let code = await sock.sendMessage(sock.user.id, {
                            text: md,
                            contextInfo: {
                                forwardingScore: 999,
                                isForwarded: true
                            }
                        });

                        await delay(1000);

                        let desc = `> ශෙයා කරන්න එපා \n\n> ᴅᴏ ɴᴏᴛ ꜱʜᴇʀᴇ ᴛʜɪꜱ \n\n> இதை யாரிடமும் பகிர வேண்டாம்\n\n> ʀɪᴘᴏ :- github.com\n\n> whatsapp channel:- https://whatsapp.com/channel/0029Vb9WF4nJJhzeUCFS6M0u\n\n> ᴏᴡɴᴇʀ :- 94783314361\n\n\n> ᴘᴏᴡᴇʀᴅ ʙʏ Chamindu-MD`;

                        await sock.sendMessage(sock.user.id, {
                            text: desc,
                            contextInfo: {
                                forwardingScore: 999,
                                isForwarded: true,
                                externalAdReply: {
                                    title: "CHAMA-MD",
                                    body: "Powered by Chamindu-MD",
                                    thumbnailUrl: "https://i.ibb.co/pjqsbyyW/7755.jpg",
                                    sourceUrl: "https://whatsapp.com/channel/0029Vb9WF4nJJhzeUCFS6M0u",
                                    mediaType: 1,
                                    renderLargerThumbnail: true,
                                    showAdAttribution: true
                                }
                            }
                        }, { quoted: code });

                    } catch (e) {
                        let errMsg = await sock.sendMessage(sock.user.id, {
                            text: e.message || 'Unknown Error',
                            contextInfo: {
                                forwardingScore: 999,
                                isForwarded: true
                            }
                        });

                        let desc = `> ශෙයා කරන්න එපා \n\n> ᴅᴏ ɴᴏᴛ ꜱʜᴇʀᴇ ᴛʜɪꜱ \n\n> இதை யாரிடமும் பகிர வேண்டாம்\n\n> ʀɪᴘᴏ :- github.com\n\n> whatsapp channel:- https://whatsapp.com/channel/0029Vb9WF4nJJhzeUCFS6M0u\n\n> ᴏᴡɴᴇʀ :- 94783314361\n\n\n> ᴘᴏᴡᴇʀᴅ ʙʏ Chamindu-MD`;

                        await sock.sendMessage(sock.user.id, {
                            text: desc,
                            contextInfo: {
                                forwardingScore: 999,
                                isForwarded: true,
                                externalAdReply: {
                                    title: "CHAMA-MD",
                                    body: "Powered by Chamindu-MD",
                                    thumbnailUrl: "https://i.ibb.co/pjqsbyyW/7755.jpg",
                                    sourceUrl: "https://whatsapp.com/channel/0029Vb9WF4nJJhzeUCFS6M0u",
                                    mediaType: 1,
                                    renderLargerThumbnail: true,
                                    showAdAttribution: true
                                }
                            }
                        }, { quoted: errMsg });
                    }

                    await delay(10);
                    await sock.ws.close();
                    await removeFile('./temp/' + id);
                    console.log(`👤 ${sock.user.id} Connected ✅ Restarting process...`);
                    await delay(10);
                    process.exit();

                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10);
                    GIFTED_MD_PAIR_CODE();
                }
            });

        } catch (err) {
            console.log("Service restarted");
            await removeFile('./temp/' + id);
            if (!res.headersSent) {
                await res.send({ code: "❗ Service Unavailable" });
            }
        }
    }

    return await GIFTED_MD_PAIR_CODE();
});

module.exports = router;
