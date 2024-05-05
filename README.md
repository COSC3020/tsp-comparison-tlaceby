[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/7Wc93oxi)

# Traveling Salesperson Problem -- Empirical Analysis

For this exercise, you'll need to take the code from the TSP Held-Karp and TSP
Local Search exercises. This can be your own implementation or somebody else's.
You will now do an empirical analysis of the implementations, comparing their
performance. Both the Held-Karp and the Local Search algorithms solve the same
problem, but they do so in completely different ways. This results in different
solutions, and in different times required to get to the solution.

Investigate the implementations' empirical time complexity, i.e. how the runtime
increases as the input size increases. _Measure_ this time by running the code
instead of reasoning from the asymptotic complexity (this is the empirical
part). Create inputs of different sizes and plot how the runtime scales (input
size on the $x$ axis, time on the $y$ axis). Your largest input should have a
runtime of _at least_ an hour. The input size that gets you to an hour will
probably not be the same for the Held-Karp and Local Search implementations.

In addition to the measured runtime, plot the tour lengths obtained by both
implementations on the same input distance matrices. The length of the tour that
Held-Karp found should always be less than or equal to the tour length that
Local Search found. Why is this?

Add the code to run your experiments, graphs, and an explanation of what you did
to this markdown file.

## Reproductability

If you want to reproduce the code then please make sure you have `g++` and patience xD. I took my javascript code and ported it to c++ as I was running into issues with the javascript `Map()` running out of memory way too quickly.

You will need a plotly account and create a `.env` file with a `USERNAME & PASSWORD` variables.

Here is an example:

```.env
PASSWORD=34nkhrkndfi3j53kjn54
USERNAME=lars_whatever
```

Then you can build the c++ project and execute the main executable. This will test for one hour atleast. After I gather data for one hour of work, I want to have this run for a entire day.

```bash
g++ -std=c++20 -o main src/main.cpp src/tsp-hk.cpp src/tsp-ls.cpp && ./main
```

To create graphs for both local and held-karp just run

```bash
node graphs.js
```

To do the analysis on just local search:

```bash
g++ -std=c++20 -o main src/measureJustLs.cpp src/tsp-hk.cpp src/tsp-ls.cpp -o tspls_analysis && ./tspls_analysis
```

## Analysis

### Comparing Held-Karp and Local-Search

- Takeaways: LS Much faster than hk. However at the cost of some accuracy.
- HK Grows expenontial vs polynomial time.
- HK Accuracy is only linear to LS.

### Looking Deeper into Local Search

- LS Much better option for anything but small input sizes.
