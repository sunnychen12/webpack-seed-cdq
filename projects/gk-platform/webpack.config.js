/******国开在线后台******/

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

const prepareProj=require( path.resolve(__dirname, 'src/modules/prepareProj.js') );

//const myPlugin=require( path.resolve(__dirname, 'src/modules/myPlugin.js') );

module.exports= env => {
    let paseBasePath = path.resolve(__dirname, 'src/pages');

    //process.cwd()返回的是当前Node.js进程执行时的工作目录
    let pages=require( path.resolve(__dirname, '../../modules/getChildrenDir.js') ).getChildrenDir( paseBasePath );

    let isProduction=env.NODE_ENV=='production';
    let isDevelopment=env.NODE_ENV=='development';
    let isNormalProduction=env.NODE_ENV=='production.normal';

    //生成html前的准备与清理工作
    prepareProj(isProduction,__dirname);

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

    if(isProduction){
        pluginsConfig.push(
            new CopyWebpackPlugin(
                [
                    {
                        // 源文件目录
                        from: globalJSON.assetsPath,
                        // 目标目录 dist目录下
                        to: path.resolve(globalJSON.distPath, 'statics/gkouc')
                    }
                ]
            ),
        );
    }

    pages.forEach(function(page){

        pluginsConfig.push(
            new HtmlWebpackPlugin({
                filename: `${page}.html`,
                //pageTitle:`${page} pageTitle`,//自定义
                title:`${page}`,
                template: paseBasePath+'/'+page+'/template.js',
                inject: false,
                chunks: ['main'],
                chunksSortMode:'manual'
            })
        )
    })

    //pluginsConfig.push(new myPlugin({ options: '' }));

    return {
        entry:{
            main: [path.join(__dirname, 'src/js/main.js')]
        },

        output:{
            path:path.normalize('E:\\JspStudy\\WWW\\gk-platform'),
            filename:"js/[name].js"
            //,publicPath: "https://cdn.example.com/assets/"
        },  
        //devtool: 'inline-source-map',//调试用
        //启动webpack自带的服务器
        devServer: {
            contentBase: globalJSON.distPath,
            compress: true,
            inline : true,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            host: '172.16.165.93',
            port: 9200,
            overlay: {
              warnings: true,
              errors: true
            },
            openPage:'index.html'
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
                                emitFile:false,//不生成文件，通过 CopyWebpackPlugin 插件复制资源
                                name:'[name].[ext]?[hash:5]'
                                //useRelativePath:true,
                                
                                /*
                                publicPath: function(url){
                                    if(/style/.test(url)){
                                        return '..'+url;
                                    }

                                    return url;
                                },
                                name:function(file){
                                    if(/css/.test(file)){
                                        return '/images/style/[name]-[hash:4].[ext]'
                                    }
                                    return 'images/[name]-[hash:4].[ext]';
                                }
                                */
                                
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
                        attributes: ['img:src', 'img:data-large-img']
                    }
                },
                
                //raw-loader : import files as a string.
                {
                    test: /\.txt$/,
                    use: [{
                        loader: 'raw-loader'
                    }]
                }
            ]
        }
    }
}