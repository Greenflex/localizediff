/**
 * @author AZOULAY Jordan <jazoulay@greenflex.com>
 * @description Compare translation local files with localise.biz translation files language by language
 */
const fs = require("fs");
const chalk = require("chalk");
const config = require("./config");
const logUtility = require("../utils/log");

const { log, error } = logUtility;

module.exports = (function () {
  let options = null;
  let verbose = false;
  let languageToExtract = null;

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
        (key === "languages" || key === "pathToTranslations") &&
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
   * @param {*} localFile
   * @param {*} fileToExtract
   * @description Add key in language file from extract file
   */
  function sync(localFile, fileToExtract) {
    if (verbose) log("");

    const file = {};
    let nbNewKey = 0;

    Object.keys(fileToExtract).forEach((key) => {
      if (localFile[key] === undefined) {
        file[key] = fileToExtract[key];
        nbNewKey += 1;
        if (verbose) log(chalk.dim(`\tNew translation key : '${key}'`));
      } else {
        file[key] = localFile[key];
      }
    });

    if (verbose) {
      log("");
      log("\t----------------------");
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
  function updateLocalFile(finalFile, language) {
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
        } else if (verbose) {
          log(`\n${pathToTranslations}${language}.json updated!`);
        }
      }
    );
  }

  function start(v, languageFrom) {
    if (v) {
      verbose = true;
      config.setVerbose(true);
    }

    if (languageFrom === undefined) {
      if (verbose)
        error(chalk.red("Use -f option for select language from extract"));
      process.exit(0);
    }

    languageToExtract = languageFrom;

    options = config.getConfig();
    if (!required(options)) {
      process.exit(0);
    }
    const { languages, pathToTranslations } = options;

    if (verbose) log(chalk.bgCyan("\t\t\t\tSTART EXTRACT"));

    for (let i = 0; i < languages.length; i += 1) {
      const language = languages[i];

      if (language !== languageToExtract) {
        if (verbose) log(chalk.underline.bold(`Language ${language} :::::`));

        let localFile = null;
        let fileToExtract = null;

        try {
          /** @var localFile local translation file  */
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
          /** @var localFile local translation file  */
          localFile = JSON.parse(
            fs.readFileSync(`${pathToTranslations}${language}.json`)
          );
        } catch (e) {
          /** If file language dosn't exist create new file from file to extract */
          try {
            fs.writeFileSync(
              `${pathToTranslations}${language}.json`,
              fs.readFileSync(`${pathToTranslations}${languageToExtract}.json`)
            );
          } catch (ex) {
            error(
              chalk.red(
                `Can't create ${pathToTranslations}${language}.json file`
              )
            );
            process.exit(0);
          }

          if (verbose)
            log(
              chalk.dim(
                `File ${pathToTranslations}${language}.json created from ${pathToTranslations}${languageToExtract}.json`
              )
            );
          continue;
        }

        if (verbose)
          log(
            chalk.italic(
              `\tLoad local file ${pathToTranslations}${language}.json`
            )
          );

        const finalFile = sync(localFile, fileToExtract);
        try {
          updateLocalFile(finalFile, language);
        } catch (e) {
          error(chalk.red(e));
          process.exit(0);
        }
      }
    }
  }

  return {
    start,
    required,
    sync,
  };
})();
