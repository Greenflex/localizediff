/**
 * @deprecated
 * @description isn't import module link with Import API https://localise.biz/api/docs/import will be change
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
          key === "messagesFileName" ||
          key === "pathToReactMessages") &&
        value === undefined
      ) {
        error(chalk.red(`Config ${key} is required`));
        allRequired = false;
      }
    });
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
    const parametersUri = urlUtility.generateURIParameters(options);
    const url = `${options.localisebiz}import/json${parametersUri}&locale=fr-x-custom`;
    request.post(
      {
        url,
        json: true,
        headers: {
          Authorization: `Loco ${options.key}`,
        },
        body: finalFile,
      },
      (err, res) => {
        if (err) {
          if (verbose) error(chalk.red(`Http Error :::: ${err} `));
          process.exit(0);
        } else if (res.statusCode === 200) {
          if (verbose) log(`Localise.biz with language fr updated!`);
        } else {
          if (verbose) error(chalk.red(`Http Error :::: ${res.statusCode} `));
          process.exit(0);
        }
      }
    );
  }

  async function start(v) {
    if (v) {
      verbose = true;
      config.setVerbose(true);
    }

    options = config.getConfig();
    if (!required(options)) {
      process.exit(0);
    }

    if (verbose) log(chalk.bgCyan("\t\t\t\tSTART SYNCHRONIZATION REACT"));

    const url = `${options.localisebiz}export/locale/fr-x-custom.json?format=script`;
    if (verbose) log(chalk.italic(`\tLoad API file ${url}`));

    try {
      /** @var fileDev local extraced messages file  */
      const fileDev = JSON.parse(
        fs.readFileSync(
          `${process.cwd()}/${options.pathToReactMessages}${
            options.messagesFileName
          }.json`
        )
      );
      if (verbose)
        log(
          chalk.italic(
            `\tLoad local file ${process.cwd()}/${options.pathToReactMessages}${
              options.messagesFileName
            }.json`
          )
        );

      // get file from localise
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
            /** @var filePo translation file in localise.biz */
            const filePo = JSON.parse(JSON.stringify(data));
            const finalFile = sync(fileDev, filePo);
            try {
              updateFileLocalize(finalFile);
            } catch (erro) {
              if (verbose) error(chalk.red(`error with Upload :::: ${erro} `));
            }
          } else {
            if (verbose) error(chalk.red(`Http Error :::: ${res.statusCode} `));
            process.exit(0);
          }
        }
      );
    } catch (err) {
      log("error", err);
    }
  }

  return {
    start,
  };
})();
