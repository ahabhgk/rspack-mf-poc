const fs = require("fs");
const path = require("path")
const crypto = require("crypto");

function extractUrlAndGlobal(urlAndGlobal) {
  const index = urlAndGlobal.indexOf("@");
  if (index <= 0 || index === urlAndGlobal.length - 1) {
    return null;
  }
  return [urlAndGlobal.substring(index + 1), urlAndGlobal.substring(0, index)];
};

function getExternalTypeFromExternal(external) {
  if (/^[a-z0-9-]+ /.test(external)) {
    const idx = external.indexOf(' ');
    return [external.slice(0, idx), external.slice(idx + 1)]
  }
  return null
}

function getExternal(external, defaultExternalType = 'script') {
  const result = getExternalTypeFromExternal(external);
  if (result === null) {
    return [defaultExternalType, external]
  }
  return result
}

module.exports = function (compiler, mfOptions, plugins) {
  const template = fs.readFileSync(path.resolve(__dirname, "./template.js"), 'utf-8');
  const remotes = [];
  for (let [key, remote] of Object.entries(mfOptions.remotes ?? {})) {
    const [externalType, external] = getExternal(typeof remote === 'string' ? remote : remote.external, mfOptions.remoteType);
    const shareScope = typeof remote !== 'string' && remote.shareScope || mfOptions.shareScope;
    if (externalType === 'script') {
      const [url, global] = extractUrlAndGlobal(external);
      const name = typeof remote !== 'string' && remote.name || global;
      remotes.push({ alias: key, name, entry: url, externalType, shareScope })
    } else {
      remotes.push({ alias: key, name: undefined, entry: undefined, externalType, shareScope })
    }
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
