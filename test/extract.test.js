const assert = require("assert");
const extract = require("../modules/extract");

describe("Extract", () => {
  it("required should be false", () => {
    const options = {
      languages: undefined,
      pathToTranslations: "/",
    };
    const required = extract.required(options);
    assert.strictEqual(required, false);
  });
  it("required should be true", () => {
    const options = {
      languages: ["en"],
      pathToTranslations: "/",
    };
    const required = extract.required(options);
    assert.strictEqual(required, true);
  });
  it("sync should be same value", () => {
    const localFile = {
      key: "value",
    };
    assert.deepStrictEqual(extract.sync({}, localFile), localFile);
  });
});
