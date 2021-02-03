/**
 * @author AZOULAY Jordan <jazoulay@greenflex.com>
 * @description Compare translation local files with localise.biz translation files language by language
 */
const request = require("request");
const fs = require("fs");
const chalk = require("chalk");
const cmd = require("node-cmd");

const config = require("./config");
const urlUtility = require("../utils/url");
const logUtility = require("../utils/log");

const { log, error } = logUtility;

module.exports = (function () {
  let options = null;
  let verbose = false;
  let direction = "down";

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
   * @param {*} localFile
   * @param {*} localiseFile
   * @description Create new translation file with translation changed by product owner and add new key translation
   */
  function sync(localFile, localiseFile, opt = options) {
    if (verbose) log("");

    const { commandAfterSync } = opt;
    const file = {};
    let nbModifications = 0;
    let nbNewKey = 0;

    Object.keys(localFile).forEach((key) => {
      if (localFile[key] === localiseFile[key]) {
        file[key] = localiseFile[key];
      } else if (localiseFile[key] === undefined) {
        file[key] = localFile[key];
        nbNewKey += 1;
        if (verbose) log(chalk.dim(`\tNew translation key : '${key}'`));
      } else {
        file[key] = direction === "up" ? localFile[key] : localiseFile[key];
        if (verbose)
          log(
            chalk.dim(
              `\tKey '${key}' updated with value : '${localiseFile[key]}'`
            )
          );
        nbModifications += 1;
      }
    });

    // check if new key in localiseFile ( localise.biz )
    Object.keys(localiseFile).forEach((key) => {
      if (localFile[key] === undefined) {
        file[key] = localiseFile[key];
        nbNewKey += 1;
        if (verbose) log(chalk.dim(`\tNew translation key : '${key}'`));
        nbModifications += 1;
      }
    });
    if (verbose) {
      log("");
      log("\t----------------------");
      log(`\tModifications : ${nbModifications}`);
      log(`\tNew translation keys : ${nbNewKey}`);
      log("\t----------------------");
    }

    if (nbModifications > 0 && commandAfterSync) {
      cmd.get(commandAfterSync, (err, data) => {
        if (err) {
          log(chalk.red(`Command ${commandAfterSync} fail!`));
          process.exit(0);
        } else if (verbose) {
          log(data);
        }
      });
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

  /**
   *
   * @param {*} finalFile
   * @param {*} language
   * @description Update translation file to localise.biz
   */
  function updateLocaliseFile(finalFile, language) {
    const { localisebiz, key } = options;
    const url = `${localisebiz}import/json?tag-all=reactjs&locale=${language}`;
    request.post(
      {
        url,
        json: true,
        headers: {
          Authorization: `Loco ${key}`,
        },
        body: finalFile,
      },
      (err, res) => {
        if (err) {
          if (verbose) error(chalk.red(`Http Error :::: ${err} `));
          process.exit(0);
        } else if (res.statusCode === 200 && verbose) {
          log(`Localise.biz with language ${language} updated!`);
        } else {
          if (verbose) error(chalk.red(`Http Error :::: ${res.statusCode} `));
          process.exit(0);
        }
      }
    );
  }

  function start(v, d) {
    if (v) {
      verbose = true;
      config.setVerbose(true);
    }

    direction = d;

    options = config.getConfig();

    if (!required(options)) {
      process.exit(0);
    }

    const { languages, localisebiz, pathToTranslations, key } = options;

    if (verbose) log(chalk.bgCyan("\t\t\t\tSTART SYNCHRONIZATION"));

    const parametersUri = urlUtility.generateURIParameters(options);

    for (let i = 0; i < languages.length; i += 1) {
      const language = languages[i];
      if (verbose) log(chalk.underline.bold(`Language ${language} :::::`));

      const url = `${localisebiz}export/locale/${language}.json${parametersUri}`;

      if (verbose) log(chalk.italic(`\tLoad API file ${url}`));

      try {
        /** @var localFile local translation file  */
        const localFile = JSON.parse(
          fs.readFileSync(`${pathToTranslations}${language}.json`)
        );

        if (verbose)
          log(
            chalk.italic(
              `\tLoad local file ${pathToTranslations}${language}.json`
            )
          );

        request.get(
          {
            url,
            json: true,
            headers: {
              Authorization: `Loco ${key}`,
            },
          },
          (err, res, data) => {
            if (err) {
              if (verbose) error(chalk.red(`Http Error :::: ${err} `));
              process.exit(0);
            } else if (res.statusCode === 200) {
              /** @var localiseFile translation file in localise.biz */
              const localiseFile = JSON.parse(JSON.stringify(data));
              const finalFile = sync(localFile, localiseFile);
              try {
                updateLocalFile(finalFile, language);
                updateLocaliseFile(finalFile, language);
              } catch (e) {
                error(chalk.red(e));
                process.exit(0);
              }
            } else if (verbose) {
              error(chalk.red(`Http Error :::: ${res.statusCode} `));
              process.exit(0);
            }
          }
        );
      } catch (e) {
        error(
          chalk.red(`File ${pathToTranslations}${language}.json not found`)
        );
        process.exit(0);
      }
    }
  }

  return {
    start,
    sync,
    required,
  };
})();
