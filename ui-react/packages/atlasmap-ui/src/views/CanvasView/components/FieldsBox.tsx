import React, { FunctionComponent, HTMLAttributes, ReactElement, useEffect } from 'react';
import { CanvasObject, useCanvas } from '../../../canvas';
import { useDimensions } from '../../../common';
import { Coords } from '../../../models';
import { useCanvasViewContext } from '../CanvasViewProvider';
import { Box } from './Box';

export interface IMappingsBoxProps extends HTMLAttributes<HTMLDivElement> {
  id: string;
  initialWidth: number;
  initialHeight: number;
  position: Coords;
  header: ReactElement | string;
  hidden: boolean;
  rightAlign?: boolean;
}
export const FieldsBox: FunctionComponent<IMappingsBoxProps> = ({
  id,
  initialWidth,
  initialHeight,
  position,
  header,
  rightAlign = false,
  hidden,
  children,
  ...props
}) => {
  const { freeView } = useCanvasViewContext();
  const scrollable = !freeView;

  const [ref, dimensions, measure ] = useDimensions();
  const { yDomain, addRedrawListener, removeRedrawListener } = useCanvas();

  useEffect(() => {
    addRedrawListener(measure);
    return () => {
      removeRedrawListener(measure);
    };
  }, [
    addRedrawListener,
    removeRedrawListener,
    measure,
  ]);

  return (
    <CanvasObject
      id={id}
      width={initialWidth}
      height={scrollable ? initialHeight : yDomain(dimensions.height)}
      movable={!scrollable}
      {...position}
    >
      <div
        ref={ref}
        style={{
          height: scrollable ? '100%' : undefined,
          opacity: hidden ? 0 : 1,
        }}
        {...props}
      >
        <Box
          header={header}
          rightAlign={rightAlign}
          style={{
            alignItems: 'center',
            overflow: 'hidden'
          }}
        >
          <div
            ref={ref}
            style={{
              height: scrollable ? '100%' : undefined,
              overflow: scrollable ? 'auto' : undefined,
              display: 'flex',
              flexFlow: 'column',
              width: '100%',
            }}
            {...props}
          >
            {children}
          </div>
        </Box>
      </div>
    </CanvasObject>
  )
};