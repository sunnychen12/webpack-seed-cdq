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
    typeof(options.cache)=='boolean' || (options.cache=false);
    //options.timeout || (options.timeout=1000*30);//默认异步请求超时时间为 30s

    //如果是首页接口“1、获取学员课程选课信息”，就不用增加参数“domainName”
    if(options.url!='/api/stud/study/moodleGetUserCourseInfo'){
      var cacheUserCourseInfo=this.cacheUserCourseInfo.get();
      if(cacheUserCourseInfo && options.data){
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

  //页面模板缓存
  pageTempCache:{
    key : 'pageTempCache',
    clear: function(){
      sessionStorage.removeItem(this.key);
    },
    set : function(temp){
      sessionStorage.setItem( this.key, temp )
    },
    //返回模板文件的html代码
    get : function(){
      var _self=this;
      var def=$.Deferred();
      var result=sessionStorage.getItem(this.key)
      
      if(result){
        def.resolve(result);
      }
      else{
        commomLab.ajaxProcess({
          url: 'page-template.html',
          dataType:'html'
        })
        .done(function(res){
          _self.set(res);

          def.resolve(res);
        })
        .fail(function(){
          def.reject();
        });
      }

      return def.promise();
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

//append
;(function () {
  commomLab.pageTempCache.clear();

  $.showIndicator();
  commomLab.pageTempCache.get()
  .done(function(ptpl){
    var $pageCache=$('body').children('.page-cache');
    if($pageCache.length==0){
      $('body').append('<div id="page-cache" class="page-cache"></div>');
      $pageCache=$('#page-cache');
    }
    
    $(document)
    .on('pageAnimationStart', function(event, id, page) {
      //console.log('pageAnimationStart:',event, id, page)
    })
    .on('pageAnimationEnd', function(event, id, page) {
      
    })
    .on('beforePageSwitch', function(event, id, page) {
      //console.log('beforePageSwitch:',event, id, page)
    })
    //首页
    .on("pageInit", "#page-index", function(event, id, page) {
      var username = commomLab.getQueryParam('username'); // 学号
      username || (username = '');
      var courseCode = commomLab.getQueryParam('courseCode'); //课程号
      courseCode || (courseCode = '');
      var realname = commomLab.getQueryParam('realname'); //真实姓名
      realname || (realname = '');

      $pageCache.html($('.page-current .page-app').html()).show();

      //清除缓存
      //sessionStorage.clear();
      var app = new Vue({
          el: page.children('.page-app')[0],
          template:$(ptpl).find('[data-id="'+id+'"]').html(),
          data: {
              success: true,
              msg: '',
              //isShowMore:false,
              isloaded: false, //是否所有数据都已经加载完毕
              hasFinItem: false,
              userCourseInfo: false,
              actCompleteStatus: {},
              sectionList: [],
              newSectionList: []
          },
          created: function() {
              if (!username && !courseCode && !realname) {
                  this.success = false;
                  this.msg = '参数出错';
                  this.showHtml();
                  this.$nextTick(function() {
                      //删除“找老师”的按钮，因为传的参数不合法
                      $('[data-id="call-box"]').remove();
                  });
              } else {
                  this.getData();
              }
          },
          computed: {
              courseProgress: function() {
                  if (this.userCourseInfo && this.userCourseInfo.choose && this.userCourseInfo.choose.progress) {
                      return parseFloat(this.userCourseInfo.choose.progress + '').toFixed(2);
                  } else {
                      return 0;
                  }
              },
              //上次学到
              latestStudy: function() {
                  var vm = this;
                  var result = false;
                  if (this.actCompleteStatus && this.actCompleteStatus.statuses && this.actCompleteStatus.statuses.length > 0) {
                      var actStatus = this.actCompleteStatus.statuses;
                      var targetItem = false,
                          targetItemName = '';
                      for (var i = 0; i < actStatus.length; i++) {
                          if (i == 0) {
                              targetItem = actStatus[0];
                          } else if (actStatus[i].timecompleted > 0 && actStatus[i].timecompleted > actStatus[i - 1].timecompleted) {
                              targetItem = actStatus[i];
                          }
                      };
                      if (targetItem && this.sectionList.length > 0) {
                          $.each(vm.sectionList, function(i, section) {
                              if (section.modulesList && section.modulesList.length > 0) {
                                  $.each(section.modulesList, function(j, modules) {
                                      if (!targetItem.cmid) {
                                          result = modules;
                                          return false;
                                      } else if (targetItem.cmid == modules.id) {
                                          targetItemName = modules.name;
                                          result = modules;
                                          return false;
                                      }
                                  });
                                  if (result) {
                                      return false;
                                  }
                              }
                          });
                      }
                  }
                  return result;
              }
          },
          methods: {
              //结束异步，关键加载特殊，显示页面内容
              showHtml: function() {
                  var vm = this;
                  vm.isloaded = true;
                  $.hideIndicator();
              },
              getData: function() {
                  var vm = this;
                  this.getUserCourseInfo(username, courseCode, realname).done(function(resData) {
                      document.title = resData.course.courseName;
                      $.showIndicator();
                      //获取课程章节活动信息
                      var def = $.Deferred();
                      commomLab.ajaxProcess({
                          url: '/api/stud/study/moodleGetCourseContents',
                          data: {
                              courseId: resData.course.courseId,
                              token: resData.token
                          },
                          success: function(res2) {
                              if (commomLab.checkAPIResult(res2)) {
                                  if (res2.data.sectionList && res2.data.sectionList.length > 0) {
                                      vm.userCourseInfo = resData;
                                      vm.sectionList = res2.data.sectionList;
                                      //转换数据格式
                                      vm.convertData(res2.data.sectionList);
                                      def.resolve();
                                  } else {
                                      vm.success = false;
                                      vm.msg = '暂无数据';
                                      vm.showHtml();
                                  }
                              } else {
                                  vm.success = false;
                                  vm.msg = '数据查询出错';
                                  vm.showHtml();
                              }
                          },
                          error: function(XMLHttpRequest, textStatus, errorThrown) {
                              vm.success = false;
                              vm.msg = '数据查询出错';
                              vm.showHtml();
                          }
                      });
                      //获取学员完成活动的状态
                      def.done(function() {
                          $.showIndicator();
                          vm.getActivitiesCompletionStatus(vm.userCourseInfo.user.id, vm.userCourseInfo.course.courseId, resData.token).done(function(res3) {
                              if (commomLab.checkAPIResult(res3) && res3.data.statuses && res3.data.statuses.length > 0) {
                                  vm.actCompleteStatus = res3.data;

                                  function searchState(cmid) {
                                      var r = false;
                                      $.each(res3.data.statuses, function(index, item) {
                                          if (cmid == item.cmid) {
                                              r = item.state;
                                              return false;
                                          }
                                      });
                                      return r;
                                  }
                                  $.each(vm.newSectionList, function(r, newSection) {
                                      $.each(newSection.group, function(n, section) {
                                          $.each(section.modulesList, function(m, module) {
                                              var state = searchState(module.id);
                                              if (state) {
                                                  vm.$set(section.modulesList[m], 'state', state)
                                                  if (!vm.hasFinItem && state == 1) {
                                                      vm.hasFinItem = true;
                                                  }
                                              }
                                          });
                                      });
                                  });
                              }
                          }).always(function() {
                              vm.showHtml();
                              vm.$nextTick(function() {
                                  var $content = $('.content');
                                  commomLab.moveTop($content);
                                  //滚动定位到之前点击的活动
                                  var pos = commomLab.cacheIndexScrollPos.get();
                                  if (pos) {
                                      $content.scrollTop(pos);
                                      commomLab.cacheIndexScrollPos.clear();
                                  }
                                  //banner背景预加载
                                  var $courseBanner = $('.course-banner'),
                                      bgUrl = $courseBanner.attr('data-bg');
                                  if (bgUrl) {
                                      var img = new Image();
                                      img.src = bgUrl;
                                      img.onload = function() {
                                          $courseBanner.empty();
                                      }
                                  } else {
                                      $courseBanner.empty();
                                  }
                              });
                          });
                      });
                  })
              },
              convertData: function(sectionList) {
                  var vm = this;
                  var rootItem = [];
                  if (sectionList && sectionList.length > 0) {
                      //查找根元素
                      for (var index in sectionList) {
                          if (sectionList[index].parent == '') {
                              rootItem.push(sectionList[index]);
                          }
                      }
                      //查找子元素
                      if (rootItem.length > 0) {
                          for (var n in rootItem) {
                              rootItem[n]['group'] = [];
                              for (var m in sectionList) {
                                  if (sectionList[m].parent != '' && rootItem[n].id == sectionList[m].parent) {
                                      rootItem[n]['group'].push(sectionList[m]);
                                  }
                              }
                          }
                      }
                      //console.log(rootItem);
                  }
                  vm.newSectionList = rootItem;
              },
              //获取学员课程选课信息
              getUserCourseInfo: function(username, courseCode, realname) {
                  var vm = this,
                      def = $.Deferred();
                  var cacheUserCourseInfo = commomLab.cacheUserCourseInfo.get();

                  function getDataFromServer() {
                      $.showIndicator();
                      commomLab.ajaxProcess({
                          url: '/api/stud/study/moodleGetUserCourseInfo',
                          data: {
                              username: username,
                              courseCode: courseCode,
                              realname: realname
                          }
                      }).done(function(res) {
                          if (commomLab.checkAPIResult(res) && res.data.course && res.data.course.courseId) {
                              var resData = res.data;
                              resData['realname'] = realname;
                              //缓存第一个接口的数据
                              commomLab.cacheUserCourseInfo.set(resData);
                              $.hideIndicator();
                              /////////
                              def.resolve(resData);
                          } else {
                              vm.success = false;
                              vm.msg = '数据查询出错';
                              vm.showHtml();
                          }
                      }).fail(function(XMLHttpRequest, textStatus, errorThrown) {
                          vm.success = false;
                          vm.msg = '数据查询出错';
                          vm.showHtml();
                      });
                  }
                  //未缓存过
                  if (!cacheUserCourseInfo) {
                      getDataFromServer();
                  }
                  //已缓存过
                  else {
                      //强制重新请求接口
                      if (sessionStorage.getItem('redirecte')) {
                          //删除，以免重新请求接口
                          sessionStorage.removeItem('redirecte');
                          getDataFromServer();
                      }
                      //直接获取缓存的数据
                      else {
                          setTimeout(function() {
                              def.resolve(cacheUserCourseInfo);
                          }, 0);
                      }
                  }
                  return def.promise();
              },
              //获取学员完成活动的状态
              getActivitiesCompletionStatus: function(userid, courseid, token) {
                  return commomLab.ajaxProcess({
                      url: '/api/stud/study/moodleGetActivitiesCompletionStatus',
                      data: {
                          userid: userid,
                          courseid: courseid,
                          token: token
                      }
                  });
              },
              //设置不同活动类型的标签颜色
              getLableColor: function(modname) {
                  var result = '';
                  switch (modname) {
                      case 'url': //视频
                          result = '#4c8ee0';
                          break;
                      case 'page': //网页
                          result = '#ff8126';
                          break;
                      case 'quiz': //测验
                          result = '#778ba5';
                          break;
                      case 'resource': //资源说明
                          result = '#14a956';
                          break;
                      case 'forum': //讨论
                          result = '#655de2';
                          break;
                      default:
                          '#4c8ee0'
                          break;
                  }
                  return result;
              },
              //根据活动 module 获取活动名称 和 跳转地址
              getModuleInfoAbout: function(module) {
                  var result = {
                      name: '',
                      jumpUrl: ''
                  }
                  switch (module.modname) {
                      case 'url':
                          result.name = '视频';
                          result.jumpUrl = 'course-study-of-video.html?videourl=' + (
                              (module.contents && module.contents.length > 0 && module.contents[0].fileurl) ? module.contents[0].fileurl : '') + '&' + ('videoId=' + module.id) + '&' + ('pagetitle=' + module.name) + '&' + ('state=' + module.state) + '&' + ('instance=' + module.instance);
                          break;
                      case 'page':
                          result.name = '网页';
                          var mCnts = module.contents;
                          if (mCnts && mCnts.length > 0) {
                              var targetModule = false;
                              if (mCnts.length == 1) {
                                  targetModule = mCnts[0];
                              } else {
                                  for (var i in mCnts) {
                                      if (/\.html/i.test(mCnts[i].filename)) {
                                          targetModule = mCnts[i];
                                          break;
                                      }
                                  }
                                  if (!targetModule) {
                                      targetModule = mCnts[0];
                                  }
                              }
                              result.jumpUrl = 'course-study-of-iframe.html?url=' + (targetModule.fileurl ? targetModule.fileurl : '') + '&' + ('pagetitle=' + module.name) + '&' + ('pageid=' + module.id) + '&' + 'filename=' + (targetModule.filename ? targetModule.filename : '') + '&' + ('state=' + module.state) + '&' + ('instance=' + module.instance);
                          }
                          break;
                      case 'quiz':
                          result.name = '测验';
                          /*
                  result.jumpUrl='course-study-of-practice.html?'+
                    ('pagetitle='+module.name)+
                    '&'+
                    ('quizid='+module.instance);
                    */
                          result.jumpUrl = 'course-study-of-practice-records-list.html?' + ('pagetitle=' + module.name) + '&' + ('quizid=' + module.instance);
                          break;
                      case 'resource':
                          result.name = '资源说明';
                          //result.jumpUrl='course-study-of-reading.html';
                          if (module.contents && module.contents.length > 0 && module.contents[0].fileurl) {
                              result.jumpUrl = module.contents[0].fileurl + '&token=' + commomLab.cacheUserCourseInfo.get().token
                          }
                          break;
                      case 'forum':
                          result.name = '讨论';
                          result.jumpUrl = 'course-discussion-index.html?' + ('pagetitle=' + module.name) + '&' + ('forumid=' + module.instance);
                          break;
                      default:
                          break;
                  }
                  return result;
              },
              //获取用户测验做题列表
              getUserExamList: function(quizid) {
                  return commomLab.ajaxProcess({
                      url: '/api/stud/study/moodleGetUserAttempts',
                      data: {
                          quizid: quizid,
                          token: commomLab.cacheUserCourseInfo.get().token
                      }
                  });
              },
              //判断是否可以进入“测验”活动
              checkQuizAccess: function(quizid) {
                  return commomLab.ajaxProcess({
                      url: '/api/stud/study/moodleGetQuizAccessInformation',
                      data: {
                          quizid: quizid,
                          token: commomLab.cacheUserCourseInfo.get().token
                      }
                  });
              },
              getModuleHref: function(module, event) {
                  var vm = this;
                  //标签类型，不对处理
                  if (module.modname == 'label') {
                      return
                  }
                  //视频 / 测验 活动
                  else if (module.modname == 'url' || module.modname == 'quiz') {
                      if (module.contents) {
                          if (module.contents.length == 0 || !module.contents[0].fileurl || module.contents[0].fileurl.length == 0) {
                              commomLab.myToast({
                                  msg: '资源地址为空'
                              });
                              return;
                          }
                      } else if (module.availabilityinfo) {
                          //视频
                          if (module.modname == 'url') {
                              $.alert('专题内视频需按顺序进行学习，请先观看上一视频。');
                          }
                          //测验
                          else if (module.modname == 'quiz') {
                              $.alert('请先观看完成本专题内的视频，再进行专题测验。');
                          }
                          return;
                      }
                  }
                  //缓存点击访问的活动的ID字段值
                  commomLab.cacheIndexScrollPos.set($('.content').scrollTop());
                  var jumpUrl = this.getModuleInfoAbout(module).jumpUrl;
                  //测验 类型活动
                  if (module.modname == 'quiz') {
                      $.showIndicator();
                      this.checkQuizAccess(module.instance).done(function(res) {
                          if (commomLab.checkAPIResult(res) && res.data.canattempt) {

                              $.router.load(jumpUrl, true);
                          } else {
                              commomLab.myToast({
                                  msg: res.data.message
                              })
                          }
                      }).fail(function() {
                          commomLab.myToast({
                              msg: '数据查询出错'
                          })
                      }).always(function() {
                          $.hideIndicator();
                      });
                  } else {
                      if (module.modname == 'resource') {
                          //ios直接访问文件资源链接就可以实现下载
                          if ($.device.ios && $.device.webView) {
                              location.href = jumpUrl;
                          } else {
                              window.open(jumpUrl);
                          }
                      } else {
                          $.router.load(jumpUrl, true);
                      }
                  }
              },
              //banner图片格式化
              imgUrlFormat: function(url) {
                  var result = '';
                  var w = document.body.clientWidth, //图片宽度
                      h = 7 * parseFloat($('html').css('font-size')); //图片高度 7rem
                  //?x-oss-process=image/crop,w_200,g_center
                  if (url) {
                      if (url.indexOf('http://eefile.') == -1) {
                          result = url;
                      } else {
                          if (url.indexOf('?x-oss-process=image') == -1) {
                              result = url + '?x-oss-process=image/resize,m_fixed,w_' + w + ',h_' + h + '/sharpen,100/auto-orient,1'
                          } else {
                              result = url + '/' + url.indexOf('auto-orient,1') == -1 ? '/resize,m_fixed,w_{0},h_{1}/sharpen,100/auto-orient,1'.format(w, h) : '/resize,m_fixed,w_{0},h_{1}/sharpen,100'.format(w, h);
                          }
                      }
                  }
                  return result;
              },
              slidePanel: function(event) {
                  var that = event.currentTarget;
                  var $slidePanel = $(that).next();
                  var $p = $(that).parent();
                  if (!$p.hasClass('expand-box')) {
                      $p.addClass('expand-box');
                  } else {
                      $p.removeClass('expand-box');
                  }
                  $slidePanel.slideToggle();
              }
          },
          watch:{
            isloaded:function(newVal){
              if(newVal){
                $pageCache.hide().empty();
              }
            }
          }
      });
    })
    //考试活动-列表页面
    .on("pageInit", "#page-course-study-of-practice-records-list", function(event, id, page) {
      //测验ID
      var quizid = commomLab.getQueryParam('quizid');
      quizid || (quizid = '');
      var pagetitle = commomLab.getQueryParam('pagetitle');
      pagetitle || (pagetitle = '');

      $pageCache.html($('.page-current .page-app').html()).show();

      //获取缓存数据
      var cacheUserCourseInfo = commomLab.cacheUserCourseInfo.get();
      var app = new Vue({
          el: page.children('.page-app')[0],
          template:$(ptpl).find('[data-id="'+id+'"]').html(),
          data: {
              success: true,
              empty: false,
              msg: '',
              isloaded: false, //是否所有数据都已经加载完毕
              permitTestTimes: false,
              testScore: '', //测试得分
              attemptLen: 0,
              gradeMax: '--', //表头 成绩
              graderaw: '--', //成绩得分
              attemptData: false, //测验记录列表
              notFinAttempt: false, //最近未完成的测验对象
              accessrules: false, //规则描述
              preventaccessreasons: false //访问限制描述
          },
          created: function() {
              var vm = this;
              $.showIndicator();
              this.getUserAttempts().done(function(res) {
                  if (commomLab.checkAPIResult(res)) {
                      var resData = res.data;
                      if (resData.attempts) {
                          if (resData.attempts.length > 0) {
                              //初始化成绩得分
                              for (var item in resData.attempts) {
                                  resData.attempts[item].itemGrade = '--';
                              }
                              vm.attemptData = resData;
                              vm.attemptLen = resData.attempts.length;
                              //查找是否存在未结束的测验
                              if (resData.attempts.length > 0) {
                                  var attempts = resData.attempts;
                                  for (var i in attempts) {
                                      if (attempts[i].state == 'inprogress') {
                                          vm.notFinAttempt = attempts[i];
                                          break;
                                      }
                                  }
                              }
                              //统计测验得分
                              //vm.getTestScore(resData.attempts[0]);
                              vm.getGradeMax();
                          } else {
                              vm.empty = true;
                              vm.showHtml();
                          }
                      } else if (resData.message) {
                          vm.success = false;
                          vm.msg = resData.message;
                          vm.showHtml();
                      } else {
                          vm.showHtml();
                      }
                  } else {
                      vm.success = false;
                      vm.msg = '数据查询出错';
                      vm.showHtml();
                  }
              }).fail(function(XMLHttpRequest, textStatus, errorThrown) {
                  vm.success = false;
                  vm.msg = '数据查询出错';
                  vm.showHtml();
              }).always(function() {
                  vm.checkQuizAccess();
              })
          },
          methods: {
              //结束异步，关键加载特殊，显示页面内容
              showHtml: function() {
                  var vm = this;
                  vm.isloaded = true;
                  $.hideIndicator();
              },
              hideHtml: function() {
                  var vm = this;
                  vm.isloaded = false;
                  $.showIndicator();
              },
              //开始测验考试
              startAttempt: function() {
                  var vm = this;
                  //存在未完成的测验
                  if (vm.notFinAttempt) {
                      vm.jumpController(vm.notFinAttempt);
                  } else {
                      $.showIndicator();
                      commomLab.ajaxProcess({
                          url: '/api/stud/study/moodleStartAttempt',
                          data: {
                              quizid: quizid,
                              token: cacheUserCourseInfo.token
                          }
                      }).done(function(resInfo) {
                          if (commomLab.checkAPIResult(resInfo)) {
                              var resData = resInfo.data;
                              //数据提交异常
                              if (resData.errorcode) {
                                  commomLab.myToast({
                                      msg: resData.message
                                  });
                                  if (resData.errorcode == 'attemptstillinprogress') {
                                      $('.content').scrollTop(10000);
                                  }
                              } else if (resData.attempt) {
                                  //缓存状态
                                  /*
                                      commomLab.cacheAttemptState.set({
                                          qid : quizid,
                                          aid : resData.attempt.id
                                      },'inprogress');
                                      */
                                  location.href = 'course-study-of-practice.html?' + ('pagetitle=' + pagetitle) + '&' + ('quizid=' + quizid) + '&' + ('attemptid=' + resData.attempt.id);
                              } else {
                                  commomLab.myToast({
                                      msg: '数据查询出错'
                                  });
                              }
                          } else {
                              commomLab.myToast({
                                  msg: '数据查询出错'
                              });
                          }
                      }).fail(function() {
                          commomLab.myToast({
                              msg: '数据查询出错'
                          });
                      }).always(function() {
                          $.hideIndicator();
                      });
                  }
              },
              //获取用户测验做题列表
              getUserAttempts: function() {
                  return commomLab.ajaxProcess({
                      url: '/api/stud/study/moodleGetUserAttempts',
                      data: {
                          quizid: quizid,
                          userid: cacheUserCourseInfo.user.id,
                          status: 'all',
                          token: cacheUserCourseInfo.token
                      }
                  })
              },
              //判断是否可以进入“测验”活动
              checkQuizAccess: function() {
                  var vm = this;
                  vm.hideHtml();
                  commomLab.ajaxProcess({
                      url: '/api/stud/study/moodleGetQuizAccessInformation',
                      data: {
                          quizid: quizid,
                          token: commomLab.cacheUserCourseInfo.get().token
                      }
                  }).done(function(res) {
                      if (commomLab.checkAPIResult(res)) {
                          var resData = res.data;
                          //是否有 访问限制
                          if (resData.preventaccessreasons && resData.preventaccessreasons.length > 0) {
                              vm.preventaccessreasons = resData.preventaccessreasons;
                          }
                          //允许测试次数
                          var rules = resData.accessrules;
                          if (rules && rules.length > 0) {
                              vm.accessrules = rules;
                              for (var i in rules) {
                                  if (rules[i].indexOf('允许试答次数') != -1) {
                                      var splitRule = rules[i].split('：');
                                      if (splitRule.length > 0) {
                                          vm.permitTestTimes = rules[i].split('：')[1];
                                      } else {
                                          vm.permitTestTimes = -1; //无限次
                                      }
                                      break;
                                  }
                              }
                              if (vm.permitTestTimes === false) {
                                  vm.permitTestTimes = -1; //无限次
                              }
                          } else {
                              vm.permitTestTimes = -1; //无限次
                          }
                      }
                  }).always(function() {
                      vm.showHtml();
                  })
              },
              //统计测验得分
              getTestScore: function(attempt) {
                  var vm = this;
                  //回顾试卷
                  commomLab.ajaxProcess({
                      url: '/api/stud/study/moodleGetAttemptReview',
                      data: {
                          attemptid: attempt.id,
                          token: cacheUserCourseInfo.token
                      }
                  }).done(function(res) {
                      if (commomLab.checkAPIResult(res) && res.data.questions && res.data.questions.length > 0) {
                          var questions = res.data.questions;
                          for (var i in questions) {
                              if (questions[i].type != 'description') {
                                  vm.testScore = vm.testScore - 0 + questions[i].maxmark;
                              }
                          }
                      }
                  })
              },
              //获取具体活动的 表头成绩
              getGradeMax: function() {
                  var vm = this;
                  $.showIndicator();
                  //获取成绩列表
                  commomLab.ajaxProcess({
                      url: '/api/stud/study/moodleGetGradeItems',
                      data: {
                          userid: cacheUserCourseInfo.user.id,
                          courseid: cacheUserCourseInfo.course.courseId,
                          token: cacheUserCourseInfo.token
                      }
                  }).done(function(res) {
                      if (commomLab.checkAPIResult(res) && res.data.usergrades && res.data.usergrades.length > 0) {
                          var usergrades = res.data.usergrades;
                          var gradeitems = usergrades[0].gradeitems;
                          if (gradeitems && gradeitems.length > 0) {
                              for (var i in gradeitems) {
                                  if (gradeitems[i].iteminstance == quizid) {
                                      vm.gradeMax = gradeitems[i].grademax;
                                      if (gradeitems[i].graderaw === 0 || gradeitems[i].graderaw > 0) {
                                          vm.graderaw = gradeitems[i].graderaw;
                                      }
                                      var attempts = vm.attemptData.attempts
                                      for (var j in attempts) {
                                          if (attempts[j].sumgrades === 0 || attempts[j].sumgrades > 0) {
                                              attempts[j].itemGrade = attempts[j].sumgrades / 100 * gradeitems[i].grademax;
                                          }
                                      }
                                      break;
                                  }
                              }
                          }
                      }
                  }).always(function() {
                      vm.showHtml();
                  })
              },
              //获取状态名
              getStateName: function(state) {
                  var vm = this;
                  var result = '';
                  switch (state) {
                      case 'inprogress':
                          result = '进行中';
                          break;
                      case 'overdue':
                          result = '未完成';
                          break;
                      case 'finished':
                          result = '完成';
                          break;
                      case 'abandoned':
                          result = '放弃';
                          break;
                      default:
                          break;
                  }
                  return result;
              },
              leavePage: function() {
                  location.href = 'index.html?' + ('username=' + cacheUserCourseInfo.user.username) + '&' + ('courseCode=' + cacheUserCourseInfo.course.courseCode) + '&' + ('realname=' + cacheUserCourseInfo.realname);
              },
              //模式化日期
              formatDate: function(timemap) {
                  var date = new Date(timemap);

                  function formatDigit(d) {
                      return (d >= 10) ? d : ('0' + d);
                  }
                  return (date.getFullYear() + '-' + formatDigit((date.getMonth() + 1)) + '-' + formatDigit(date.getDate()) + ' ' + formatDigit(date.getHours()) + ':' + formatDigit(date.getMinutes()))
              },
              //查看记录详情
              jumpController: function(attempt) {
                  /*
                    inprogress 进行中  可继续答题，
                    overdue 未完成  逾期未提交， 
                    finished 完成  提交了测验     
                    abandoned 放弃  作废
                  */
                  switch (attempt.state) {
                      case 'inprogress': //进行中
                      case 'finished': //完成
                          //缓存状态
                          /*
                              commomLab.cacheAttemptState.set({
                                  qid : quizid,
                                  aid : attempt.id
                              },attempt.state);
                              */
                          //查看解析
                          location.href = 'course-study-of-practice.html?' + ('pagetitle=' + pagetitle) + '&' + ('quizid=' + quizid) + '&' + ('attemptid=' + attempt.id);
                          break;
                      case 'overdue': //未完成
                          break;
                      case 'abandoned': //放弃
                          break;
                      default:
                          break;
                  }
              }
          },
          watch:{
            isloaded:function(newVal){
              if(newVal){
                $pageCache.hide().empty();
              }
            }
          }
      });
    })

    .on('pageInit', '#page-course-study-of-iframe', function(event, id, page) {
      page.children('.page-app').html(
        $(ptpl).find('[data-id="'+id+'"] .page-app').html()
      );



      var token=commomLab.cacheUserCourseInfo.get().token;

      document.title=commomLab.getQueryParam('pagetitle');

      var url=commomLab.getQueryParam('url');//跳转url
      //document.getElementById('ifrm').src=url+'&token='+token;
        url=url+'&token='+token;

      var pageid=commomLab.getQueryParam('pageid');//网页活动ID
        pageid || (pageid=0);

      //文件名，用以鉴别不同的资源
      var filename=commomLab.getQueryParam('filename');
        filename || (filename='');

      var instance=commomLab.getQueryParam('instance');//instance
        instance || (instance='');

      var state=commomLab.getQueryParam('state');//活动 状态
        state || (state='');

      var def=$.Deferred();

      //如果是图片
      if(/\.(jpg|jpeg|png|gif|bmp)/i.test(filename)){
        $(frames['ifrm'].frameElement).remove();
        $('.content').html('<img src="'+url+'">');
        def.resolve();
      }
      else{
        $.showIndicator();
        //解析html代码
        commomLab.ajaxProcess({
          url: '/api/stud/study/html2Str',
          data: {
            htmlUrl: url
          }
        })
        .done(function(res){
          if(commomLab.checkAPIResult(res)){
            var doc=frames['ifrm'].frameElement.contentWindow.document;
            doc.body.innerHTML=res.data.htmlContent;

            doc.head.innerHTML='\
                <meta charset="utf-8">\
                <meta http-equiv="X-UA-Compatible" content="IE=edge">\
                <title></title>\
                <meta name="viewport" content="initial-scale=1, maximum-scale=1">\
                <style type="text/css">*{box-sizing: border-box;}</style>\
              ';
            def.resolve();
          }
          else{
            commomLab.myToast({
                    msg:'资源加载出错'
                });
          }
        })
        .fail(function(){
          commomLab.myToast({
                  msg:'资源加载出错'
              });
        })
        .always(function(){
          $pageCache.hide().empty();
          $.hideIndicator();
        })
      }

      //ended
      def.done(function(){
        //如果该活动已是完成状态，不需要再请求该接口
        if(state!=1){
          commomLab.ajaxProcess({
            url: '/api/stud/study/moodleViewPage',
            data: {
              cmid: pageid,
              pageid: instance,
              completed: 1,
              token: token
            }
          });
        }
      })
    })


    $.init();

  })
  .fail(function(){
    commomLab.myToast({msg:'页面模板获取失败'});
  })
  .always(function(){
    $.hideIndicator();
  });
})();