const layout = require('../../components/layout/layout.js');
const content = require('./content.art');
const script = require('./script.art');

const title = '报读缴费平台-提交报读（检测通过）';

const commonScript=require('raw-loader!../../components/commonScript/commonScript.txt');

const renderData={
	headerData:{
		title: title
	},
	bodyData:{
		content: content() + commonScript + '\n' + script()
	}
}

module.exports = layout.run( renderData );