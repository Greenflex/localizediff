const assert = require("assert");
const sync = require("../modules/sync");

describe("Sync", () => {
  it("required should be false", () => {
    const options = {
      languages: undefined,
      pathToTranslations: "/",
    };
    const required = sync.required(options);
    assert.strictEqual(required, false);
  });
  it("required should be true", () => {
    const options = {
      languages: ["en"],
      pathToTranslations: "/",
      key: "key",
      pathToTranslations: "pathToTranslations",
    };
    const required = sync.required(options);
    assert.strictEqual(required, true);
  });
  it("sync should be same value", () => {
    const localFile = {
      key: "value",
      threeKey: "three value",
    };
    const localiseFile = {
      key: "value2",
      secondKey: "second value",
    };
    assert.deepStrictEqual(sync.sync(localFile, localiseFile, {}), {
      ...localFile,
      ...localiseFile,
    });
  });
});
