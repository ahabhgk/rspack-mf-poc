const createRuntime = require("./create-runtime");

module.exports = class Plugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    const vmokOptions = this.options;
    new compiler.webpack.EntryPlugin(
      compiler.context,
      createRuntime(
        compiler,
        vmokOptions, // create initOptions.remotes from config.remotes
        [...(vmokOptions.runtimePlugins || [])], // vmok runtime plugin
      ),
      { name: undefined },
    ).apply(compiler);

    delete vmokOptions.runtimePlugins;
    new compiler.webpack.container.ModuleFederationPlugin({
      ...vmokOptions,
    }).apply(compiler);
  }
}
