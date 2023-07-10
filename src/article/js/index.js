import articleBundles from "./_articleBundles.js";

// ALL ARTICLE JS GOES HERE
// - jQuery supported
import FontPicker from "font-picker";
import "../../setup/js/_accordion";
import articleTheme from "../articleTheme.json";

window.addEventListener("load", function(){
    // window.alert("Script load ok!");

    $(".article").each(function(){
        $(this).accordion({
            isTabContent: true,
            after: function(){
            }
        })
    });

    var url = new URL(window.location.href);
    var param_theme = url.searchParams.get("theme");
    if (param_theme) {
        $("body").addClass(param_theme);
    } else {
        $("body").addClass(articleTheme.default);
    }


    var fontPickerOptions = {
        "sort": "popularity",
        "families": [
            "Barlow", "Barlow Condensed"
        ],
        // "scripts": ["Vietnamese"]
    }

    window.fontPickerPrimary = new FontPicker(
        "AIzaSyBxqeghm6vBR5BLIoXjQG4PCU_A6sGSNTw", // Google API key
        "Barlow", // Default font
        {
            ...fontPickerOptions,
            pickerId: 'primary'
        }
    );
    window.fontPickerSecondary = new FontPicker(
        "AIzaSyBxqeghm6vBR5BLIoXjQG4PCU_A6sGSNTw", // Google API key
        "Barlow", // Default font
        {
            ...fontPickerOptions,
            pickerId: 'secondary'
        }
    );

});