/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

module powerbi.extensibility.visual {
    // d3
    import Selection = d3.Selection;

    // powerbi.extensibility.utils.interactivity
    import ISelectionHandler = powerbi.extensibility.utils.interactivity.ISelectionHandler;
    import SelectableDataPoint = powerbi.extensibility.utils.interactivity.SelectableDataPoint;
    import IInteractiveBehavior = powerbi.extensibility.utils.interactivity.IInteractiveBehavior;
    import IInteractivityService = powerbi.extensibility.utils.interactivity.IInteractivityService;
    import registerStandardSelectionHandler = powerbi.extensibility.utils.interactivity.interactivityUtils.registerStandardSelectionHandler;

    export interface BehaviorOptions {
        clearCatcher: Selection<any>;
        dataPointsSelection: Selection<EnhancedScatterChartDataPoint>;
        interactivityService: IInteractivityService;
    }

    export const DefaultOpacity: number = 0.85;
    export const DimmedOpacity: number = 0.4;

    export function getFillOpacity(
        selected: boolean,
        highlight: boolean,
        hasSelection: boolean,
        hasPartialHighlights: boolean
    ): number {
        if ((hasPartialHighlights && !highlight) || (hasSelection && !selected)) {
            return DimmedOpacity;
        }

        return DefaultOpacity;
    }

    export class VisualBehavior implements IInteractiveBehavior {
        public options: BehaviorOptions;

        public bindEvents(options: BehaviorOptions, selectionHandler: ISelectionHandler): void {
            this.options = options;

            const {
                dataPointsSelection,
            } = options;

            registerStandardSelectionHandler(dataPointsSelection, selectionHandler);

            options.clearCatcher.on("click", () => {
                selectionHandler.handleClearSelection();
            });
        }

        public renderSelection(hasSelection: boolean) {
            const {
                dataPointsSelection,
                interactivityService,
            } = this.options;

            const hasHighlights: boolean = interactivityService.hasSelection();

            dataPointsSelection.style("opacity", (dataPoint: EnhancedScatterChartDataPoint) => {
                return getFillOpacity(
                    dataPoint.selected,
                    dataPoint.highlight,
                    !dataPoint.highlight && hasSelection,
                    !dataPoint.selected && hasHighlights
                );
            });
        }
    }
}
