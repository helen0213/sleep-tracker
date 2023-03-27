class LineChart {
    // initial code from d3-annotated-line-chart example and d3-interactive-line-chart example
    /**
     * Class constructor with initial configuration
     * @param {Object}
     * @param {Array}
     */
    constructor(_config, _data) {
        // TODO: adjust config according to the design and add parameters if needed
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: 700,
            containerHeight: 350,
            margin: {top: 15, right: 15, bottom: 20, left: 25}
        }
        this.data = _data;
        this.initVis();
    }

    initVis() {
        // Create SVG area, initialize scales and axes
        let vis = this;

        vis.config.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.config.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
    
        vis.xScale = d3.scaleTime()
            .range([0, vis.config.width - 10]);
    
        vis.yScale = d3.scaleLinear()
            .range([vis.config.height, 10])
            .nice();
    
        // Initialize axes
        vis.xAxis = d3.axisBottom(vis.xScale)
            .ticks(6)
            .tickSizeOuter(0)
            .tickFormat(d3.timeFormat("%I:%M %p"));
    
        vis.yAxis = d3.axisLeft(vis.yScale)
            .ticks(5)
            .tickSizeOuter(0);
    
        // Define size of SVG drawing area
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);
    
        // Append group element that will contain our actual chart (see margin convention)
        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);
    
        // Append empty x-axis group and move it to the bottom of the chart
        vis.xAxisG = vis.chart.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0,${vis.config.height})`);
        
        // Append y-axis group
        vis.yAxisG = vis.chart.append('g')
            .attr('class', 'axis y-axis');
      
        vis.updateVis();
    }

    updateVis() {
        // Prepare data and scales
        let vis = this;
        const parseTime = d3.timeParse("%d %H:%M");
        vis.groupedData = d3.groups(vis.data, d => d.time);
        vis.groupedData.forEach(d => {
            d[0] = parseTime(d[0]);
            d.count = d[1].length;
          });
        vis.groupedData.sort((a,b) => b[0] - a[0]);
        
        vis.xValue = d => d[0];
        vis.yValue = d => d.count;

        vis.line = d3.line()
        .x(d => vis.xScale(vis.xValue(d)))
        .y(d => vis.yScale(vis.yValue(d)));

        // Set the scale input domains
        vis.xScale.domain(d3.extent(vis.groupedData, vis.xValue));
        vis.yScale.domain(d3.extent(vis.groupedData, vis.yValue));

        vis.bisectDate = d3.bisector(vis.xValue).left;

        vis.renderVis();
    }

    renderVis() {
        // Bind data to visual elements, update axes
        let vis = this;

        // Add line path
        vis.chart.selectAll('.chart-line')
            .data([vis.groupedData])
        .join('path')
            .attr('class', 'chart-line')
            .attr('d', vis.line);
    
        // Update the axes
        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);
    }

}