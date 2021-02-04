/**
 * @author AZOULAY Jordan <jazoulay@greenflex.com>
 * @description Load configuration from env or program execution or then localize.yml
 */
const program = require("commander");
const yaml = require("js-yaml");
const fs = require("fs");
const chalk = require("chalk");
const logUtility = require("../utils/log");

const { log, error, clear, warn } = logUtility;

module.exports = (function () {
  let verbose = false;

  function setVerbose(v) {
    verbose = v;
  }

  function getVar(key, params) {
    if (program[key]) {
      return program[key];
    }
    if (process.env[`LOCALISE_${key.toUpperCase()}`]) {
      return process.env[`LOCALISE_${key.toUpperCase()}`];
    }
    return params[key];
  }

  function getVarLanguages(params) {
    if (program.languages) {
      return program.languages.split(",");
    }
    if (process.env.LOCALISE_LANGUAGES) {
      return process.env.LOCALISE_LANGUAGES.split(",");
    }
    return params.languages;
  }

  /**
   * @description open localize.yml file
   */
  function openFileConfig() {
    let configTry = { params: {} };
    let filePath;

    try {
      if (process.env.LOCALISE_CONFIGFILE) {
        filePath = process.env.LOCALISE_CONFIGFILE;
      } else if (program.configFile) {
        filePath = program.configFile;
      } else {
        filePath = `${process.cwd()}/localize.yml`;
      }
      if (fs.existsSync(filePath)) {
        configTry = yaml.safeLoad(fs.readFileSync(filePath, "utf8"));
      } else if (fs.existsSync(`${process.cwd()}/localize.yml.dist`)) {
        configTry = yaml.safeLoad(
          fs.readFileSync(`${process.cwd()}/localize.yml.dist`, "utf8")
        );
      } else {
        if (verbose)
          warn(
            chalk.yellow(
              `Config File Not Found ::::: ${filePath} or ${process.cwd()}/localize.yml.dist`
            )
          );
      }
    } catch (err) {
      if (verbose) error(chalk.red(`error with load file :::: ${err} `));
      process.exit(0);
    }

    return configTry;
  }

  /**
   * @description create options variable with all parameters
   */
  function getConfig() {
    if (verbose) clear();
    const { params } = openFileConfig();

    if (verbose) log(chalk.bold("Config loaded :"));
    const options = {};
    /** @var options.localisebiz path api localise.biz [default="https://localise.biz/api"] */
    options.localisebiz =
      getVar("localisebiz", params) || "https://localise.biz/api";
    options.localisebiz =
      options.localisebiz &&
      options.localisebiz[options.localisebiz.length - 1] === "/"
        ? options.localisebiz
        : `${options.localisebiz}/`;
    if (verbose)
      log(chalk.italic("\tlocalisebiz: ", chalk.bold(options.localisebiz)));
    /** @var options.key key public of localise.biz ( need read and write )  */
    options.key = getVar("key", params);
    if (verbose) log(chalk.italic("\tkey: ", chalk.bold(options.key)));
    /** @var options.pathToReactMessages path to messages extracted in react projects  */
    options.pathToReactMessages = getVar("pathToReactMessages", params);
    if (options.pathToReactMessages) {
      options.pathToReactMessages =
        options.pathToReactMessages &&
        options.pathToReactMessages[options.pathToReactMessages.length] === "/"
          ? options.pathToReactMessages
          : `${options.pathToReactMessages}/`;
    }
    if (verbose && options.pathToReactMessages) {
      log(
        chalk.italic("\tpathToReactMessages: ") +
          chalk.bold(options.pathToReactMessages)
      );
    }
    /** @var options.messagesFileName name of file to extract messages  */
    options.messagesFileName = getVar("messagesFileName", params);
    if (verbose && options.messagesFileName) {
      log(
        chalk.italic("\tmessagesFileName: ") +
          chalk.bold(options.messagesFileName)
      );
    }
    /** @var options.pathToTranslations path to local translation folder  */
    options.pathToTranslations = getVar("pathToTranslations", params);
    if (options.pathToTranslations) {
      options.pathToTranslations =
        options.pathToTranslations &&
        options.pathToTranslations[options.pathToTranslations.length] === "/"
          ? options.pathToTranslations
          : `${options.pathToTranslations}/`;
    }
    if (verbose && options.pathToTranslations) {
      log(
        chalk.italic(
          "\tpathToTranslations:",
          chalk.bold(options.pathToTranslations)
        )
      );
    }
    /** @var options.languages array languages you needed */
    options.languages = getVarLanguages(params) || ["en"];
    if (verbose)
      log(chalk.italic("\tLanguages: ", chalk.bold(options.languages)));
    /** @var options.filter Filter assets by comma-separated tag names. Match any tag with * and negate tags by prefixing with !  */
    options.filter = getVar("filter", params);
    if (verbose && options.filter)
      log(chalk.italic("\tfilter: ", chalk.bold(options.filter)));
    /** @var options.commandAfterSync command to execute after sync if translation file changed */
    options.commandAfterSync = getVar("commandAfterSync", params);
    if (verbose && options.commandAfterSync)
      log(
        chalk.italic(
          "\tcommandAfterSync: ",
          chalk.bold(options.commandAfterSync)
        )
      );
    /** @var options.format More specific format of file type. e.g. symfony applies to php, xlf & yml [default value: 'script'] */
    options.format = getVar("format", params) || "script";
    if (verbose) log(chalk.italic("\tformat: ", chalk.bold(options.format)));
    /** @var options.index Override default lookup key for the file format: "id", "text" or a custom alias  */
    options.index = getVar("index", params);
    if (verbose && options.index)
      log(chalk.italic("\tindex: ", chalk.bold(options.index)));
    /** @var options.source Specify alternative source locale instead of project default  */
    options.source = getVar("source", params);
    if (verbose && options.source)
      log(chalk.italic("\tsource: ", chalk.bold(options.source)));
    /** @var options.namespace Override the project name for some language packs that use it as a key prefix  */
    options.namespace = getVar("namespace", params);
    if (verbose && options.namespace)
      log(chalk.italic("\tnamespace: ", chalk.bold(options.namespace)));
    /** @var options.fallback Fallback locale for untranslated assets, specified as short code. e.g. en or en_GB  */
    options.fallback = getVar("fallback", params);
    if (verbose && options.fallback)
      log(chalk.italic("\tfallback: ", chalk.bold(options.fallback)));
    /** @var options.order Export translations according to asset order  */
    options.order = getVar("order", params);
    if (verbose && options.order)
      log(chalk.italic("\torder: ", chalk.bold(options.order)));
    /** @var options.status Export translations with a specific status or flag. Negate values by prefixing with !. e.g. "translated", or "!fuzzy".  */
    options.status = getVar("status", params);
    if (verbose && options.status)
      log(chalk.italic("\tstatus: ", chalk.bold(options.status)));
    /** @var options.printf Force alternative "printf" style. */
    options.printf = getVar("printf", params);
    if (verbose && options.printf)
      log(chalk.italic("\tprintf: ", chalk.bold(options.printf)));
    /** @var options.charset Specify preferred character encoding. Alternative to Accept-Charset header but accepts a single value which must be valid. */
    options.charset = getVar("charset", params);
    if (verbose && options.charset)
      log(chalk.italic("\tcharset: ", chalk.bold(options.charset)));
    /** @var options.breaks Force platform-specific line-endings. Default is Unix (LF) breaks. */
    options.breaks = getVar("breaks", params);
    if (verbose && options.breaks)
      log(chalk.italic("\tbreaks: ", chalk.bold(options.breaks)));
    /** @var options.noComments Disable rendering of redundant inline comments including the Loco banner.  */
    options.noComments = getVar("noComments", params);
    if (verbose && options.noComments)
      log(chalk.italic("\tnoComments: ", chalk.bold(options.noComments)));
    /** @var options.noFolding Protect dot-separated keys so that foo.bar is not folded into object properties. */
    options.noFolding = getVar("noFolding", params);
    if (verbose && options.noFolding)
      log(chalk.italic("\tnoFolding: ", chalk.bold(options.noFolding)));
    /** @var options.async Specify that import should be done asynchronously (recommended for large files) */
    options.async = getVar("async", params);
    if (verbose && options.async)
      log(chalk.italic("\tasync: ", chalk.bold(options.async)));
    /** @var options.path Specify original file path for source code references (excluding line number) */
    options.path = getVar("path", params);
    if (verbose && options.path)
      log(chalk.italic("\tpath: ", chalk.bold(options.path)));
    /** @var options.ignoreNew Specify that new assets will NOT be added to the project */
    options.ignoreNew = getVar("ignoreNew", params);
    if (verbose && options.ignoreNew)
      log(chalk.italic("\tignoreNew: ", chalk.bold(options.ignoreNew)));
    /** @var options.ignoreExisting Specify that existing assets encountered in the file will NOT be updated */
    options.ignoreExisting = getVar("ignoreExisting", params);
    if (verbose && options.ignoreExisting)
      log(
        chalk.italic("\tignoreExisting: ", chalk.bold(options.ignoreExisting))
      );
    /** @var options.tagNew Tag any NEW assets added during the import with the given tags (comma separated) */
    options.tagNew = getVar("tagNew", params);
    if (verbose && options.tagNew)
      log(chalk.italic("\ttagNew: ", chalk.bold(options.tagNew)));
    /** @var options.tagAll Tag ALL assets in the file with the given tags (comma separated) */
    options.tagAll = getVar("tagAll", params);
    if (verbose && options.tagAll)
      log(chalk.italic("\ttagAll: ", chalk.bold(options.tagAll)));
    /** @var options.unTagAll Remove existing tags from any assets matched in the imported file (comma separated) */
    options.unTagAll = getVar("unTagAll", params);
    if (verbose && options.unTagAll)
      log(chalk.italic("\tunTagAll: ", chalk.bold(options.unTagAll)));
    /** @var options.tagUpdated Remove existing tags from assets that are MODIFIED during import */
    options.tagUpdated = getVar("tagUpdated", params);
    if (verbose && options.tagUpdated)
      log(chalk.italic("\ttagUpdated: ", chalk.bold(options.tagUpdated)));
    /** @var options.tagAbsent Tag existing assets in the project that are NOT found in the imported file */
    options.tagAbsent = getVar("tagAbsent", params);
    if (verbose && options.tagAbsent)
      log(chalk.italic("\ttagAbsent: ", chalk.bold(options.tagAbsent)));
    /** @var options.unTagAbsent Remove existing tags from assets NOT found in the imported file */
    options.unTagAbsent = getVar("unTagAbsent", params);
    if (verbose && options.unTagAbsent)
      log(chalk.italic("\tunTagAbsent: ", chalk.bold(options.unTagAbsent)));
    /** @var options.deleteAbsent Permanently DELETES project assets NOT found in the file (use with extreme caution) */
    options.deleteAbsent = getVar("deleteAbsent", params);
    if (verbose && options.deleteAbsent)
      log(chalk.italic("\tdeleteAbsent: ", chalk.bold(options.deleteAbsent)));

    if (verbose) log("");
    return options;
  }

  return {
    setVerbose,
    getConfig,
    getVar,
    getVarLanguages,
  };
})();
