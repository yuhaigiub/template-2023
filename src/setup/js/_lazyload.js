import "lazysizes";

$.fn.initLazyload = function(options){
    var defaults = {
      before: () => {},
      after: () => {}
    }
    var settings = $.extend(defaults, options);
    settings.before();


    settings.after();
}