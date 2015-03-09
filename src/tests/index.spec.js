var Test = (function () {
    var runTest = function () {
        describe('just a test', function () {
            it('should equal true', function () {
                console.log('testing...');
                expect(1).toEqual(1);
            });
        });
    };

    return {
        runTest: runTest
    };
})();

Test.runTest();