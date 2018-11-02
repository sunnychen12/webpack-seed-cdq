const fs = require("fs");
const UglifyJS = require('uglify-js');
const path = require("path");
const Watchpack = require("watchpack");

const globalJSON = require( path.resolve(__dirname, "globalJSON.js") );

let isDev=false;//true：项目用于嵌套数据；项目用于生成纯静态页面，无数据嵌入
if(process.argv.length>2){
  isDev=true;
}

var wp = new Watchpack({
    // options:
    aggregateTimeout: 1000,
    // fire "aggregated" event when after a change for 1000ms no additional change occurred
    // aggregated defaults to undefined, which doesn't fire an "aggregated" event

    poll: true,
    // poll: true - use polling with the default interval
    // poll: 10000 - use polling with an interval of 10s
    // poll defaults to undefined, which prefer native watching methods
    // Note: enable polling when watching on a network path

    ignored: /node_modules/,
    // anymatch-compatible definition of files/paths to be ignored
    // see https://github.com/paulmillr/chokidar#path-filtering
});

wp.watch(['commonLab.js'], [path.resolve(globalJSON.srcPath,'js')], Date.now() - 10000);

wp.on("change", function(filePath, mtime) {
    fs.writeFileSync( 
         path.join(isDev ? globalJSON.devPath : globalJSON.distPath, 'js/commonLab.min.js')
      , UglifyJS.minify({
      "commonLab.js": fs.readFileSync(filePath, "utf8")
    }).code, "utf8");
});
