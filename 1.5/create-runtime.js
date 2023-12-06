const fs = require("fs");
const path = require("path")
const crypto = require("crypto");

function extractUrlAndGlobal(urlAndGlobal) {
  const index = urlAndGlobal.indexOf("@");
  if (index <= 0 || index === urlAndGlobal.length - 1) {
    throw new Error(`Invalid request "${urlAndGlobal}"`);
  }
  return [urlAndGlobal.substring(index + 1), urlAndGlobal.substring(0, index)];
};

module.exports = function (compiler, mfOptions, plugins) {
  const template = fs.readFileSync(path.resolve(__dirname, "./template.js"), 'utf-8');
  const remotes = [];
  for (let [key, remote] of Object.entries(mfOptions.remotes ?? {})) {
    let url, global;
    try {
      // only add externalType: "script" into initOptions.remotes
      [url, global] = extractUrlAndGlobal(remote);
    } catch (e) {
      continue;
    }
    remotes.push({ alias: key, name: global, entry: url })
  }
  const pluginImports = [];
  const pluginVars = []
  for (let i = 0; i < plugins.length; i++) {
    const pluginVar = `__$P$${i}`;
    pluginImports.push(`import ${pluginVar} from ${JSON.stringify(path.resolve(compiler.context, plugins[i]))};`)
    pluginVars.push(`${pluginVar}()`);
  }
  let realEntry = template
    .replace('$INITOPTIONS_REMOTES$', JSON.stringify(remotes))
    .replace('$INITOPTIONS_PLUGIN_IMPORTS$', pluginImports.join("\n"))
    .replace('$INITOPTIONS_PLUGINS$', `[${pluginVars.join(', ')}]`);
  const hash = crypto.createHash('md5').update(realEntry).digest('hex');
  const dir = path.resolve(compiler.context, '.vmok');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  const outputPath = path.resolve(dir, `entry-${hash}.js`);
  if (!fs.existsSync(outputPath)) {
    fs.writeFileSync(outputPath, realEntry);
  }
  return outputPath
}
