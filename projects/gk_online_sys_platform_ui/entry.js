//const readline = require('readline');
//const rl = readline.createInterface(process.stdin, process.stdout);

const chalk = require('chalk');
const ora = require('ora');
const path = require("path");

let cmdKey='prod';
if(process.argv.length>2){
  cmdKey=process.argv[2];
}

//rl.question('Pls input project name: ',  function(project){
    const spinner = ora('start building').start();

    let projectPath=__dirname;
    let pConfig=path.resolve(projectPath,`webpack.config.js`);

    let cmdList={
      "prod": `webpack --config ${pConfig} --mode production --env.NODE_ENV=production --progress`,
      "prod.normal": `webpack --config ${pConfig} --mode production --env.NODE_ENV=production.normal --progress`,
      "start:prod": `webpack-dev-server --hot --config ${pConfig} --mode production --env.NODE_ENV=production --open`,
      "start:prod.normal": `webpack-dev-server --hot --config ${pConfig} --mode production --env.NODE_ENV=production.normal --open`,
      "auto:prod": `webpack --config ${pConfig} --mode production --env.NODE_ENV=production --watch`,
      "auto:prod.normal": `webpack --config ${pConfig} --mode production --env.NODE_ENV=production.normal --watch`
    }

    let cmd=cmdList[cmdKey];

    console.log(chalk.yellow(`\n\n${cmd}\n`));

    let cmdWatch='node '+path.resolve(projectPath,`watchFiles.js`);

    console.log(chalk.yellow(`\n\n${cmdWatch}\n`));

    const concurrently = require('concurrently');

    concurrently([cmdWatch,cmd]).then(function(data){
      spinner.info(`\n-------------built finished--------------\n`);
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


 
