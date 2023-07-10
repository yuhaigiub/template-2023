// import { defaults } from "js-cookie";
import "../../setup/js/_scaleRoot.2";
import twbsPagination from "twbs-pagination";

$.fn.vPortal = function(options) {
    var defaults = {
        container: '',
        el: {
            parentContainer: '',
            tabContainer: '',
            resultContainer: '',
            paginationContainer: '.pagination',
            containerSuffix: ' li a',
            viewAll: '.viewAll',
            itemTotal: '#itemTotal',
            itemPerPage: '#itemPerPage',
            currentSection: '#currentSection',
            shortUri: '#shortUri'
        },
        data: {
            startPage: 1,
            totalPage: 1,
        },
        paginationOptions: {},
        before: function(){},
        after: function(){}
    }

    var settings = {
        ...defaults,
        ...options,
        el: {
            ...defaults.el,
            ...options.el
        },
        data: {
            ...defaults.data,
            ...options.data
        }
    }

    settings.el.parentContainer = settings.container + " ";

    // var settings = $.extend(defaults, options);

    settings.before();

    // var shortUri = $(settings.el.parentContainer + settings.el.shortUri).val();
    // var itemTotal = $(settings.el.parentContainer + settings.el.itemTotal).val();

    if (
        $(settings.el.parentContainer + settings.el.paginationContainer).length > 0
    ) {

        var $elPagination = $(settings.el.parentContainer + settings.el.paginationContainer);

        var params = $elPagination.attr('data-params');
        if (params == undefined) {
            params = '';
        } 

        var dataType = $elPagination.attr('data-type');
        if (dataType == undefined) {
            dataType = 'json';
        } 

        var blockName = $elPagination.attr('data-block-name');
        if (blockName == undefined) {
            blockName = '';
        } 

        var shortUrl = $elPagination.attr('data-shorturl');
        if (shortUrl == undefined) {
            shortUrl = '';
        } 

        // var params = $(settings.el.parentContainer + settings.el.paginationContainer).data('params');

        pagination(settings.el, dataType, shortUrl, blockName, params, settings.after(), settings.paginationOptions);
    }

    $("body").on("click", settings.el.parentContainer + settings.el.tabContainer + settings.el.containerSuffix, function(e) {
        e.preventDefault();

        if ($(this).attr("href") != "#") {
            window.location.href = $(this).attr("href");
        }

        $(settings.el.parentContainer + settings.el.tabContainer + settings.el.containerSuffix).removeClass('active');
        var params = $(this).data('params');
        if (params == undefined) {
            params = '';
        } 

        var dataType = $(this).data('type');
        if (dataType == undefined) {
            dataType = 'json';
        } 

        var viewAll = $(this).data('viewall');
        if (viewAll == undefined) {
            viewAll = '#';
        } 
        var blockName = $(this).data('block-name');
        var shortUrl = $(this).data('shorturl');
        
        $(this).addClass('active');
        
        loadNews(settings.el, 1, 'loadTab', dataType, shortUrl, blockName, params, function(){
            // settings.after();
            $(settings.el.parentContainer + settings.el.viewAll).attr('href', viewAll);    
        }, settings.paginationOptions);

        return false;
    });



}

var pagination = function(el, dataType, shortUrl, blockName, params, after = function(){}, paginationOptions = {}) {

    var itemTotal = $(el.parentContainer + el.itemTotal).val();
    var itemPerPage = $(el.parentContainer + el.itemPerPage).val();
    var currentSection = $(el.parentContainer + el.currentSection).val();
    var modulusPage = itemTotal % itemPerPage > 0 ? 1 : 0;

    var totalPages = parseInt(itemTotal / itemPerPage) + modulusPage;

    var searchPage = 1;

    // if ($('#resultSearch').val() == 1) {
    //     searchPage = parseInt($('#searchPage').val()) + 1;
    // }

    if (totalPages > 1) {

        $(el.parentContainer + el.paginationContainer).twbsPagination({
            startPage: searchPage,
            totalPages: totalPages,
            visiblePages: 5,
            first: '&laquo;',
            prev: '&lsaquo;',
            next: '&rsaquo;',
            last: '&raquo;',
            paginationClass: 'pagination',
            nextClass: 'next',
            prevClass: 'prev',
            lastClass: 'last',
            firstClass: 'first',
            initiateStartPageClick: false,
            onPageClick: function(event, page) {
                // pageClickedTime++;
                loadNews(el, page, 'paging', dataType, shortUrl, blockName, params, after(), paginationOptions); 

                return false;
            },
            ...paginationOptions
        });

    } else {

        $(el.parentContainer + el.paginationContainer).empty();
        $(el.parentContainer + el.paginationContainer).removeData("twbs-pagination");
        $(el.parentContainer + el.paginationContainer).unbind("page");

    }
}


var loadNews = function(
        el, page, type, dataType, shortUrl, blockName, params = "", after = function(){}, paginationOptions = {}
    ) {
        // var shortUri = $(el.parentContainer + el.shortUri).val();
        var url = shortUrl + '/' + blockName + '.' + page + '.html';
        url = url.replaceAll('///', '/');
        url = url.replaceAll('//', '/');
        url = '//' + url;


        if (params.length > 0) {
            url += params;
        }

        // console.log(el, page, type, shortUrl, blockName, params, after);
        // console.log(url);
        // var result = ``;
        // $(el.parentContainer + el.resultContainer).html(result);
        after(); 

        if (url.indexOf("undefined") < 0) {
        // if (url.indexOf("undefined") < 0 && pageClickedTime != 1) {
            $.ajax({
                url: url,
                dataType: dataType,
                success: function(result) {
    
                    // console.log(el.parentContainer + el.resultContainer);
                    // console.log(result);
    
                    $(el.parentContainer + el.resultContainer).html(result);
                    $("#wrapper").scalePlatform();  
    
                    if (type == 'loadTab') {
    
                        $(el.parentContainer + el.paginationContainer).empty();
                        $(el.parentContainer + el.paginationContainer).removeData("twbs-pagination");
                        $(el.parentContainer + el.paginationContainer).unbind("page");
    
                        if ($(el.parentContainer + el.itemTotal).val() > 0) {
                            pagination(el, dataType, shortUrl, blockName, params, after(), paginationOptions);
                        }
    
                    }

                    // console.log("scale again");
                    after();
                }
            });
        }

}