import md5 from "md5";

let dndpDefault = {
    // url: './assets/test-api/getdata.html',
    // url2: './assets/test-api/savedata.html',
    url: "",
    debug: false,
    directory: "assets/images/gifts",
    items: {
        A: "1", B: "2", C: "3", D: "4", E: "5", F: "6", G: "7", H: "8", I: "9", length: 9, type: "png",
    },
    names: ["500 Xu Khóa", "4000 Vàng", "Áo thun Gunny Origin", "Tai nghe Bluetooth AirPods 3 Apple", "Điện thoại iPhone 13 128GB", "Đồng hồ Apple Watch Series 7 LTE 41mm", "Gà Bông Gunny Origin", "5 viên Đá Cường Hóa", "1 Bùa Ma Thuật",],
    el: {
        cp: "",
        returnPrize: "#returnPrize",
        action: ".pm__rut",
        reward: ".reward",
        inform: "#popup_inform",
        informContent: ".pm__inform-text",
        rewardContainer: "#rewardContainer",
    },
    variable: {
        spinable: true, urlGet: "", urlSave: "", methodGet: "", methodSave: ""
    },
    callback: function () { },
};

const dndPromotion = function (options) {
    let defaults = dndpDefault;
    var settings = $.extend(defaults, options);

    let _CheckSO = "";
    let Key128Bytesold = "";
    var DataKey128 = "";
    let cp = sPoint;

    const closeAllPopup = () => {
        $(".popup").removeClass("active");
        $("html").removeClass("popup-opened");
    };

    const activePopup = (id) => {
        $(id).addClass("active");
        $("html").addClass("popup-opened");
    };

    const informError = (content) => {
        $(settings.el.informContent).html(content);
        activePopup(settings.el.inform);
    };

    const nameToSrc = (name) => {
        return `//img.zing.vn/products/codm/landing/2023-quay-so-1/prod/${settings.directory}/${name}.${settings.items.type}`;
        // return `${settings.directory}/${name}.${settings.items.type}`;
    };

    const getAwardID = (code) => {
        return settings.items[code];
    };

    const makePrize = (response) => {
        // console.log(response);

        var Key128 = response.split("=");
        var _Data = Key128[1];
        DataKey128 += _Data;
        var index = parseInt(_Data.charAt(127));
        var count_start = _Data.substr(index + 39, 4);
        var AC = _Data.substr(index + 32, 1);

        var _Code = _Data.substr(index + 33, 6);
        var _Encry1 = _Data.substr(index, 32);
        var _Encry2 = md5(_Encry1 + _Data.substr(index + 32, 1));

        return {
            characterImg: AC,
            _Code: _Code,
            indexImg: getAwardID(AC),
            _Encry1: _Encry1,
            _Encry2: _Encry2,
            _Data: _Data,
            data: "Key32Bytes1=" + _Encry1 + "&Key32Bytes2=" + _Encry2,
        };
    };

    const handleData = ($this, responseData) => {
        // console.log(responseData);
        var listPrize = [];
        var data = [];

        var totalTurn = $this.hasClass("rut-1") ? 1 : 5;
        var type = $this.data("value");
        var $chest = $this.prev();
        var $item = $this.parent();

        if (totalTurn === 1) {
            var prize = makePrize(responseData);
            listPrize.push(prize);
            data = prize.data;
        } else if (totalTurn === 5) {
            for (var i = 0; i < responseData.length; i++) {
                var prize = makePrize(responseData[i]);
                listPrize.push(prize);
                data = prize.data;
            }
        }
        const randomInRange = (start, end) => {
            return Math.floor(Math.random() * (end - start + 1) + start);
        }
        if (type != undefined) {
            $.ajax({
                type: settings.variable.methodSave, url: settings.variable.urlSave, dataType: "json", //or HTML, JSON, etc.,
                data: {
                    action: "save_data", data: data, type: type, totalTurn: totalTurn,
                }, beforeSend: function () {
                    // activePopup("#loading");
                    // $("#anireward").addClass("active");
                    settings.animBefore();
                }, success: function (data) {
                    closeAllPopup();
                    // console.log(data);
                    Key128Bytesold = DataKey128;
                    if (data.status === 1 && data.data === "ok") {
                        // console.log(listPrize);
                        if (listPrize.length > 0) {
                            $(settings.el.rewardContainer).empty();
                            switch (listPrize.length) {
                                case 1:
                                case 10:
                                    for (var i = 0, len = listPrize.length; i < len; i++) {
                                        var characterName = listPrize[i].characterImg;
                                        var listItem = $(`.key-${characterName}`)
                                        var itemIndex = listItem.length > 1 ? listItem[randomInRange(0, 1)].id.slice(5) : listItem[0].id.slice(5)
                                        var indexName = listPrize[i].indexImg;
                                        var imgUrl = nameToSrc(itemIndex);
                                        var prizeName = settings.names[indexName - 1];
                                        if (listPrize.length == 10) {
                                            var template = `
                                               <img class="wrapper__10qua--item" src="${imgUrl}" alt="${prizeName}">
                                            `;
                                            $(settings.el.rewardContainer10).append(template)
                                        } else {
                                            var template2 = `
                                                      <img class="popup__wrapper--reward" src="${imgUrl}" data="${characterName}" alt="${prizeName}">
                                                      <img class="render__item" src="${imgUrl}" alt="${prizeName}">
                                            `;
                                            $(settings.el.rewardContainer).append(template2)
                                        }
                                    }

                                    setTimeout(function () {
                                        settings.animResult(listPrize);
                                        if ($(".pm__usedPoint").length > 0) {
                                            var usedPoint = $(".pm__usedPoint").html();
                                            usedPoint = parseInt(usedPoint);
                                            usedPoint += totalTurn;
                                            $(".pm__usedPoint").html(usedPoint);
                                        }
                                        settings.callback();
                                    }, settings.wait);

                                    settings.variable.spinable = true;
                                    break;
                                default:
                                    closeAllPopup();
                                    informError("Error: Results not return in 1 or 10 type.");
                                    return false;
                            }


                            var totalTurn = $this.hasClass("rut-1") ? 1 : 5;
                            cp = totalTurn == 5 ? cp - 5 : cp - 1;

                            $(settings.el.cp).html(cp);
                        }
                    }
                }, error: function (response) {
                    settings.variable.spinable = true;
                    alert(response.data);
                },
            });
        } else {
            closeAllPopup();
            settings.variable.spinable = true;
            informError("Error: Missing data-type.");
        }

        _CheckSO = Key128Bytesold;
        if (_CheckSO == DataKey128) {
            return false;
        }

        // console.log(data);
        // var type = 'test';
    };

    const getData = ($this) => {
        let totalTurn = $this.hasClass("rut-1") ? 1 : 5;
        let type = $this.data("value");
        var action = $this.hasClass("rut-1") ? "get_data" : "get_data_5";
        // let type = 'test';
        if (type != undefined) {
            $.ajax({
                type: settings.variable.methodGet, url: settings.variable.urlGet, dataType: "json", data: {
                    action: action, type: type, totalTurn: totalTurn,
                }, beforeSend: function () {
                    // activePopup("#loading");
                    $("#anireward").addClass("active");
                }, success: function (response) {
                    // $("#anireward").removeClass("active");
                    closeAllPopup();
                    settings.variable.spinable = true;

                    if (response.status === 1) {
                        handleData($this, response.data);
                    } else {
                        informError(response.data);
                    }
                }, error: function (response) {
                    closeAllPopup();
                    settings.variable.spinable = true;
                    // informError('Error Status: ' + response.data);
                    informError("Vui lòng kiểm tra lại kết nối mạng để tiếp tục");
                },
            });
        } else {
            closeAllPopup();
            settings.variable.spinable = true;
            informError("Error: Missing data-type.");
        }
    };

    const main = () => {
        // console.log(nameToSrc('gt5'));

        $(settings.el.action).on("click", function (e) {
            e.preventDefault();
            if (settings.variable.spinable) {
                closeAllPopup();
                settings.variable.spinable = false;

                let totalTurn = $(this).hasClass("rut-1") ? 1 : 5;

                if (totalTurn == 5 && cp < 5) {
                    settings.variable.spinable = true;
                    informError("Bạn chưa đủ lượt để quay nhanh x5 hoặc đã hết lượt. Vui lòng kiểm tra lại.");
                } else if (totalTurn == 1 && cp < 1) {
                    settings.variable.spinable = true;
                    informError("Bạn đã hết lượt. Vui lòng kiểm tra lại.");
                } else {
                    settings.animWait(this);
                    getData($(this));
                }
                // if ((cp >= 1 && totalTurn == 1) || (cp >= 5 && totalTurn == 5)) {
                // } else if (totalTurn == 5 && cp < 5) {
                // } else {
                //     settings.variable.spinable = true;
                //     informError("Bạn đã hết lượt.");
                // }
            }
        });
    };


    if (settings.debug) {
        settings.variable.urlGet = './assets/test-api/playgame/getdata.html';
        settings.variable.urlSave = './assets/test-api/playgame/savedata.html';
        settings.variable.methodGet = "GET";
        settings.variable.methodSave = "GET";
    } else {
        settings.variable.urlGet = settings.url;
        settings.variable.urlSave = settings.url;
        settings.variable.methodGet = "POST";
        settings.variable.methodSave = "POST";
    }

    main();
};

const getAwardSrcById = function (code) {
    let settings = {
        items: dndpDefault.items, directory: dndpDefault.directory,
    };

    const nameToSrc = (name) => {
        return `//img.zing.vn/products/codm/landing/2023-quay-so-1/prod/${settings.directory}/${name}.${settings.items.type}`;
        // return `${settings.directory}/${name}.${settings.items.type}`;

    };

    const getAwardID = (code) => {
        return settings.items[code];
    };

    return nameToSrc(getAwardID(code));
};

export {dndPromotion, getAwardSrcById};
