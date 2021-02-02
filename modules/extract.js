/**
 * @author AZOULAY Jordan <jazoulay@greenflex.com>
 * @description Compare translation local files with localise.biz translation files language by language
 */
const fs = require("fs");
const config = require("./config");
const chalk = require("chalk");
const logUtility = require("../utils/log");
const log = logUtility.log;
const error = logUtility.error;

module.exports = (function () {
  let options = null;
  let verbose = false;
  let languageToExtract = null;

  function start(v, languageFrom) {
    if (v) {
      verbose = true;
      config.setVerbose(true);
    }

    if (languageFrom === undefined) {
      verbose
        ? error(chalk.red("Use -f option for select language from extract"))
        : "";
      process.exit(0);
    }

    languageToExtract = languageFrom;

    options = config.getConfig();
    const { languages, pathToTranslations } = options;

    verbose ? log("\t\t\t\t" + chalk.bgCyan("START EXTRACT")) : "";

    for (let i = 0; i < languages.length; i++) {
      const language = languages[i];

      if (language === languageToExtract) {
        continue;
      }

      verbose
        ? log("Language " + chalk.underline.bold(language) + " :::::")
        : "";

      let fileDev = null;
      let fileToExtract = null;

      try {
        /** @var fileDev local translation file  */
        fileToExtract = JSON.parse(
          fs.readFileSync(`${pathToTranslations}${languageToExtract}.json`)
        );
      } catch (e) {
        error(
          chalk.red(
            `File ${pathToTranslations}${languageToExtract}.json not found`
          )
        );
        process.exit(0);
      }

      try {
        /** @var fileDev local translation file  */
        fileDev = JSON.parse(
          fs.readFileSync(`${pathToTranslations}${language}.json`)
        );
      } catch (e) {
        /** If file language dosn't exist create new file from file to extract */
        try {
          fs.writeFileSync(
            `${pathToTranslations}${language}.json`,
            fs.readFileSync(`${pathToTranslations}${languageToExtract}.json`)
          );
        } catch (e) {
          error(
            chalk.red(`Can't create ${pathToTranslations}${language}.json file`)
          );
          process.exit(0);
        }

        verbose
          ? log(
              chalk.dim(
                `File ${pathToTranslations}${language}.json created from ${pathToTranslations}${languageToExtract}.json`
              )
            )
          : "";
        continue;
      }

      verbose
        ? log(
            chalk.italic(
              `\tLoad local file ${pathToTranslations}${language}.json`
            )
          )
        : "";

      const finalFile = sync(fileDev, fileToExtract);
      try {
        updateFileDev(finalFile, language);
      } catch (e) {
        error(chalk.red(e));
        process.exit(0);
      }
    }
  }

  /**
   *
   * @param {*} fileDev
   * @param {*} fileToExtract
   * @description Add key in language file from extract file
   */
  function sync(fileDev, fileToExtract) {
    verbose ? log("") : "";

    let file = {};
    let nbModifications = 0;
    let nbNewKey = 0;

    for (let key in fileToExtract) {
      if (fileDev[key] === undefined) {
        file[key] = fileToExtract[key];
        nbNewKey++;
        verbose ? log(chalk.dim(`\tNew translation key : '${key}'`)) : "";
      } else {
        file[key] = fileDev[key];
      }
    }
    if (verbose) {
      log("");
      log("\t----------------------");
      log(`\tModifications : ${nbModifications}`);
      log(`\tNew translation keys : ${nbNewKey}`);
      log("\t----------------------");
    }

    return file;
  }

  /**
   *
   * @param {*} finalFile
   * @param {*} language
   * @description Save local translation file
   */
  function updateFileDev(finalFile, language) {
    const { pathToTranslations } = options;
    fs.writeFile(
      `${pathToTranslations}${language}.json`,
      JSON.stringify(finalFile, null, 2),
      (err) => {
        if (err) {
          error(
            chalk.red(
              `Can't write in file ${pathToTranslations}${language}.json`
            )
          );
          process.exit(0);
        } else {
          verbose
            ? log(`\n${pathToTranslations}${language}.json updated!`)
            : "";
        }
      }
    );
  }

  return {
    start: start,
  };
})();
