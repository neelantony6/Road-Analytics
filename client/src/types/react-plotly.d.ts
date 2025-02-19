import { PlotParams } from 'react-plotly.js';

declare module 'react-plotly.js' {
  import { Component } from 'react';
  
  export interface Figure {
    data?: Object[];
    layout?: Object;
    frames?: Object[];
  }

  export interface PlotParams extends Partial<Figure> {
    style?: Object;
    className?: string;
    useResizeHandler?: boolean;
    debug?: boolean;
    revision?: number;
  }

  export default class Plot extends Component<PlotParams> {}
}
