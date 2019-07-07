declare module 'macos-tabs' {
  import * as React from "react";
  // export function TabBody(): void
  interface MacOSTabsProps {
    tabs: React.ReactNode[]
  }
  export default class MacOSTabs extends React.Component<MacOSTabsProps> {}

  interface TabBodyProps {
    label: string | number
    children?: React.ReactNode 
    tabId: string | number
  }

  export class TabBody extends React.Component<TabBodyProps, {}> {} 
}