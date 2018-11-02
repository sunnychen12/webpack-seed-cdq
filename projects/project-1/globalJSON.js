const path = require("path");

module.exports = {
	//生产环境目录，用于嵌套数据；
	devPath: path.normalize('E:\\git_repository\\com.gzedu.xlims.new\\gkApp\\src\\main\\webapp\\views\\gkApp\\mobile-learning'),
	srcPath: path.resolve(__dirname,'src'),
	distPath: path.resolve(__dirname,'dist')
};