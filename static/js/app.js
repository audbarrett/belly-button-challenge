// read in json from provided URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// init to select first test subject from dropdown for initial graphs
function init() {
  // read in json data
  d3.json(url).then(function(data) {
    let names = data.names;
    // select dropdown menu
    let selector = d3.select("#selDataset");
    // populate dropdown menu with id numbers
    for (let i = 0; i < names.length; i++) {
      selector.append("option").text(names[i]).property("value", names[i]);  
    }
    // select first sample for initialized graphs
    let firstSample = names[0];
    // call make chart & demo info functions with first ID
    charts(firstSample)
    demoInfo(firstSample)
    });

}

// create charts function
function charts(sample) {
    // read in json data
    d3.json(url).then(function(data) {
        // filter only id number currently needed
        let samplesList = data.samples.filter(i => i.id == sample)
        let currentSample = samplesList[0]
        let otu_ids = currentSample.otu_ids;
        // format otu_ids
        let formatted_otu_ids = otu_ids.map(i => `OTU ${i}`).slice(0,10).reverse()
            console.log(formatted_otu_ids)
        // get other values for x & y
        let otu_labels = currentSample.otu_labels;
        let sample_values = currentSample.sample_values;
            console.log(sample_values)
        // filter only to top 10 (need to figure out how to reverse without messing up graph)
        let sample_values_10 = currentSample.sample_values.slice(0,10).reverse();
            console.log(sample_values_10);

        // horizontal bar graph
        // set up bar graph data
        let barData = [{
            x: sample_values_10,
            y: formatted_otu_ids,
            text: otu_labels,
            type: 'bar',
            orientation: 'h' 
        }];
        let barLayout = {
            hovermode: 'closest',
            height: 600,
            width: 400}

        // plot bar graph
        Plotly.newPlot("bar", barData, barLayout);
        
        //bubble chart
        //set up bubble data
        let bubbleData = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                color: otu_ids,
                size: sample_values,
                colorscale: 'Earth'}
              }];
        let bubbleLayout = {
            height: 500,
            width: 1000,
            xaxis: {title: {text: 'OTU ID'}}
        }
        // plot bubble chart
        Plotly.newPlot("bubble", bubbleData, bubbleLayout)
    })
};

// create demoInfo function
function demoInfo(sample) {
  // read in json 
  d3.json(url).then(function(data) {
    // get only metadata from json
    let metadata = data.metadata;
    // select only id number currently being used
    let dataList = metadata.filter(i => i.id == sample)
    let currentData = dataList[0]
        console.log(currentData)
    // select metadata box from html
    let metadataBox = d3.select("#sample-metadata")
    // empty out box
    metadataBox.html("")
    // append h6 and fill with text pulled from dictionary key & value pairs
    Object.entries(currentData).forEach(([key,value]) => {
        metadataBox.append("h6").text(key + ": " + value)
    });
})
}
// create optionChanged function & call both functions
function optionChanged(sample) {
    charts(sample)
    demoInfo(sample)
};

// call init to set initial graphs
init();