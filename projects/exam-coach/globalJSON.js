const path = require("path");

module.exports = {
	//生产环境目录，用于嵌套数据；
	devPath: 'E:\\git_repository\\base_examV2.0_svn\\web\\api\\coach',
	//physicalSkinPath: path.normalize('Z:\\exam_chinaeenet_com\\exam-coach'),
	//physicalSkinPath: path.normalize('\\\\172.16.170.119\\css.gzedu.com\\exam_chinaeenet_com\\exam-coach'),
	physicalSkinPath: 'F:\\css.gzedu.com\\exam_chinaeenet_com\\exam-coach',
	srcPath: path.resolve(__dirname,'src'),
	distPath: path.resolve(__dirname,'dist'),
	localhost:'http://172.16.170.119:801',//内网样式服务器地址
	serverhost:'http://css.eenet.com',//线上样式服务器地址
	serverSkinPath : 'exam_chinaeenet_com/exam-coach'//具体目录
};