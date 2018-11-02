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
    var url=window.location.href;
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
    //options.timeout || (options.timeout=1000*30);//默认异步请求超时时间为 30s
    $.extend(true, options.data, {bathURL:ajaxBathPath});
    
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

  //检测接口的初步返回数据是否有问题
  checkAPIResult : function(res){
    return (
              res.success &&
              res.data &&
              res.data.code==200 &&
              res.data.data
            );
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