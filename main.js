const {
  spawn
} = require("child_process");
const path = require("path");
function start() {
  let _0x1e68f1 = [path.join(__dirname, "connect.js"), ...process.argv.slice(0x2)];
  console.log([process.argv[0x0], ..._0x1e68f1].join("\n"));
  let _0x3d5f6d = spawn(process.argv[0x0], _0x1e68f1, {
    'stdio': ["inherit", "inherit", "inherit", "ipc"]
  }).on("message", _0x3f8687 => {
    if (_0x3f8687 == "reset") {
      console.log("Restarting Bot...");
      _0x3d5f6d.kill();
      start();
      delete _0x3d5f6d;
    }
  }).on("exit", _0x2d1812 => {
    console.error("Exited with code:", _0x2d1812);
    if (_0x2d1812 == '.' || _0x2d1812 == 0x1 || _0x2d1812 == 0x0) {
      start();
    }
  });
}
start();