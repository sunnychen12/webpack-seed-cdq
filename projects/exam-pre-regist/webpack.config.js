/******国开学习网移动版******/

const path = require("path");
const webpack = require('webpack');
const fs = require("fs");

//const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const HtmlWebpackPlugin = require('html-webpack-plugin');

//const prepareProj=require( path.resolve(__dirname, 'src/modules/prepareProj.js') );

//const myPlugin=require( path.resolve(__dirname, 'src/modules/myPlugin.js') );

module.exports= env => {
    let paseBasePath = path.resolve(__dirname, 'src/pages');

    //process.cwd()返回的是当前Node.js进程执行时的工作目录
    let pages=require( path.resolve(__dirname, '../../modules/getChildrenDir.js') ).getChildrenDir( paseBasePath );

    let isProduction=env.NODE_ENV=='production';
    let isDevelopment=env.NODE_ENV=='development';
    let isNormalProduction=env.NODE_ENV=='production.normal';

    //生成html前的准备与清理工作
    //prepareProj(isProduction,__dirname);

    let pluginsConfig=[
            new MiniCssExtractPlugin({
                  // Options similar to the same options in webpackOptions.output
                  // both options are optional
                  filename: "css/exam-pre-regist.css"
                })
        ];

    pages.forEach(function(page){

        pluginsConfig.push(
            new HtmlWebpackPlugin({
                filename: 'index.html',
                //pageTitle:`${page} pageTitle`,//自定义
                title:`${page}`,
                template: paseBasePath+'/'+page+'/index.html',
                inject: false,
                chunks: ['main'],
                //chunksSortMode:'manual'
            })
        )
    })

    //pluginsConfig.push(new myPlugin({ options: '' }));

    return {
        entry:{
            main: [path.join(__dirname, 'src/js/main.js')]
        },

        output:{
            path:path.resolve(__dirname,'dist'),
            filename:"js/exam-pre-regist.js"
            //,publicPath: "https://cdn.example.com/assets/"
        },  
        //devtool: 'inline-source-map',//调试用
        //启动webpack自带的服务器
        devServer: {
            contentBase: path.join(__dirname, "dist"),
            compress: true,
            inline : true,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            host: '172.16.165.93',
            port: 9400,
            overlay: {
              warnings: true,
              errors: true
            },
            openPage:'数据申报.html'
        },

        watchOptions:{
            poll:500,//监测修改的时间(ms)
            aggregateTimeout:500, //防止重复按键，500毫米内算按键一次
            //ignored:['projects/**/dist/**', 'node_modules']///不监测
            ignored:['node_modules',path.join(__dirname, "svg")]///不监测
        },
        optimization: {
            
            runtimeChunk: false,
            
            minimize: isProduction ? true:false,
            minimizer:[
                new OptimizeCSSAssetsPlugin(),
                //多线程js打包器
                new ParallelUglifyPlugin({
                    test:/.js$/,
                    //exclude:/lodash/,
                    workerCount:5,
                    uglifyJS: ()=>{
                        return isProduction ?
                            {

                                output: {
                                  beautify: false, //美化
                                  comments: false //注释
                                },
                                ie8:true,
                                mangle:true,
                                compress:{
                                    drop_console:true
                                }
                            }:
                            {

                                output: {
                                  beautify: true, //格式化
                                  comments: true //注释
                                },
                                ie8:true,
                                mangle:false,
                                compress:{
                                    drop_console:false
                                }
                            }
                    }
                }),

                
            ],
            
            splitChunks: false
        },
        plugins: pluginsConfig,
        module: {
            rules: [
                {
                    test: /\.less$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                              // you can specify a publicPath here
                              // by default it use publicPath in webpackOptions.output
                              //publicPath: 'images/'
                            }
                        },
                        'css-loader',
                        'postcss-loader',//具体配置看postcss.config.js
                        'less-loader'
                    ]
                },
                
                {
                    test: /\.html/, 
                    exclude: /node_modules/,
                    use:[
                        {
                            loader: "html-loader"
                        }
                    ]
                },
                
                {
                    test: /\.(png|jpg|jpeg|gif)$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 10,
                                //outputPath: './images/',
                                //emitFile:false,//不生成文件，通过 CopyWebpackPlugin 插件复制资源
                                publicPath: (url, resourcePath, context) => {
                                    // `resourcePath` is original absolute path to asset
                                    // `context` is directory where stored asset (`rootContext`) or `context` option

                                    // To get relative path you can use
                                    // const relativePath = path.relative(context, resourcePath);

                                    if (/-css/.test(url)) {
                                      return url.replace('css/','');
                                    }
                                    else{
                                        return 'http://172.16.170.119:801/ouchgzee_com/person_center/v3.0.1/exam-pre-regist/'+url;
                                    }
                                },
                                outputPath: (url, resourcePath, context) => {
                                    // `resourcePath` is original absolute path to asset
                                    // `context` is directory where stored asset (`rootContext`) or `context` option

                                    // To get relative path you can use
                                    // const relativePath = path.relative(context, resourcePath);

                                    if (/-css/.test(url)) {
                                      return 'css/'+url;
                                    }
                                    else{
                                        return url;
                                    }
                                },
                                name:'images/[name].[ext]'
                            }
                        }
                    ]
                },

                {
                    test: /\.(woff|woff2|eot|ttf|otf|svg)(.*)?$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 10,
                                
                                outputPath: 'fonts/',
                                emitFile:false,//不生成文件，通过 CopyWebpackPlugin 插件复制资源
                                name:'[name].[ext]?[hash:5]'
                            }
                        }
                    ]
                }
            ]
        }
    }
}