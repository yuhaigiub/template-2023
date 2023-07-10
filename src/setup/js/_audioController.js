

$.fn.audioController = function(options) {
    var defaults = {
        obj: $(this),
        el: {
            mute: '.audioMute',
            state: '.audioState',
            prev: '.audioPrev',
            next: '.audioNext',
            container: '.audioBackground',
        },
        toggleClass: 'active',
        state: {
            isMuted: false,
            isPlaying: false,
            playingId: 0,
        },
        triggerAutoplay: true,
        data: []
    }

    var settings = $.extend(defaults, options);

    // make data

    $(settings.el.container).each(function(){
        $(this).children("audio").each(function(){
            
            settings.data.push($(this).get(0))
            // settings.data.append(this);
        });
    });

    // control audio

    var playAudio = function(playingId = settings.state.playingId) {
        settings.data.forEach(element => {
            element.pause();
            element.muted = false;
        });
        settings.data[playingId].play();
        settings.state.isPlaying = true;
        $(settings.el.state).addClass("active");
    }

    var pauseAudio = function(playingId = settings.state.playingId) {
        settings.data[playingId].pause();
        settings.state.isPlaying = false;
        $(settings.el.state).removeClass("active");
    }

    var mutedAudio = function() {
        settings.data.forEach(element => {
            element.muted = true;
        });
        settings.state.isMuted = true;
        $(settings.el.mute).addClass("active");
    }

    var unMutedAudio = function() {
        settings.data.forEach(element => {
            element.muted = false;
        });
        settings.state.isMuted = false;
        $(settings.el.mute).removeClass("active");
    }

    // Autoplay 

    if (settings.triggerAutoplay) {
        $("body").one("click", function(){
            playAudio(); 
        });
    }

    // On click Play

    $("body").on("click", settings.el.state, function(){
        if (settings.state.isPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
        settings.triggerAutoplay = false;
        // console.log(settings.state);
    });

    // On click Muted 

    $("body").on("click", settings.el.mute, function(){
        if (settings.state.isMuted) {
            unMutedAudio();
        } else {
            mutedAudio();
        }
        // console.log(settings.state);
    });

    $("body").on("click", settings.el.prev, function(){
        var max = settings.data.length - 1;
        if (settings.state.playingId == 0) {
            settings.state.playingId = max;
        } else {
            settings.state.playingId--;
        }
        playAudio();
        // console.log(settings.state);
    });


    $("body").on("click", settings.el.next, function(){
        var max = settings.data.length - 1;
        if (settings.state.playingId + 1 > max) {
            settings.state.playingId = 0;
        } else {
            settings.state.playingId++;
        }
        playAudio();
        // console.log(settings.state);
    });


    // settings.data[0].play();


}