let program = require("commander");
let syncProgram = require("./modules/sync");

let version = "0.9.0-beta";
let cmdValue = null;

program
  .version(version)
  .option("-v, --verbose", "display verbose")
  .usage("[options] <cmd>")
  .arguments("<cmd>")
  .action(function(cmd, env) {
    cmdValue = cmd;
  });

init();

function init() {
  program.on("--help", function() {
    console.log("  Infos:");
    console.log("\tWrite configuration in config.yaml file. Open README.md\n");
    console.log("  Commandes:");
    console.log("\tsync \tsynchronize translation with localise.biz  \n");
  });
  program.parse(process.argv);

  switch (cmdValue) {
    case "sync":
      program.verbose ? console.log("\n") : "";
      syncProgram.start(program.verbose);
      break;
    default:
      program.verbose ? console.warn("WARN ::::: No command") : "";
  }
}
