const layout = require('../../components/layout/layout.js');
const content = require('./content.art');
const script = require('./script.art');

const title = '查看监考行为记录';

const renderData={
	headerData:{
		title: title
	},
	isPopWin:true,
	bodyData:{
		content: content(),
		script: script()
	}
}

module.exports = layout.run( renderData );