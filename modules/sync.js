/**
 * @author AZOULAY Jordan <jazoulay@greenflex.com>
 * @description Compare translation local files with localise.biz translation files language by language
 */
const request = require("request");
const fs = require("fs");
const config = require("./config");
const chalk = require("chalk");
const cmd = require("node-cmd");
const urlUtility = require("../utils/url");
const logUtility = require("../utils/log");
const log = logUtility.log;
const error = logUtility.error;

module.exports = (function () {
  let options = null;
  let verbose = false;
  let direction = null;

  function start(v, d) {
    if (v) {
      verbose = true;
      config.setVerbose(true);
    }

    direction = d;

    options = config.getConfig();

    verbose ? log("\t\t\t\t" + chalk.bgCyan("START SYNCHRONIZATION")) : "";

    const parametersUri = urlUtility.generateURIParameters(options);

    for (let i = 0; i < options.languages.length; i++) {
      const language = options.languages[i];
      verbose
        ? log("Language " + chalk.underline.bold(language) + " :::::")
        : "";

      const url = `${options.localisebiz}export/locale/${language}.json${parametersUri}`;

      verbose ? log(chalk.italic(`\tLoad API file ${url}`)) : "";

      try {
        /** @var fileDev local translation file  */
        const fileDev = JSON.parse(
          fs.readFileSync(`${options.pathToTranslations}${language}.json`)
        );

        verbose
          ? log(
              chalk.italic(
                `\tLoad local file ${options.pathToTranslations}${language}.json`
              )
            )
          : "";

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
              const finalFile = sync(fileDev, filePo);
              try {
                updateFileDev(finalFile, language);
                updateFilePo(finalFile, language);
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
   * @param {*} fileDev
   * @param {*} filePo
   * @description Create new translation file with translation changed by product owner and add new key translation
   */
  function sync(fileDev, filePo) {
    verbose ? log("") : "";

    let file = {};
    let nbModifications = 0;
    let nbNewKey = 0;

    for (let key in fileDev) {
      if (fileDev[key] === filePo[key]) {
        file[key] = filePo[key];
      } else if (filePo[key] === undefined) {
        file[key] = fileDev[key];
        nbNewKey++;
        verbose ? log(chalk.dim(`\tNew translation key : '${key}'`)) : "";
      } else {
        file[key] = direction === "up" ? fileDev[key] : filePo[key];
        verbose
          ? log(
              chalk.dim(`\tKey '${key}' updated with value : '${filePo[key]}'`)
            )
          : "";
        nbModifications++;
      }
    }
    // check if new key in filePo ( localise.biz )
    for (let key in filePo) {
      if (fileDev[key] === undefined) {
        file[key] = filePo[key];
        nbNewKey++;
        verbose ? log(chalk.dim(`\tNew translation key : '${key}'`)) : "";
        nbModifications++;
      }
    }
    if (verbose) {
      log("");
      log("\t----------------------");
      log(`\tModifications : ${nbModifications}`);
      log(`\tNew translation keys : ${nbNewKey}`);
      log("\t----------------------");
    }

    if (nbModifications > 0 && options.commandAfterSync) {
      cmd.get(options.commandAfterSync, (err, data, stderr) => {
        if (err) {
          log(chalk.red(`Command ${options.commandAfterSync} fail!`));
          process.exit(0);
        } else {
          verbose ? log(data) : "";
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

  /**
   *
   * @param {*} finalFile
   * @param {*} language
   * @description Update translation file to localise.biz
   */
  function updateFilePo(finalFile, language) {
    const url = `${options.localisebiz}import/json?tag-all=reactjs&locale=${language}`;
    request.post(
      {
        url: url,
        json: true,
        headers: {
          Authorization: `Loco ${options.key}`,
        },
        body: finalFile,
      },
      (err, res, data) => {
        if (err) {
          verbose ? error(chalk.red(`Http Error :::: ${err} `)) : "";
          process.exit(0);
        } else if (res.statusCode === 200) {
          verbose ? log(`Localise.biz with language ${language} updated!`) : "";
        } else {
          verbose ? error(chalk.red(`Http Error :::: ${res.statusCode} `)) : "";
          process.exit(0);
        }
      }
    );
  }

  return {
    start: start,
  };
})();
