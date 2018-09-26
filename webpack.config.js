const path = require("path");
const webpack = require('webpack');

//const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const HtmlWebpackPlugin = require('html-webpack-plugin');

const prepareProj=require('./src/modules/prepareProj.js');

module.exports= env => {
    //console.log('NODE_ENV: ', env.NODE_ENV);
    let paseBasePath = './src/pages';

    let pages=require('./src/modules/getChildrenDir.js').getChildrenDir( path.resolve(__dirname, paseBasePath) );

    let isProduction=env.NODE_ENV=='production';
    let isDevelopment=env.NODE_ENV=='development';
    let isNormalProduction=env.NODE_ENV=='production.normal';

    //生成html前的准备与清理工作
    prepareProj(isProduction);

    let pluginsConfig=[
            
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery'
                //commonLab : require.resolve('./src/js/commonLab.js')
            }),
            new CopyWebpackPlugin(
                [
                    //拷贝 脚本
                    {
                        // 源文件目录
                        from: './src/js/commonLab.js',
                        // 目标目录 dist目录下
                        to: './js/commonLab.js'
                    },
                    {
                        // 源文件目录
                        from: './src/assets/js/**/*.js',
                        // 目标目录 dist目录下
                        to: './assets/js/[name].[ext]',
                        ignore: [
                            'sm.js',
                            'sm.min.js',
                            'sm-config.js',
                            'sm-extend.js',
                            'zepto.min.js',
                            'lazyload.js'
                        ]
                    },

                    //拷贝 图片
                    {
                        // 源文件目录
                        from: './src/images',
                        // 目标目录 dist目录下
                        to: './images'
                    },
                    {
                        // 源文件目录
                        from: './src/css/images',
                        // 目标目录 dist目录下
                        to: './css/images'
                    },

                    //拷贝 字体
                    {
                        // 源文件目录
                        from: './src/css/fonts',
                        // 目标目录 dist目录下
                        to: './css/fonts',
                        ignore: [
                            'style.css',
                            'svg/*'
                        ]
                    },
                    {
                        // 源文件目录
                        from: './src/assets/css/font',
                        // 目标目录 dist目录下
                        to: './css/font'
                    }
                ]
            ),
            new MiniCssExtractPlugin({
                  // Options similar to the same options in webpackOptions.output
                  // both options are optional
                  filename: "css/[name].css"
                })
        ];

    pages.forEach(function(page){

        pluginsConfig.push(
            new HtmlWebpackPlugin({
                filename: `${page}.html`,
                title:`${page}`,
                template: paseBasePath+'/'+page+'/template.js',
                inject: false,
                chunks: ['main'],
                chunksSortMode:'manual'
            })
        )
    })



    return {
        entry:{
            main: [path.join(__dirname, './src/js/main.js')]
        },

        output:{
            path:path.resolve(__dirname,'dist'),
            filename:"js/[name].js"
            //,publicPath: "https://cdn.example.com/assets/"
        },  
        //devtool: 'inline-source-map',//调试用
        //启动webpack自带的服务器
        devServer: {
            contentBase: path.join(__dirname, "dist"),
            compress: true,
            inline : true,
            host: '172.16.165.93',
            port: 9000
        },

        watchOptions:{
            poll:1000,//监测修改的时间(ms)
            aggregateTimeout:500, //防止重复按键，500毫米内算按键一次
            ignored:/node_modules///不监测
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
                
                /*
                new UglifyJsPlugin({
                    
                    uglifyOptions:{
                        output: {
                          beautify: true, //不需要格式化
                          comments: false //不保留注释
                        },
                        ie8:true,
                        mangle:false,
                        compress:{
                            drop_console:true
                        }

                    }
                })
                */
                
            ],
            
            splitChunks: false
            /*
            splitChunks: {
                cacheGroups: {
                    
                    vendor:{//node_modules内的依赖库
                        chunks:"all",
                        test: /\.js$/,
                        name:"vendor",
                        minChunks: 2, //被不同entry引用次数(import),1次的话没必要提取
                        maxInitialRequests: 5,
                        minSize: 0,
                        priority:100
                    },
                    
                    styles: {
                        name: 'styles',
                        test: /\.(css|less)$/,
                        chunks: 'initial',
                        minChunks: 2,
                        enforce: true
                    }
                }
            }
            */

        },
        plugins: pluginsConfig,
        module: {
            rules: [
                {
                    test: /\.less$/,
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
                    use:[
                        {
                            loader: "html-loader"
                        }
                    ]
                },
                
                {
                    test: /\.(png|jpg|jpeg|gif)$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 10,
                                
                                outputPath: 'images/',
                                emitFile:false,//不生成文件，通过 CopyWebpackPlugin 插件复制资源
                                name:'[name].[ext]?[hash]'
                                
                                
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
                    loader: 'underscore-template-loader',
                    query: {
                        attributes: ['img:src', 'img:data-large-img']
                    }
                },
                /*
                //raw-loader : import files as a string.
                {
                    test: /\.txt$/,
                    use: [{
                        loader: 'raw-loader'
                    }]
                },
                
                {
                  test: require.resolve('jquery'),
                  use: [{
                      loader: 'expose-loader',
                      options: 'jQuery'
                  },{
                      loader: 'expose-loader',
                      options: '$'
                  }]
                }
                */
            ]
        }
    }
}