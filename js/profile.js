$(document).ready(() => {

    SDK.loadmenu();

    const currentUser = SDK.currentUser();

    $(".page-header").html(`<h1>Hi, ${currentUser.username}</h1>`);

});

