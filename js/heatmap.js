class Heatmap {

    /**
     * Class constructor with initial configuration
     * @param {Object}
     * @param {Array}
     */
    constructor(_config, _data) {
        // TODO: adjust config according to the design and add parameters if needed
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: 600,
            containerHeight: 380,
            margin: {top: 15, right: 15, bottom: 20, left: 25},
            legendWidth: 160,
            legendBarHeight: 10
        }
        this.data = _data;
        this.initVis();
    }

    initVis() {
        // Create SVG area, initialize scales and axes
        const vis = this;
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        vis.config.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.config.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        vis.chartArea = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

        vis.colorScale = d3.scaleSequential()
            .interpolator(d3.interpolateBlues);

        vis.xScale = d3.scaleBand()
            .range([10, vis.config.width - 40]);

        vis.yScale = d3.scaleBand()
            .range([0, vis.config.height])
            .paddingInner(0.05);

        vis.xAxis = d3.axisBottom(vis.xScale)
            .ticks(11)
            .tickSize(0)
            .tickFormat(d3.format(".1f")) // Remove comma delimiter for thousands
            .tickPadding(10);

        vis.yAxis = d3.axisLeft(vis.yScale)
            .tickSize(0);

        vis.xAxisG = vis.chartArea.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0,${vis.config.height})`);

        // Append y-axis group
        vis.yAxisG = vis.chartArea.append('g')
            .attr('class', 'axis y-axis')
            .attr('transform', `translate(10,0)`);

        // prep for legend
        vis.legend = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.containerWidth - vis.config.legendWidth - vis.config.margin.right},0)`);

        vis.legendColorGradient = vis.legend.append('defs').append('linearGradient')
            .attr('id', 'linear-gradient');

        vis.legendColorRamp = vis.legend.append('rect')
            .attr('width', vis.config.legendWidth)
            .attr('height', vis.config.legendBarHeight)
            .attr('fill', 'url(#linear-gradient)');

        vis.xLegendScale = d3.scaleLinear()
            .range([0, vis.config.legendWidth]);

        vis.xLegendAxis = d3.axisBottom(vis.xLegendScale)
            .tickSize(vis.config.legendBarHeight + 3)
            .tickFormat(d3.format('.2f'));

        vis.xLegendAxisG = vis.legend.append('g')
            .attr('class', 'axis x-axis legend-axis');

        vis.updateVis();
    }

    updateVis() {
        // Prepare data and scales
        const vis = this;
        vis.groupedData = d3.rollups(vis.data, v => d3.mean(v, d => d.sleepEfficiency), d => d.ageGroup, d => d.sleepDuration);
        vis.yValue = d => d[0];
        vis.colorValue = d => d[1];
        vis.xValue = d => d[0];
        vis.colorScale.domain([0, 1]);
        vis.xScale.domain([5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10]);
        vis.yScale.domain(vis.groupedData.map(vis.yValue).sort(d3.ascending));
        vis.renderVis();
        vis.renderLegend();
    }

    renderVis() {
        // Bind data to visual elements, update axes
        const vis = this;
        // Bind data to selection and use the name of each state (d[0]) as a key
        const row = vis.chartArea.selectAll('.h-row')
            .data(vis.groupedData, d => d[0])
            .join('g')
            .attr('class', 'h-row')
            .attr('transform', d => `translate(0,${vis.yScale(vis.yValue(d))})`);

        // Append row label (y-axis)
        // rowEnter.append('text')
        //     .attr('class', 'h-label')
        //     .attr('text-anchor', 'end')
        //     .attr('dy', '0.85em')
        //     .attr('x', -8)
        //     .text(vis.yValue);

        const cellWidth = (vis.config.width / 12 - 2);

        const cell = row.selectAll('.h-cell')
            .data(d => d[1])
            .join('rect')
            .attr('class', 'h-cell')
            .attr('height', vis.yScale.bandwidth())
            .attr('width', cellWidth)
            .attr('x', d => vis.xScale(vis.xValue(d)))
            .attr('fill', d => {
                if (d[1] === null) {
                    return '#fff';
                } else {
                    return vis.colorScale(vis.colorValue(d));
                }
            });

        // TODO: deal with N/A
        // const cellNa = row.merge(rowEnter).selectAll('.h-cell-na')
        //     .data(d => {
        //         console.log(d);
        //         d[1].filter(k => k.value === null)
        //     });
        //
        // const cellNaEnter = cellNa.enter().append('line')
        //     .attr('class', 'h-cell-na');
        //
        // cellNaEnter.merge(cellNa)
        //     .attr('x1', d => vis.xScale(vis.xValue(d)))
        //     .attr('x2', d => vis.xScale(vis.xValue(d)) + cellWidth)
        //     .attr('y1', vis.yScale.bandwidth())
        //     .attr('y2', 0);

        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);
    }

    /**
     * Update colour legend
     */
    renderLegend() {
        const vis = this;

        // Add stops to the gradient
        // Learn more about gradients: https://www.visualcinnamon.com/2016/05/smooth-color-legend-d3-svg-gradient
        vis.legendColorGradient.selectAll('stop')
            .data(vis.colorScale.range())
            .join('stop')
            .attr('offset', (d, i) => i / (vis.colorScale.range().length - 1))
            .attr('stop-color', d => d);

        // Set x-scale and reuse colour-scale because they share the same domain
        // Round values using `nice()` to make them easier to read.
        vis.xLegendScale.domain(vis.colorScale.domain()).nice();
        const extent = vis.xLegendScale.domain();

        // Manually calculate tick values
        vis.xLegendAxis.tickValues([
            extent[0],
            parseFloat(extent[1] / 4),
            parseFloat(extent[1] / 2),
            parseFloat(extent[1] / 4 * 3),
            extent[1]
        ]);

        // Update legend axis
        vis.xLegendAxisG.call(vis.xLegendAxis);
    }

}