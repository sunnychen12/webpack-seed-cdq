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

const globalJSON = require( path.resolve(__dirname, "globalJSON.js") );

//const prepareProj=require( path.resolve(globalJSON.srcPath, 'modules/prepareProj.js') );

//const myPlugin=require( path.resolve(__dirname, 'src/modules/myPlugin.js') );

module.exports= env => {
    let paseBasePath = path.resolve(globalJSON.srcPath, 'pages');

    //process.cwd()返回的是当前Node.js进程执行时的工作目录
    let pages=require( path.resolve(__dirname, '../../modules/getChildrenDir.js') ).getChildrenDir( paseBasePath );

    let isProduction=env.NODE_ENV=='production';
    let isDevelopment=env.NODE_ENV=='development';
    let isNormalProduction=env.NODE_ENV=='production.normal';

    //生成html前的准备与清理工作
    //prepareProj(isProduction);

    let pluginsConfig=[
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery'
                //commonLab : require.resolve('./src/js/commonLab.js')
            }),
            new MiniCssExtractPlugin({
                  // Options similar to the same options in webpackOptions.output
                  // both options are optional
                  filename: "css/[name].css"
                })
        ];

    pages.forEach(function(page){
        //只生成静态版

        pluginsConfig.push(
            new HtmlWebpackPlugin({
                filename: `${page}.html`,
                //pageTitle:`${page} pageTitle`,//自定义
                templateParameters:{
                    isProduction: isProduction,
                    host: isProduction?globalJSON.serverhost:globalJSON.localhost,
                    commonSkinPath: globalJSON.serverSkinPath
                },
                template: paseBasePath+'/'+page+'/html.html',
                inject: false,
                chunks: ['main'],
                chunksSortMode:'manual'
            })
        )
    })

    //pluginsConfig.push(new myPlugin({ options: '' }));

    return {
        entry:{
            main: [path.join(globalJSON.srcPath, 'js/main.js')]
        },

        output:{
            path: globalJSON.distPath,
            filename:"js/[name].js"
            //,publicPath: "https://cdn.example.com/assets/"
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
            noParse: /node_modules\/(jquey\.js)/,
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
                    test: /\.tpl/, 
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
                                
                                outputPath: 'images/',
                                emitFile:false,//不生成文件，通过 CopyWebpackPlugin 插件复制资源
                                name:'[name].[ext]?[hash:5]'
                                
                                
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
                },

                //模板引擎
                {
                    test: /\.(art)$/,
                    exclude: /node_modules/,
                    loader: 'underscore-template-loader',
                    query: {
                        attributes: []
                    }
                },
                
                //raw-loader : import files as a string.
                {
                    test: /\.(txt|msg)$/,
                    use: [{
                        loader: 'raw-loader'
                    }]
                }
            ]
        }
    }
}