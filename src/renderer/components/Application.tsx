import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import { join } from 'path';
import MacOSTabs, { TabBody } from 'macos-tabs';
import { Howl } from 'howler';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { remote } from 'electron';
import { bind } from 'mousetrap';
require('./Application.scss');

import { Parser, processors } from 'xml2js';
const fs = require('fs');
const parser = new Parser({
    explicitRoot: false,
    explicitArray: false,
    explicitChildren: true,
    mergeAttrs: true,
    attrValueProcessors: [processors.parseNumbers, processors.parseBooleans]
});
let xml_string = fs.readFileSync(
    join(remote.app.getPath('downloads'), '0.soundboard/Contents.xml'),
    'utf8'
);

interface SoundboardSound {
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

interface Soundboard {
    name: string;
    sounds: SoundboardSoundArray;
}
const keyMappings: { [index: number]: string } = {
    [0]: '1',
    [1]: 'Q',
    [2]: 'A',
    [3]: 'Z',
    [4]: '2',
    [5]: 'W',
    [6]: 'S',
    [7]: 'X',
    [8]: '3',
    [9]: 'E',
    [10]: 'D',
    [11]: 'C',
    [12]: '4',
    [13]: 'R',
    [14]: 'F',
    [15]: 'V',
    [16]: '5',
    [17]: 'T',
    [18]: 'G',
    [19]: 'B',
    [20]: '6',
    [21]: 'Y',
    [22]: 'H',
    [23]: 'N',
    [24]: '7',
    [25]: 'U',
    [26]: 'J',
    [27]: 'M',
    [28]: '8',
    [29]: 'I',
    [30]: 'K',
    [31]: ','
};
const sounds: { [index: number]: SoundboardSound | null } = {};
parser.parseString(xml_string, (err: any, data: Soundboard) => {
    console.log(data);
    for (const x in data.sounds.sound) {
        const sound = data.sounds.sound[x];
        sounds[sound.index] = sound;
    }
});

interface TileProps {
    index: number;
}
interface TileState {
    percent: number;
}

class Tile extends React.Component<TileProps, TileState> {
    constructor(props: TileProps) {
        super(props);
        // set initial state
        this.state = { percent: 0 };
    }

    timerID: NodeJS.Timeout | null = null;
    sfx: Howl | null = null;

    componentDidMount() {
        const { index } = this.props;
        const sound = sounds[index];

        if (sound != null) {
            this.sfx = new Howl({
                src: [
                    'file://' +
                        join(remote.app.getPath('downloads'), '0.soundboard/') +
                        sound.prerenderedPath
                ],
                volume: sound.playbackVolume,
                loop: sound.loops
            });
            // FIXME what if loop
            this.sfx.on('play', () => {
                this.playingSound();
                this.timerID = setInterval(() => this.playingSound(), 50);
            });
            this.sfx.on('end', () => {
                if (this.timerID != null) {
                    console.log(this.timerID);
                    clearInterval(this.timerID);
                }
                this.setState({ percent: 0 });
            });
        }

        bind(keyMappings[index].toLowerCase(), this.playSound);
    }

    public componentWillUnmount() {
        if (this.timerID != null) {
            clearInterval(this.timerID);
        }
    }

    private playingSound() {
        if (this.sfx) {
            const seek = this.sfx.seek();
            if (typeof seek === 'number') {
                this.setState({ percent: (100 * seek) / this.sfx.duration() });
            }
        }
    }

    playSound = () => {
        const { index } = this.props;
        const sound = sounds[index];
        if (sound == null || this.sfx == null) {
            return;
        }

        if (this.sfx.playing()) {
            this.sfx.stop();

            if (sound.restartOnPress) {
                this.sfx.play();
            }
        } else {
            this.sfx.play();
        }
    };

    public render() {
        const { index } = this.props;
        const sound = sounds[index];

        return (
            <div className="h-25 flex items-start pa2" style={{ position: 'relative' }}>
                <div
                    className="h-100 w-100 flex br3 ba b--black-20 bg-white"
                    onClick={this.playSound}
                >
                    <div
                        className="w-100 pa2 f4 b"
                        style={{
                            wordBreak: 'break-word',
                            overflow: 'hidden',
                            textOverflow: 'ellipses',
                            zIndex: 10,
                        }}
                        title={sound ? sound.name : ''}
                    >
                        {sound ? sound.name : ''}
                    </div>
                    <div className="pa2" style={{ zIndex: 10 }}>
                        <button className="f3">{keyMappings[index]}</button>
                    </div>
                    <div className="h-100 ph1 pv3" style={{ zIndex: 10 }}>
                        <div className="h-100">
                            <Slider vertical={true} defaultValue={100} />
                        </div>
                    </div>
                </div>
                <div
                    className="h-100 w-100"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        padding: 'inherit',
                        pointerEvents: 'none'
                    }}
                >
                    <div
                        className={`h-100 flex br3 bg-black w-50 ${
                            this.state.percent < 97 ? ' br--left' : ''
                        }`}
                        style={{ opacity: 0.1, width: `${this.state.percent}%` }}
                    />
                </div>
            </div>
        );
    }
}

const Board = () => {
    return (
        <TabBody label="Segues" tabId="1">
            <div className="h-100 flex justify-between">
                {[0, 1, 2, 3, 4, 5, 6, 7].map(x => {
                    return (
                        <div
                            className="h-100 pv2 flex-column justify-between"
                            style={{ flexBasis: 0, flexGrow: 1 }}
                        >
                            {[0, 1, 2, 3].map(y => {
                                return <Tile index={y + x * 4} />;
                            })}
                        </div>
                    );
                })}
            </div>
        </TabBody>
    );
};

const Application = () => (
    <div className="h-100 flow flow-column bg-near-white">
        <div className="" style={{ height: '96%' }}>
            <MacOSTabs tabs={[Board()]} />
        </div>
        <div className="bt b--black-20 ph2" style={{ height: 20 }}>
            <div className="tr lh-copy v-mid">Soundboard</div>
        </div>
    </div>
);

export default hot(Application);
