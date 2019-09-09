const fs = require("fs");
const UglifyJS = require('uglify-js');
const cssmin = require('cssmin');
const path = require("path");

const globalJSON = require( path.resolve(__dirname, "globalJSON.js") );

//监控文件变化
var chokidar = require('chokidar');

var watcher = chokidar.watch([
  'src/js/commonLab.js',
  'dist/css/main.css',
  'dist/*.html'
])
.on('change', (filePath, stats) => {
  var source=fs.readFileSync(filePath, "utf8");
  //生成js文件的压缩与未压缩版本
  if(filePath.indexOf('commonLab.js')!=-1){
    fs.writeFileSync( 
       path.join(__dirname, 'dist/js/commonLab.js'),
       source, 
       "utf8"
    );
    
    fs.writeFileSync( 
       path.join(globalJSON.physicalSkinPath, 'js/commonLab.js'),
       source, 
       "utf8"
    );

    fs.writeFileSync( 
        path.join(globalJSON.physicalSkinPath, 'js/commonLab.min.js'),
        UglifyJS.minify({
            "commonLab.js": source
        }).code, 
       "utf8"
    );
    
  }
  //生成css文件的压缩与未压缩版本
  else if(filePath.indexOf('main.css')!=-1){
    
    fs.writeFileSync(
         path.join(globalJSON.physicalSkinPath, 'css/main.css'),
         source,
         "utf8"
    );

    fs.writeFileSync( 
        path.join(globalJSON.physicalSkinPath, 'css/main.min.css'),
        cssmin(source), 
       "utf8"
    );
    
  }
  //拷贝开发版html文件到项目的特定目录下
  else if(filePath.indexOf('-dev.html')!=-1){
    let filename=filePath.substring(filePath.lastIndexOf('\\')+1);
    filename=filename.replace('-dev','');

    fs.writeFileSync(
         path.join(globalJSON.devPath, filename),
         source,
         "utf8"
    );
  }
  
});
