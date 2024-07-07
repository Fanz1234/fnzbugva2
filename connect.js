require("./config");
const {
  default: LexxyBotConnect,
  delay,
  jidNormalizedUser,
  PHONENUMBER_MCC,
  makeCacheableSignalKeyStore,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  getContentType,
  generateForwardMessageContent,
  prepareWAMessageMedia,
  generateWAMessageFromContent,
  generateMessageID,
  downloadContentFromMessage,
  makeInMemoryStore,
  jidDecode,
  proto
} = require("@whiskeysockets/baileys");
const fs = require('fs');
const pino = require("pino");
const {
  join
} = require('path');
const {
  await,
  getBuffer,
  fetchJson
} = require("./lib/myfunc");
const makeWASocket = require("@whiskeysockets/baileys")["default"];
const readline = require("readline");
const NodeCache = require('node-cache');
const chalk = require("chalk");
const {
  color,
  mylog
} = require("./lib/color");
const store = makeInMemoryStore({
  'logger': pino().child({
    'level': 'silent',
    'stream': "store"
  })
});
const pairingCode = true || process.argv.includes("--pairing-code");
const useMobile = process.argv.includes("--mobile");
const xlec = readline.createInterface({
  'input': process.stdin,
  'output': process.stdout
});
const question = _0x5d8871 => new Promise(_0x35b924 => xlec.question(_0x5d8871, _0x35b924));
async function connectToWhatsApp() {
  let {
    version: _0x52765e,
    isLatest: _0x4c2be4
  } = await fetchLatestBaileysVersion();
  const {
    state: _0x3b24e5,
    saveCreds: _0x1e6251
  } = await useMultiFileAuthState(join(__dirname, "./session"));
  const _0x342595 = new NodeCache();
  const _0x5d3602 = makeWASocket({
    'logger': pino({
      'level': "silent"
    }),
    'printQRInTerminal': !pairingCode,
    'mobile': useMobile,
    'auth': {
      'creds': _0x3b24e5.creds,
      'keys': makeCacheableSignalKeyStore(_0x3b24e5.keys, pino({
        'level': 'fatal'
      }).child({
        'level': "fatal"
      }))
    },
    'browser': ["Ubuntu", 'Chrome', "20.0.04"],
    'version': _0x52765e,
    'patchMessageBeforeSending': _0x2c9c04 => {
      const _0x35fe4c = !!(_0x2c9c04.buttonsMessage || _0x2c9c04.templateMessage || _0x2c9c04.listMessage);
      if (_0x35fe4c) {
        _0x2c9c04 = {
          'viewOnceMessage': {
            'message': {
              'messageContextInfo': {
                'deviceListMetadataVersion': 0x2,
                'deviceListMetadata': {}
              },
              ..._0x2c9c04
            }
          }
        };
      }
      return _0x2c9c04;
    },
    'getMessage': async _0xc11c76 => {
      let _0x582fb6 = jidNormalizedUser(_0xc11c76.remoteJid);
      let _0x4bfec3 = await store.loadMessage(_0x582fb6, _0xc11c76.id);
      return _0x4bfec3?.["message"] || '';
    },
    'markOnlineOnConnect': true,
    'generateHighQualityLinkPreview': true,
    'msgRetryCounterCache': _0x342595
  });
  store.bind(_0x5d3602.ev);
  if (pairingCode && !_0x5d3602.authState.creds.registered) {
    if (useMobile) {
      console.log("Cannot use pairing code with mobile api");
    }
    console.log(chalk.cyan("┌──────────────┈"));
    console.log("│• " + chalk.redBright("Silakan Tulis Nomor Whatsapp Anda"));
    console.log("│• " + chalk.redBright("Contoh : 628xxxxx"));
    console.log(chalk.cyan("└──────────────┈"));
    let _0x50a88e;
    if (!!_0x50a88e) {
      _0x50a88e = _0x50a88e.replace(/[^0-9]/g, '');
      if (!Object.keys(PHONENUMBER_MCC).some(_0x1d3bbe => _0x50a88e.startsWith(_0x1d3bbe))) {
        console.log(chalk.bgBlack(chalk.redBright("Start with country code of your WhatsApp Number, Example : 628xxxxxxxx")));
        process.exit(0x0);
      }
    } else {
      _0x50a88e = await question(chalk.bgBlack(chalk.greenBright("Your WhatsApp Number : ")));
      _0x50a88e = _0x50a88e.replace(/[^0-9]/g, '');
      if (!Object.keys(PHONENUMBER_MCC).some(_0x32786f => _0x50a88e.startsWith(_0x32786f))) {
        console.log(chalk.bgBlack(chalk.redBright("Start with country code of your WhatsApp Number, Example : 628xxxxxxxx")));
        _0x50a88e = await question(chalk.bgBlack(chalk.greenBright("Your WhatsApp Number : ")));
        _0x50a88e = _0x50a88e.replace(/[^0-9]/g, '');
        xlec.close();
      }
    }
    setTimeout(async () => {
      let _0xdcfc3c = await _0x5d3602.requestPairingCode(_0x50a88e);
      _0xdcfc3c = _0xdcfc3c?.["match"](/.{1,4}/g)?.["join"]('-') || _0xdcfc3c;
      console.log(chalk.bgBlack(chalk.greenBright("Copy Pairing Code :")), chalk.black(chalk.white(_0xdcfc3c)));
    }, 0x7d0);
  }
  _0x5d3602.ev.on("messages.upsert", async _0x26dac0 => {
    try {
      msg = _0x26dac0.messages[0x0];
      if (!msg.message) {
        return;
      }
      require("./index")(_0x5d3602, msg, store);
    } catch (_0x515f11) {
      console.log(_0x515f11);
    }
  });
  _0x5d3602.ev.on('connection.update', _0x36c2c7 => {
    console.log("Connection Update :", _0x36c2c7);
    if (_0x36c2c7.connection === "open") {
      console.log(mylog("Connected " + _0x5d3602.user.id));
    } else if (_0x36c2c7.connection === "close") {
      console.log(mylog('Disconnected!'));
      connectToWhatsApp();
    }
  });
  _0x5d3602.sendTextWithMentions = async (_0x3248f6, _0x32eb84, _0x5212db, _0x1298fc = {}) => _0x5d3602.sendMessage(_0x3248f6, {
    'text': _0x32eb84,
    'contextInfo': {
      'mentionedJid': [..._0x32eb84.matchAll(/@(\d{0,16})/g)].map(_0x3a22c9 => _0x3a22c9[0x1] + "@s.whatsapp.net")
    },
    ..._0x1298fc
  }, {
    'quoted': _0x5212db
  });
  _0x5d3602.decodeJid = _0x50679d => {
    if (!_0x50679d) {
      return _0x50679d;
    }
    if (/:\d+@/gi.test(_0x50679d)) {
      let _0x3e1f2d = jidDecode(_0x50679d) || {};
      return _0x3e1f2d.user && _0x3e1f2d.server && _0x3e1f2d.user + '@' + _0x3e1f2d.server || _0x50679d;
    } else {
      return _0x50679d;
    }
  };
  _0x5d3602.sendmentions = (_0x16b940, _0x16d53b, _0x134596 = [], _0xd746da) => {
    if (_0xd746da == null || _0xd746da == undefined || _0xd746da == false) {
      let _0xd4cf3 = _0x5d3602.sendMessage(_0x16b940, {
        'text': _0x16d53b,
        'mentions': _0x134596
      }, {
        'quoted': msg
      });
      return _0xd4cf3;
    } else {
      let _0x3fa023 = _0x5d3602.sendMessage(_0x16b940, {
        'text': _0x16d53b,
        'mentions': _0x134596
      }, {
        'quoted': msg
      });
      return _0x3fa023;
    }
  };
  _0x5d3602.ev.on("creds.update", _0x1e6251);
  return _0x5d3602;
}
connectToWhatsApp()["catch"](_0x7ba00d => console.log(_0x7ba00d));
let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright("Update " + __filename));
  delete require.cache[file];
  require(file);
});