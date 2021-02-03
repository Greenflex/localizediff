const assert = require("assert");
const config = require("../modules/config");

process.env.LOCALISE_CONFIGFILE = "./test/localize.yml";
process.env.LOCALISE_KEY = "";
process.env.LOCALISE_LANGUAGES = "en,fr";

describe("Config", () => {
  it("getVar should return value", () => {
    assert.strictEqual(config.getVar("key", { key: "value" }), "value");
  });
  it("getVarLanguages should return value", () => {
    assert.deepStrictEqual(config.getVarLanguages({}), ["en", "fr"]);
  });
  it("getConfig should return config", () => {
    assert.deepStrictEqual(config.getConfig(), {
      localisebiz: "https://localise.biz/api/",
      key: "key",
      pathToReactMessages: "pathToReactMessages/",
      messagesFileName: undefined,
      pathToTranslations: "/home/node/translations/",
      languages: ["en", "fr"],
      filter: "filter",
      commandAfterSync: "commandAfterSync",
      format: "format",
      index: "index",
      source: "source",
      namespace: "namespace",
      fallback: "fallback",
      order: "order",
      status: "status",
      printf: "printf",
      charset: "charset",
      breaks: "breaks",
      noComments: "noComments",
      noFolding: "noFolding",
      async: "async",
      path: "path",
      ignoreNew: "ignoreNew",
      ignoreExisting: "ignoreExisting",
      tagNew: "tagNew",
      tagAll: "tagAll",
      unTagAll: "unTagAll",
      tagUpdated: "tagUpdated",
      tagAbsent: "tagAbsent",
      unTagAbsent: "unTagAbsent",
      deleteAbsent: "deleteAbsent",
    });
  });
});
