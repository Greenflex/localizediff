#!/usr/bin/env node
/**
 * @author AZOULAY Jordan <jazoulay@greenflex.com>
 * @description Program for sync local translation and localise.biz
 */

let program = require("commander");
let syncProgram = require("./modules/sync");
let extractProgram = require("./modules/extract");
let downloadProgram = require("./modules/download");
let importProgram = require("./modules/import");

let version = "1.0.7-stable";
let cmdValue = null;

program
  .version(version)
  .option("-v, --verbose", "display verbose")
  .option("-f, --from [language]", "language from extract")
  .option("-ri, --react-intl", "use file from babel-plugin-react-intl extract")
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
    console.log("\tWrite configuration in localize.yaml file. Open README.md");
    console.log("\n  Commandes:");
    console.log("\tsync \t synchronize translation with localise.biz");
    console.log("\textract  extract key from language for others");
    console.log(
      "\tdownload downlaod translations file from localise.biz to local pathToTranslations"
    );
    console.log("\n  Usages:");
    console.log("\tlocalizediff sync");
    console.log("\tlocalizediff sync -ri");
    console.log("\tlocalizediff -v -d up sync");
    console.log("\tlocalizediff -f en extract");
    console.log("\tlocalizediff -v -f fr extract");
    console.log("\tlocalizediff -v download");
  });
  program.parse(process.argv);

  switch (cmdValue) {
    case "sync":
      program.verbose ? console.log("\n") : "";
      syncProgram.start(
        program.verbose,
        program.direction ? program.direction : "down",
        program.reactIntl
      );
      break;
    case "import":
      program.verbose ? console.log("import react-intl messages") : "";
      importProgram.start(program.verbose);
      break;
    case "extract":
      program.verbose ? console.log("\n") : "";
      extractProgram.start(program.verbose, program.from);
      break;
    case "download":
      program.verbose ? console.log("\n") : "";
      downloadProgram.start(program.verbose);
      break;
    default:
      program.verbose ? console.warn("WARN ::::: No command") : "";
  }
}
