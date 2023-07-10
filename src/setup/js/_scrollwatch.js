// import ScrollWatch from 'scrollwatch';

$.fn.scrollWatch = function(options){
    var defaults = {
      before: () => {},
      options: {
        watchOnce: false,
        watch: '#sectionHeader',
        scrollThrottle: 20,
        onElementInView: function() {
            $(".breadcrumb").removeClass("fixed");
            $(".nav").removeClass("fixed");
        },
        onElementOutOfView: function() { 
            $(".breadcrumb").addClass("fixed");
            $(".nav").addClass("fixed");
        }
      },
      after: () => {}
    }
    var settings = $.extend(defaults, options);
    settings.before();
    // console.log(settings.options);
    var sw = new ScrollWatch(settings.options);

    settings.after();
}