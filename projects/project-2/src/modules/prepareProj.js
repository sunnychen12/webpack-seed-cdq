const path = require("path");
const fs = require("fs");
const rm = require('rimraf');
const UglifyJS = require('uglify-js');
const mkp = require('mkp');
const concatFiles = require('concat-files');
//const basePath=path.resolve(__dirname, '../../')+'/';

const prepareFiles=function(projectRootPath){
  const basePath=projectRootPath;
  mkp([
          path.join(basePath, 'dist/css'),
          path.join(basePath, 'dist/js'),
          path.join(basePath, 'dist/assets/js')
      ], (er) => {
          
          if (er) console.error(er)
          else{
              /*
              common 公共框架合成与压缩
              */
              //合并文件js
              concatFiles(
                  [
                      path.join(basePath, 'src/assets/js/zepto.min.js'),
                      path.join(basePath, 'src/assets/js/sm-config.js'),
                      path.join(basePath, 'src/assets/js/sm.min.js')
                  ],  path.join(basePath, 'dist/js/common.js'), function(err) {
                      if (err) throw err
                      else {
                          fs.writeFileSync(path.join(basePath, 'dist/js/common.min.js'), UglifyJS.minify({
                              "common.min.js": fs.readFileSync(path.join(basePath, 'dist/js/common.js'), "utf8")
                          }).code, "utf8");
                      }
                  }
              )

              fs.writeFileSync(path.join(basePath, 'dist/js/commonLab.min.js'), UglifyJS.minify({
                  "commonLab.js": fs.readFileSync(path.join(basePath, 'src/js/commonLab.js'), "utf8")
              }).code, "utf8");
              
          }
          
      })


  //合并文件css
  concatFiles(
      [
          path.join(basePath, 'src/assets/css/sm.min.css'),
          path.join(basePath, 'src/assets/css/sm-extend.min.css'),
          path.join(basePath, 'src/assets/js/crop4/cropper.css')
      ],  path.join(basePath, 'dist/css/common.css')
  )
}

module.exports = (isProduction,projectRootPath) => {
  if(isProduction){
    rm(path.join(projectRootPath, 'dist'), (err) => {
        if (err) throw err;
        else{
            prepareFiles(projectRootPath);
        }
    });
  }
  else{
    prepareFiles(projectRootPath);
  }
};