#!/usr/bin/env node
/**
 * @author AZOULAY Jordan <jazoulay@greenflex.com>
 * @description localizediff is a software that allows you to synchronize translation files in json format with SaaS translation software [localise.biz/](https://localise.biz/)
 */
const program = require("commander");
const syncProgram = require("./modules/sync");
const extractProgram = require("./modules/extract");
const downloadProgram = require("./modules/download");
const importProgram = require("./modules/import");
const logUtility = require("./utils/log");

const { log, warn } = logUtility;

const version = "2.0.0";
let cmdValue = null;

program
  .version(version)
  .option("-v, --verbose", "display verbose")
  .option(
    "-c, --configFile [path]",
    "path to config file localise.yml [default: './localise.yml']"
  )
  .option(
    "-la, --languages [languages]",
    "array languages you needed [default:\"['en']\"] ex: en,fr,es,..."
  )
  // Écrire une meilleure doc @seb @christian
  .option("-r, --pathToReactMessages [path]", "path to react messages")
  // Sert au module import à vérifier @jordan @seb @christian
  .option("-m, --messagesFileName [message]", "message file name")
  .option("-p, --pathToTranslations [path]", "path to local translation folder")
  .option(
    "-ca, --commandAfterSync [command]",
    "command to execute after sync if translation file changed"
  )
  .option(
    "-l, --localisebiz [url]",
    "url to localise.biz api [default='https://localise.biz/api']"
  )
  .option("-k, --key [key]", "key to localise.biz/")
  .option("-f, --from [language]", "language from extract")
  .option(
    "-d, --direction [direction]",
    "use 'down' if local changes should be overwritten [default: 'down'] ( use for sync cmd )"
  )
  .option(
    "-fi, --filter [filter]",
    "Filter assets by comma-separated tag names. Match any tag with * and negate tags by prefixing with ! "
  )
  .option(
    "-fa, --format [format]",
    "More specific format of file type. e.g. symfony applies to php, xlf & yml [default value: 'script']"
  )
  .option(
    "-in, --index",
    "Override default lookup key for the file format: 'id', 'text' or a custom alias "
  )
  .option(
    "-src, --source",
    "Specify alternative source locale instead of project default"
  )
  .option(
    "-np, --namespace",
    "Override the project name for some language packs that use it as a key prefix "
  )
  .option(
    "-fb, --fallback",
    "Fallback locale for untranslated assets, specified as short code. e.g. en or en_GB "
  )
  .option("-or, --order", "Export translations according to asset order")
  .option(
    "-st, --status",
    "Export translations with a specific status or flag. Negate values by prefixing with !. e.g. 'translated', or '!fuzzy'."
  )
  .option("-pr, --printf", "Force alternative 'printf' style.")
  .option(
    "-ch, --charset",
    "Specify preferred character encoding. Alternative to Accept-Charset header but accepts a single value which must be valid."
  )
  .option(
    "-br, --breaks",
    "Force platform-specific line-endings. Default is Unix (LF) breaks."
  )
  .option(
    "-nc, --noComments",
    "Disable rendering of redundant inline comments including the Loco banner."
  )
  .option(
    "-nf, --noFolding",
    "Protect dot-separated keys so that foo.bar is not folded into object properties."
  )
  .option(
    "-as, --async",
    "Specify that import should be done asynchronously (recommended for large files)"
  )
  .option(
    "-pa, --path",
    "Specify original file path for source code references (excluding line number)"
  )
  .option(
    "-in, --ignoreNew",
    "Specify that new assets will NOT be added to the project"
  )
  .option(
    "-ie, --ignoreExisting",
    "Specify that existing assets encountered in the file will NOT be updated"
  )
  .option(
    "-tn, --tagNew",
    "Tag any NEW assets added during the import with the given tags (comma separated)"
  )
  .option(
    "-ta, --tagAll",
    "Tag ALL assets in the file with the given tags (comma separated)"
  )
  .option(
    "-uta, --unTagAll",
    "Remove existing tags from any assets matched in the imported file (comma separated)"
  )
  .option(
    "-tb, --tagAbsent",
    "Tag existing assets in the project that are NOT found in the imported file"
  )
  .option(
    "-utb, --unTagAbsent",
    "Remove existing tags from assets NOT found in the imported file"
  )
  .option(
    "-da, --deleteAbsent",
    "Permanently DELETES project assets NOT found in the file (use with extreme caution)"
  )
  .usage("[options] <cmd>")
  .arguments("<cmd>")
  .action((cmd) => {
    cmdValue = cmd;
  });

function init() {
  program.on("--help", () => {
    log("\n  Infos:");
    log("\tOpen README.md");
    log("\thttps://www.npmjs.com/package/localizediff");
    log("\n  Commandes:");
    log("\tsync \t synchronize translation with localise.biz");
    log("\textract  extract key from language for others");
    log(
      "\tdownload downlaod translations file from localise.biz to local pathToTranslations"
    );
    log("\n  Usages:");
    log("\tlocalizediff sync");
    // log("\tlocalizediff import");
    log("\tlocalizediff -v -d up sync");
    log("\tlocalizediff -f en extract");
    log("\tlocalizediff -v -f fr extract");
    log("\tlocalizediff -v download");
  });
  program.parse(process.argv);
  const { verbose } = program;

  switch (cmdValue) {
    case "sync":
      if (verbose) log("\n");
      syncProgram.start(
        program.verbose,
        program.direction ? program.direction : "down",
        program.reactIntl
      );
      break;
    case "import":
      if (verbose) log("import react-intl messages");
      importProgram.start(program.verbose);
      break;
    case "extract":
      if (verbose) log("\n");
      extractProgram.start(program.verbose, program.from);
      break;
    case "download":
      if (verbose) log("\n");
      downloadProgram.start(program.verbose);
      break;
    default:
      if (verbose) warn("WARN ::::: No command");
  }
}

init();
