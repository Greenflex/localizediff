/**
 * @author AZOULAY Jordan <jazoulay@greenflex.com>
 * @description Program for sync local translation and localise.biz
 */

let program = require("commander");
let syncProgram = require("./modules/sync");
let extractProgram = require("./modules/extract");
let downloadProgram = require("./modules/download");

let version = "0.9.0-beta";
let cmdValue = null;

program
  .version(version)
  .option("-v, --verbose", "display verbose")
  .option("-l, --language [language]", "language from extract")
  .option(
    "-d, --direction [direction]",
    "use 'down' if local changes should be overwritten [default: 'down'] ( use for sync cmd )"
  )
  .usage("[options] <cmd>")
  .arguments("<cmd>")
  .action(function(cmd, env) {
    cmdValue = cmd;
  });

init();

function init() {
  program.on("--help", function() {
    console.log("  Infos:");
    console.log("\tWrite configuration in config.yaml file. Open README.md");
    console.log("\n  Commandes:");
    console.log("\tsync \t synchronize translation with localise.biz");
    console.log("\textract  extract key from language for others");
    console.log(
      "\tdownload downlaod translations file from localise.biz to local pathToTranslations"
    );
    console.log("\n  Usages:");
    console.log("\tnode localisebizsync.js sync");
    console.log("\tnode localisebizsync.js -v -d up sync");
    console.log("\tnode localisebizsync.js -l en extract");
    console.log("\tnode localisebizsync.js -v -l fr extract");
    console.log("\tnode localisebizsync.js -v download");
  });
  program.parse(process.argv);

  switch (cmdValue) {
    case "sync":
      program.verbose ? console.log("\n") : "";
      syncProgram.start(
        program.verbose,
        program.direction ? program.direction : "down"
      );
      break;
    case "extract":
      program.verbose ? console.log("\n") : "";
      extractProgram.start(program.verbose, program.language);
      break;
    case "download":
      program.verbose ? console.log("\n") : "";
      downloadProgram.start(program.verbose);
      break;
    default:
      program.verbose ? console.warn("WARN ::::: No command") : "";
  }
}
