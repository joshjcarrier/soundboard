import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import { join } from 'path';
import MacOSTabs, { TabBody } from 'macos-tabs';
import { remote } from 'electron';
import { Soundboard, SoundboardSound } from './Types';
import Tile from './Tile';

import 'rc-slider/assets/index.css';
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
const soundboardDir = join(remote.app.getPath('downloads'), '0.soundboard')
const xml_string = fs.readFileSync(
    join(soundboardDir, 'Contents.xml'),
    'utf8'
);

const sounds: { [index: number]: SoundboardSound | null } = {};
parser.parseString(xml_string, (err: any, data: Soundboard) => {
    console.log(data);
    for (const x in data.sounds.sound) {
        const sound = data.sounds.sound[x];
        sounds[sound.index] = sound;
    }
});

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

const Board = () => {
    return (
        <TabBody label="Segues" tabId="1">
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
