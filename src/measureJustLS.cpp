#include <chrono>
#include <cstdlib>
#include <fstream>
#include <iostream>
#include <random>
#include <vector>

#include "main.h"

using namespace std;
using namespace chrono;

vector<vector<int>> generateRandomDistanceMatrix(int size) {
  vector<vector<int>> matrix(size, vector<int>(size));
  for (int i = 0; i < size; i++) {
    for (int j = 0; j < size; j++) {
      matrix[i][j] = (i == j) ? 0 : rand() % 100 + 1;
    }
  }

  return matrix;
}

void measureLocalSearch(int size, ofstream& outFile) {
  vector<long long> runtimes;
  double average = 0;
  for (int i = 0; i < 5; i++) {
    auto start = high_resolution_clock::now();
    vector<vector<int>> matrix = generateRandomDistanceMatrix(size);
    tsp_ls(matrix);
    auto end = high_resolution_clock::now();
    long long duration = duration_cast<milliseconds>(end - start).count();
    runtimes.push_back(duration);
    average += duration;
  }

  average /= runtimes.size();

  outFile << "Size (" << size << ") [ ";
  for (auto runtime : runtimes) {
    outFile << runtime << " ";
  }
  outFile << "] -> Avg (" << average << ")\n" << flush;
}

int main(int argc, char** args) {
  if (argc != 2) {
    cout << "Missing runtime in minutes. \n";
    exit(1);
  }

  const int runtime = atoi(args[1]);
  if (runtime <= 0) {
    cout << "Invalid runtime. Must be >= 0 minutes\n";
    exit(1);
  }

  srand(time(nullptr));
  ofstream outFile("tsp_ls-" + to_string(runtime) + "-min.txt");
  outFile.clear();  // rm file contents // no append

  cout << "\nRunning test for " << runtime << " minutes\n";
  auto startTime = high_resolution_clock::now();

  int size = 5;
  while (true) {
    if (duration<double, ratio<60>>(high_resolution_clock::now() - startTime)
            .count() >= runtime) {
      cout << "Time limit of " << runtime << " minutes reached.\n";
      break;
    }

    measureLocalSearch(size++, outFile);
  }

  string fn("node graph-tsp-ls.js " + to_string(runtime));
  system(fn.c_str());

  outFile.close();
  return 0;
}
