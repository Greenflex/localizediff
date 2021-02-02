/**
 * @author AZOULAY Jordan <jazoulay@greenflex.com>
 * @description Download translation files language by language from localise.biz.
 */
const request = require("request");
const fs = require("fs");
const config = require("./config");
const chalk = require("chalk");
const urlUtility = require("../utils/url");
const logUtility = require("../utils/log");
const log = logUtility.log;
const error = logUtility.error;

module.exports = (function () {
  let options = null;
  let verbose = false;

  function start(v) {
    if (v) {
      verbose = true;
      config.setVerbose(true);
    }

    options = config.getConfig();

    verbose ? log("\t\t\t\t" + chalk.bgCyan("START DOWNLOAD")) : "";

    for (let i = 0; i < options.languages.length; i++) {
      const language = options.languages[i];
      verbose
        ? log("Language " + chalk.underline.bold(language) + " :::::")
        : "";
      const parametersUri = urlUtility.generateURIParameters(options);
      const url = `${options.localisebiz}export/locale/${language}.json${parametersUri}`;

      verbose ? log(chalk.italic(`\tLoad API file ${url}`)) : "";

      try {
        request.get(
          {
            url: url,
            json: true,
            headers: {
              Authorization: `Loco ${options.key}`,
            },
          },
          (err, res, data) => {
            if (err) {
              verbose ? error(chalk.red(`Http Error :::: ${err} `)) : "";
              process.exit(0);
            } else if (res.statusCode === 200) {
              /** @var filePo translation file in localise.biz */
              const filePo = JSON.parse(JSON.stringify(data));
              try {
                updateFileDev(filePo, language);
              } catch (e) {
                error(chalk.red(e));
                process.exit(0);
              }
            } else {
              verbose
                ? error(chalk.red(`Http Error :::: ${res.statusCode} `))
                : "";
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

  /**
   *
   * @param {*} finalFile
   * @param {*} language
   * @description Save local translation file
   */
  function updateFileDev(finalFile, language) {
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
        } else {
          verbose
            ? log(`\n${options.pathToTranslations}${language}.json updated!`)
            : "";
        }
      }
    );
  }

  return {
    start: start,
  };
})();
