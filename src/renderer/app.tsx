import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import Application from './components/Application';

require('tachyons/css/tachyons.min.css');

// Create main element
const mainElement = document.createElement('div');
mainElement.className = "h-100 overflow-hidden";
document.body.appendChild(mainElement);

// Render components
const render = (Component: () => JSX.Element) => {
    ReactDOM.render(
        <AppContainer>
              <Component />
        </AppContainer>,
        mainElement
    );
};

render(Application);
