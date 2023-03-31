class PieChart {
    // Definition of sleep type from wikipidia
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
            containerHeight: 525,
            margin: { top: 25, right: 25, bottom: 25, left: 25 },
            radius: 210,
            tooltipPadding: _config.tooltipPadding || 15
        }
        this.data = _data;
        this.initVis();
    }

    initVis() {
        // Create SVG area, initialize scale
        let vis = this;

        vis.config.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.config.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        // Initialize scales
        vis.tooltipScale = d3.scaleOrdinal()
            .domain(["Rapid Eye Movement Sleep", "Deep Sleep", "Light Sleep"])
            .range(["Rapid eye movement sleep (REM sleep) is a unique phase of sleep in mammals and birds, characterized by random rapid movement of the eyes, accompanied by low muscle tone throughout the body, and the propensity of the sleeper to dream vividly.",
                "Slow-wave sleep, often referred to as deep sleep, consists of stage three of non-rapid eye movement sleep.",
                "Non-rapid eye movement sleep, also known as light sleep, is unlike REM sleep, there is usually little or no eye movement during these stages. Dreaming occurs during both sleep states, and muscles are not paralyzed as in REM sleep."]);

        vis.colorScale = d3.scaleOrdinal()
            .domain(["Rapid Eye Movement Sleep", "Deep Sleep", "Light Sleep"])
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
        vis.filteredData = vis.data.filter(d => individuals.includes(d.id));
        if (individuals.length == 0) {
            vis.filteredData = vis.data;
        }
        vis.nestedData = {
            percent: [{ type: "Rapid Eye Movement Sleep", percentage: d3.mean(vis.filteredData, d => d.REMSleepPercentage) },
            { type: "Deep Sleep", percentage: d3.mean(vis.filteredData, d => d.deepSleepPercentage) },
            { type: "Light Sleep", percentage: d3.mean(vis.filteredData, d => d.lightSleepPercentage) }],
            average: [{ title: "Age", value: d3.mean(vis.filteredData, d => d.age) },
            { title: "Sleep Duration", value: d3.mean(vis.filteredData, d => d.sleepDuration) },
            { title: "Sleep Efficiency", value: d3.mean(vis.filteredData, d => d.sleepEfficiency) }],
        };
        vis.typeValue = d => d.data.type;
        vis.renderVis();
    }

    renderVis() {
        // Bind data to visual elements
        let vis = this;
        
        // Add pie chart
        const arcs = vis.chart.selectAll(".arc")
            .data(vis.pie(vis.nestedData.percent))
            .join('path')
            .attr('class', 'arc')
            .attr("fill", d => vis.colorScale(vis.typeValue(d)))
            .attr("d", vis.arc);

        // Add text label on pie chart
        const label = vis.chart.selectAll(".label")
            .data(vis.pie(vis.nestedData.percent))
            .join("text")
            .attr('class', 'label')
            .attr("transform", d => "translate(" + vis.arc.centroid(d) + ")")
            .style("text-anchor", "middle")
            .style("font-size", 17)
            .style("font-weight", 600)
            .attr("fill", "white")
            .text(d => d3.format(".1f")(d.data.percentage) + "%");

        // Add text for detailed information
        const text = vis.svg.selectAll(".text")
            .data(vis.nestedData.average)
            .join("text")
            .attr('class', 'text')
            .attr("transform", (d, i) => `translate(${vis.config.width / 2},${vis.config.height / 2 - 40 + (i * 35)})`)
            .style("text-anchor", "middle")
            .style("font-size", 20)
            .style("font-weight", 500)
            .attr("fill", "#FFFACA")
            .text(d => "Average " + d.title + " : " + d3.format(".1f")(d.value));

        // Add legend
        const legend = vis.svg.selectAll(".legend")
            .data(vis.pie(vis.nestedData.percent))
            .join("g")
            .attr('class', 'legend')
            .attr("transform", (d, i) => `translate(${vis.config.containerWidth - 210},${vis.config.containerHeight - 100 + (i * 22)})`)
            .attr("class", "legend");

        legend.append("rect")
            .attr("width", 18)
            .attr("height", 18)
            .attr("rx", 4)
            .attr("fill", d => vis.colorScale(vis.typeValue(d)));

        legend.append("text")
            .text(d => vis.typeValue(d))
            .style("font-size", 15)
            .attr("fill", "#FFFACA")
            .attr("y", 12)
            .attr("x", 22);

        // Tooltip event listeners
        legend.on('mouseover', (event, d) => {
            d3.select('#tooltip')
                .style('display', 'block')
                .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')
                .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
                .html(`
          <div class='tooltip-title'>${vis.tooltipScale(vis.typeValue(d))}</div>
        `);
        })
            .on('mouseleave', () => {
                d3.select('#tooltip').style('display', 'none');
            });
    }
}