$(document).ready(init);
// $('body').on('contextmenu', '#myCanvas', function(e) { return false; });

function init(jQuery) {
    $("#btn").click(window.globals.paperClicked);
}

// PaperScript Interop
window.globals = {
    paperClicked: function() {}
}