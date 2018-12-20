//工具
var ultil={};
//文件上传方法2:点击选择上传文件后，自动上传文件，不再显示弹窗上传
ultil.uploadSingleFile=function (opts){
    var defaultOpts={
          //文件类型，'*'代表任意类型，'png|gif|jpeg'多类型用'|'隔开
          fileType: '*',
          //上传完成后，需要回调访问的站点的文件地址
          callbackPageUrl: location.origin+'/assets/html/uploadIframe.html',
          //文件上传前回调
          onUploadBefore: false,
          //文件上传成功后回调
          onSuccess: false
        };

    opts = $.extend(true, defaultOpts, opts);

    //创建createUploadIframe
    ;(function (){
      /*
        opts.onUploadBefore: 文件上传前的回调方法
      */
      var ifrTpl='\
        <html>\
          <head>\
          </head>\
          <body>\
            <form id="submitForm" name="submitForm" method="post" enctype="multipart/form-data" action="http://eefile.gzedu.com/ossupload/uploadInterface.do">\
              <input type="file" name="files" id="file">\
              <input type="hidden" name="formMap.FILE_TYPE" value="files">\
              <input type="hidden" name="formMap.compress" value="0">\
              <input type="hidden" name="formMap.origin" value="'+opts.callbackPageUrl+'">\
              <input type="hidden" name="formMap.filecwd" value="/APP038/xj/image">\
              <input type="hidden" name="formMap.ACCESS_KEY_ID" value="b49ca70bac1082b01318bd3cecf317e4">\
              <input type="hidden" name="formMap.ACCESS_KEY_SECRET" value="17b16aedf2f46e32ccfbd6049090925f">\
            </form>\
          </body>\
        </html>\
      ';

      var ifrm=$('#ifr');
      if(ifrm){
        ifrm.remove();
      }
      $('body').append('<iframe id="ifr" name="ifr" src="about:blank" style="display:none;"></iframe>');
      ifrm=document.getElementById('ifr');
      var doc=ifrm.contentWindow.document;

      doc.open();
      doc.write(ifrTpl);
      doc.close();

      //显示图片
      $(ifrm.contentWindow.document).find('#file').on('change', function(event) {
        event.preventDefault();

        //文件类型检测
        if(opts.fileType!='*' && this.value){
          var isPast=false;
          var filter=opts.fileType.split('|');
          if(filter.length>0){
            for(var index in filter){
              var rule=new RegExp('.+(.'+filter[index]+')$','i');
              if(rule.test(this.value)){
                isPast=true;
                break;
              }
            }
          }
          if(!isPast){
            $.resultDialog(0, '文件类型不对<br><div class="font16">'+filter.join('、')+'</div>', 2000);
            return false
          }
        }

        if(opts && typeof opts.onUploadBefore == 'function'){
          opts.onUploadBefore.call(this);
        }

        var ifrm=document.getElementById('ifr');
        var doc=ifrm.contentWindow.document;
        
        doc.forms.submitForm.submit();
      }).trigger('click');
    })();

    window.process=function(result){

      var filelist = $.parseJSON(result['data']);

      if(filelist && filelist.resultList && filelist.resultList.length>0){
        if( typeof opts.onSuccess == 'function' ){
          opts.onSuccess(filelist.resultList);
        }
      }
    }
}

/** 格式化输入字符串**/
//用法: "hello{0}".format('world')；返回'hello world'
String.prototype.format= function(){
  var args = arguments;
  return this.replace(/\{(\d+)\}/g,function(s,i){
    return args[i];
  });
}