declare module 'react-draggable' {
  import * as React from 'react';

  export interface DraggableProps {
    axis?: 'both' | 'x' | 'y' | 'none';
    bounds?: {left: number; top: number; right: number; bottom: number} | string | false;
    defaultClassName?: string;
    defaultClassNameDragging?: string;
    defaultClassNameDragged?: string;
    defaultPosition?: {x: number; y: number};
    position?: {x: number; y: number};
    scale?: number;
    onStart?: (e: MouseEvent, data: DraggableData) => void | false;
    onDrag?: (e: MouseEvent, data: DraggableData) => void | false;
    onStop?: (e: MouseEvent, data: DraggableData) => void | false;
    onMouseDown?: (e: MouseEvent) => void;
    children: React.ReactNode;
  }

  export interface DraggableData {
    node: HTMLElement;
    x: number;
    y: number;
    deltaX: number;
    deltaY: number;
    lastX: number;
    lastY: number;
  }

  export default class Draggable extends React.Component<DraggableProps> {}
}
