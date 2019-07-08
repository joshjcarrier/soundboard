declare module 'macos-tabs' {
    import * as React from 'react';

    interface MacOSTabsProps {
        activeTabIndex: number;
        tabs: React.ReactNode[];
        defaultContent: React.ReactNode;
        addTabPosition?: 'none' | 'start' | 'end';
        onAddTabButtonClick?: (e: Event) => void;
        onCloseTabButtonClick?: (e: Event, index: number) => void;
        onSetActiveTab?(index: number): void;
    }
    export default class MacOSTabs extends React.Component<MacOSTabsProps> {}

    interface TabBodyProps {
        label: string | number;
        children?: React.ReactNode;
        tabId: string | number;
    }

    export class TabBody extends React.Component<TabBodyProps, {}> {}
}
