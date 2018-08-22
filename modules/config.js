const yaml = require("js-yaml");
const fs = require("fs");
const chalk = require("chalk");

module.exports = (function() {
  let verbose = false;

  function openFileConfig() {
    return yaml.safeLoad(fs.readFileSync("./config.yaml", "utf8"));
  }

  function setVerbose(v) {
    verbose = v;
  }

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
    options.key = params.key;
    verbose
      ? console.log(
          chalk.italic("\tLocalize.biz key: ") + chalk.bold(options.key)
        )
      : "";
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
    options.languages = params.languages ? params.languages : ["en", "fr"];
    verbose
      ? console.log(
          chalk.italic("\tLanguages: ") + chalk.bold(options.languages)
        )
      : "";
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
