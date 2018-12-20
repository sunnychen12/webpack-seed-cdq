//const readline = require('readline');
//const rl = readline.createInterface(process.stdin, process.stdout);

const chalk = require('chalk');
const ora = require('ora');
const path = require("path");

let cmdKey='prod';
if(process.argv.length>2){
  cmdKey=process.argv[2];
}
/*
let project='project-1'
if(process.argv.length>3){
  project=process.argv[3];
}
*/

let isDev=false;//true：项目用于嵌套数据；项目用于生成纯静态页面，无数据嵌入
if(process.argv.length>3){
  isDev=true;
}

//rl.question('Pls input project name: ',  function(project){
    const spinner = ora('start building').start();

    let projectPath=__dirname;
    let pConfig=path.resolve(projectPath,`webpack.config${isDev?'.dev':''}.js`);

    let cmdList={
      "prod": `webpack --config ${pConfig} --mode production --env.NODE_ENV=production --progress`,
      "prod.normal": `webpack --config ${pConfig} --mode production --env.NODE_ENV=production.normal --progress`,
      "dev": `webpack --config ${pConfig} --mode development --env.NODE_ENV=development --progress`,
      "start:dev": `webpack-dev-server --hot --config ${pConfig} --mode development --env.NODE_ENV=development --open`,
      "start:prod": `webpack-dev-server --hot --config ${pConfig} --mode production --env.NODE_ENV=production --open`,
      "start:prod.normal": `webpack-dev-server --hot --config ${pConfig} --mode production --env.NODE_ENV=production.normal --open`,
      "auto:prod": `webpack --config ${pConfig} --mode production --env.NODE_ENV=production --watch`,
      "auto:prod.normal": `webpack --config ${pConfig} --mode production --env.NODE_ENV=production.normal --watch`,
      "auto:prod.dev": `webpack --config ${pConfig} --mode development --env.NODE_ENV=development --watch`
    }

    let cmd=cmdList[cmdKey];

    console.log(chalk.yellow(`\n\n${cmd}\n`));

    let cmdWatch='node '+path.resolve(projectPath,`watchFiles.js${isDev?' dev':''}`);

    console.log(chalk.yellow(`\n\n${cmdWatch}\n`));

    const concurrently = require('concurrently');

    concurrently([cmdWatch,cmd]).then(function(data){
      spinner.info(`\n-------------built finished${isDev?'(dev)':''}--------------\n`);
    }, function(error){
      spinner.info('\n-------------built error--------------\n');
    });

    setTimeout(function(){
      try{
        spinner.stop();
      }catch(e){}
    },3000)

    //rl.close();

//});


 
