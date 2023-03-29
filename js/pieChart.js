class PieChart {
    //https://medium.com/javarevisited/create-a-pie-or-doughnut-chart-using-d3-js-7d4a1d590420
    /**
     * Class constructor with initial configuration
     * @param {Object}
     * @param {Array}
     */
    constructor(_config, _data) {
        // TODO: adjust config according to the design and add parameters if needed
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: 525,
            containerHeight: 525,
            margin: {top: 25, right: 25, bottom: 25, left: 25},
            radius: 210
        }
        this.data = _data;
        this.initVis();
    }

    initVis() {
        // Create SVG area, initialize scale
        let vis = this;

        vis.config.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.config.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        // Initialize scale
        vis.colorScale = d3.scaleOrdinal()
            .domain(["REMSleepPercentage", "deepSleepPercentage", "lightSleepPercentage"])
            .range(["#FFBC76", "#AD5A54", "#6D9E88"]);

        // Define size of SVG drawing area
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        // Initialize arc area
        vis.arc = d3.arc()
            .innerRadius(vis.config.radius - 55)
            .outerRadius(vis.config.radius)
            .cornerRadius(10);

        vis.pie = d3.pie()
            .value(d => d.percentage)
            .padAngle(.01);
        
        // Append group element that will contain our actual chart (see margin convention)
        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.width / 2},${vis.config.height / 2})`);
      
        vis.updateVis();
    }

    updateVis() {
        // Prepare data
        let vis = this;
        vis.nestedData = [{type: "REMSleepPercentage", percentage: d3.mean(vis.data, d => d.REMSleepPercentage)},
        {type: "deepSleepPercentage", percentage: d3.mean(vis.data, d => d.deepSleepPercentage)},
        {type: "lightSleepPercentage", percentage: d3.mean(vis.data, d => d.lightSleepPercentage)}];
        vis.colorValue = d => d.data.type;
        vis.renderVis();
    }

    renderVis() {
        // Bind data to visual elements
        let vis = this;
        
        // Add 
        vis.arcs = vis.chart.selectAll(".arc")
            .data(vis.pie(vis.nestedData))
            .enter()
            .append("path")
            .attr("fill", d => vis.colorScale(vis.colorValue(d)))
            .attr("d", vis.arc);

        // ?
        vis.arcs.selectAll(".text")
            .data(vis.pie(vis.nestedData))
            .enter()
            .append("text")
            .attr("transform", d => "translate(" + vis.arc.centroid(d) + ")")
            .style("text-anchor", "middle")
            .style("font-size", 17)
            .text(d => d.data.percentage);
        
    }
}