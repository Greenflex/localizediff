/**
 * @author AZOULAY Jordan <jazoulay@greenflex.com>
 * @description Read configuration in ./config.yaml file
 */
const yaml = require("js-yaml");
const fs = require("fs");
const chalk = require("chalk");

module.exports = (function() {
  let verbose = false;

  /**
   * @description open config.yaml file
   */
  function openFileConfig() {
    return yaml.safeLoad(fs.readFileSync("./config.yaml", "utf8"));
  }

  function setVerbose(v) {
    verbose = v;
  }

  /**
   * @description create options variable with all parameters
   */
  function getConfig() {
    let params = null;
    try {
      params = openFileConfig().params;
    } catch (e) {
      console.error(chalk.red("Config file ( config.yaml ) not found"));
      process.exit(0);
    }

    verbose
      ? console.log(chalk.bold("Config file ./config.yaml loaded :"))
      : "";
    let options = {};
    /** @var options.localisebiz path api localise.biz */
    options.localisebiz =
      params.localisebiz &&
      params.localisebiz[params.localisebiz.length - 1] === "/"
        ? params.localisebiz
        : `${params.localisebiz}/`;
    verbose
      ? console.log(
          chalk.italic("\tLink to API localise.biz: ") +
            chalk.bold(options.localisebiz)
        )
      : "";
    /** @var options.key key public of localise.biz ( need read and write )  */
    options.key = params.key;
    verbose
      ? console.log(
          chalk.italic("\tLocalize.biz key: ") + chalk.bold(options.key)
        )
      : "";
    /** @var options.pathToTranslations path to local translation folder  */
    options.pathToTranslations =
      params.pathToTranslations &&
      params.pathToTranslations[params.pathToTranslations.length] === "/"
        ? params.pathToTranslations
        : `${params.pathToTranslations}/`;
    verbose
      ? console.log(
          chalk.italic("\tPath to local translation folder: ") +
            chalk.bold(options.pathToTranslations)
        )
      : "";
    /** @var options.languages languages (default : ["en", "fr"]) */
    options.languages = params.languages ? params.languages : ["en", "fr"];
    verbose
      ? console.log(
          chalk.italic("\tLanguages: ") + chalk.bold(options.languages)
        )
      : "";
    /** @var options.filter tag to localise.biz use for differentiate with symfony files */
    options.filter = params.filter ? params.filter : "reactjs";
    verbose
      ? console.log(chalk.italic("\tFilter: ") + chalk.bold(params.filter))
      : "";

    verbose ? console.log("") : "";
    return options;
  }

  return {
    setVerbose: setVerbose,
    getConfig: getConfig
  };
})();
