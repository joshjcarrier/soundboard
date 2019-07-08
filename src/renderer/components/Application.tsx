import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import { join } from 'path';
import MacOSTabs, { TabBody } from 'macos-tabs';
import { remote } from 'electron';
import { Soundboard } from './Types';
import Board from './Board';

require('./Application.scss');

import { Parser, processors } from 'xml2js';
import { readFile } from 'fs';

const parser = new Parser({
    explicitRoot: false,
    explicitArray: false,
    explicitChildren: true,
    mergeAttrs: true,
    attrValueProcessors: [processors.parseNumbers, processors.parseBooleans]
});

interface SoundboardDirectory {
    path: string;
    soundboard: Soundboard;
}

interface ApplicationState {
    soundboards: SoundboardDirectory[];
}
class Application extends React.Component<{}, ApplicationState> {
    appDir = remote.app.getPath('downloads');

    constructor(props: {}) {
        super(props);
        this.state = {
            soundboards: []
        };
    }

    componentDidMount() {
        const soundboardDir = join(this.appDir, '0.soundboard');
        readFile(join(soundboardDir, 'Contents.xml'), (e, xmlString) => {
            if (e != null) {
                return;
            }
            parser.parseString(xmlString, (err: any, data: Soundboard) => {
                if (err != null) {
                    return;
                }
                console.log(data);
                this.setState({
                    ...this.state,
                    soundboards: [
                        ...this.state.soundboards,
                        { path: soundboardDir, soundboard: data }
                    ]
                });
            });
        });
    }

    public render() {
        return (
            <div className="h-100 flow flow-column bg-near-white">
                <div style={{ height: '96%' }}>
                    <MacOSTabs
                        tabs={this.renderTabs()}
                        defaultContent={`Loading from ${this.appDir}...`}
                    />
                </div>
                <div className="bt b--black-20 ph2" style={{ height: 20 }}>
                    <div className="tr lh-copy v-mid">Soundboard</div>
                </div>
            </div>
        );
    }

    private renderTabs() {
        return this.state.soundboards.map((dir, i) => (
            <TabBody key={`application--tab-body-${i}`} label={dir.soundboard.name} tabId={i}>
                <Board soundboardDir={dir.path} sounds={dir.soundboard.sounds.sound} />
            </TabBody>
        ));
    }
}

export default hot(Application);
