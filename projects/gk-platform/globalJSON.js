const path = require("path");

module.exports = {
	//生产环境目录，用于嵌套数据；
	//serverPath: 'http://172.16.165.93:9100/statics/gkouc',
	serverPath: 'statics/gkouc',
	assetsPath: path.resolve('E:\\git_repository\\gk_ouc\\src\\main\\webapp\\statics', 'gkouc'),
	distPath: path.normalize('E:\\JspStudy\\WWW\\gk-platform')
};