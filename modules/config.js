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
    const params = openFileConfig().params;

    verbose ? console.log(chalk.bold("Config file loaded :")) : "";
    let options = {};
    /** @var options.localisebiz path api localise.biz */
    options.localisebiz = getVar("localisebiz", params);
    options.localisebiz =
      options.localisebiz &&
      options.localisebiz[options.localisebiz.length - 1] === "/"
        ? options.localisebiz
        : `${options.localisebiz}/`;
    verbose
      ? console.log(
          chalk.italic("\tLink to API localise.biz: ") +
            chalk.bold(options.localisebiz)
        )
      : "";
    /** @var options.key key public of localise.biz ( need read and write )  */
    options.key = getVar("key", params);
    verbose
      ? console.log(
          chalk.italic("\tLocalize.biz key: ") + chalk.bold(options.key)
        )
      : "";
    /** @var options.pathToReactMessages path to messages extracted in react projects  */
    options.pathToReactMessages = getVar("pathToReactMessages", params);
    options.pathToReactMessages =
      options.pathToReactMessages &&
      options.pathToReactMessages[options.pathToReactMessages.length] === "/"
        ? options.pathToReactMessages
        : `${options.pathToReactMessages}/`;
    verbose
      ? console.log(
          chalk.italic("\tPath to local translation messages folder: ") +
            chalk.bold(options.pathToReactMessages)
        )
      : "";
    /** @var options.messagesFileName name of file to extract messages  */
    options.messagesFileName = getVar("messagesFileName", params);

    /** @var options.pathToTranslations path to local translation folder  */
    options.pathToTranslations = getVar("pathToTranslations", params);
    options.pathToTranslations =
      options.pathToTranslations &&
      options.pathToTranslations[options.pathToTranslations.length] === "/"
        ? options.pathToTranslations
        : `${options.pathToTranslations}/`;
    verbose
      ? console.log(
          chalk.italic("\tPath to local translation folder: ") +
            chalk.bold(options.pathToTranslations)
        )
      : "";
    /** @var options.languages */
    options.languages = getVar("languages", params);
    verbose
      ? console.log(
          chalk.italic("\tLanguages: ") + chalk.bold(options.languages)
        )
      : "";
    /** @var options.filter tag to use */
    options.filter = getVar("filter", params);
    verbose
      ? console.log(chalk.italic("\tFilter: ") + chalk.bold(options.filter))
      : "";
    /** @var options.commandAfterSync command to execute after sync if translation file changed */
    options.commandAfterSync = getVar("commandAfterSync", params);

    verbose ? console.log("") : "";
    return options;
  }

  return {
    setVerbose: setVerbose,
    getConfig: getConfig,
  };
})();
