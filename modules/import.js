/**
 * @author AZOULAY Jordan <jazoulay@greenflex.com>
 * @description Compare translation local files with localise.biz translation files for french and upload resulting file to localise
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

  async function start(v) {
    if (v) {
      verbose = true;
      config.setVerbose(true);
    }

    options = config.getConfig();
    if (!required(options)) {
      process.exit(0);
    }

    verbose
      ? log("\t\t\t\t" + chalk.bgCyan("START SYNCHRONIZATION REACT"))
      : "";

    const url = `${options.localisebiz}export/locale/fr-x-custom.json?format=script`;
    verbose ? log(chalk.italic(`\tLoad API file ${url}`)) : "";

    try {
      /** @var fileDev local extraced messages file  */
      let fileDev = JSON.parse(
        fs.readFileSync(
          `${process.cwd()}/${options.pathToReactMessages}${
            options.messagesFileName
          }.json`
        )
      );
      verbose
        ? log(
            chalk.italic(
              `\tLoad local file ${process.cwd()}/${
                options.pathToReactMessages
              }${options.messagesFileName}.json`
            )
          )
        : "";

      // get file from localise
      request.get(
        {
          url: url,
          json: true,
          headers: {
            Authorization: `Loco ${options.key}`,
          },
        },
        function (err, res, data) {
          if (err) {
            verbose ? error(chalk.red(`Http Error :::: ${err} `)) : "";
            process.exit(0);
          } else if (res.statusCode === 200) {
            /** @var filePo translation file in localise.biz */
            const filePo = JSON.parse(JSON.stringify(data));
            const finalFile = sync(fileDev, filePo);
            try {
              updateFileLocalize(finalFile);
            } catch (err) {
              verbose ? error(chalk.red(`error with Upload :::: ${err} `)) : "";
            }
          } else {
            verbose
              ? error(chalk.red(`Http Error :::: ${res.statusCode} `))
              : "";
            process.exit(0);
          }
        }
      );
    } catch (err) {
      log("error", err);
    }
  }

  /**
   *
   * @param {*} options
   * @description check if all options required is initialized
   */
  function required(options) {
    let allRequired = true;
    for (const key in options) {
      const value = options[key];
      if (
        (key === "localisebiz" ||
          key === "languages" ||
          key === "key" ||
          key === "messagesFileName" ||
          key === "pathToReactMessages") &&
        value === undefined
      ) {
        error(chalk.red(`Config ${key} is required`));
        allRequired = false;
      }
    }
    return allRequired;
  }

  /**
   *
   * @param {*} fileDev
   * @param {*} filePo
   * @description Create new translation file with translation changed by product owner and add new key translation
   */
  const sync = (fileDev, filePo) => {
    const newKeys = {};
    fileDev.forEach((message) => {
      if (!filePo[message.id]) {
        newKeys[message.id] = message.defaultMessage;
      }
    });
    return {
      ...newKeys,
      ...filePo,
    };
  };

  /*
   * @param {*} finalFile
   * @description Update translation file to localise.biz
   */
  function updateFileLocalize(finalFile) {
    //  generateUrl(options);
    const parametersUri = urlUtility.generateURIParameters(options);
    const url = `${options.localisebiz}import/json${parametersUri}&locale=fr-x-custom`;
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
          verbose ? log(`Localise.biz with language fr updated!`) : "";
        } else {
          verbose ? error(chalk.red(`Http Error :::: ${res.statusCode} `)) : "";
          process.exit(0);
        }
      }
    );
  }

  return {
    start,
  };
})();
