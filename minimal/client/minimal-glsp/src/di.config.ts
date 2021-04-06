/********************************************************************************
 * Copyright (c) 2020 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import '../css/diagram.css';

import {
    boundsModule,
    buttonModule,
    configureModelElement,
    ConsoleLogger,
    defaultGLSPModule,
    defaultModule,
    edgeLayoutModule,
    expandModule,
    exportModule,
    fadeModule,
    glspDecorationModule,
    GLSPGraph,
    glspHoverModule,
    glspMouseToolModule,
    glspSelectModule,
    glspServerCopyPasteModule,
    layoutCommandsModule,
    LogLevel,
    modelHintsModule,
    modelSourceModule,
    openModule,
    overrideViewerOptions,
    paletteModule,
    routingModule,
    SEdge,
    SGraphView,
    SLabel,
    toolFeedbackModule,
    toolsModule,
    TYPES,
    validationModule,
    viewportModule,
    zorderModule
} from '@eclipse-glsp/client';
import { Container, ContainerModule } from 'inversify';

import { ActivityNode, EventNode, TaskNode } from './model';
import {
    AssociationEdgeView,
    EventNodeView,
    EventTaskNodeView,
    ForeignLabelView,
    ForkOrJoinNodeView,
    TaskNodeView,
    WorkflowEdgeView
} from './workflow-views';

const minimalDiagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
    rebind(TYPES.LogLevel).toConstantValue(LogLevel.warn);
    const context = { bind, unbind, isBound, rebind };
    configureModelElement(context, 'graph', GLSPGraph, SGraphView);
    // configureModelElement(context, 'node', RectangularNode, RectangularNodeView);
    configureModelElement(context, 'event:start', EventNode, EventNodeView);
    configureModelElement(context, 'event:end', EventNode, EventNodeView);
    configureModelElement(context, 'event:task', EventNode, EventTaskNodeView);
    configureModelElement(context, 'activity:alternative', ActivityNode, ForkOrJoinNodeView);
    configureModelElement(context, 'activity:gateway', ActivityNode, ForkOrJoinNodeView);
    configureModelElement(context, 'node', TaskNode, TaskNodeView);
    configureModelElement(context, 'node:comment', TaskNode, TaskNodeView);
    configureModelElement(context, 'edge', SEdge, WorkflowEdgeView);
    configureModelElement(context, 'edge:association', SEdge, AssociationEdgeView);
    configureModelElement(context, 'label', SLabel, ForeignLabelView);
});

export default function createContainer(widgetId: string): Container {
    const container = new Container();

    container.load(validationModule, defaultModule, glspMouseToolModule, defaultGLSPModule, glspSelectModule, boundsModule, viewportModule, toolsModule,
        glspHoverModule, fadeModule, exportModule, expandModule, openModule, buttonModule, modelSourceModule,
        minimalDiagramModule, toolFeedbackModule, modelHintsModule, glspServerCopyPasteModule, paletteModule, routingModule, glspDecorationModule, edgeLayoutModule, zorderModule,
        layoutCommandsModule);

    overrideViewerOptions(container, {
        baseDiv: widgetId,
        hiddenDiv: widgetId + '_hidden',
        needsClientLayout: true
    });

    return container;
}
