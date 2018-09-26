const layout = require('../layout/layout.art');
const header = require('../header/header.art');
const footer = require('../footer/footer.art');
const _=require('lodash');

const moduleExports = {


  /* 整合各公共组件和页面实际内容，最后生成完整的HTML文档 */
  run(htmlData) {
  	let config={
  		headerData:{
	  		title:'',
	  		appendContent: '' 
	  	},
	  	bodyData:{
	  		content:''
	  	},
	  	footerData:{
	  		appendContent: '' 
	  	}
  	}
    let componentRenderData = _.merge(config,htmlData);

    let renderData = {
      header: header(componentRenderData.headerData),
      footer: footer(componentRenderData.footerData),
      content: componentRenderData.bodyData.content
    };
    return layout(renderData);
  },
};

module.exports = moduleExports;
