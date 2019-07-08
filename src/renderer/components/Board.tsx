import * as React from 'react';
import { SoundboardSound } from './Types';
import Tile from './Tile';

const keyMappings: { [index: number]: string } = {
    [0]: '1',
    [1]: 'q',
    [2]: 'a',
    [3]: 'z',
    [4]: '2',
    [5]: 'w',
    [6]: 's',
    [7]: 'x',
    [8]: '3',
    [9]: 'e',
    [10]: 'd',
    [11]: 'c',
    [12]: '4',
    [13]: 'r',
    [14]: 'f',
    [15]: 'v',
    [16]: '5',
    [17]: 't',
    [18]: 'g',
    [19]: 'b',
    [20]: '6',
    [21]: 'y',
    [22]: 'h',
    [23]: 'n',
    [24]: '7',
    [25]: 'u',
    [26]: 'j',
    [27]: 'm',
    [28]: '8',
    [29]: 'i',
    [30]: 'k',
    [31]: ','
};

interface BoardProps {
    soundboardDir: string;
    sounds: SoundboardSound[];
}

interface BoardState {
    // ordered
    sounds: { [index: number]: SoundboardSound };
}

export default class Board extends React.Component<BoardProps, BoardState> {
    constructor(props: BoardProps) {
        super(props);
        const { sounds } = this.props;
        const orderedSounds: { [index: number]: SoundboardSound } = {};
        for (const x in sounds) {
            const sound = sounds[x];
            orderedSounds[sound.index] = sound;
        }

        this.state = {
            sounds: orderedSounds
        };
    }

    public render() {
        const { soundboardDir } = this.props;
        const { sounds } = this.state;
        return (
            <div className="h-100 flex justify-between">
                {[0, 1, 2, 3, 4, 5, 6, 7].map(x => {
                    return (
                        <div
                            key={`application--tile-x-${x}`}
                            className="h-100 pv2 flex-column justify-between"
                            style={{ flexBasis: 0, flexGrow: 1 }}
                        >
                            {[0, 1, 2, 3].map(y => {
                                return (
                                    <Tile
                                        key={`tile-${y + x * 4}`}
                                        keyMapping={keyMappings[y + x * 4]}
                                        sound={sounds[y + x * 4]}
                                        soundboardDir={soundboardDir}
                                    />
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        );
    }
}
