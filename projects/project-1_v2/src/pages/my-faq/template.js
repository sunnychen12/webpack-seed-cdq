const layout = require('../../components/layout/layout.js');
const content = require('./content.art');
const script = require('./script.art');

//活动  iframe嵌套页
const title = '我的问题';

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