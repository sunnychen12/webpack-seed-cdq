const layout = require('../../components/layout/layout.js');
const content = require('./content.art');
const script = require('./script.art');

const title = '在线监控';

const renderData={
	bodyCssSelectors:'inner-page-body',
	headerData:{
		title: title,
		appendContent:`
			<style type="text/css">
				.td-s1{
					border-right: 1px solid #DEDEDE;
					padding: 5px 20px;
				}
			</style>
		`
	},
	bodyData:{
		content: content(),
		script: script()
	}
}

module.exports = layout.run( renderData );