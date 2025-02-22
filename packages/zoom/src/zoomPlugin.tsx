/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { createStore, Plugin, PluginFunctions, RenderViewer, Slot, SpecialZoomLevel, ViewerState } from '@react-pdf-viewer/core';

import CurrentScale, { CurrentScaleProps } from './CurrentScale';
import ShortcutHandler from './ShortcutHandler';
import StoreProps from './StoreProps';
import Zoom, { ZoomProps } from './Zoom';
import ZoomIn, { ZoomInProps } from './ZoomIn';
import ZoomOut, { ZoomOutProps } from './ZoomOut';
import ZoomInButton from './ZoomInButton';
import ZoomOutButton from './ZoomOutButton';
import ZoomPopover from './ZoomPopover';

interface ZoomPlugin extends Plugin {
    zoomTo: (scale: number | SpecialZoomLevel) => void;
    CurrentScale: (props: CurrentScaleProps) => React.ReactElement;
    ZoomIn: (props: ZoomInProps) => React.ReactElement;
    ZoomInButton: () => React.ReactElement;
    ZoomOut: (props: ZoomOutProps) => React.ReactElement;
    ZoomOutButton: () => React.ReactElement;
    Zoom: (props: ZoomProps) => React.ReactElement;
    ZoomPopover: () => React.ReactElement;
}

const zoomPlugin = (): ZoomPlugin => {
    const store = React.useMemo(() => createStore<StoreProps>({}), []);

    const CurrentScaleDecorator = (props: CurrentScaleProps) => (
        <CurrentScale {...props} store={store} />
    );

    const ZoomInDecorator = (props: ZoomInProps) => (
        <ZoomIn {...props} store={store} />
    );

    const ZoomInButtonDecorator = () => (
        <ZoomInDecorator>
            {props => <ZoomInButton {...props} />}
        </ZoomInDecorator>
    );

    const ZoomOutDecorator = (props: ZoomOutProps) => (
        <ZoomOut {...props} store={store} />
    );

    const ZoomOutButtonDecorator = () => (
        <ZoomOutDecorator>
            {props => <ZoomOutButton {...props} />}
        </ZoomOutDecorator>
    );

    const ZoomDecorator = (props: ZoomProps) => <Zoom {...props} store={store} />;

    const ZoomPopoverDecorator = () => (
        <ZoomDecorator>
            {props => <ZoomPopover {...props} />}
        </ZoomDecorator>
    );

    const renderViewer = (props: RenderViewer): Slot => {
        const { slot } = props;
        const updateSlot: Slot = {
            children: (
                <>
                <ShortcutHandler
                    containerRef={props.containerRef}
                    store={store}
                />
                {slot.children}
                </>
            )
        };
        return {...slot, ...updateSlot};
    };

    return {
        renderViewer,
        install: (pluginFunctions: PluginFunctions) => {
            store.update('zoom', pluginFunctions.zoom);
        },
        onViewerStateChange: (viewerState: ViewerState) => {
            store.update('scale', viewerState.scale);
            return viewerState;
        },
        zoomTo: (scale: number | SpecialZoomLevel) => {
            const zoom = store.get('zoom');
            if (zoom) {
                zoom(scale);
            }
        },
        CurrentScale: CurrentScaleDecorator,
        ZoomIn: ZoomInDecorator,
        ZoomInButton: ZoomInButtonDecorator,
        ZoomOut: ZoomOutDecorator,
        ZoomOutButton: ZoomOutButtonDecorator,
        Zoom: ZoomDecorator,
        ZoomPopover: ZoomPopoverDecorator,
    };
};

export default zoomPlugin;
