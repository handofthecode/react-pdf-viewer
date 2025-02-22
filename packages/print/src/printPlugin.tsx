/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { createStore, Plugin, RenderViewer, Slot } from '@react-pdf-viewer/core';

import Print, { PrintProps } from './Print';
import PrintButton from './PrintButton';
import PrintContainer from './PrintContainer';
import PrintStatus from './PrintStatus';
import ShortcutHandler from './ShortcutHandler';
import StoreProps from './StoreProps';

interface PrintPlugin extends Plugin {
    Print: (props: PrintProps) => React.ReactElement;
    PrintButton: () => React.ReactElement;
}

const printPlugin = (): PrintPlugin => {
    const store = React.useMemo(() => createStore<StoreProps>({
        printStatus: PrintStatus.Inactive,
    }), []);

    const PrintDecorator = (props: PrintProps) => (
        <Print {...props} store={store} />
    );

    const PrintButtonDecorator = () => (
        <PrintDecorator>
            {
                (props) => <PrintButton {...props} />
            }
        </PrintDecorator>
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
                <PrintContainer
                    doc={props.doc}
                    pageHeight={props.pageHeight}
                    pageWidth={props.pageWidth}
                    rotation={props.rotation}
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
        Print: PrintDecorator,
        PrintButton: PrintButtonDecorator,
    };
};

export default printPlugin;
