const path = require("path");

module.exports = {
	//生产环境目录，用于嵌套数据；
	devPath: path.normalize('E:\\git_repository\\gk_ouc\\src\\main\\webapp\\statics\\mobile-learning-v2'),
	srcPath: path.resolve(__dirname,'src'),
	distPath: path.resolve(__dirname,'dist')
};