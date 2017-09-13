$(document).ready(init);
// $('body').on('contextmenu', '#myCanvas', function(e) { return false; });
var foo = 'foo';
function init(jQuery) {
}
window.foo = 'foo';

// PaperScript Interop
window.globals = {
	foo: 'foo',
    testConnection: function(msg){ console.log(msg)},
}