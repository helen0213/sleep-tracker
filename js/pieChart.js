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
            containerWidth: 850,
            containerHeight: 850,
            margin: {top: 25, right: 25, bottom: 25, left: 25},
            radius: 400
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
        vis.colorScale = d3.scale.ordinal()
            .domain(["REMSleepPercentage", "deepSleepPercentage", "lightSleepPercentage"])
            .range(["#FFBC76", "#AD5A54", "#6D9E88"]);

        // Define size of SVG drawing area
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        // Initialize arc area
        vis.arc = d3.arc()
            .innerRadius(vis.config.radius - 100)
            .outerRadius(vis.config.radius - 20);

        vis.pie = d3.layout.pie()
            .value(d => d[1]);
        
        // Append group element that will contain our actual chart (see margin convention)
        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);
            //.attr('transform', `translate(${vis.config.width / 2},${vis.config.height / 2})`);
      
        vis.updateVis();
    }

    updateVis() {
        // Prepare data
        let vis = this;
        vis.nestedData = [];
        vis.nestedData.push(["REMSleepPercentage", d3.mean(vis.data, d => d.REMSleepPercentage)]);
        vis.nestedData.push(["deepSleepPercentage", d3.mean(vis.data, d => d.deepSleepPercentage)]);
        vis.nestedData.push(["lightSleepPercentage", d3.mean(vis.data, d => d.lightSleepPercentage)]);
        // group it in another way?
        vis.colorValue = d => d[0];

        vis.renderVis();
    }

    renderVis() {
        // Bind data to visual elements
        let vis = this;
        
        // Add 
        vis.arcs = vis.chart.selectAll(".arc")
            .data(vis.pie(vis.nestedData))
            .enter()
            .append("g")
            .attr("class", "arc");

        vis.arcs.append("path")
            .attr("fill", d => vis.colorScale(vis.colorValue(d)))
            .attr("d", vis.arc);
    }
}