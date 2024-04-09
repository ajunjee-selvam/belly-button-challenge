// Use the D3 library to read in samples.json from the URL https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json.
d3.json("samples.json").then(function(samples_data){
    console.log(samples_data)
});

// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual. 
// - Use sample_values as the values for the bar chart. 
// - Use otu_ids as the labels for the bar chart. 
// - Use otu_labels as the hovertext for the chart.

// Function for creating bar chart based on the selected dataset
function createBarChart(sample_values,otu_ids,otu_labels) {
    // Define the data array and set the orientation to horizontal 
    let data = [{
        type: 'bar',
        x: sample_values,
        y: otu_ids,
        text: otu_labels,
        orientation: 'h'
    }];

    // Define the title and dimensions
    let layout = {
        title: "Top 10 OTUs",
        height: 500,
        width: 1100
    };

    //Plot the bar chart
    Plotly.newPlot('bar', data, layout);
};

// Create a bubble chart that displays each sample.
// - Use otu_ids for the x values.
// - Use sample_values for the y values.
// - Use sample_values for the marker size.
// - Use otu_ids for the marker colors.
// - Use otu_labels for the text values.

// Function for creating bubble chart based on the selected dataset
function createBubbleChart(otu_ids,sample_values,otu_labels) {
    // Define the data array and set marker sizes and colors
    let data = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
            size: sample_values,
            color: otu_ids
        }
    }];

    // Define the titles and dimensions
    let layout = {
        title: "OTU ID Values",
        xaxis: {
            title: {
                text: 'OUT ID'
            },
            height: 1000,
            weidth: 1000
        }
    };
    
    // Plot the bubble chart
    Plotly.newPlot('bubble', data, layout);
};

// Display the sample metadata, i.e., an individual's demographic information.
// Display each key-value pair from the metadata JSON object somewhere on the page.
function demoInfo(data) {
    // Select the metadata element in the html 
    let demo_info = d3.select("#sample-metadata");
    demo_info.html("")

    // Create a list to store the demographic information and append each key and value to the list
    let demo_info_list = demo_info.append("ul");
    Object.entries(data).forEach(([key, value]) => {
        demo_info_list.append("li").text(key + ": " + value);
     });
};


// Update all the plots when a new sample is selected. 
function optionChanged(value) {
    d3.json("./data/samples.json").then(function(sample_data) {
        // Filter the metadata for the selected id
        let metadata = sample_data.metadata.filter(data => data.id == value);

        // Filter the samples for the selected id
        let sample = sample_data.samples.filter(data => data.id == value);
        
        // Call the bar chart function and set the parameters for the Top 10 IDs in reverse order using the previously defined sample variable
        createBarChart(
            sample[0].sample_values.slice(0,10).reverse(),
            // Update the labels to include "OTU" before the ids
            sample[0].otu_ids.slice(0,10).reverse().map(a=>"OTU "+ a),
            sample[0].otu_labels.slice(0,10).reverse());
        // Call the bubble chart function and set the parameters using the previously defined sample variable
        createBubbleChart(
            sample[0].otu_ids,
            sample[0].sample_values,
            sample[0].otu_labels);
        // Call the demographic info function using the previously defined metadata variable
        demoInfo(metadata[0]);
    });
};


function init() {
    // Select the dropdown element
    let dropdown = d3.select("#selDataset")

    // Select the data and populate the dropdown list with the sample name/id values
    d3.json("samples.json").then((sample_data)=> {
    sample_data.names.forEach(function(name) {
        dropdown.append("option").text(name).property("value");
    })

    // Filtering the data and metadata based on the first sample id in the dataset
    let sample = sample_data.samples.filter(data => data.id == sample_data.names[0]);
    let metadata = sample_data.metadata.filter(data => data.id == sample_data.names[0]);

    // Calling the bar chart function and initializing the bar chart based on the first id in the dropdown
    createBarChart(
    sample[0].sample_values.slice(0,10).reverse(),
    // Update the labels to include "OTU" before the ids
    sample[0].otu_ids.slice(0,10).reverse().map(a=>"OTU "+ a),
    sample[0].otu_labels.slice(0,10).reverse());
    
    // Calling the bubble chart function and initializing the bubble chart based on the first id in the dropdown
    createBubbleChart(
        sample[0].otu_ids,
        sample[0].sample_values,
        sample[0].otu_labels);

    // Calling the demographic info function for the initialization based on the first id in the dropdown
    demoInfo(metadata[0]);
})};

// Calling the init function for the default plot and table generations
init();