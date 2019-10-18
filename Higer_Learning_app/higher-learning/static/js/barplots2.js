var myArray = d3.csv("../static/data/avg_costs.csv").then(function(data) {
    console.log(data);
    data.sort((a,b) => parseFloat(b.Avg_Cost_Per_Prisoner)-parseFloat(a.Avg_Cost_Per_Prisoner));
    console.log(data);
    data = data.reverse();
  var trace2 = {
    x: data.map(row => row.Avg_Cost_Per_Prisoner),
    y: data.map(row => row.State),
    text: data.map(row => row.Avg_Cost_Per_Prisoner),
    type: 'bar',
    orientation: 'h'
  }
  var data2 = [trace2];
  var layout2 = {
    title: 'Cost Per Prisoner by State (in 000s)',
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
  Plotly.newPlot('bar2', data2, layout2);
});


var myArray = d3.csv("../static/data/avg_costs.csv").then(function(data) {
   console.log(data);
   data.sort((a,b) => parseInt(b.At_or_Above_Basic)-parseInt(a.At_or_Above_Basic));
   console.log(data);
   data = data.reverse();
 var trace3 = {
   x: data.map(row => row.At_or_Above_Basic),
   y: data.map(row => row.State),
   text: data.map(row => row.At_or_Above_Basic),
   type: 'bar',
   orientation: 'h'
 }
 var data = [trace3];
 var layout = {
   title: 'At or Above Basic Reading Proficiency',
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
 Plotly.newPlot('bar3', data, layout);
 });




var myArray = d3.csv("../static/data/avg_costs.csv").then(function(data) {
  console.log(data);
   data.sort((a,b) => parseInt(b.Incarceration)-parseInt(a.Incarceration));
   console.log(data);
   data = data.reverse();
 var trace4 = {
   x: data.map(row => row.Incarceration),
   y: data.map(row => row.State),
   text: data.map(row => row.Incarceration),
   type: 'bar',
   orientation: 'h'
 }
 var data4 = [trace4];
 var layout4 = {
   title: 'Incarceration Rates per 100,000 residents',
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
 Plotly.newPlot('bar4', data4, layout4);
});

