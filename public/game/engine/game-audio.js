export default {
    audioInfos: {},
    music: null,
    effects: [],
    resetMusic: true,
    generalVolume: 0.05,

    configure() {
        this.loadAudio('music', 'catch-it-117676.mp3', 0.6);
        this.loadAudio('falling', 'falling-whistle-swish-1-84769.mp3', 1);
        this.loadAudio('jump', 'cartoon-jump-6462.mp3', 1);
        this.loadAudio('gem', 'coin-pickup-98269.mp3', 1);
        this.loadAudio('clock', 'time-passing-sound-effect-fast-clock-108403.mp3', 0.8);
    },

    loadAudio(name, audioFileName, initialVolume) {
        if (this.audioInfos[name]) {
            return;
        }
        const audio = document.createElement("audio");
        audio.src = './assets/' + audioFileName;
        audio.volume = 0;
        audio.play();
        audio.pause();
        this.audioInfos[name] = {
            audio,
            initialVolume
        };
    },

    copyAudioInfo(name) {
        if (!this.audioInfos[name]) {
            return undefined;
        }
        const origAudioInfo = this.audioInfos[name];
        const origAudio = origAudioInfo.audio;
        const audio = document.createElement("audio");
        audio.src = origAudio.src;
        audio.volume = origAudioInfo.initialVolume;
        return {
            audio,
            initialVolume: origAudioInfo.initialVolume,
        };
    },

    configureMusic() {
        this.music = this.audioInfos['music'];
        this.music.audio.volume = this.music.initialVolume * this.generalVolume;
        this.music.audio.loop = true;
    },

    playMusic() {
        if (this.music == null) this.configureMusic();
        
        this.music.audio.play();
    },

    pauseMusic() {
        if (this.music == null) return;

        this.music.audio.pause();
        if (this.resetMusic) {
            this.music.audio.currentTime = 0;
        }
    },

    playEffect(name) {
        const effect = this.copyAudioInfo(name);
        effect.audio.volume = effect.initialVolume * this.generalVolume;
        effect.audio.play();
        this.effects.push(effect);
        effect.audio.addEventListener("ended", () => {
            this.effects = this.effects.filter(e => e != effect);
        });
        return effect;
    },

    stopEffects() {
        this.effects.forEach(effect => effect.audio.pause());
        this.effects = [];
    },
}