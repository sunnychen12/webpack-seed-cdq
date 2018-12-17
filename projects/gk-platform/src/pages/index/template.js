const layout = require('../../components/layout/layout.js');
const content = require('./content.art');
const script = require('./script.art');

const title = '北京国开教务后台';

const renderData={
	bodyCssSelectors:'hold-transition fixed skin-blue sidebar-mini',
	headerData:{
		title: title
	},
	bodyData:{
		content: content(),
		script: script()
	},
	footerData:false
}

module.exports = layout.run( renderData );