/**
 * @author AZOULAY Jordan <jazoulay@greenflex.com>
 * @description Load configuration from env or program execution or then localize.yml
 */
let program = require("commander");
const yaml = require("js-yaml");
const fs = require("fs");
const chalk = require("chalk");

module.exports = (function () {
  let verbose = false;

  function setVerbose(v) {
    verbose = v;
  }

  function getVar(key, params) {
    if (process.env[`LOCALISE_${key.toUpperCase()}`]) {
      return process.env[`LOCALISE_${key.toUpperCase()}`];
    } else if (program[key]) {
      return program[key];
    } else {
      return params[key];
    }
  }

  /**
   * @description open localize.yml file
   */
  function openFileConfig() {
    let configTry;
    let filePath;

    try {
      if (process.env.LOCALISE_CONFIG_FILE) {
        filePath = filePath;
      }
      if (
        program.configFile !== undefined &&
        fs.existsSync(program.configFile)
      ) {
        filePath = program.configFile;
      }
      if (fs.existsSync(`${process.cwd()}/localize.yml`)) {
        filePath = `${process.cwd()}/localize.yml`;
      } else {
        verbose ? console.error(chalk.red(`Config File Not Found`)) : "";
        process.exit(0);
      }
      configTry = yaml.safeLoad(fs.readFileSync(filePath, "utf8"));
    } catch (err) {
      verbose ? console.error(chalk.red(`error with Upload :::: ${err} `)) : "";
      process.exit(0);
    }

    return configTry;
  }

  /**
   * @description create options variable with all parameters
   */
  function getConfig() {
    verbose ? console.clear() : "";
    const params = openFileConfig().params;

    verbose ? console.log(chalk.bold("Config loaded :")) : "";
    let options = {};
    /** @var options.localisebiz path api localise.biz [default="https://localise.biz/api"] */
    options.localisebiz =
      getVar("localisebiz", params) || "https://localise.biz/api";
    options.localisebiz =
      options.localisebiz &&
      options.localisebiz[options.localisebiz.length - 1] === "/"
        ? options.localisebiz
        : `${options.localisebiz}/`;
    verbose
      ? console.log(
          chalk.italic("\tlocalisebiz: ") + chalk.bold(options.localisebiz)
        )
      : "";
    /** @var options.key key public of localise.biz ( need read and write )  */
    options.key = getVar("key", params);
    verbose
      ? console.log(chalk.italic("\tkey: ") + chalk.bold(options.key))
      : "";
    /** @var options.pathToReactMessages path to messages extracted in react projects  */
    options.pathToReactMessages = getVar("pathToReactMessages", params);
    options.pathToReactMessages =
      options.pathToReactMessages &&
      options.pathToReactMessages[options.pathToReactMessages.length] === "/"
        ? options.pathToReactMessages
        : `${options.pathToReactMessages}/`;
    verbose && options.pathToReactMessages
      ? console.log(
          chalk.italic("\tpathToReactMessages: ") +
            chalk.bold(options.pathToReactMessages)
        )
      : "";
    /** @var options.messagesFileName name of file to extract messages  */
    options.messagesFileName = getVar("messagesFileName", params);
    verbose && options.messagesFileName
      ? console.log(
          chalk.italic("\tmessagesFileName: ") +
            chalk.bold(options.messagesFileName)
        )
      : "";
    /** @var options.pathToTranslations path to local translation folder  */
    options.pathToTranslations = getVar("pathToTranslations", params);
    options.pathToTranslations =
      options.pathToTranslations &&
      options.pathToTranslations[options.pathToTranslations.length] === "/"
        ? options.pathToTranslations
        : `${options.pathToTranslations}/`;
    verbose && options.pathToTranslations
      ? console.log(
          chalk.italic("\tpathToTranslations:") +
            chalk.bold(options.pathToTranslations)
        )
      : "";
    /** @var options.languages array languages you needed */
    options.languages = getVar("languages", params) || ["en"];
    verbose
      ? console.log(
          chalk.italic("\tLanguages: ") + chalk.bold(options.languages)
        )
      : "";
    /** @var options.filter Filter assets by comma-separated tag names. Match any tag with * and negate tags by prefixing with !  */
    options.filter = getVar("filter", params);
    verbose && options.filter
      ? console.log(chalk.italic("\tfilter: ") + chalk.bold(options.filter))
      : "";
    /** @var options.commandAfterSync command to execute after sync if translation file changed */
    options.commandAfterSync = getVar("commandAfterSync", params);
    verbose && options.commandAfterSync
      ? console.log(
          chalk.italic("\tcommandAfterSync: ") +
            chalk.bold(options.commandAfterSync)
        )
      : "";
    /** @var options.format More specific format of file type. e.g. symfony applies to php, xlf & yml [default value: 'script'] */
    options.format = getVar("format", params) || "script";
    verbose
      ? console.log(chalk.italic("\tformat: ") + chalk.bold(options.format))
      : "";
    /** @var options.index Override default lookup key for the file format: "id", "text" or a custom alias  */
    options.index = getVar("index", params);
    verbose && options.index
      ? console.log(chalk.italic("\tindex: ") + chalk.bold(options.index))
      : "";
    /** @var options.source Specify alternative source locale instead of project default  */
    options.source = getVar("source", params);
    verbose && options.source
      ? console.log(chalk.italic("\tsource: ") + chalk.bold(options.source))
      : "";
    /** @var options.namespace Override the project name for some language packs that use it as a key prefix  */
    options.namespace = getVar("namespace", params);
    verbose && options.namespace
      ? console.log(
          chalk.italic("\tnamespace: ") + chalk.bold(options.namespace)
        )
      : "";
    /** @var options.fallback Fallback locale for untranslated assets, specified as short code. e.g. en or en_GB  */
    options.fallback = getVar("fallback", params);
    verbose && options.fallback
      ? console.log(chalk.italic("\tfallback: ") + chalk.bold(options.fallback))
      : "";
    /** @var options.order Export translations according to asset order  */
    options.order = getVar("order", params);
    verbose && options.order
      ? console.log(chalk.italic("\torder: ") + chalk.bold(options.order))
      : "";
    /** @var options.status Export translations with a specific status or flag. Negate values by prefixing with !. e.g. "translated", or "!fuzzy".  */
    options.status = getVar("status", params);
    verbose && options.status
      ? console.log(chalk.italic("\tstatus: ") + chalk.bold(options.status))
      : "";
    /** @var options.printf Force alternative "printf" style. */
    options.printf = getVar("printf", params);
    verbose && options.printf
      ? console.log(chalk.italic("\tprintf: ") + chalk.bold(options.printf))
      : "";
    /** @var options.charset Specify preferred character encoding. Alternative to Accept-Charset header but accepts a single value which must be valid. */
    options.charset = getVar("charset", params);
    verbose && options.charset
      ? console.log(chalk.italic("\tcharset: ") + chalk.bold(options.charset))
      : "";
    /** @var options.breaks Force platform-specific line-endings. Default is Unix (LF) breaks. */
    options.breaks = getVar("breaks", params);
    verbose && options.breaks
      ? console.log(chalk.italic("\tbreaks: ") + chalk.bold(options.breaks))
      : "";
    /** @var options.noComments Disable rendering of redundant inline comments including the Loco banner.  */
    options.noComments = getVar("noComments", params);
    verbose && options.noComments
      ? console.log(
          chalk.italic("\tnoComments: ") + chalk.bold(options.noComments)
        )
      : "";
    /** @var options.noFolding Protect dot-separated keys so that foo.bar is not folded into object properties. */
    options.noFolding = getVar("noFolding", params);
    verbose && options.noFolding
      ? console.log(
          chalk.italic("\tnoFolding: ") + chalk.bold(options.noFolding)
        )
      : "";
    /** @var options.async Specify that import should be done asynchronously (recommended for large files) */
    options.async = getVar("async", params);
    verbose && options.async
      ? console.log(chalk.italic("\tasync: ") + chalk.bold(options.async))
      : "";
    /** @var options.path Specify original file path for source code references (excluding line number) */
    options.path = getVar("path", params);
    verbose && options.path
      ? console.log(chalk.italic("\tpath: ") + chalk.bold(options.path))
      : "";
    /** @var options.ignoreNew Specify that new assets will NOT be added to the project */
    options.ignoreNew = getVar("ignoreNew", params);
    verbose && options.ignoreNew
      ? console.log(
          chalk.italic("\tignoreNew: ") + chalk.bold(options.ignoreNew)
        )
      : "";
    /** @var options.ignoreExisting Specify that existing assets encountered in the file will NOT be updated */
    options.ignoreExisting = getVar("ignoreExisting", params);
    verbose && options.ignoreExisting
      ? console.log(
          chalk.italic("\tignoreExisting: ") +
            chalk.bold(options.ignoreExisting)
        )
      : "";
    /** @var options.tagNew Tag any NEW assets added during the import with the given tags (comma separated) */
    options.tagNew = getVar("tagNew", params);
    verbose && options.tagNew
      ? console.log(chalk.italic("\ttagNew: ") + chalk.bold(options.tagNew))
      : "";
    /** @var options.tagAll Tag ALL assets in the file with the given tags (comma separated) */
    options.tagAll = getVar("tagAll", params);
    verbose && options.tagAll
      ? console.log(chalk.italic("\ttagAll: ") + chalk.bold(options.tagAll))
      : "";
    /** @var options.unTagAll Remove existing tags from any assets matched in the imported file (comma separated) */
    options.unTagAll = getVar("unTagAll", params);
    verbose && options.unTagAll
      ? console.log(chalk.italic("\tunTagAll: ") + chalk.bold(options.unTagAll))
      : "";
    /** @var options.tagUpdated Remove existing tags from assets that are MODIFIED during import */
    options.tagUpdated = getVar("tagUpdated", params);
    verbose && options.tagUpdated
      ? console.log(
          chalk.italic("\ttagUpdated: ") + chalk.bold(options.tagUpdated)
        )
      : "";
    /** @var options.tagAbsent Tag existing assets in the project that are NOT found in the imported file */
    options.tagAbsent = getVar("tagAbsent", params);
    verbose && options.tagAbsent
      ? console.log(
          chalk.italic("\ttagAbsent: ") + chalk.bold(options.tagAbsent)
        )
      : "";
    /** @var options.unTagAbsent Remove existing tags from assets NOT found in the imported file */
    options.unTagAbsent = getVar("unTagAbsent", params);
    verbose && options.unTagAbsent
      ? console.log(
          chalk.italic("\tunTagAbsent: ") + chalk.bold(options.unTagAbsent)
        )
      : "";
    /** @var options.deleteAbsent Permanently DELETES project assets NOT found in the file (use with extreme caution) */
    options.deleteAbsent = getVar("deleteAbsent", params);
    verbose && options.deleteAbsent
      ? console.log(
          chalk.italic("\tdeleteAbsent: ") + chalk.bold(options.deleteAbsent)
        )
      : "";

    verbose ? console.log("") : "";
    return options;
  }

  return {
    setVerbose: setVerbose,
    getConfig: getConfig,
  };
})();
