/**
 * Load data from CSV file asynchronously and render charts
 */
d3.csv('data/Sleep_Efficiency.csv').then(data => {

    // Convert columns to numerical values
    data.forEach(d => {
        Object.keys(d).forEach(attr => {
            // TODO: data preprocessing
        });
    });
});

/*
 * Todo:
 * - initialize views
 * - filter data
 * - listen to events and update views
 */
