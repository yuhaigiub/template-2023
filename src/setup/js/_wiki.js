// import List from "list.js";

$.fn.wiki = function(options) {
    var defaults = {
        el: {
            container: 'subWiki',
            draftSearch: 'wiki_search_draft',
            search: 'wiki_search',
            filterNation: 'wiki_nation',
            filterType: 'wiki_type',
            pagination: 'wiki_pagination',
            list: 'wiki_ul',
            item: 'wiki_item',
        },
        data: {
            nation: 'data-wiki-nation',
            type: 'data-wiki-type',
            name: 'data-wiki-name',
            query: 'data-wiki-query'
        },
        pagination: true,
        itemsEachPage: function(){
            var device = {
                width: $(window).innerWidth(),
                height: $(window).innerHeight()
            };

            var isMobile = (device.width < device.height);
            
            if (isMobile) {
                return 6;
            } else {
                return 6;
            }
        },
        before: function() {},
        after: function() {},
    };
    var settings = $.extend(defaults, options);

    settings.before();

    var addonQuery = function(){
        $("." + settings.el.item).each(function(){
            var query = $(this).attr("data-wiki-query"),
                name = $(this).attr("data-wiki-name");
            $(this).attr("data-wiki-query", query + " " + removeVietnameseTones(name));
        });
    }();

    var wikiListOptions = {
        listClass: settings.el.list,
        searchClass: settings.el.search,
        page: settings.itemsEachPage(),
        valueNames: [
            {name: settings.el.item, attr: settings.data.query},
            // {name: settings.el.item, attr: settings.data.type},
            // {name: settings.el.item, attr: settings.data.name}
        ]
    }

    if (settings.pagination) {
        wikiListOptions = {
            ...wikiListOptions, 
            pagination: [{
                paginationClass: settings.el.pagination,
                innerWindow: 2,
                outerWindow: 1,
                item: "<li><span class='page'></span></li>"
            }]
        }
    }

    // console.log(wikiListOptions);

    var wikiList = new List(
        settings.el.container,
        wikiListOptions
    );
    settings.after();

    // console.log(wikiList);

    // --- 

    var curNation = "",
        curType = "",
        curName = "";

    var elSearchInput = $("."+settings.el.search);
    // var elSearchInput = $("."+settings.el.draftSearch);

    // change draft input 

    // console.log("."+settings.el.draftSearch);

    if ($("."+settings.el.draftSearch).length > 0) {
        var elDraftSearch = $("."+settings.el.draftSearch);
        elDraftSearch.on("input", function(){
            var inputDraftSearch = elDraftSearch.val();
            curName = inputDraftSearch;
            // elSearchInput.val(inputDraftSearch);
            if (curName.length > 0) {
                curNation = "";
                curType = "";
                $("."+settings.el.filterNation + " li").children('.tab__item').removeClass("active");
                $("."+settings.el.filterNation + " li").eq(0).children('.tab__item').addClass("active");
                $("."+settings.el.filterType + " li").children('.tab__item').removeClass("active");
                $("."+settings.el.filterType + " li").eq(0).children('.tab__item').addClass("active");
            }
            execFilter();
        });

        elDraftSearch.on("keydown", function(e){
            if (e.key === 13) {
                e.preventDefault();
                return false;
            }
        });
    }

    // console.log("."+settings.el.filterNation);

    if ($("."+settings.el.filterNation).length > 0) {
        var elFilterNation = $("."+settings.el.filterNation);
        elFilterNation.find(".tab__item").on("click", function(){
            var elDraftSearch = $("."+settings.el.draftSearch);
            elDraftSearch.val("");
            elDraftSearch.trigger("input");
            // console.log($(this).attr(settings.data.nation));
            var inputNation = $(this).attr(settings.data.nation);
            curNation = inputNation;
            $("."+settings.el.filterNation + " li").children('.tab__item').removeClass("active");
            $(this).addClass("active");
            execFilter();
        }); 
    }
    
    if ($("."+settings.el.filterType).length > 0) {
        var elFilterType = $("."+settings.el.filterType);
        elFilterType.find(".tab__item").on("click", function(){
            var elDraftSearch = $("."+settings.el.draftSearch);
            elDraftSearch.val("");
            elDraftSearch.trigger("input");
            // console.log($(this).attr(settings.data.type));
            var inputType = $(this).attr(settings.data.type);
            curType = inputType;
            $("."+settings.el.filterType + " li").children('.tab__item').removeClass("active");
            $(this).addClass("active");
            execFilter();
        }); 
    }

    var execFilter = function() {

        console.log(curNation, curType, curName);

        var query = "";

        if (curName.length > 0) {
            query = curName;
        } else if (curNation.length > 0 && curType.length > 0) {
            query = curNation + " " + curType;
        } else if (curNation.length > 0) {
            query = curNation;
        } else {
            query = curType;
        }

        // console.log(query);

        elSearchInput.val(query);
        wikiList.search(query);
    }

    // if ($("." + settings.el.pagination + " .page").length > 0) {
    //     $( "." + settings.el.pagination ).on("click", " .page", function(){
    //         setTimeout(function(){
    //             settings.after();
    //         }, 0)
    //     })
    // }

    wikiList.on("updated", function(){
        settings.after();
    })

    function removeVietnameseTones(str) {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
        str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
        str = str.replace(/đ/g,"d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
        // Remove extra spaces
        // Bỏ các khoảng trắng liền nhau
        str = str.replace(/ + /g," ");
        str = str.trim();
        // Remove punctuations
        // Bỏ dấu câu, kí tự đặc biệt
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
        return str;
    }
    
}