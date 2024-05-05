const fs = require("fs");
require("dotenv").config();
const plotly = require("plotly")(process.env.USERNAME, process.env.PASSWORD);

const runtime = process.argv[2];
if (!runtime) {
  console.error("Incorrect usage. Expected number of minutes program ran.");
  process.exit(1);
}

function parseData() {
  const data = fs.readFileSync(`tsp_ls-${runtime}-min.txt`, "utf8");
  const lines = data.split("\n");
  const sizes = [];
  const runtimes = [];
  const averages = [];
  let totalIterations = 0;

  lines.forEach((line) => {
    if (line.startsWith("Size")) {
      const size = parseInt(line.match(/Size \((\d+)\)/)[1]);
      const average = parseFloat(line.match(/-> Avg \(([\d\.]+)\)/)[1]);
      const runtimeValues = line
        .match(/\[ (.+?) \]/)[1]
        .split(" ")
        .map(Number)
        .map((ms) => ms);

      runtimeValues.forEach((runtime) => {
        sizes.push(size);
        runtimes.push(runtime);
      });

      averages.push({ size: size, average: average });
      totalIterations += 1;
    }
  });

  return { sizes, runtimes, averages, totalIterations };
}

const { sizes, runtimes, averages, totalIterations } = parseData();

const scatterTrace = {
  x: sizes,
  y: runtimes,
  mode: "markers",
  type: "scatter",
  name: "Individual Runtimes",
  marker: { size: 3 },
};

const lineTrace = {
  x: averages.map((data) => data.size),
  y: averages.map((data) => data.average),
  mode: "lines+markers",
  type: "scatter",
  name: "Average Runtimes",
  line: { color: "orange", thickness: 1 },
};

const layout = {
  title: `Local Search Runtime by Matrix Size - ${totalIterations} Iterations`,
  xaxis: { title: "Matrix Size" },
  yaxis: { title: "Runtime (ms)" },
  showlegend: true,
};

const imgOpts = {
  format: "png",
  width: 1200,
  height: 1000,
};

const outputFile = `./assets/tsp-ls-plot-${runtime}.png`;
plotly.getImage(
  { data: [scatterTrace, lineTrace], layout: layout },
  imgOpts,
  function (error, imageStream) {
    if (error) return console.error(error);
    const fileStream = fs.createWriteStream(outputFile);
    imageStream.pipe(fileStream);
    fileStream.on("finish", () => console.log(`Saved: ${outputFile}`));
  }
);
