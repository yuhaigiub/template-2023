// TEST
// 
// var serverTime = new Date().getTime();
// var serverTime = new Date(2021, 1, 8).getTime();
// 

const milestonesSimulator = {
    data: {
        value: {
            serverTime: new Date().getTime(), 
            // serverTime: new Date(2021, 1, 3).getTime()
        },
        el: {
            milestonesValue: '#milestonesValue',
            milestonesCheatAdd: '#milestonesCheatAdd',
            milestonesCheatMultiply: '#milestonesCheatMultiply',
            milestonesBar: '#milestonesBar',
            milestonesBarActive: '#milestonesBarActive'
        },
        target: [
            //   / \
            //  / ! \  Remember month starts by 0 instead of 1.
            // /_____\
            {
                time: new Date(2021, 1, 5), // <-- open promotion time
                gain: 0 
            },
            {
                time: new Date(2021, 1, 10),
                gain: 1000
            },
            {
                time: new Date(2021, 1, 12),
                gain: 2300
            },
            {
                time: new Date(2021, 1, 14),
                gain: 3500
            },
            {
                time: new Date(2021, 1, 16),
                gain: 4900
            },
            {
                time: new Date(2021, 1, 18),
                gain: 5500
            },
            {
                time: new Date(2021, 1, 20),
                gain: 6600
            },
            {
                time: new Date(2021, 1, 22),
                gain: 7500
            },
            {
                time: new Date(2021, 1, 24),
                gain: 8000
            }
        ],
        milestonesDisplay: {
            attribute: {
                desktop: 'width',
                mobile: 'width',
            },
            unit: {
                desktop: '%',
                mobile: '%',
            }
        },
        milestones: [
            {
                gain: 0,
                value: {
                    desktop: 0,
                    mobile: 0
                }
            },
            {
                gain: 250000000,
                value: {
                    desktop: 27,
                    mobile: 27
                }
            },
            {
                gain: 500000,
                value: {
                    desktop: 55,
                    mobile: 55
                }
            },
            {
                gain: 1000000,
                value: {
                    desktop: 87,
                    mobile: 87
                }
            }
        ]
    },
    util: {
        isMobile: () => () => {
            var width = $(window).outerWidth(),
                height = $(window).outerHeight();

            return ((width <= 700) || (width < height));
        },
        getCurrentTime: (serverTime) => 
            (serverTime.toString().length < 12) ? serverTime * 1000 : serverTime,
        getCurrentStage: (serverTime) => {
            var before = -1, 
                after = -1; 

            for (let i = 0, len = milestonesSimulator.data.target.length; i < len; i++) {
                let stage = milestonesSimulator.data.target[i];
                let currentTime = milestonesSimulator.util.getCurrentTime(serverTime);
                if (currentTime >= stage.time.getTime()) before = i;
                if (currentTime < stage.time.getTime()) {
                    after = i; 
                    break;
                } 
            }
            
            return [before, after]; 
        },
        getSubscriptions: (serverTime) => {
            let currentTime = milestonesSimulator.util.getCurrentTime(serverTime);
            let stages = milestonesSimulator.data.target;
            let [before, after] = milestonesSimulator.util.getCurrentStage(milestonesSimulator.data.value.serverTime);

            if (before < 0) return stages[0].gain;
            if (after < 0) return stages[stages.length - 1].gain;

            let middlePercentage = (currentTime - stages[before].time.getTime()) / 
                                    (stages[after].time.getTime() - stages[before].time.getTime());

        
            // console.log(currentTime - stages[before].time.getTime());
            // console.log(stages[after].time.getTime() - stages[before].time.getTime());
            // console.log(timePercentage);

            return (stages[before].gain + middlePercentage * (stages[after].gain - stages[before].gain))

        },
        displaySubscriptions: (milestonesValue) => {

            var formatedMilestonesValue = parseInt(milestonesValue).toLocaleString('vi');

            if ($(milestonesSimulator.data.el.milestonesValue).length > 0) {
                $(milestonesSimulator.data.el.milestonesValue).val(formatedMilestonesValue);
            }
            return 0;
        },
        displayMilestones: (milestonesValue) => {                
            let before = -1,
                after = -1;
            let stages = milestonesSimulator.data.milestones;
            for (let i = 0, len = stages.length; i < len; i++) {

                let stage = stages[i];

                if (milestonesValue >= stage.gain) before = i;
                if (milestonesValue < stage.gain) {
                    after = i; 
                    break;
                } 
            } 

            let deviceType = milestonesSimulator.util.isMobile() ? "mobile" : "desktop";


            if (before < 0) {
                $(milestonesSimulator.data.el.milestonesBarActive).css({
                    [milestonesSimulator.data.milestonesDisplay.attribute[deviceType]] : 0 + milestonesSimulator.data.milestonesDisplay.unit[deviceType]
                });
                return;
            };
            if (after < 0) {
                $(milestonesSimulator.data.el.milestonesBarActive).css({
                    [milestonesSimulator.data.milestonesDisplay.attribute[deviceType]] : milestonesSimulator.data.milestones[milestonesSimulator.data.milestones.length - 1].value[deviceType] + milestonesSimulator.data.milestonesDisplay.unit[deviceType]
                });
                return;
            };


            let middlePercentage = (milestonesValue - stages[before].gain) / 
                                    (stages[after].gain - stages[before].gain); 

            let displayPercentage = stages[before].value[deviceType] + 
                                    middlePercentage * (stages[after].value[deviceType] - stages[before].value[deviceType]);
            
            // console.log(displayPercentage);

            if ($(milestonesSimulator.data.el.milestonesBarActive).length > 0) {
                $(milestonesSimulator.data.el.milestonesBarActive).css({
                    [milestonesSimulator.data.milestonesDisplay.attribute[deviceType]] : displayPercentage + milestonesSimulator.data.milestonesDisplay.unit[deviceType]
                });
            }

            // console.log(before, after);


        }        
    },
    before: function(){},
    after: function(){},
    init: function(data){

        milestonesSimulator.data.value.serverTime = data.serverTime;

        // console.log(milestonesSimulator.data.value)

        milestonesSimulator.before(); 

        // 

        var subs = milestonesSimulator.util.getSubscriptions(milestonesSimulator.data.value.serverTime);

        // console.log(subs); 
        
        subs = Math.floor(subs);

        let milestonesCheatAdd = 0,
            milestonesCheatMultiply = 1;

        if ($(milestonesSimulator.data.el.milestonesCheatAdd).length > 0) {
            milestonesCheatAdd = $(milestonesSimulator.data.el.milestonesCheatAdd).val();
        }

        if ($(milestonesSimulator.data.el.milestonesCheatMultiply).length > 0) {
            milestonesCheatMultiply = $(milestonesSimulator.data.el.milestonesCheatMultiply).val();
        }

        milestonesCheatAdd = parseInt(milestonesCheatAdd);
        milestonesCheatMultiply = parseInt(milestonesCheatMultiply);

        subs = subs * milestonesCheatMultiply + milestonesCheatAdd;

        subs = (subs < 0) ? 0 : subs;

        milestonesSimulator.util.displaySubscriptions(subs);
        milestonesSimulator.util.displayMilestones(subs);
        //  

        milestonesSimulator.after();
    }
}

const milestonesHybrid = {
    data: {
        value: {
            // serverTime: new Date().getTime(), 
            // serverTime: new Date(2021, 1, 3).getTime()
            ajax: '//event.zing.vn/webapi/getTotalRegister?dd=8afa6fa843c12cf38e8e1c6e65a11d89&programID=312&apiKey=APIKEY_6a4f5cd1ac697080b8cb178c82cf740f'
        },
        el: {
            milestonesValue: '#milestonesValue',
            milestonesCheatAdd: '#milestonesCheatAdd',
            milestonesCheatMultiply: '#milestonesCheatMultiply',
            milestonesBar: '#milestonesBar',
            milestonesBarActive: '#milestonesBarActive',
            milestonesRun: "#milestonesRun",
            milestonesIcon: "#milestonesIcon"
        },
        milestonesDisplay: {
            attribute: {
                desktop: 'width',
                mobile: 'width',
            },
            unit: {
                desktop: '%',
                mobile: '%',
            }
        },
        milestonesRunDisplay: {
            attribute: {
                desktop: 'left',
                mobile: 'left',
            },
            unit: {
                desktop: '%',
                mobile: '%',
            }
        },
        milestones: [
            {
                gain: 0,
                value: {
                    desktop: 0,
                    mobile: 0
                }
            },
            {
                gain: 50000,
                value: {
                    desktop: 10,
                    mobile: 10
                }
            },
            {
                gain: 100000,
                value: {
                    desktop: 30,
                    mobile: 30
                }
            },
            {
                gain: 200000,
                value: {
                    desktop: 50,
                    mobile: 50
                }
            },
            {
                gain: 500000,
                value: {
                    desktop: 70,
                    mobile: 70
                }
            },
            {
                gain: 1000000,
                value: {
                    desktop: 90,
                    mobile: 90
                }
            }
        ]
    },
    util: {
        isMobile: () => () => {
            var width = $(window).outerWidth(),
                height = $(window).outerHeight();

            return ((width <= 700) || (width < height));
        },
        getSubscriptions: (callback = function(data){}) => {

            if (milestonesHybrid.data.value.ajax.length === 0) {
                // get data from #value

                var elSubs = $(milestonesHybrid.data.el.milestonesValue);
                var subscriptions = 0;

                switch (elSubs.prop("tagName")) {
                    case 'input': 
                        subscriptions = elSubs.val();
                    break;
                    default: 
                        subscriptions = parseInt(elSubs.html());
                }

                callback(parseInt(subscriptions));

            } else {
                // get data from ajax (TODO)



                $.ajax({
                    url: milestonesHybrid.data.value.ajax,   
                    dataType: 'json', 
                    success: function(data) {
                        // console.log(data);
                        if (data.status != undefined && data.status == 1) {
                            callback(parseInt(data.data));
                        }
                    }
                })
            }
        },
        displaySubscriptions: (milestonesValue) => {
            if ($(milestonesHybrid.data.el.milestonesValue).length > 0) {
                $(milestonesHybrid.data.el.milestonesValue).val(milestonesValue);

                var elSubs = $(milestonesHybrid.data.el.milestonesValue);
                switch (elSubs.prop("tagName")) {
                    case 'input': 
                        elSubs.val(milestonesValue);
                    break;
                    default: 
                        elSubs.html(milestonesValue);
                }
            }
            return 0;
        },
        displayMilestones: (milestonesValue) => {                
            let before = -1,
                after = -1;
            let stages = milestonesHybrid.data.milestones;
            for (let i = 0, len = stages.length; i < len; i++) {

                let stage = stages[i];

                // console.log(milestonesValue, stage.gain);

                if (milestonesValue >= stage.gain) before = i;
                if (milestonesValue < stage.gain) {
                    after = i; 
                    break;
                } 
            } 
            // console.log(before, after);

            let deviceType = milestonesHybrid.util.isMobile() ? "mobile" : "desktop";


            if (before < 0) {
                $(milestonesHybrid.data.el.milestonesBarActive).css({
                    [milestonesHybrid.data.milestonesDisplay.attribute[deviceType]] : 0 + milestonesHybrid.data.milestonesDisplay.unit[deviceType]
                });
                return;
            };
            if (after < 0) {
                $(milestonesHybrid.data.el.milestonesBarActive).css({
                    [milestonesHybrid.data.milestonesDisplay.attribute[deviceType]] : milestonesHybrid.data.milestones[milestonesHybrid.data.milestones.length - 1].value[deviceType] + milestonesHybrid.data.milestonesDisplay.unit[deviceType]
                });
                return;
            };


            let middlePercentage = (milestonesValue - stages[before].gain) / 
                                    (stages[after].gain - stages[before].gain); 

            let displayPercentage = stages[before].value[deviceType] + 
                                    middlePercentage * (stages[after].value[deviceType] - stages[before].value[deviceType]);
            
            // console.log(displayPercentage);

            if ($(milestonesHybrid.data.el.milestonesBarActive).length > 0) {
                $(milestonesHybrid.data.el.milestonesBarActive).css({
                    [milestonesHybrid.data.milestonesDisplay.attribute[deviceType]] : displayPercentage + milestonesHybrid.data.milestonesDisplay.unit[deviceType]
                });
            }

            if ($(milestonesHybrid.data.el.milestonesRun).length > 0) {
                $(milestonesHybrid.data.el.milestonesRun).css({
                    [milestonesHybrid.data.milestonesRunDisplay.attribute[deviceType]] : displayPercentage + milestonesHybrid.data.milestonesRunDisplay.unit[deviceType]
                });
            }

            // console.log(after);

            if ($(milestonesHybrid.data.el.milestonesIcon).length > 0) {
                for (let i = 0; i < before; i++) {
                    // console.log(i);
                    $(milestonesHybrid.data.el.milestonesIcon + " > li").eq(i).addClass("active");
                }


            }





        }        
    },
    before: function(){},
    after: function(){},
    init: function(data){

        // milestonesHybrid.data.value.serverTime = data.serverTime;

        // console.log(milestonesHybrid.data.value)

        milestonesHybrid.before(); 

        // 

        milestonesHybrid.util.getSubscriptions(
            function(subs){
                // console.log(subs); 
                
                subs = Math.floor(parseInt(subs));
        
                let milestonesCheatAdd = 0,
                    milestonesCheatMultiply = 1;
        
                if ($(milestonesHybrid.data.el.milestonesCheatAdd).length > 0) {
                    milestonesCheatAdd = $(milestonesHybrid.data.el.milestonesCheatAdd).val();
                }
        
                if ($(milestonesHybrid.data.el.milestonesCheatMultiply).length > 0) {
                    milestonesCheatMultiply = $(milestonesHybrid.data.el.milestonesCheatMultiply).val();
                }
        
                milestonesCheatAdd = parseInt(milestonesCheatAdd);
                milestonesCheatMultiply = parseInt(milestonesCheatMultiply);
        
                // console.log(subs, milestonesCheatMultiply, milestonesCheatAdd); 
        
                // subs = subs * milestonesCheatMultiply + milestonesCheatAdd;
        
                subs = (subs < 0) ? 0 : subs;
        
                milestonesHybrid.util.displaySubscriptions(subs);
                milestonesHybrid.util.displayMilestones(subs);
                //  
        
                milestonesHybrid.after();
            }
        );
    }
}

const milestonesRendered = {
    data: {
        el: {
            milestonesValue: '#milestonesValue',
            milestonesCheatAdd: '#milestonesCheatAdd',
            milestonesCheatMultiply: '#milestonesCheatMultiply',
            milestonesBar: '#milestonesBar',
            milestonesBarActive: '#milestonesBarActive',
            milestonesBarActiveSupport: '#milestonesBarActiveSupport',
            milestonesRun: "#milestonesRun"
        },
        milestones: [
            {
                gain: 0,
                value: {
                    desktop: 0,
                    mobile: 0,
                }
            },
            {
                gain: 30000,
                value: {
                    desktop: 8,
                    mobile: 17,
                }
            },
            {
                gain: 60000,
                value: {
                    desktop: 24,
                    mobile: 50,
                }
            },
            {
                gain: 100000,
                value: {
                    desktop: 42,
                    mobile: 85,
                }
            },
            {
                gain: 250000,
                value: {
                    desktop: 59,
                    mobile: 118,
                }
            },
            {
                gain: 500000,
                value: {
                    desktop: 76,
                    mobile: 151,
                }
            },
            {
                gain: 1000000,
                value: {
                    desktop: 94,
                    mobile: 184,
                }
            },
            {
                gain: 2000000,
                value: {
                    desktop: 100,
                    mobile: 200,
                }
            }
        ],
        milestonesDisplay: {
            attribute: {
                desktop: 'width',
                mobile: 'height',
            },
            unit: {
                desktop: '%',
                mobile: '%',
            }, 
        },
        milestonesRunDisplay: {
            attribute: {
                desktop: 'left',
                mobile: 'left',
            },
            unit: {
                desktop: '%',
                mobile: '%',
            }
        },
    },
    util: {
        isMobile: () => {
            var width = $(window).outerWidth(),
                height = $(window).outerHeight();
            return (width < height);
        },
        getCurrentStage: (currentValue) => {
            var before = -1, 
                after = -1; 

            for (let i = 0, len = milestonesRendered.data.milestones.length; i < len; i++) {
                let stage = milestonesRendered.data.milestones[i];
                if (currentValue >= stage.gain) before = i;
                if (currentValue < stage.gain) {
                    after = i; 
                    break;
                } 
            }
            
            return [before, after]; 
        },
        getSubscriptions: (currentValue) => {
            let stages = milestonesRendered.data.milestones;
            let [before, after] = milestonesRendered.util.getCurrentStage(currentValue);

            if (before < 0) return stages[0].gain;
            if (after < 0) return stages[stages.length - 1].gain;

            let middlePercentage = (currentValue - stages[before].gain) / 
                                    (stages[after].gain - stages[before].gain);

        
            // console.log(currentTime - stages[before].time.getTime());
            // console.log(stages[after].time.getTime() - stages[before].time.getTime());
            // console.log(timePercentage);

            return (stages[before].gain + middlePercentage * (stages[after].gain - stages[before].gain))

        },
        displaySubscriptions: (milestonesValue) => {

            // var formatedMilestonesValue = parseInt(milestonesValue).toLocaleString('th'); 
            var formatedMilestonesValue = parseInt(milestonesValue); 

            if ($(milestonesRendered.data.el.milestonesValue).length > 0) {
                $(milestonesRendered.data.el.milestonesValue).html(formatedMilestonesValue);
            }
            return 0;
        },
        displayMilestones: (milestonesValue) => {                
            let before = -1,
                after = -1;
            let stages = milestonesRendered.data.milestones;


            for (let i = 0, len = stages.length; i < len; i++) {

                let stage = stages[i];

                if (milestonesValue >= stage.gain) before = i;
                if (milestonesValue < stage.gain) {
                    after = i; 
                    break;
                } 
            } 

            // console.log(after);

            let deviceType = milestonesRendered.util.isMobile() ? "mobile" : "desktop";

            // console.log(deviceType);

            if (before < 0) {
                $(milestonesRendered.data.el.milestonesBarActive).css({
                    [milestonesRendered.data.milestonesDisplay.attribute[deviceType]] : 
                        0 + milestonesRendered.data.milestonesDisplay.unit[deviceType]
                });
                return;
            };
            if (after < 0) {
                $(milestonesRendered.data.el.milestonesBarActive).css({
                    [milestonesRendered.data.milestonesDisplay.attribute[deviceType]] : 
                        milestonesRendered.data.milestones[milestonesRendered.data.milestones.length - 1].value[deviceType] 
                        + milestonesRendered.data.milestonesDisplay.unit[deviceType]
                });
                return;
            };


            let middlePercentage = (milestonesValue - stages[before].gain) / 
                                    (stages[after].gain - stages[before].gain); 

            let displayPercentage = stages[before].value[deviceType] + 
                                    middlePercentage * (stages[after].value[deviceType] - stages[before].value[deviceType]);
            
            // console.log(displayPercentage);

            if ($(milestonesRendered.data.el.milestonesBarActive).length > 0) {
                $(milestonesRendered.data.el.milestonesBarActive).css({
                    [milestonesRendered.data.milestonesDisplay.attribute[deviceType]] : 
                    displayPercentage + milestonesRendered.data.milestonesDisplay.unit[deviceType]
                });
            }

            if (displayPercentage > 100) {
                let displayPercentageSupport = displayPercentage - 100;
                $(milestonesRendered.data.el.milestonesBarActiveSupport).css({
                    [milestonesRendered.data.milestonesDisplay.attribute[deviceType]] : 
                    displayPercentageSupport + milestonesRendered.data.milestonesDisplay.unit[deviceType]
                });
            }

            // console.log(before, after);

            if ($(milestonesRendered.data.el.milestonesRun).length > 0) {
                $(milestonesRendered.data.el.milestonesRun).css({
                    [milestonesRendered.data.milestonesRunDisplay.attribute[deviceType]] : displayPercentage + milestonesRendered.data.milestonesRunDisplay.unit[deviceType]
                });
            }
            if (displayPercentage > 100) {
                let displayPercentageSupport = displayPercentage - 100;
                if ($(milestonesRendered.data.el.milestonesRun).length > 0) {
                    $(milestonesRendered.data.el.milestonesRun).css({
                        [milestonesRendered.data.milestonesRunDisplay.attribute[deviceType]] : displayPercentageSupport + milestonesRendered.data.milestonesRunDisplay.unit[deviceType]
                    });

                    $(milestonesRendered.data.el.milestonesRun).addClass("stage-2");
                }
            }

        }        
    },
    init: function(data) {
        var result = data + 0;
        var 
            $elValue = $("#milestonesValue"),
            $elMilestones = $("#milestonesIcon .milestones_icon__item");
        // var
        //     $elCheatAdd = $(".milestones #milestonesCheatAdd"),
        //     $elCheatMul = $(".milestones #milestonesCheatMultiply");
        // result = data.data * parseInt($elCheatMul.val()) + parseInt($elCheatAdd.val());

        $elValue.html(result);

        $elMilestones.each(function(){
            var $elMilestone = $(this);
            var pointToActive = parseInt($elMilestone.attr("data-ptactive"));
            if (result >= pointToActive) $elMilestone.addClass("active");
        }); 

        milestonesRendered.util.displaySubscriptions(result);
        milestonesRendered.util.displayMilestones(result);
    }
}

export {
    milestonesSimulator, 
    milestonesHybrid,
    milestonesRendered
};