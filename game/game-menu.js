menuLib.data = {
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

menuLib.start();
