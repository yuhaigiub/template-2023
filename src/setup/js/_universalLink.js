$.fn.universalLink = function(options) {
    var defaults = {
        dataAppstore: "data-appstore",
        dataAndroid: "data-ggplay"
    }
    var settings = $.extend(defaults, options);

    var isIOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ? true : false );
    var isANDROID = navigator.userAgent.toLowerCase().indexOf("android") > -1; 
    
    // console.log(navigator.userAgent.toLowerCase());
    // console.log(isIOS, isANDROID);

    var universalLink = "#";

    if (isIOS) {
        universalLink = $(this).attr(settings.dataAppstore);
    } else if (isANDROID) {
        universalLink = $(this).attr(settings.dataAndroid);
    }

    $(this).attr("href", universalLink);

}