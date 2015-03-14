var App = (function () {
    var privateMethod = function (message) {
        console.log('Messages: ' + message);
    };

    var publicMethod = function (text) {
        privateMethod(text);
    };

    return {
        publicMethod: publicMethod
    };
})();

App.publicMethod('Hello!');