class Heatmap {

    /**
     * Class constructor with initial configuration
     * @param {Object}
     * @param {Array}
     */
    constructor(_config) {
        // TODO: adjust config according to the design and add parameters if needed
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: 1000,
            containerHeight: 380,
            margin: {top: 15, right: 15, bottom: 20, left: 25}
        }
        this.initVis();
    }

    initVis() {
        // Create SVG area, initialize scales and axes
    }

    updateVis() {
        // Prepare data and scales
    }

    renderVis() {
        // Bind data to visual elements, update axes
    }

}