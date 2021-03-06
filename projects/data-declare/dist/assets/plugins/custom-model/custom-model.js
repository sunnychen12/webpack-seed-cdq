/*
说明：自定制模态框modal弹出框
用法 
$.mydialog({
  id:'upload-1',
  width:760,
  height:490,
  content: 'url:xx.html' // 'html'
});
*/

;(function($){

	var dialogDefault={
		id:Math.floor(Math.random()*1000000),
		width:100,
    	height:50,
    	content:'',
    	fade:true,//此属性，当为false时，只对非iframe情况有效
    	backdrop:true,//点击遮罩层是否关闭
    	transparent:false,//背景色透明设置
    	showCloseIco:true,
    	markOpacity:0.5,//遮罩层透明设置
    	zIndex:10,
    	iframeScroll:'no',
    	onClose:function(){},
    	onLoaded:function(){}
	};
	var htmlTmp=[//弹窗模板-加载iframe
		'<div class="modal import-modal" data-id="{0}">',
			'<div class="modal-dialog">',
				'<div class="modal-content overlay-wrapper import-modal-content">',
					'<div class="overlay">',
						'<i class="fa fa-refresh fa-spin"></i>',
					'</div>',
					'<iframe id="Iframe-{0}" name="Iframe-{0}" scrolling="{2}" frameborder="0" width="100%" height="100%"></iframe>',
				'</div>',
				'{1}',//设置关闭ico
			'</div>',
		'</div>'
	];
	var htmlTmp2=[//弹窗模板-非iframe
		'<div class="modal import-modal" data-id="{0}">',
			'<div class="modal-dialog">',
				'<div class="modal-content overlay-wrapper import-modal-content">',
					'<div class="modal-body no-padding"></div>',
				'</div>',
				'{1}',//设置关闭ico
			'</div>',
		'</div>'
	];
	$.extend({
		mydialog:function(setting){
			var opt =$.extend({},dialogDefault,setting);
			var i=opt.content.indexOf("url");
			var tmp;

			if(i!=-1){
				tmp=htmlTmp.join("");
			}
			else{
				tmp=htmlTmp2.join("");
			}

			tmp=tmp.replace(/\{0\}/g,opt.id);
			tmp=tmp.replace(/\{1\}/g,opt.showCloseIco?'<button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>':'');
			tmp=tmp.replace(/\{2\}/g,opt.iframeScroll);

			var $modelBox=$(tmp);
			var $modelContent=$modelBox.find(".modal-content");

			/*设置弹框的样式*/
			$modelBox.find(".modal-dialog").width(opt.width);
			$modelContent.css({
				height:opt.height,
				'margin-top':($(window).height()-opt.height)/2,
			});
			if(opt.transparent){
				$modelContent.css("background","none")
			}
			if(!opt.backdrop){
				$modelBox.attr("data-backdrop","static");
			}
			if(opt.fade){
				$modelBox.addClass('fade');
			}
			$modelBox.css("z-index",opt.zIndex)

			/*设置弹框的样式*/

			$("body").append($modelBox);

			if(i!=-1){
				var $iframe=$('#Iframe-'+opt.id);
				var url=opt.content.substring(i+4);
				
				$modelBox
				.on('shown.bs.modal', function(event) {
				    $iframe
				    .prop('src',url)
				    .on('load', function(event) {
				      $(this).siblings('.overlay').hide();
				      $iframe.get(0).api=$modelBox;
				      
				      opt.onLoaded();
				    });
				}).modal('show');
			}
			else{
				$modelBox.find(".modal-body").html(opt.content);
				$modelBox.on('shown.bs.modal', function(event) {
					
					opt.onLoaded();
				}).modal('show');
			}

			// 设置遮罩层透明度
			$modelBox.next(".modal-backdrop").css({
				opacity: opt.markOpacity,
				'z-index': parseInt(opt.zIndex)-1
			});

			$modelBox
			.on('hidden.bs.modal', function(event) {
			    $modelBox.remove();

			    // 如果是多弹窗显示
			    if($('.import-modal',document.body).length>0){
			    	$('body').addClass('modal-open')
			    }

			    opt.onClose();
			});
			if(document.all && document.addEventListener && !window.atob){
			    $modelBox.trigger("shown.bs.modal");
			}

			$(window).resize(function(event) {
				var differ=($(window).height()-opt.height)/2;
				$modelContent.css({
					'margin-top':differ>0?differ:0
				});
			});

			return $modelBox;
		},
		//alert提示
		alertDialog:function(options){
			/*
				@options 配置参数

				@options{
					title: 标题，字符串，默认‘提示’
					cancel：取消按钮,为true(默认)时显示，可设置为 function 回调方法
					cancelLabel: 取消按钮 文本，字符串，默认‘取消’
					cancelCss: 取消按钮 样式选择器，字符串，默认‘btn btn-normal btn-gray’
					ok: 确定按钮,为true(默认)时显示，可设置为 function 回调方法
					okLabel: 确定按钮 文本，字符串，默认‘确定’
					okCss: 确定按钮 样式选择器，字符串，默认‘btn btn-normal btn-orange margin_l15’
					content: 提示内容，字符串，默认‘’,
					onShown: 回调
				}
			*/			
			options =$.extend({},dialogDefault,options);

			var alertHtml=[];//弹窗模板
			alertHtml.push('<div class="box no-border no-shadow margin-bottom-none" style="height:'+(options.height||200)+'px">');

			var dialogId=options.id;

				//标题栏
	      		alertHtml.push('<div class="box-header with-border">');
	      			alertHtml.push('<h3 class="box-title">'+(options.title||'提示')+'</h3>');
	            alertHtml.push('</div>');
	      	

		      	//主体内容
		      	alertHtml.push('<div class="box-body v-scroll-panel" style="height:'+((options.height||200)-106)+'px">');
		      		alertHtml.push(options.content||'提示');
		      	alertHtml.push('</div>');

			if(typeof(options.ok)=='undefined'){
				options.ok=true;
			}
			if(typeof(options.cancel)=='undefined'){
				options.cancel=true;
			}

	      	if(options.cancel || options.ok){//按钮组
				alertHtml.push('<div class="box-footer text-right" style="position:absolute;bottom:0;left:0;width:100%;">');
					if(options.cancel){
						alertHtml.push('<button type="button" class="'+(options.cancelCss||'btn btn-default min-width-90px margin_l15')+'" data-role="cancel">'+(options.cancelLabel||'取消')+'</button>')
					}
					if(options.ok){
						alertHtml.push('<button type="button" class="'+(options.okCss||'btn btn-primary min-width-90px margin_l15')+'" data-role="confirm">'+(options.okLabel||'确定')+'</button>');
					}
				alertHtml.push('</div>');
	      	}



	      	alertHtml.push('</div>');

			var r=$.mydialog({
			    id : dialogId,
			    width : (options.width||300),
			    height : (options.height||200),
			    zIndex : (options.zIndex||1110),
			    content: alertHtml.join(''),
			    onLoaded:function(){
			      var $box=$('[data-id="'+dialogId+'"]');

			      $('.box-body',$box).height(
			      	this.height-$(".box-header",$box).outerHeight(true)-$(".box-footer",$box).outerHeight(true)-20
			      );

			      if(options.ok){
				      $('[data-role="confirm"]',$box).click(function(event) {
				      	if(typeof(options.ok)=='function'){
			          		options.ok.call(r);
			          	}
			          	else{
			            	$.closeDialog($box);
			            }
				      });
			      }

			      if(options.cancel){
				      $('[data-role="cancel"]',$box).click(function(event) {
				      	if(typeof(options.cancel)=='function'){
			          		options.cancel.call(r);
			          	}
			          	else{
			            	$.closeDialog($box);
			            }
				      });
			      }

			      if(typeof(options.onShown)=='function'){
		          	options.onShown.call($box);
		          }
			    }
			});
			return r;
		},
		resultDialog:function (options){
			//操作结果提示
			/*
				type:{0:黄，1:绿，2:红}
				msg:弹出信息
				timer:关闭提示的计时器
				width:宽度
				height:高度
				用法：
				$.when(
					$.resultDialog(
						{
							type:2,
							msg:'发布失败！',
							timer:1500,
							width:150,
							height:50
						}
					);
				)
                .done(function(){
                    //提示关闭后的回调方法
                });
			*/

			var dtd=$.Deferred();
			var color,icon;
			options.type || (options.type=0);
			switch(options.type){
				case 1:
					color='alert-success';
					icon='fa-check';
					break;
				case 2:
					color='alert-danger';
					icon='fa-ban';
					break;
				default:
					color='alert-warning';
					icon='fa-warning';
					break;
			}

			var pop=$.mydialog({
			  id:'resultDialog',
			  width:(options.width || 150),
			  height:(options.height || 50),
			  backdrop:false,
			  fade:true,
			  zIndex:(options.zIndex || 10),
			  transparent:true,
			  showCloseIco:false,
			  content: [
			  '<div class="alert '+color+' alert-dismissable no-margin pad15 clearfix">',
			  	'<table style="margin:0 auto;"><tr>',
			  		'<td><i class="icon fa f18 '+icon+'"></i></td>',
			  		'<td><div class="f16">'+options.msg+'</div></td>',
			  	'</tr></table>',
			  '</div>'
			  ].join('')
			});

			setTimeout(function(){
				dtd.resolve();
			    $.closeDialog(pop);
			},($.isNumeric(options.timer)?options.timer:1500));

			return dtd.promise();
		},
		closeDialog:function($modelBox){
			$modelBox.modal('hide');
		}
	});
})(jQuery);