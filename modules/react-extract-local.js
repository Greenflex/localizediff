const fs = require("fs");
const R = require("ramda");
const glob = require("glob");
const babel = require("@babel/core");
const path = require("path");

process.env.NODE_ENV = "production"; // For babel.transform

function extractMessages(pattern /* : string */) /* : string */ {
  const srcPaths = glob.sync(pattern, { absolute: true });
  const relativeSrcPaths = glob.sync(pattern);
  const contents = srcPaths
    .filter((p) => {
      const ext = path.extname(p);
      return ext === ".js" || ext === ".ts" || ext === ".tsx" || ext === ".jsx";
    })
    .map((p) => [p, fs.readFileSync(p, "utf-8")]);

  const messages = contents
    .map((content) =>
      babel.transform(content[1], {
        filename: content[0],
        presets: [["react-app", { flow: true, typescript: true }]],
        plugins: ["babel-plugin-react-intl"],
        babelrc: false,
      })
    )
    .map(R.path(["metadata", "react-intl", "messages"]));

  const result = R.zipWith(
    (m, r) => m.map(R.assoc("filepath", r)),
    messages,
    relativeSrcPaths
  )
    .filter(R.complement(R.isEmpty))
    .reduce(R.concat, []);

  return result;
}

module.exports = extractMessages;
