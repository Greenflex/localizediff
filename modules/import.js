/**
 * @author AZOULAY Jordan <jazoulay@greenflex.com>
 * @description Compare translation local files with localise.biz translation files for french and upload resulting file to localise
 */
const request = require("request");
const fs = require("fs");
const config = require("./config");
const chalk = require("chalk");
const cmd = require("node-cmd");

module.exports = (function() {
  let options = null;
  let verbose = false;
  let direction = null;
  let reactIntl = false;

  async function start(v) {
    if (v) {
      verbose = true;
      config.setVerbose(true);
    }

    options = config.getConfig();

    verbose
      ? console.log("\t\t\t\t" + chalk.bgCyan("START SYNCHRONIZATION REACT"))
      : "";

    const url = `${options.localisebiz}export/locale/fr.json?format=script`;
    verbose ? console.log(chalk.italic(`\tLoad API file ${url}`)) : "";

    try {
      /** @var fileDev local extraced messages file  */
      let fileDev = JSON.parse(
        fs.readFileSync(
          `${options.pathToReactMessages}${options.messagesFileName}.json`
        )
      );
      verbose
        ? console.log(
            chalk.italic(
              `\tLoad local file ${options.pathToReactMessages}${
                options.messagesFileName
              }.json`
            )
          )
        : "";

      // get file from lcoalise
      request.get(
        {
          url: url,
          json: true,
          headers: {
            Authorization: `Loco ${options.key}`
          }
        },
        function(err, res, data) {
          if (err) {
            verbose ? console.error(chalk.red(`Http Error :::: ${err} `)) : "";
            process.exit(0);
          } else if (res.statusCode === 200) {
            /** @var filePo translation file in localise.biz */
            const filePo = JSON.parse(JSON.stringify(data));
            const finalFile = sync(fileDev, filePo);
            try {
              updateFileLocalize(finalFile);
            } catch (err) {
              verbose
                ? console.error(chalk.red(`error with Upload :::: ${err} `))
                : "";
            }
          } else {
            verbose
              ? console.error(chalk.red(`Http Error :::: ${res.statusCode} `))
              : "";
            process.exit(0);
          }
        }
      );
    } catch (err) {
      console.log("error", err);
    }
  }

  /**
   *
   * @param {*} fileDev
   * @param {*} filePo
   * @description Create new translation file with translation changed by product owner and add new key translation
   */
  const sync = (fileDev, filePo) => {
    const newKeys = {};
    fileDev.forEach(message => {
      if (!filePo[message.id]) {
        newKeys[message.id] = message.defaultMessage;
      }
    });
    return {
      ...newKeys,
      ...filePo
    };
  };

  /*
   * @param {*} finalFile
   * @description Update translation file to localise.biz
   */
  function updateFileLocalize(finalFile) {
    const url = `${options.localisebiz}import/json?tag-all=reactjs&locale=fr`;
    request.post(
      {
        url: url,
        json: true,
        headers: {
          Authorization: `Loco ${options.key}`
        },
        body: finalFile
      },
      (err, res, data) => {
        if (err) {
          verbose ? console.error(chalk.red(`Http Error :::: ${err} `)) : "";
          process.exit(0);
        } else if (res.statusCode === 200) {
          verbose ? console.log(`Localise.biz with language fr updated!`) : "";
        } else {
          verbose
            ? console.error(chalk.red(`Http Error :::: ${res.statusCode} `))
            : "";
          process.exit(0);
        }
      }
    );
  }

  return {
    start: start
  };
})();
