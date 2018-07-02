define(['require', 'main'], function () {
    require(['index', 'test'], function (index, test) {
        console.log(index);
        //console.log(test());
    });
});