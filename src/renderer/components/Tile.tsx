import * as React from 'react';
import { Howl } from 'howler';
import Slider from 'rc-slider';
import { bind, unbind } from 'mousetrap';

import { SoundboardSound } from './Types';

import 'rc-slider/assets/index.css';

interface TileProps {
    keyMapping: string;
    sound: SoundboardSound | null;
    soundboardDir: string;
}
interface TileState {
    percent: number;
}

export default class Tile extends React.Component<TileProps, TileState> {
    constructor(props: TileProps) {
        super(props);
        this.state = { percent: 0 };
    }

    timerID: NodeJS.Timeout | null = null;
    sfx: Howl | null = null;

    componentDidMount() {
        const { keyMapping, sound, soundboardDir } = this.props;

        if (sound != null) {
            this.sfx = new Howl({
                src: [`file://${soundboardDir}/${sound.prerenderedPath}`],
                volume: sound.playbackVolume,
                loop: sound.loops
            });
            this.sfx.on('play', () => {
                this.playingSound();
                this.timerID = setInterval(() => this.playingSound(), 50);
            });
            this.sfx.on('end', () => {
                if (this.timerID != null) {
                    clearInterval(this.timerID);
                }
                this.setState({ percent: 0 });
            });
        }

        bind(keyMapping, this.playSound);
    }

    public componentWillUnmount() {
        if (this.timerID != null) {
            clearInterval(this.timerID);
        }

        unbind(this.props.keyMapping);
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
        const { sound } = this.props;
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
        const { keyMapping, sound } = this.props;

        return (
            <div className="h-25 flex items-start pa2" style={{ position: 'relative' }}>
                <div
                    className="h-100 w-100 flex br3 ba b--black-20 bg-white"
                    style={{ cursor: 'pointer' }}
                    onClick={this.playSound}
                >
                    <div
                        className="w-100 pa2 f4 b"
                        style={{
                            wordBreak: 'break-word',
                            overflow: 'hidden',
                            textOverflow: 'ellipses',
                            zIndex: 10
                        }}
                        title={sound ? sound.name : ''}
                    >
                        {sound ? sound.name : ''}
                    </div>
                    <div className="pa2" style={{ zIndex: 10 }}>
                        <button className="f3">{keyMapping.toUpperCase()}</button>
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
