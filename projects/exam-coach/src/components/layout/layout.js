const layout = require('../layout/layout.art');
const header = require('../header/header.art');
const footer = require('../footer/footer.art');
const commonJson = require("../../../globalJSON.js");
//const _=require('lodash');
const deepExtend = require('deep-extend');

const moduleExports = {
  

  /* 整合各公共组件和页面实际内容，最后生成完整的HTML文档 */
  run(htmlData) {
  	let config={
  		headerData:{
	  		title:'',
        bathPath: commonJson.serverPath,
	  		appendContent: '' 
	  	},
	  	bodyData:{
	  		content:'',
        script:''
	  	},
	  	footerData:true
  	}
    //let componentRenderData = _.merge(config,htmlData);
    let componentRenderData = deepExtend(config,htmlData);

    function resetImgPath(str){
      if(typeof('str')=="string" && str!=''){
        return str.replace(/(<img [^>]*src=['"])([^'"]+)([^>]*>)/gi,function (match, $1,$2,$3) {
          //绝对地址的，就不做处理
          if($2.indexOf('http')==0){
            return match
          }
          else{
            return $1+commonJson.serverPath+$2+$3;
          }
        });
      }
      else{
        return '';
      }
    }

    let footerContent='';
    if(componentRenderData.footerData){
      footerContent=footer({bathPath: commonJson.serverPath});
    }
    

    let renderData = {
      bathPath: commonJson.serverPath,
      bodyCssSelectors: componentRenderData.bodyCssSelectors,
      header: header(componentRenderData.headerData),
      footer: footerContent,
      content: resetImgPath(componentRenderData.bodyData.content),
      script: componentRenderData.bodyData.script
    };
    return layout(renderData);
  },
};

module.exports = moduleExports;
