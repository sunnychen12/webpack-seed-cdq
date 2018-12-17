const layout = require('../../components/layout/layout.js');
const content = require('./content.art');
const script = require('./script.art');

//活动  iframe嵌套页
const title = '非学历教育';

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