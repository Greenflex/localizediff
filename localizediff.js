#!/usr/bin/env node
/**
 * @author AZOULAY Jordan <jazoulay@greenflex.com>
 * @description Program for sync local translation and localise.biz
 */

const program = require("commander");
const syncProgram = require("./modules/sync");
const extractProgram = require("./modules/extract");
const downloadProgram = require("./modules/download");
const importProgram = require("./modules/import");

let version = "1.1.9-stable";
let cmdValue = null;

console.log("hello 1");

program
  .version(version)
  .option("-v, --verbose", "display verbose")
  .option("-f, --from [language]", "language from extract")
  .option(
    "-d, --direction [direction]",
    "use 'down' if local changes should be overwritten [default: 'down'] ( use for sync cmd )"
  )
  .option("-c, --config-file [path]", "path to config file")
  .option("-l, --localisebiz [url]", "url to localise.biz api")
  .option("-k, --key [key]", "key to localise.biz/")
  // Écrire une meilleure doc @seb @christian
  .option("-r, --path-to-react-messages [path]", "path to react messages")
  // Sert au module import à vérifier @jordan @seb @christian
  .option("-m, --messages-file-name [message]", "message file name")
  .option(
    "-p, --path-to-translations [path]",
    "path to local translation folder"
  )
  .option("-la, --languages [languages]", "array languages you needed")
  .option('-f, --filter [filter]"', "tag to use")
  .option(
    "-ca, --command-after-sync [command]",
    "command to execute after sync if translation file changed"
  )
  .usage("[options] <cmd>")
  .arguments("<cmd>")
  .action(function (cmd, env) {
    cmdValue = cmd;
  });

console.log("hello");
init();

function init() {
  program.on("--help", function () {
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
    console.log("\tlocalizediff import");
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
