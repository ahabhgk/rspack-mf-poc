const path = require("path")
const concurrently = require("concurrently");
const rspack = (project, dir) => `${process.env.LOCAL_RSPACK ?? 'npx rspack'} s -c ${path.resolve(__dirname, project, dir, "webpack.config.js")}`

const [, , project, dirs] = process.argv

concurrently(dirs.split(',').map(d => rspack(project, d)))
