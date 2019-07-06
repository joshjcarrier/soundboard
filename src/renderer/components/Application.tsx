import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import { join } from 'path';
import MacOSTabs, { TabBody } from 'macos-tabs';
import { Howl } from 'howler';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import {remote} from 'electron';
import {bind} from 'mousetrap';
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
let xml_string = fs.readFileSync(join(remote.app.getPath('downloads'), '0.soundboard/Contents.xml'), 'utf8');

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
const keyMappings: { [index:number]: string} = {
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
  [31]: ',',
}
const sounds: { [index: number]: SoundboardSound | null } = {};
parser.parseString(xml_string, (err: any, data: Soundboard) => {
    console.log(data);
    for (const x in data.sounds.sound) {
        const sound = data.sounds.sound[x];
        sounds[sound.index] = sound;
    }
});

const Tile = (index: number) => {
    const sound = sounds[index];
    var sfx: Howl;
    if (sound != null) {
        sfx = new Howl({
            src: ['file://' + join(remote.app.getPath('downloads'), '0.soundboard/') + sound.prerenderedPath],
            volume: sound.playbackVolume,
            loop: sound.loops
        });
        
    }
    const playSound = () => {
        if (sound == null || sfx == null) {
            return;
        }

        if (sfx.playing()) {
            sfx.stop();

            if (sound.restartOnPress) {
                sfx.play();
            }
        } else {
            sfx.play();
        }
    };

    bind(keyMappings[index].toLowerCase(), playSound);

    return (
        <div className="h-25 flex items-start pa1">
            <div className="h-100 w-100 flex br3 ba b--black-20 bg-white" onClick={e => playSound()}>
                <div
                    className="w-100 pa2 f4 b"
                    style={{ wordBreak: 'break-word', overflow: 'hidden', textOverflow: 'ellipses' }}
                    title={sound ? sound.name : '|>'}
                >
                    {sound ? sound.name : '|>'}
                </div>
                <div className="pa2">
                    <button className="f3">{keyMappings[index]}</button>
                </div>
                <div className="h-100 ph1 pv3">
                  <div className="h-100">
                    <Slider vertical={true} defaultValue={100} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const Board = () => {
    return (
        <TabBody label="Segues" tabId="1">
            <div className="h-100 flex justify-between">
                {[0, 1, 2, 3, 4, 5, 6, 7].map(x => {
                    return (
                        <div
                            className="h-100 flex-column justify-between"
                            style={{ flexBasis: 0, flexGrow: 1 }}
                        >
                            {[0, 1, 2, 3].map(y => {
                                return Tile(y + x * 4);
                            })}
                        </div>
                    );
                })}
            </div>
        </TabBody>
    );
};

const Application = () => (
    <div className="h-100 flow flow-column bg-near-white" >
        <div className="" style={{height:"96%"}}>
          <MacOSTabs tabs={[Board()]} />
          </div>
        <div className="bt b--black-20 ph2" style={{height:20}}>
          <div className="tr lh-copy v-mid">
            Soundboard
            </div>
        </div>
    </div>
);

export default hot(Application);
