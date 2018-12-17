const chalk = require('chalk');

function MyPlugin(options) {
  //options = options || {};
  //this.outputPath = options.outputPath;
}

MyPlugin.prototype.apply = function (compiler) {
  compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
    console.log('The compiler is starting a new compilation...');

    compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync(
      'MyPlugin',
      (htmlPluginData, cb) => {
        console.log(chalk.yellow(`\n\n${htmlPluginData.plugin.options.pageTitle}\n`));

        htmlPluginData.html += 'The Magic Footer'



        cb(null, htmlPluginData)
      }
    )
  })
}

module.exports = MyPlugin