menuData = {
    title: "Easy Game dev",
    children: {
        "play": {
            title: "Play Game",
            action: menuPlay,
        },
    }
};

function menuPlay() {
    menuLib.hide();
    game.start();
}

menuLib.component = document.getElementsByClassName("menu-content")[0];
menuLib.show();
