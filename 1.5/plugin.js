const createRuntime = require("./create-runtime");

module.exports = class Plugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    const vmokOptions = this.options;
    new compiler.webpack.container.ModuleFederationPlugin({
      ...vmokOptions,
      runtimePlugins: [createRuntime(
        compiler,
        vmokOptions, // create initOptions.remotes from config.remotes
        [...(vmokOptions.runtimePlugins || [])], // vmok runtime plugin
      )]
    }).apply(compiler);
  }
}
