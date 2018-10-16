/*!commomLab
*/
var commonLab={
	modalIconClose: '<span class="icon icon-close" onclick="$.closeModal()"></span>',
	openModal: function(opts){
		var defaultOpts={
			titls: '提示',
			text: '内容',
			extraClass: 'my-modal'
		}

		opts.title='<div class="modal-title-name">'+opts.title+'</div>'+this.modalIconClose;

		opts= $.extend({}, defaultOpts, opts);
		
		var domModal=$.modal(opts);

	    return this.fixModal(domModal);
	},
	fixModal: function(domModal){
		var $modal=$(domModal)
			, $boxH=$modal.height()
        	, $winH=$(window).height()
        	, $modalInner=$modal.find('.modal-inner')
        	, $inH=$modalInner.height();
        
	    $modal.css('margin-top',-$modal.height()/2);

        if( $boxH < $inH ){
        	var $modalTitle=$modalInner.children('.modal-title');

        	var differ=$boxH-($modalTitle.length>0?$modalInner.children('.modal-title').height():0);

          	$modal.find('.modal-text').css({
              'overflow-y': 'auto'
            }).height( differ );
        }

        return $modal
    },
    //显示大图
    'showLargePhoto':function($img){
      if( $img.length>0 ){
        $img.one('click', function(event) {
          var initIndex=$.inArray(this,$img);
          initIndex=initIndex?initIndex:0;

          var arrPhotos=[];
          $img.each(function(index, el) {
            var obj={};
            obj.url=$(this).attr('data-large-img');
            obj.caption=this.title ? this.title:'';
            arrPhotos.push(obj);
          });

          $.closeModal();

          //api: http://www.swiper.com.cn/api/index.html
          $.photoBrowser({
            photos : arrPhotos,
            theme: 'dark',
            ofText:'\/',
            initialSlide:initIndex,
            //swipeToClose:false,
            expositionHideCaptions:true,
            type: 'standalone',
            preloadImages: false,
            lazyLoading: true,
            onLazyImageReady: function(swiper){
              var $c=$(swiper.swiperContainer[0]);
              var $activedImg=$c.find('img').eq(swiper.activeIndex);
              
              if($activedImg.height()>$c.height()){
                $activedImg.parent().height('100%');
              }
            }            
          }).open();
        });
        
      }
    },
}

//第一次点击文本框时，光标置后
$('.page').on('click','[data-focus="focus-last"]',function () {
	if( $(this).attr('data-has-focus')!='1' ){
	  var t=this.value;
	  $(this).val("").focus().val(t);
	  $(this).attr('data-has-focus','1');
	}
});

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
})(window);

/** 格式化输入字符串**/
//用法: "hello{0}".format('world')；返回'hello world'
String.prototype.format= function(){
  var args = arguments;
  return this.replace(/\{(\d+)\}/g,function(s,i){
    return args[i];
  });
}