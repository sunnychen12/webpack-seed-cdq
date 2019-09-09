const layout = require('../../components/layout/layout.js');
const content = require('./content.art');
const script = require('./script.art');

//学习空间-思政课首页-播放弹窗
const title = '视频';

const renderData={
	headerData:{
		title: title
	},
	bodyData:{
		content: content(),
		script: script()
	}
}

module.exports = layout.run( renderData );