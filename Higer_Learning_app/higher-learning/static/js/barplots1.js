// Load data from data.csv
var myArray = d3.csv("../static/data/avg_costs.csv").then(function(data) {
   console.log(data);
   data.sort((a,b) => parseFloat(b.Avg_Cost_Per_Student)-parseFloat(a.Avg_Cost_Per_Student));
   console.log(data);
   data = data.reverse();
var trace1 = {
   x: data.map(row => row.Avg_Cost_Per_Student),
   y: data.map(row => row.State),
   text: data.map(row => row.Avg_Cost_Per_Student),
   type: 'bar',
   orientation: 'h'
};
var data = [trace1];
var layout = {
   title: 'Cost Per Student by State (in 000s)',
   autosize: "true",
   width: "100%",
   height: "100%",
   margin: {
     l: 200,
     r: 5,
     t: 30,
     b: 30,
   }
 };
 Plotly.newPlot('bar1', data, layout);
});

