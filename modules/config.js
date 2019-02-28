/**
 * @author AZOULAY Jordan <jazoulay@greenflex.com>
 * @description Read configuration in ./config.yaml file
 */
const yaml = require('js-yaml');
const fs = require('fs');
const chalk = require('chalk');

module.exports = (function() {
  let verbose = false;

  /**
   * @description open localize.yaml file
   */
  function openFileConfig() {
    let configTry;
    try {
      // copy dist to yml file using env var for api key
      const data = fs.readFileSync(
        `${process.cwd()}/localize.yml.dist`,
        'utf8',
      );
      var localizeKey = process.env.LOCALISE_KEY;
      var result = data.replace(/key:/g, `key: ${localizeKey}`);

      fs.writeFileSync(`${process.cwd()}/localize.yml`, result, 'utf8');
      configTry = yaml.safeLoad(
        fs.readFileSync(`${process.cwd()}/localize.yml`, 'utf8'),
      );
    } catch (e) {
      console.log(e);
    }
    return configTry;
  }

  function setVerbose(v) {
    verbose = v;
  }

  /**
   * @description create options variable with all parameters
   */
  function getConfig() {
    const params = openFileConfig().params;

    verbose
      ? console.log(chalk.bold('Config file ./localize.yaml loaded :'))
      : '';
    let options = {};
    /** @var options.localisebiz path api localise.biz */
    options.localisebiz =
      params.localisebiz &&
      params.localisebiz[params.localisebiz.length - 1] === '/'
        ? params.localisebiz
        : `${params.localisebiz}/`;
    verbose
      ? console.log(
          chalk.italic('\tLink to API localise.biz: ') +
            chalk.bold(options.localisebiz),
        )
      : '';
    /** @var options.key key public of localise.biz ( need read and write )  */
    options.key = params.key;
    verbose
      ? console.log(
          chalk.italic('\tLocalize.biz key: ') + chalk.bold(options.key),
        )
      : '';
    /** @var options.pathToReactMessages path to messages extracted in react projects  */
    options.pathToReactMessages =
      params.pathToReactMessages &&
      params.pathToReactMessages[params.pathToReactMessages.length] === '/'
        ? params.pathToReactMessages
        : `${params.pathToReactMessages}/`;
    verbose
      ? console.log(
          chalk.italic('\tPath to local translation messages folder: ') +
            chalk.bold(options.pathToReactMessages),
        )
      : '';
    /** @var options.messagesFileName name of file to extract messages  */
    options.messagesFileName = params.messagesFileName
      ? params.messagesFileName
      : 'messages';

    /** @var options.pathToTranslations path to local translation folder  */
    options.pathToTranslations =
      params.pathToTranslations &&
      params.pathToTranslations[params.pathToTranslations.length] === '/'
        ? params.pathToTranslations
        : `${params.pathToTranslations}/`;
    verbose
      ? console.log(
          chalk.italic('\tPath to local translation folder: ') +
            chalk.bold(options.pathToTranslations),
        )
      : '';
    /** @var options.languages languages (default : ["en", "fr"]) */
    options.languages = params.languages ? params.languages : ['en', 'fr'];
    verbose
      ? console.log(
          chalk.italic('\tLanguages: ') + chalk.bold(options.languages),
        )
      : '';
    /** @var options.filter tag to localise.biz use for differentiate with symfony files */
    options.filter = params.filter ? params.filter : 'reactjs';
    verbose
      ? console.log(chalk.italic('\tFilter: ') + chalk.bold(params.filter))
      : '';
    /** @var options.commandAfterSync command to execute after sync if translation file changed */
    options.commandAfterSync = params.commandAfterSync
      ? params.commandAfterSync
      : null;

    verbose ? console.log('') : '';
    return options;
  }

  return {
    setVerbose: setVerbose,
    getConfig: getConfig,
  };
})();
