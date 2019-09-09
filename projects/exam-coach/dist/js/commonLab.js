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
    options.type || (options.type='GET');
    options.dataType || (options.dataType='json');
    typeof(options.cache)=='boolean' || (options.cache=false);
    //options.timeout || (options.timeout=1000*30);//默认异步请求超时时间为 30s

    var opts=$.extend({}, $.ajaxSettings, options);
    return $.ajax(opts);

  },
  //答题卡的显示处理
  resetAnsCard : function(){
      var $card=$('.ans-card-list').filter(function(){return $(this).height()!=0}) //匹配可见的元素
        , cardWith=$card.width()-1
        , $items=$card.children()
        , $item=$items.eq(0)
        , itemWidth=$item.outerWidth(true)+1
        , counts=$items.length;

      var w=0, m=0;
      for (var i = 1; i <= counts; i++) {
        w=itemWidth*i;
        if(w>cardWith){
          m=i;
          break;
        }
      }

      if(m>0){
        $card.css('padding-left', (cardWith-itemWidth*(m-1))/2 );
      }
  },
  //找老师
  callTeacher: function(){
    try{
      Phone.consulting();
    }catch(e){}
  }
}


;(function(){
  //fadeIn
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

  //slideToggle
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

  //浏览器后退
  $('body')
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


/** Vue **/
var mixin = {
  data: function () {
    return {
        success:true,
        msg:'',
        isloaded:false,//是否所有数据都已经加载完毕
    }
  },
  methods:{
    //结束异步，关键加载特殊，显示页面内容
    showHtml:function(errorMsg){
        if(errorMsg){
          this.success=false;
          this.msg=errorMsg;
        }
        
        this.isloaded=true;
        $.hideIndicator();
    },
    hideHtml:function(){
        this.isloaded=false;
        $.showIndicator();
      },
    //浏览器后退
    historyBack:function(){
        history.back();
    }
  }
}