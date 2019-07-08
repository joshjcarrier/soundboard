export interface SoundboardSound {
    backgroundColor: string;
    index: number;
    loops: boolean;
    name: string;
    prerenderedPath: string;
    playbackVolume: number;
    restartOnPress: boolean;
}

interface SoundboardSoundArray {
    sound: SoundboardSound[];
}

export interface Soundboard {
    name: string;
    sounds: SoundboardSoundArray;
}
