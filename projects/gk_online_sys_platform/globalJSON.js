const path = require("path");
const basePath = 'E:\\git_repository\\ouc_cloud';

module.exports = {
	//basePath: path.normalize('E:\\git_repository\\ouc_cloud\\'),
	basePath: basePath,
	//静态文件
	pathStatic:{
		serverPath: 'http://172.16.165.93:9201',
		// basePath 下的 目录
		distPath: 'html/ouc_cloud_web/ouc-base'
	},
	//生产环境
	pathProd:{
		serverPath: 'http://172.16.165.93:9201',
		// basePath 下的 目录
		distPath: 'code/ouc_cloud_web/ouc-base'
	},
	
	pathProj:{
		// basePath 下的 目录
		distPath: 'html/ouc_cloud_skin/sys_plateform'
	},

	commonSkin:path.join(basePath,'html/ouc_cloud_skin/common')
};