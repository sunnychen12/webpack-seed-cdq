const path = require("path");
const fs = require("fs");
const rm = require('rimraf');
const UglifyJS = require('uglify-js');
const mkp = require('mkp');
const concatFiles = require('concat-files');
const globalJSON = require( path.resolve(__dirname, "../../globalJSON.js") );

const prepareFiles=function(){
  mkp([
          path.join(globalJSON.distPath, 'css'),
          path.join(globalJSON.distPath, 'js'),
          path.join(globalJSON.distPath, 'assets/js')
      ], (er) => {
          
          if (er) console.error(er)
          else{
              /*
              common 公共框架合成与压缩
              */
              //合并文件js
              concatFiles(
                  [
                      path.join(globalJSON.srcPath, 'assets/js/zepto.min.js'),
                      path.join(globalJSON.srcPath, 'assets/js/sm-config.js'),
                      path.join(globalJSON.srcPath, 'assets/js/sm.min.js'),
                      path.join(globalJSON.srcPath, 'assets/js/vue.js'),
                      //path.join(globalJSON.srcPath, 'assets/js/template.js')
                  ],  path.join(globalJSON.distPath, 'js/common.js'), function(err) {
                      if (err) throw err
                      else {
                          fs.writeFileSync(path.join(globalJSON.distPath, 'js/common.min.js'), UglifyJS.minify({
                              "common.min.js": fs.readFileSync(path.join(globalJSON.distPath, 'js/common.js'), "utf8")
                          }).code, "utf8");
                      }
                  }
              )

              fs.writeFileSync(path.join(globalJSON.distPath, 'js/commonLab.min.js'), UglifyJS.minify({
                  "commonLab.js": fs.readFileSync(path.join(globalJSON.srcPath, 'js/commonLab.js'), "utf8")
              }).code, "utf8");
              
          }
          
      })


  //合并文件css
  concatFiles(
      [
          path.join(globalJSON.srcPath, 'assets/css/sm.min.css'),
          path.join(globalJSON.srcPath, 'assets/css/sm-extend.min.css')
      ],  path.join(globalJSON.distPath, 'css/common.css')
  )
}

module.exports = (isProduction) => {
  if(isProduction){
    rm(globalJSON.distPath, (err) => {
        if (err) throw err;
        else{
            prepareFiles();
        }
    });
  }
  else{
    prepareFiles();
  }
};