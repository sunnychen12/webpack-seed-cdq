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