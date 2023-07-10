$.fn.activeNav = function(options) {
    var defaults = {
        el: {
            navContainer: '#topBar',
            navSuffix: ' nav ul li ul li a',
            currentNav: '#currentNav'
        },
        before: () => {},
        after: () => {}
    } 

    var settings = {
        ...defaults,
        ...options,
        el: {
            ...defaults.el,
            ...options.el
        },
    }

    settings.before();

    if ($(settings.el.navContainer).length > 0) {
        var currentNav = $(settings.el.currentNav).val();
        $(settings.el.navContainer + settings.el.navSuffix).removeClass("active");
        $(settings.el.navContainer + settings.el.navSuffix + "[data-active-path='"+currentNav+"']").addClass("active");
        $(settings.el.navContainer + settings.el.navSuffix + "[data-active-path='"+currentNav+"']").parent().addClass("active");
    }

    settings.after();
}