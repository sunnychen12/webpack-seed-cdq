const path = require("path");
const globalJSON = require( "../../globalJSON.js" );

const skinPath=path.join(globalJSON.commonSkin, 'build/custom/reset.less');

require(skinPath)