const layout = require('../../components/layout/layout.js');
const content = require('./content.art');
const script = require('./script.art');

//课程学习-练习测试
const title = '';

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