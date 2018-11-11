/**
 * @author AZOULAY Jordan <jazoulay@greenflex.com>
 * @description Compare translation local files with localise.biz translation files for french and upload resulting file to localise
 */
const request = require("request");
const fs = require("fs");
const config = require("./config");
const chalk = require("chalk");
const cmd = require("node-cmd");

// const filePo = {
//   "iot.header": "",
//   "iot.enrolment.site-connection": "Site connection",
//   "iot.enrolment.installation": "Installation",
//   "iot.enrolment.installationType": "Type of solar installation",
//   "iot.enrolment.business-model": "Business model",
//   "iot.enrolment.device-type": "Type of monitoring device",
//   "iot.enrolment.device-brand": "{type} device brand",
//   "iot.enrolment.device-model": "{type} device model",
//   "iot.enrolment.device-serial-number": "{type} device serial number",
//   "iot.enrolment.equipment-type": "Type of equipment",
//   "iot.enrolment.equipment-brand": "Equipment brand",
//   "iot.enrolment.equipment-model": "Equipment model",
//   "iot.enrolment.equipment-serial-number": "Equipment serial number",
//   "iot.enrolment.monitoring-device": "Monitoring device",
//   "iot.enrolment.add-equipment-field": "Add more equipment",
//   "iot.enrolment.add-device": "Add another monitoring device",
//   "iot.enrolment.pv-capacity": "PV capacity (kWp)",
//   "iot.enrolment.battery-capacity": "Battery capacity (kWh)",
//   "iot.enrolment.generator-global-capacity": "Generator Global Capacity (kVA)",
//   "iot.enrolment.connectedEquipment": "Site",
//   "iot.enrolment.no-specification": "No specification found.",
//   "iot.enrolment.serial-number-exists": "Serial number already used.",
//   "iot.enrolment.type": "Type",
//   "iot.enrolment.brand": "Brand",
//   "iot.enrolment.model": "Model",
//   "iot.enrolment.serialNumber": "Serial number",
//   "iot.enrolment.specification-not-found":
//     "Specification not found for {model}",
//   "iot.enrolment.warning-title": "Warning",
//   "iot.enrolment.already-enrolled": "Site already enrolled.",
//   "iot.enrolment.save-modal": "Configuration save",
//   "iot.enrolment.continue-modal": "Continue",
//   "iot.enrolment.step-customfields": "Custom fields",
//   "iot.enrolment.step-items": "Items",
//   "iot.enrolment.step-devices": "Devices",
//   "iot.mp-list.number": "Numéro",
//   "iot.mp-list.friendly-name": "Friendly Name",
//   "iot.mp-list.counter-id": "Counter Id",
//   "iot.mp-list.counter-user": "Counter Use",
//   "iot.mp-list.utilities": "Utilities",
//   "iot.mp-list.updated-at": "Dernière mise à jour",
//   "iot.mp-list.parent-list": "Liste des parents",
//   "iot.mp-list.children-list": "Liste des enfants",
//   "iot.mp-list.start": "Début",
//   "iot.mp-list.end": "Fin",
//   "iot.mp-list.title": "Liste des Zones",
//   "iot.mp.element-type": "Type",
//   "iot.mp.measure-point": "Point de Mesure",
//   "iot.measure-point.edit.parents-geo": "Parents géographiques",
//   "iot.measure-point.show.children-geo": "Enfants géographiques",
//   "iot.measure-point.edit.parents-wiring": "Parents unifilaires",
//   "iot.measure-point.show.children-wiring": "Enfants unifilaires",
//   "iot.measure-point.show.parents-geo": "Parents géographiques",
//   "iot.measure-point.show.parents-wiring": "Parents unifilaires",
//   "iot.device.id": "Id",
//   "iot.device.asset.name": "Nom",
//   "iot.device.assignment.status": "Status",
//   "iot.device.assignment.assignmentType": "Dernière date d'intéraction",
//   "iot.monitoring.company": "Client",
//   "iot.monitoring.directory": "Site",
//   "iot.monitoring.title": "Liste des Statuts des plans de comptage",
//   "iot.upload.type": "Upload type",
//   "iot.upload.manual-upload-true": "Manual Upload",
//   "iot.upload.manual-upload-false": "Uploaded by API",
//   "iot.upload.create-date": "Date",
//   "iot.upload.username": "User",
//   "iot.upload.file-name": "File name",
//   "iot.upload.details": "Details",
//   "iot.zone-list.number": "Numéro",
//   "iot.mp-list.other-infos": "Autres Infos",
//   "iot.mp-list.children-zone": "Liste des enfants",
//   "iot.mp-list.parent-zone": "Dernière mise à jour",
//   "iot.zone.show.parents-geo": "Parents géographiques",
//   "iot.zone.show.children-geo": "Enfants géographiques",
//   "iot.zone.show.parents-wiring": "Parents unifilaires",
//   "iot.zone.show.children-wiring": "Enfants unifilaires"
// };

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
          console.log("even before");
          if (err) {
            verbose ? console.error(chalk.red(`Http Error :::: ${err} `)) : "";
            process.exit(0);
          } else if (res.statusCode === 200) {
            /** @var filePo translation file in localise.biz */
            const filePo = JSON.parse(JSON.stringify(data));
            const finalFile = sync(fileDev, filePo);
            console.log(finalFile);
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
