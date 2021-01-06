/**
 * @author AZOULAY Jordan <jazoulay@greenflex.com>
 * @description Compare translation local files with localise.biz translation files language by language
 */
const request = require("request");
const fs = require("fs");
const config = require("./config");
const chalk = require("chalk");

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
                    ? console.error(
                            chalk.red("Use -f option for select language from extract")
                            )
                    : "";
            process.exit(0);
        }

        languageToExtract = languageFrom;

        options = config.getConfig();

        verbose ? console.log("\t\t\t\t" + chalk.bgCyan("START EXTRACT")) : "";

        for (let i = 0; i < options.languages.length; i++) {
            const language = options.languages[i];

            if (language === languageToExtract) {
                continue;
            }

            verbose
                    ? console.log("Language " + chalk.underline.bold(language) + " :::::")
                    : "";

            let fileDev = null;
            let fileToExtract = null;

            try {
                /** @var fileDev local translation file  */
                fileToExtract = JSON.parse(
                        fs.readFileSync(
                                `${options.pathToTranslations}${languageToExtract}.json`
                                )
                        );
            } catch (e) {
                console.error(
                        chalk.red(
                                `File ${
                                options.pathToTranslations
                                }${languageToExtract}.json not found`
                                )
                        );
                process.exit(0);
            }

            try {
                /** @var fileDev local translation file  */
                fileDev = JSON.parse(
                        fs.readFileSync(`${options.pathToTranslations}${language}.json`)
                        );
            } catch (e) {
                /** If file language dosn't exist create new file from file to extract */
                try {
                    fs.writeFileSync(
                            `${options.pathToTranslations}${language}.json`,
                            fs.readFileSync(
                                    `${options.pathToTranslations}${languageToExtract}.json`
                                    )
                            );
                } catch (e) {
                    console.error(
                            chalk.red(
                                    `Can't create ${options.pathToTranslations}${language}.json file`
                                    )
                            );
                    process.exit(0);
                }

                verbose
                        ? console.log(
                                chalk.dim(
                                        `File ${
                                        options.pathToTranslations
                                        }${language}.json created from ${
                                        options.pathToTranslations
                                        }${languageToExtract}.json`
                                        )
                                )
                        : "";
                continue;
            }

            verbose
                    ? console.log(
                            chalk.italic(
                                    `\tLoad local file ${options.pathToTranslations}${language}.json`
                                    )
                            )
                    : "";

            const finalFile = sync(fileDev, fileToExtract);
            try {
                updateFileDev(finalFile, language);
            } catch (e) {
                console.error(chalk.red(e));
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
        verbose ? console.log("") : "";

        let file = {};
        let nbModifications = 0;
        let nbNewKey = 0;

        for (let key in fileToExtract) {
            if (fileDev[key] === undefined) {
                file[key] = fileToExtract[key];
                nbNewKey++;
                verbose
                        ? console.log(chalk.dim(`\tNew translation key : '${key}'`))
                        : "";
            } else {
                file[key] = fileDev[key];
            }
        }
        if (verbose) {
            console.log("");
            console.log("\t----------------------");
            console.log(`\tModifications : ${nbModifications}`);
            console.log(`\tNew translation keys : ${nbNewKey}`);
            console.log("\t----------------------");
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
                err => {
                    if (err) {
                        console.error(
                                chalk.red(
                                        `Can't write in file ${
                                        options.pathToTranslations
                                        }${language}.json`
                                        )
                                );
                        process.exit(0);
                    } else {
                        verbose
                                ? console.log(
                                        `\n${options.pathToTranslations}${language}.json updated!`
                                        )
                                : "";
                    }
                }
        );
    }

    return {
        start: start
    };
})();
