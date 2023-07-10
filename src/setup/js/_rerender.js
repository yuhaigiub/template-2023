const rerender = {
    util: {
        convertTableToJson: function(tableWrapper) {
            // Loop through grabbing everything
            var myRows = [];
            var $headers = $(tableWrapper + " th");
            var $rows = $(tableWrapper + " tbody tr").each(function(index) {
              var $cells = $(this).find("td");
              myRows[index] = {};
              $cells.each(function(cellIndex) {
                myRows[index][$($headers[cellIndex]).html()] = $(this).html();
              });    
            });
            
            // Let's put this in the object like you want and convert to JSON (Note: jQuery will also do this for you on the Ajax request)
            var myObj = {};
            myObj = myRows;

            return myObj;
        }
    },
    rankDisplay: function(callback = function(){}){
        if (($("#rankRender").length > 0) && ($("#rankDisplay").length > 0)) {
            var rankRender = rerender.util.convertTableToJson("#rankRender");
            // console.log(rankRender);

            // Top 3

            var top3 = `<div class="rank__top3">`;

            for (let i = 0; i < 3; i++) {
                if (rankRender[i] != undefined) {
                    top3 += `
                    <div class="rank__item">
                        <div class="rank__name">${rankRender[i]["Nhân vật"]}</div>
                        <div class="rank__info">
                            Máy chủ:
                            <span class="rank__server">${rankRender[i]["Server"]}</span>
                            <br>
                            Số lần đã quay:
                            <span class="rank__played">${rankRender[i]["Số lượt"]}</span>
                        </div>
                    </div>`;
                }
            }

            top3 += `</div>`

            // Top 4 - 9

            var top9 = `<div class="rank__top10">
			<div id="rankTop10" class="swiper-container">
				<div class="swiper-wrapper">`;

            for (let i = 3; i < 9; i++) {
                if (rankRender[i] != undefined) {
                    top9 += `
                    <div class="swiper-slide">
                        <div class="rank__item">
                            <div class="rank__name">${rankRender[i]["Nhân vật"]}</div>
                            <div class="rank__info">
                                Máy chủ:
                                <span class="rank__server">${rankRender[i]["Server"]}</span>
                                <br>
                                Số lần đã quay:
                                <span class="rank__played">${rankRender[i]["Số lượt"]}</span>
                            </div>
                        </div>
                    </div>`;
                }
            }

            top9 += `
            </div>
                </div>
                <span class="swiper-button-prev swiper-button-prev-rankTop10"></span>
                <span class="swiper-button-next swiper-button-next-rankTop10"></span>
            </div>`;

            $("#rankDisplay").append(top3);
            $("#rankDisplay").append(top9);

            $("#rankRender").remove();
            callback();
        }
    },
    rankDisplayApi: function(callback = function(){}){
        if (($("#rankRender").length > 0) && ($("#rankDisplay").length > 0)) {
            $.ajax({
                url: '//event.zing.vn/webapi/getLuckyDrawRanking',
                dataType: 'jsonp', 
                data: {
                    programID: 336,
                    apiKey: 'APIKEY_c479ce182043bc5383a7d84560dba894',
                    dd: '8afa6fa843c12cf38e8e1c6e65a11d89',
                    dataType: 'jsonp'
                },
                success: function (data) {
                    // console.log(data);
                    let rankRender = data.data;

                    var top3 = `<div class="rank__top3">`;
        
                    for (let i = 0; i < 3; i++) {
                        if (rankRender[i] != undefined) {
                            top3 += `
                            <div class="rank__item">
                                <div class="rank__name">${rankRender[i]["CharacterName"]}</div>
                                <div class="rank__info">
                                    Máy chủ:
                                    <span class="rank__server">${rankRender[i]["ServerName"]}</span>
                                    <br>
                                    Số lần đã quay:
                                    <span class="rank__played">${rankRender[i]["Point"]}</span>
                                </div>
                            </div>`;
                        }
                    }
        
                    top3 += `</div>`;
                    top3 += `</div>`;
        
                    // Top 4 - 9
        
                    var top9 = `<div class="rank__top10">
                    <div id="rankTop10" class="swiper-container">
                        <div class="swiper-wrapper">`;
        
                    for (let i = 3; i < 9; i++) {
                        if (rankRender[i] != undefined) {
                            top9 += `
                            <div class="swiper-slide">
                                <div class="rank__item">
                                    <div class="rank__name">${rankRender[i]["CharacterName"]}</div>
                                    <div class="rank__info">
                                        Máy chủ:
                                        <span class="rank__server">${rankRender[i]["ServerName"]}</span>
                                        <br>
                                        Số lần đã quay:
                                        <span class="rank__played">${rankRender[i]["Point"]}</span>
                                    </div>
                                </div>
                            </div>`;
                        }
                    }
        
                    top9 += `
                    </div>
                        </div>
                        <span class="swiper-button-prev swiper-button-prev-rankTop10"></span>
                        <span class="swiper-button-next swiper-button-next-rankTop10"></span>
                    </div>`;

                    $("#rankDisplay").append(top3);
                    $("#rankDisplay").append(top9);

                    $("#rankRender").remove();
                    callback();
        
                }
            })
        }
    },
    // rewardDisplay: function(callback = function(){}){

    // }
}


export default rerender;