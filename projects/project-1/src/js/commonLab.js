;(function(){
  //IE9及以下版本不支持
  if(document.all && !window.atob){
      var ieTipsTpl=[
        '<div style="padding:20px;text-align:center">',
            '<table width="100%" height="360">',
                '<tr>',
                    '<td valign="middle">',
                        '<div style="font-size:28px;padding-bottom:15px;">请更换浏览器进行访问！</div>',
                        '<div style="font-size:16px;color:#666;line-height:1.75">',
                            '本页面暂不支持IE浏览器和使用IE内核兼容模式的浏览器访问！<br>',
                            '建议下载谷歌浏览器、360浏览器、搜狗浏览器，并使用极速模式访问！',
                        '</div>',
                        '<table width="100%" style="margin-top:20px;">',
                            '<tr>',
                                '<td style="padding-right:15px;border-right:1px solid #eee;">',
                                    '<a href="https://www.google.cn/intl/zh-CN/chrome/">',
                                        '<img src="http://eefile.download.eenet.com//interface/APP038/xj/image/4133a7ae891001c358c9c4d07cea8e8b.png">',
                                    '</a>',
                                '</td>',
                                '<td style="padding:0 15px;border-right:1px solid #eee;">',
                                    '<a href="http://browser.360.cn/">',
                                        '<img src="http://eefile.download.eenet.com//interface/APP038/xj/image/7c5de1cc0281fc1a79755c5e4eaf35c0.png">',
                                    '</a>',
                                '</td>',
                                '<td style="padding-left:15px;">',
                                    '<a href="https://ie.sogou.com/">',
                                        '<img src="http://eefile.download.eenet.com//interface/APP038/xj/image/db27183be1b3a9e2608a88c9bfdd31f5.png">',
                                    '</a>',
                                '</td>',
                            '</tr>',
                        '</table>',
                    '</td>',
                '</tr>',
            '</table>',
        '</div>'
      ].join('');

      var div1=document.createElement('div');
      div1.id="ver-tips-mark";

      var div2=document.createElement('div');
      div2.id="ver-tips";
      div2.innerHTML=ieTipsTpl;

      document.body.appendChild(div1);
      document.body.appendChild(div2);

      //销毁所有插件，阻止执行其它业务代码
      Vue=Zepto=$=null;

  }
})();

/*!commomLab
*/
var commomLab={
  //验证 transition事件名前缀
  whichTransitionEvent: function(){
      var t,
      el = document.createElement('surface'),
      transitions = {
        'transition':'transitionend',
        'OTransition':'oTransitionEnd',
        'MozTransition':'transitionend',
        'WebkitTransition':'webkitTransitionEnd'
      };

     for(t in transitions){
         if( el.style[t] !== undefined ){
             return transitions[t];
         }
     }
  },
  /*
  * 表单验证
  * @jqForm:form 的jq 对象
  */
  checkform : function(jqForm){
    var lab=this, hasFin=true;
    $('[data-check="1"]',jqForm).each(function(index, el) {
      var that=this;
      if( $.trim($(this).val())=='' ){
        lab.myToast({msg:$(this).attr('data-msg-empty')},function(){
          $(that).focus();
        });
        hasFin=false;
        return false;
      }
      else{
        var reg=new RegExp($(this).attr('data-rule'),'g');
        if( !reg.test($(this).val()) ){
          lab.myToast({msg:$(this).attr('data-msg-error')},function(){
            $(that).focus();
          });
          hasFin=false;
          return false;
        }
      }
    });

    return hasFin;
  },

  moveTop : function($scroller){
    //move top
    var $movetop=$("#movetop");

    if($movetop.length==0){
      $('body').append('<a href="javascript:;" class="moveTop" id="movetop"></a>');
      $movetop=$("#movetop");
    }

    $movetop.click(function(){
        $scroller.scrollTop(0);
    });

    var jqW=$scroller;
    jqW.on('scroll', function(event) {
      if(jqW.scrollTop()>50){
        $movetop.animate({opacity:1},'fast','ease',function(){
          $movetop.show();
        })
      }
      else{
        $movetop.animate({opacity:0},'fast','ease',function(){
          $movetop.hide();
        })
      }
    });
  },

  //显示一个消息，会在2秒钟后自动消失
  myToast : function(opts,cb) {
      var defaultOps={
        msg : '',
        time : 2000,
        extraclass : ''
      };

      opts=$.extend({},defaultOps,opts);

      $('body').append(
        $('<div data-id="my-overlay"></div>').css({
            position: 'absolute',
            left: 0,
            top: 0,
            'z-index': 10600,
            width: '100%',
            height: '100%'
        })
      );
      var $toast = $('<div class="modal toast ' + (opts.extraclass || '') + '">' + opts.msg + '</div>').appendTo(document.body);

      $.openModal($toast, function(){
          setTimeout(function() {
            $toast.one('closed', function(event) {
              $('[data-id="my-overlay"]').remove();
              if(typeof cb =='function'){
                cb.call();
              }
            });
            $.closeModal($toast);
          }, opts.time);
      });
  },

  //解析参数
  getQueryParam : function(name){
    var url=window.location.search;
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var dotIndex=url.indexOf("?");
    if(dotIndex!=-1){
      var r = url.substr(dotIndex+1).match(reg);

      if(r!=null) return decodeURIComponent(r[2]); return null;
    }

    return null;
  },

  //ajax 统一方法
  ajaxProcess : function(options){
    //远程接口网址的域名
    var ajaxBathPath="http://beijinglms.eenet.com";
    //var ajaxBathPath="http://172.16.165.93:8081";

    options.type || (options.type='GET');
    options.dataType || (options.dataType='json');
    typeof(options.cache)=='boolean' || (options.cache=false);
    //options.timeout || (options.timeout=1000*30);//默认异步请求超时时间为 30s

    //如果是首页接口“1、获取学员课程选课信息”，就不用增加参数“domainName”
    if(options.url!='/api/stud/study/moodleGetUserCourseInfo'){
      var cacheUserCourseInfo=this.cacheUserCourseInfo.get();
      if(cacheUserCourseInfo && options.data && typeof(options.data.signature)=='undefined' ){
        options.data['domainName']=cacheUserCourseInfo.user.domainName;
      }
    }

    //$.extend(true, options.data, {bathURL:ajaxBathPath});
    
    var opts=$.extend({}, $.ajaxSettings, options);
    return $.ajax(opts);

    /*
      $.ajax({
        url: '/path/to/file',
        type: 'default GET (Other values: POST)',
        dataType: 'json',
        data: {param1: 'value1'},
        success: function(res){
          
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

        },
        complete: function(){

        }
      })
      .done(function() {
        console.log("success");
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });
    */
    
  },
  //缓存学员课程选课信息
  cacheUserCourseInfo : {
    key : 'UserCourseInfo',
    clear: function(){
      localStorage.removeItem(this.key);
    },
    set : function(jsonData){
      localStorage.setItem( this.key,JSON.stringify(jsonData) )
    },
    get : function(){
      var result=false;
      try{
        result = JSON.parse(localStorage.getItem(this.key))
      }
      catch(e){}

      return result;
    }
  },

  //缓存学员课程选课信息
  cacheCourseInfoActivities : {
    key : 'courseActivities',
    clear: function(){
      sessionStorage.removeItem(this.key);
    },
    set : function(jsonData){
      sessionStorage.setItem( this.key,JSON.stringify(jsonData) )
    },
    get : function(){
      var result=false;
      try{
        result = JSON.parse(sessionStorage.getItem(this.key))
      }
      catch(e){}

      return result;
    }
  },

  //缓存活动状态信息
  cacheActStatus : {
    key : 'actStatus',
    clear: function(){
      sessionStorage.removeItem(this.key);
    },
    set : function(jsonData){
      sessionStorage.setItem( this.key,JSON.stringify(jsonData) )
    },
    get : function(){
      var result=false;
      try{
        result = JSON.parse(sessionStorage.getItem(this.key))
      }
      catch(e){}

      return result;
    }
  },

  //根据 id 查找活动
  getActivityInfo : function(id){
    var activities=this.cacheCourseInfoActivities.get().allModules;

    var activityInfo=activities.filter(function(item){
      return id==item.id
    })[0];

    return activityInfo?activityInfo:false;
  },

  //缓存首页用户滚动页面的位置
  cacheIndexScrollPos : {
    key : 'indexScrollPos',
    clear: function(){
      sessionStorage.removeItem(this.key);
    },
    set : function(val){
      sessionStorage.setItem( this.key, val )
    },
    get : function(){
      return sessionStorage.getItem( this.key );
    }
  },

  //缓存某活动的某一次测验的状态
  cacheAttemptState : {
    para : {
      qid: '-',//测验活动ID
      aid: '-'//某一次测验的ID
    },
    key : 'attemptState',
    clear: function(opts){
      var key=this.key+''+opts.qid+'_'+opts.aid;

      sessionStorage.removeItem(key);
    },
    set : function(opts, state){
      var key=this.key+''+opts.qid+'_'+opts.aid;
      
      sessionStorage.setItem( key, state )
    },
    get : function(opts){
      var key=this.key+''+opts.qid+'_'+opts.aid;

      return sessionStorage.getItem( key );
    }
  },

  //检测接口的初步返回数据是否有问题
  checkAPIResult : function(res){
    return (
              res.msgCode==200 &&
              res.data
            );
  },
  //找老师
  callTeacher: function(){
    try{
      var userinfor=this.cacheUserCourseInfo.get().user;
      if(
        userinfor &&
        userinfor.username &&
        userinfor.studentId
      ){
        location.href='/statics/mobile-learning/faq-center.html?userName='+userinfor.username+'&studentId='+userinfor.studentId;
      }
    }catch(e){}
  },

  //监控浏览器后退离开页面
  onPageBackAway:function(cb){
    history.replaceState(null,null,'#t0');
    window.onhashchange=function(){
      if(typeof(cb)=='function'){
        cb.call(window);
      }
    }

  },

  //学员学习行为记录
  addStudyAction:function(opts){
    var userinfor=this.cacheUserCourseInfo.get();
    var act={//操作类型
      C001: '进入课程',
      C002: '文本学习',
      C003: '视频学习',
      C004: '进入测试',
      C005: ' 进入测验做题',
      C006: ' 提交测验做题',
      C007: ' 进入讨论活动',
      C008: ' 讨论发表回复',
      C009: ' 讨论发表评论'
    };

    var defaultOps={
      userNo: userinfor.user.username, //学号
      courseCode: userinfor.course.courseCode, //课程编号
      actId: '', //活动章节ID cmId（学习活动的时候填写，其它为空）
      actTime: 0, //学习时长(s)
      actType: '', //操作类型
      actName: '', //活动名称
      actDec: '', //操作描述
      chooseId: userinfor.choose.chooseId,//选课ID
      timeStamp: '', //时间戳（秒为单位,30分钟内有效）
      nonce: '', //随机字符串
      signature: '' //签名
    }

    //如果没自定义操作描述，当根据 操作类型 能找到对应的默认描述，就用该默认的
    if(opts.actType){
      if(act[opts.actType]){
        if(!opts.actDec){
          switch(opts.actType){
            case 'C001':
              opts.actDec='进入“'+opts.actName+'”课程';
              break;
            case 'C002':
            case 'C003':
              if(opts.actIsFin){
                opts.actDec='完成了“'+opts.actName+'”'+act[opts.actType];
              }
              else{
                opts.actDec='进入“'+opts.actName+'”'+act[opts.actType];
              }
              
              break;
            case 'C004':
              opts.actDec='进入“'+opts.actName+'”测试';
              break;
            case 'C005':
              opts.actDec='进入“'+opts.actName+'”测验做题';
              break;
            case 'C006':
              opts.actDec='提交“'+opts.actName+'”测验做题';
              break;
            case 'C007':
              opts.actDec='进入“'+opts.actName+'”讨论活动';
              break;
            case 'C008':
            case 'C009':
              opts.actDec='在“'+opts.actName+'”'+act[opts.actType];
              break;
            default:
              opts.actDec='“'+opts.actName+'”'+act[opts.actType];
              break;
          }
          
        }
      }
    }

    opts=$.extend({},defaultOps,opts);

    this.ajaxProcess({
      url: '/api/stud/online/addStudyAction.json',
      data: opts
    });
  },
  //获取用户浏览页面的时长
  getVisitDuration:function(){
    var prevHistroy=this.cachePrevHistroy.get();
    var timeStamp=new Date().getTime();
    var differTime=0;//时长(s);
    if(prevHistroy){
      if(prevHistroy.path!=location.pathname){
        differTime=((timeStamp-prevHistroy.visitTime) / 1000 % 60).toFixed(2);
      }
    }
    this.cachePrevHistroy.set({
      path: location.pathname,
      visitTime: timeStamp
    });
    return differTime;
  },
  /*缓存用户浏览上一页面的行为记录
   *json对象
   *  @path:页面地址
   *  @visitTime:访问时间的时间戳（毫秒）
  */
  cachePrevHistroy : {
    key : 'prevHistroy',
    clear: function(){
      sessionStorage.removeItem(this.key);
    },
    set : function(jsonData){
      if(jsonData){
        try{
          sessionStorage.setItem( this.key, JSON.stringify(jsonData) )
        }
        catch(e){
          console.log('cachePrevHistroy 的 session 值需为json对象');
        }
      }
      else{
        console.log('cachePrevHistroy 的 session 值为空');
      }
    },
    get : function(){
      var result=false;
      try{
        result = JSON.parse(sessionStorage.getItem(this.key))
      }
      catch(e){}

      return result;
    }
  },
  //四舍五入
  /*
    int n 数值
    int d 小数位
  */
  floatToFixed: function (n,d) { 
      var s=n+""; 
      if(!d)d=0; 
      if(s.indexOf(".")==-1)s+="."; 
      s+=new Array(d+1).join("0"); 
      if(new RegExp("^(-|\\+)?(\\d+(\\.\\d{0,"+(d+1)+"})?)\\d*$").test(s)){
          var s="0"+RegExp.$2,pm=RegExp.$1,a=RegExp.$3.length,b=true;
          if(a==d+2){
              a=s.match(/\d/g); 
              if(parseInt(a[a.length-1])>4){
                  for(var i=a.length-2;i>=0;i--){
                      a[i]=parseInt(a[i])+1;
                      if(a[i]==10){
                          a[i]=0;
                          b=i!=1;
                      }else break;
                  }
              }
              s=a.join("").replace(new RegExp("(\\d+)(\\d{"+d+"})\\d$"),"$1.$2");

          }if(b)s=s.substr(1); 
          return (pm+s).replace(/\.$/,"");
      }return n+"";

  },

  //base64编码解码js
  /*使用
      var b = new Base64();  
      var str = b.encode("admin:admin");  
      alert("base64 encode:" + str);  
　　　　　//解密
      str = b.decode(str);  
      alert("base64 decode:" + str);  
  */
  Base64: function () {

      // private property
      _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
   
      // public method for encoding
      this.encode = function (input) {
          var output = "";
          var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
          var i = 0;
          input = _utf8_encode(input);
          while (i < input.length) {
              chr1 = input.charCodeAt(i++);
              chr2 = input.charCodeAt(i++);
              chr3 = input.charCodeAt(i++);
              enc1 = chr1 >> 2;
              enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
              enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
              enc4 = chr3 & 63;
              if (isNaN(chr2)) {
                  enc3 = enc4 = 64;
              } else if (isNaN(chr3)) {
                  enc4 = 64;
              }
              output = output +
              _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
              _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
          }
          return output;
      }
   
      // public method for decoding
      this.decode = function (input) {
          var output = "";
          var chr1, chr2, chr3;
          var enc1, enc2, enc3, enc4;
          var i = 0;
          input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
          while (i < input.length) {
              enc1 = _keyStr.indexOf(input.charAt(i++));
              enc2 = _keyStr.indexOf(input.charAt(i++));
              enc3 = _keyStr.indexOf(input.charAt(i++));
              enc4 = _keyStr.indexOf(input.charAt(i++));
              chr1 = (enc1 << 2) | (enc2 >> 4);
              chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
              chr3 = ((enc3 & 3) << 6) | enc4;
              output = output + String.fromCharCode(chr1);
              if (enc3 != 64) {
                  output = output + String.fromCharCode(chr2);
              }
              if (enc4 != 64) {
                  output = output + String.fromCharCode(chr3);
              }
          }
          output = _utf8_decode(output);
          return output;
      }
   
      // private method for UTF-8 encoding
      _utf8_encode = function (string) {
          string = string.replace(/\r\n/g,"\n");
          var utftext = "";
          for (var n = 0; n < string.length; n++) {
              var c = string.charCodeAt(n);
              if (c < 128) {
                  utftext += String.fromCharCode(c);
              } else if((c > 127) && (c < 2048)) {
                  utftext += String.fromCharCode((c >> 6) | 192);
                  utftext += String.fromCharCode((c & 63) | 128);
              } else {
                  utftext += String.fromCharCode((c >> 12) | 224);
                  utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                  utftext += String.fromCharCode((c & 63) | 128);
              }
   
          }
          return utftext;
      }
   
      // private method for UTF-8 decoding
      _utf8_decode = function (utftext) {
          var string = "";
          var i = 0;
          var c = c1 = c2 = 0;
          while ( i < utftext.length ) {
              c = utftext.charCodeAt(i);
              if (c < 128) {
                  string += String.fromCharCode(c);
                  i++;
              } else if((c > 191) && (c < 224)) {
                  c2 = utftext.charCodeAt(i+1);
                  string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                  i += 2;
              } else {
                  c2 = utftext.charCodeAt(i+1);
                  c3 = utftext.charCodeAt(i+2);
                  string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                  i += 3;
              }
          }
          return string;
      }
  },

  //问题反馈 板块 默认参数
  faqDefaultParams:{
    userName:'',//0961001464994
    studentId:'',//00001de5b73e4dd282463e2105576011
    signature:'feedgrrbackiktlsignaturewldpmo'
  }
}


//fadeIn
;(function(){
  $.fn.fadeIn = function(cb){
    return this.each(function(){
      var that=$(this);
      that.addClass('fadeIn animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
        that.removeClass('fadeIn animated');
          if(typeof cb == 'function'){
            cb.call(that);
          }
      }).show();
    })
  };


  $.fn.slideToggle = function(cb){
    return this.each(function(){
      var that=$(this);
      if(that.hasClass('animating')) return;

      var slideHeight=that.children('.slide-cnt').height();

      that.addClass('animating');

      if(that.hasClass('expand')){
        that.height(slideHeight).height(0)
      }
      else{
        that.height(slideHeight);
      }

      //动画事件
      that.one(commomLab.whichTransitionEvent(), function(event) {
        if(that.hasClass('expand')){
          that.removeClass('expand');
        }
        else{
          that.addClass('expand');
        }

        that.removeClass('animating');

        if(typeof cb == 'function'){
          cb.call(that);
        }
      });
    })
  }

  
})();

;(function(){
  // Android 手机下输入框获取焦点时, 输入法挡住输入框的 bug
  if (/Android/gi.test(navigator.userAgent)) {
      window.addEventListener('resize', function () {
          if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
              window.setTimeout(function () {
                  document.activeElement.scrollIntoViewIfNeeded();
              }, 0);
          }
      })
  }
})();

/** 格式化输入字符串**/
//用法: "hello{0}".format('world')；返回'hello world'
String.prototype.format= function(){
  var args = arguments;
  return this.replace(/\{(\d+)\}/g,function(s,i){
    return args[i];
  });
}

/*
var startTime = Math.ceil(new Date().getTime()), //单位秒
  getDuration = function(){
    var endTime = Math.ceil(new Date().getTime()),
      duration = endTime - startTime;

    seconds = (duration/1000 % 60).toFixed(2); //停留秒数
    
    return seconds;
  };        


window.onbeforeunload = function(e){
  var duration = getDuration();
};
*/