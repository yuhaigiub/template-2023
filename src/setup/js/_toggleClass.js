$.fn.toggleClassname = function(options){
    var defaults = {
      obj: $(this),
      toggle: [
          {
              el: $(this).parent(),
              className: 'active'
          }
      ],
      before: () => {},
      after: () => {}
    }
    var settings = $.extend(defaults, options);
  
    settings.obj.on("click", (e) => {
        console.log("clicked");
        e.preventDefault();
        settings.before();
        settings.toggle.forEach(function(item){
            if (item.el.hasClass(item.className)) {
                item.el.removeClass(item.className);
            } else {
                item.el.addClass(item.className);
            }
        });
        settings.after();
    });
}