export default {
    music: null,
    sounds: [],

    configure() {
        this.loadMusic();
    },

    loadAudio(audioFileName) {
        const audio = document.createElement("audio");
        audio.src = './assets/' + audioFileName;
        return audio;
    },

    loadMusic() {
        this.music = this.loadAudio('jlbrock44_-_Slow_Burn.mp3');
        this.music.loop = true;
        this.music.volume = 0.1;
    },

    playMusic() {
        if (this.music == null) this.loadMusic();
        
        this.music.play();
    },

    pauseMusic() {
        if (this.music == null) return;

        this.music.pause();
        this.music.currentTime = 0;
    }
}