const path = require("path");
const basePath = 'E:\\git_repository\\ouc_cloud_git\\ouc_cloud_ui';

module.exports = {
	//basePath: path.normalize('E:\\git_repository\\ouc_cloud\\'),
	basePath: basePath,
	//静态文件
	pathStatic:{
		serverPath: 'http://172.16.165.93:9201',
		// basePath 下的 目录
		distPath: 'ouc_cloud_web/ouc-site'
	},
	
	pathProj:{
		// basePath 下的 目录
		distPath: 'ouc_cloud_skin/ouc-site'
	},

	//commonSkin:path.join(basePath,'html/ouc_cloud_skin/common')
};