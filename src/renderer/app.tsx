import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import Application from './components/Application';

require('tachyons/css/tachyons.min.css');

// Create main element
const mainElement = document.createElement('div');
mainElement.className = 'h-100 overflow-hidden';
document.body.appendChild(mainElement);

// Render components
ReactDOM.render(
    <AppContainer>
        <Application />
    </AppContainer>,
    mainElement
);
