const fs = require("fs");
require("dotenv").config();
const plotly = require("plotly")(process.env.USERNAME, process.env.PASSWORD);

function parseData() {
  const resultsData = fs.readFileSync("results.txt", "utf-8");
  const lines = resultsData.split("\n");
  let iterations = parseInt(lines[0].split("(n): ")[1]);
  const hkRuntimes = lines[2].split("[")[1].split("]")[0].split(" ").filter(
    (p) => p != "",
  ).map((p) => parseInt(p));
  const lsRuntimes = lines[3].split("[")[1].split("]")[0].split(" ").filter(
    (p) => p != "",
  ).map((p) => parseInt(p));
  const hkTourLengths = lines[4].split("[")[1].split("]")[0].split(" ").filter(
    (p) => p != "",
  ).map((p) => parseInt(p));
  const lsTourLengths = lines[5].split("[")[1].split("]")[0].split(" ").filter(
    (p) => p != "",
  ).map((p) => parseInt(p));

  const data = {
    iterations,
    hkTourLengths,
    lsTourLengths,
    lsRuntimes,
    hkRuntimes,
  };

  return data;
}
const data = parseData();
function generateTSPPerformanceLayout() {
  const trace1 = {
    x: Array.from({ length: data.iterations }, (_, i) => i + 1),
    y: data.hkRuntimes,
    type: "scatter",
    mode: "lines",
    name: "Held-Karp Runtimes (ms)",
  };

  const trace2 = {
    x: Array.from({ length: data.iterations }, (_, i) => i + 1),
    y: data.hkTourLengths,
    type: "scatter",
    mode: "lines",
    name: "Held-Karp Tour Lengths",
    color: "blue",
  };

  const trace3 = {
    x: Array.from({ length: data.iterations }, (_, i) => i + 1),
    y: data.lsRuntimes,
    type: "scatter",
    mode: "lines",
    name: "Local Search Runtimes (ms)",
    color: "red",
  };

  const trace4 = {
    x: Array.from({ length: data.iterations }, (_, i) => i + 1),
    y: data.lsTourLengths,
    type: "scatter",
    mode: "lines",
    name: "Local Search Tour Lengths",
    color: "orange",
  };

  const chartData = [trace1, trace2, trace3, trace4];
  const layout = {
    title: "TSP Performance",
    xaxis: {
      title: "Iterations",
    },
    yaxis: {
      title: "Runtime (ms) / Tour Length",
    },
  };

  return {
    data: chartData,
    layout: layout,
    filename: "./assets/tsp-comparison.png",
  };
}
function generateHeldKarpDistanceTimeLayout() {
  const trace = {
    x: data.hkRuntimes,
    y: data.hkTourLengths,
    type: "scatter",
    mode: "lines",
    name: "Held-Karp",
  };

  const chartData = [trace];
  const layout = {
    title: "Held-Karp Distance vs Time",
    xaxis: {
      title: "Runtime (ms)",
    },
    yaxis: {
      title: "Tour Length",
    },
  };

  return {
    data: chartData,
    layout: layout,
    filename: "./assets/hk_dist_time.png",
  };
}

function generateLocalSearchDistanceTimeLayout() {
  const trace = {
    x: data.lsRuntimes,
    y: data.lsTourLengths,
    type: "scatter",
    mode: "lines",
    name: "Local Search",
  };

  const chartData = [trace];
  const layout = {
    title: "Local Search Distance vs Time",
    xaxis: {
      title: "Runtime (ms)",
    },
    yaxis: {
      title: "Tour Length",
    },
  };

  return {
    data: chartData,
    layout: layout,
    filename: "./assets/ls_dist_time.png",
  };
}

function generateDistanceIterationsLayout() {
  const trace1 = {
    x: Array.from({ length: data.iterations }, (_, i) => i + 1),
    y: data.hkTourLengths,
    type: "scatter",
    mode: "lines",
    name: "Held-Karp Tour Lengths",
  };

  const trace2 = {
    x: Array.from({ length: data.iterations }, (_, i) => i + 1),
    y: data.lsTourLengths,
    type: "scatter",
    mode: "lines",
    name: "Local Search Tour Lengths",
  };

  const chartData = [trace1, trace2];
  const layout = {
    title: "Distance vs Iterations",
    xaxis: {
      title: "Iterations",
    },
    yaxis: {
      title: "Tour Length",
    },
  };

  return {
    data: chartData,
    layout: layout,
    filename: "./assets/dist_i.png",
  };
}

function generateTimeIterationsLayout() {
  const trace1 = {
    x: Array.from({ length: data.iterations }, (_, i) => i + 1),
    y: data.hkRuntimes,
    type: "scatter",
    mode: "lines",
    name: "Held-Karp Runtimes (ms)",
  };

  const trace2 = {
    x: Array.from({ length: data.iterations }, (_, i) => i + 1),
    y: data.lsRuntimes,
    type: "scatter",
    mode: "lines",
    name: "Local Search Runtimes (ms)",
  };

  const chartData = [trace1, trace2];
  const layout = {
    title: "Time vs Iterations",
    xaxis: {
      title: "Iterations",
    },
    yaxis: {
      title: "Runtime (ms)",
    },
  };

  return {
    data: chartData,
    layout: layout,
    filename: "./assets/time_i.png",
  };
}
const graphConfigs = [
  generateTSPPerformanceLayout(),
  generateHeldKarpDistanceTimeLayout(),
  generateLocalSearchDistanceTimeLayout(),
  generateDistanceIterationsLayout(),
  generateTimeIterationsLayout(),
];

graphConfigs.forEach((config) => {
  plotly.getImage(
    { data: config.data, layout: config.layout },
    { format: "png", width: 1200, height: 1200 },
    (error, imageStream) => {
      if (error) return console.log(error);
      const fileStream = fs.createWriteStream(config.filename);
      imageStream.pipe(fileStream);
    },
  );
});

// function parseData() {
//   const resultsData = fs.readFileSync("results_test.txt", "utf-8");
//   const lines = resultsData.split("\n");
//   let iterations = parseInt(lines[0].split("(n): ")[1]);
//   const hkRuntimes = lines[2].split("[")[1].split("]")[0].split(" ").filter(
//     (p) => p != "",
//   ).map((p) => parseInt(p));
//   const lsRuntimes = lines[3].split("[")[1].split("]")[0].split(" ").filter(
//     (p) => p != "",
//   ).map((p) => parseInt(p));
//   const hkTourLengths = lines[4].split("[")[1].split("]")[0].split(" ").filter(
//     (p) => p != "",
//   ).map((p) => parseInt(p));
//   const lsTourLengths = lines[5].split("[")[1].split("]")[0].split(" ").filter(
//     (p) => p != "",
//   ).map((p) => parseInt(p));

//   const data = {
//     iterations,
//     hkTourLengths,
//     lsTourLengths,
//     lsRuntimes,
//     hkRuntimes,
//   };

//   console.log(data);
//   return data;
// }

// const data = parseData();

// // Graph 1: Current plot
// const trace1 = {
//   x: Array.from({ length: data.iterations }, (_, i) => i + 1),
//   y: data.hkRuntimes,
//   type: "scatter",
//   mode: "lines",
//   name: "Held-Karp Runtimes (ms)",
// };

// const trace2 = {
//   x: Array.from({ length: data.iterations }, (_, i) => i + 1),
//   y: data.hkTourLengths,
//   type: "scatter",
//   mode: "lines",
//   name: "Held-Karp Tour Lengths",
//   color: "blue",
// };

// const trace3 = {
//   x: Array.from({ length: data.iterations }, (_, i) => i + 1),
//   y: data.lsRuntimes,
//   type: "scatter",
//   mode: "lines",
//   name: "Local Search Runtimes (ms)",
//   color: "red",
// };

// const trace4 = {
//   x: Array.from({ length: data.iterations }, (_, i) => i + 1),
//   y: data.lsTourLengths,
//   type: "scatter",
//   mode: "lines",
//   name: "Local Search Tour Lengths",
//   color: "orange",
// };

// const chartData1 = [trace1, trace2, trace3, trace4];

// const layout1 = {
//   title: "TSP Performance",
//   xaxis: {
//     title: "Iterations",
//   },
//   yaxis: {
//     title: "Runtime (ms) / Tour Length",
//   },
// };

// // Graph 2: Held-Karp distance and time
// const trace5 = {
//   x: data.hkRuntimes,
//   y: data.hkTourLengths,
//   type: "scatter",
//   mode: "lines",
//   name: "Held-Karp",
// };

// const chartData2 = [trace5];

// const layout2 = {
//   title: "Held-Karp Distance vs Time",
//   xaxis: {
//     title: "Runtime (ms)",
//   },
//   yaxis: {
//     title: "Tour Length",
//   },
// };

// // Graph 3: Local Search distance and time
// const trace6 = {
//   x: data.lsRuntimes,
//   y: data.lsTourLengths,
//   type: "scatter",
//   mode: "lines",
//   name: "Local Search",
// };

// const chartData3 = [trace6];

// const layout3 = {
//   title: "Local Search Distance vs Time",
//   xaxis: {
//     title: "Runtime (ms)",
//   },
//   yaxis: {
//     title: "Tour Length",
//   },
// };

// // Graph 4: Distance plotted against iterations
// const trace7 = {
//   x: Array.from({ length: data.iterations }, (_, i) => i + 1),
//   y: data.hkTourLengths,
//   type: "scatter",
//   mode: "lines",
//   name: "Held-Karp Tour Lengths",
// };

// const trace8 = {
//   x: Array.from({ length: data.iterations }, (_, i) => i + 1),
//   y: data.lsTourLengths,
//   type: "scatter",
//   mode: "lines",
//   name: "Local Search Tour Lengths",
// };

// const chartData4 = [trace7, trace8];

// const layout4 = {
//   title: "Distance vs Iterations",
//   xaxis: {
//     title: "Iterations",
//   },
//   yaxis: {
//     title: "Tour Length",
//   },
// };

// // Graph 5: Time plotted against iterations
// const trace9 = {
//   x: Array.from({ length: data.iterations }, (_, i) => i + 1),
//   y: data.hkRuntimes,
//   type: "scatter",
//   mode: "lines",
//   name: "Held-Karp Runtimes (ms)",
// };

// const trace10 = {
//   x: Array.from({ length: data.iterations }, (_, i) => i + 1),
//   y: data.lsRuntimes,
//   type: "scatter",
//   mode: "lines",
//   name: "Local Search Runtimes (ms)",
// };

// const chartData5 = [trace9, trace10];

// const layout5 = {
//   title: "Time vs Iterations",
//   xaxis: {
//     title: "Iterations",
//   },
//   yaxis: {
//     title: "Runtime (ms)",
//   },
// };

// const graphConfigs = [
//   { data: chartData1, layout: layout1, filename: "graph1.png" },
//   { data: chartData2, layout: layout2, filename: "graph2.png" },
//   { data: chartData3, layout: layout3, filename: "graph3.png" },
//   { data: chartData4, layout: layout4, filename: "graph4.png" },
//   { data: chartData5, layout: layout5, filename: "graph5.png" },
// ];

// graphConfigs.forEach((config) => {
//   plotly.getImage(
//     { data: config.data, layout: config.layout },
//     { format: "png", width: 1200, height: 1200 },
//     (error, imageStream) => {
//       if (error) return console.log(error);
//       const fileStream = fs.createWriteStream(config.filename);
//       imageStream.pipe(fileStream);
//     },
//   );
// });
// TODO: Cleanup omfg tyler.
