;(function($){
	$.config = {
	    // 路由功能开关过滤器，返回 false 表示当前点击链接不使用路由
	    routerFilter: function($link) {
	        // a.router-link 链接使用路由功能
	        if ($link.is('a.router-link')) {
	            return true;
	        }

	        return false;
	    }
	};
})(Zepto);