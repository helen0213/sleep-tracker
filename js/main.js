/**
 * Load data from CSV file asynchronously and render charts
 */

// global objects
const parseTime = d3.timeParse("%H:%M");
let data, lineChart, pieChart, bubbleChart, heatmap;

d3.csv('data/Sleep_Efficiency_preprocessed.csv').then(_data => {
    data = _data;
    data.forEach(d => {
        d.age = +d.age;
        d.id = +d.id;
        d.sleepDuration = +d.sleepDuration;
        d.sleepEfficiency = +d.sleepEfficiency;
        d.REMSleepPercentage = +d.REMSleepPercentage;
        d.deepSleepPercentage = +d.deepSleepPercentage;
        d.lightSleepPercentage = +d.lightSleepPercentage;
        d.caffeineConsumption = +d.caffeineConsumption;
        d.alcoholConsumption = +d.alcoholConsumption;
        d.exerciseFrequency = +d.exerciseFrequency;
        d.time = parseTime(d.time);
    });

    // TODO: commented out to avoid errors, uncomment for testing purpose
    // lineChart = new LineChart({
    //     parentElement: '#linechart',
    // }, data);
    // lineChart.updateVis();
    //
    // pieChart = new PieChart({
    //     parentElement: '#piechart',
    // }, data);
    // pieChart.updateVis();
    //
    // bubbleChart = new BubbleChart({
    //     parentElement: '#bubblechart',
    // }, data);
    // bubbleChart.updateVis();
    //
    // heatmap = new Heatmap({
    //     parentElement: '#heatmap',
    // }, data);
    // heatmap.updateVis();

    // TODO: take a look at variables after transformation first
    console.log(data);
});
/*
 * Todo:
 * - initialize views
 * - filter data
 * - listen to events and update views
 */
