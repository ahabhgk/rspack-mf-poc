const path = require("path")
const concurrently = require("concurrently");
const bundle = (project, dir) => {
  const isRspack = process.env.RSPACK ?? false;
  const local = process.env.LOCAL;
  const cmd = isRspack
    ? local
      ? !local.endsWith('/packages/rspack-cli/bin/rspack')
        ? path.join(local, '/packages/rspack-cli/bin/rspack')
        : local
      : 'npx rspack'
    : local
      ? `WEBPACK_PACKAGE=${local} npx webpack`
      : 'npx webpack'
  return `${cmd} s -c ${path.resolve(__dirname, project, dir, "webpack.config.js")}`
}

const [, , project, dirs] = process.argv

concurrently(dirs.split(',').map(d => bundle(project, d)))
