/**
 * @author AZOULAY Jordan <jazoulay@greenflex.com>
 * @description Download translation files language by language from localise.biz.
 */
const request = require("request");
const fs = require("fs");
const chalk = require("chalk");
const config = require("./config");
const urlUtility = require("../utils/url");
const logUtility = require("../utils/log");

const { log, error } = logUtility;

module.exports = (function () {
  let options = null;
  let verbose = false;

  /**
   *
   * @param {*} opt
   * @description check if all options required is initialized
   */
  function required(opt) {
    let allRequired = true;
    Object.keys(opt).forEach((key) => {
      const value = opt[key];
      if (
        (key === "localisebiz" ||
          key === "languages" ||
          key === "key" ||
          key === "pathToTranslations") &&
        value === undefined
      ) {
        if (verbose) error(chalk.red(`Config ${key} is required`));
        allRequired = false;
      }
    });
    return allRequired;
  }

  /**
   *
   * @param {*} finalFile
   * @param {*} language
   * @description Save local translation file
   */
  function updateLocalFile(finalFile, language) {
    fs.writeFile(
      `${options.pathToTranslations}${language}.json`,
      JSON.stringify(finalFile, null, 2),
      (err) => {
        if (err) {
          error(
            chalk.red(
              `Can't write in file ${options.pathToTranslations}${language}.json`
            )
          );
          process.exit(0);
        } else if (verbose) {
          log(`\n${options.pathToTranslations}${language}.json updated!`);
        }
      }
    );
  }

  function start(v) {
    if (v) {
      verbose = true;
      config.setVerbose(true);
    }

    options = config.getConfig();
    if (!required(options)) {
      process.exit(0);
    }

    if (verbose) log(chalk.bgCyan("\t\t\t\tSTART DOWNLOAD"));

    for (let i = 0; i < options.languages.length; i += 1) {
      const language = options.languages[i];
      if (verbose) log(chalk.underline.bold(`Language ${language} + " :::::"`));
      const parametersUri = urlUtility.generateURIParameters(options);
      const url = `${options.localisebiz}export/locale/${language}.json${parametersUri}`;

      if (verbose) log(chalk.italic(`\tLoad API file ${url}`));

      try {
        request.get(
          {
            url,
            json: true,
            headers: {
              Authorization: `Loco ${options.key}`,
            },
          },
          (err, res, data) => {
            if (err) {
              if (verbose) error(chalk.red(`Http Error :::: ${err} `));
              process.exit(0);
            } else if (res.statusCode === 200) {
              /** @var localiseFile translation file in localise.biz */
              const localiseFile = JSON.parse(JSON.stringify(data));
              try {
                updateLocalFile(localiseFile, language);
              } catch (e) {
                error(chalk.red(e));
                process.exit(0);
              }
            } else {
              if (verbose)
                error(chalk.red(`Http Error :::: ${res.statusCode} `));
              process.exit(0);
            }
          }
        );
      } catch (e) {
        error(
          chalk.red(
            `File ${options.pathToTranslations}${language}.json not found`
          )
        );
        process.exit(0);
      }
    }
  }

  return {
    start,
  };
})();
