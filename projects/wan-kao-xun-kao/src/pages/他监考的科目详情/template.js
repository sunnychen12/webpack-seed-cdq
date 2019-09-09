const layout = require('../../components/layout/layout.js');
const content = require('./content.art');
const script = require('./script.art');

const title = '他监考的科目详情';

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