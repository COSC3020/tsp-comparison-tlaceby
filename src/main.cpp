#include "main.h"

#include <chrono>
#include <fstream>
#include <iostream>
#include <vector>

void writeResultsToFile(const vector<long long>& hkRuntimes,
                        const vector<long long>& lsRuntimes,
                        const vector<int>& hkTourLengths,
                        const vector<int>& lsTourLengths);

vector<vector<int>> generateRandomDistanceMatrix(int size) {
  vector<vector<int>> matrix(size, vector<int>(size));
  for (int i = 0; i < size; i++) {
    for (int j = 0; j < size; j++) {
      if (i == j) {
        matrix[i][j] = 0;
      } else {
        matrix[i][j] = rand() % 100 + 1;
      }
    }
  }

  return matrix;
}

int main() {
  auto startTime = chrono::high_resolution_clock::now();

  // Variables to store results
  vector<long long> hkRuntimes;
  vector<long long> lsRuntimes;
  vector<int> hkTourLengths;
  vector<int> lsTourLengths;

  int size = 2;
  while (true) {
    auto currentTime = chrono::high_resolution_clock::now();
    chrono::duration<double> elapsed =
        chrono::duration_cast<chrono::seconds>(currentTime - startTime);

    if (elapsed.count() >= (ONE_HOUR * 8)) {
      cout << "Time limit of 8 hour reached. Stopping experiments." << endl;
      break;
    }

    vector<vector<int>> distances = generateRandomDistanceMatrix(size++);

    auto hkStartTime = chrono::high_resolution_clock::now();
    int hkTourLength = tsp_hk(distances);
    auto hkEndTime = chrono::high_resolution_clock::now();
    long long hkRuntime =
        chrono::duration_cast<chrono::milliseconds>(hkEndTime - hkStartTime)
            .count();

    auto lsStartTime = chrono::high_resolution_clock::now();
    int lsTourLength = tsp_ls(distances);
    auto lsEndTime = chrono::high_resolution_clock::now();
    long long lsRuntime =
        chrono::duration_cast<chrono::milliseconds>(lsEndTime - lsStartTime)
            .count();

    // Store the results
    hkRuntimes.push_back(hkRuntime);
    lsRuntimes.push_back(lsRuntime);
    hkTourLengths.push_back(hkTourLength);
    lsTourLengths.push_back(lsTourLength);

    // Output size and results for the current iteration
    cout << "Size: " << size << endl;
    cout << "Held-Karp Runtime (ms): " << hkRuntime << endl;
    cout << "Local Search Runtime (ms): " << lsRuntime << endl;
    cout << "Held-Karp Tour Length: " << hkTourLength << endl;
    cout << "Local Search Tour Length: " << lsTourLength << endl;
    cout << endl;

    writeResultsToFile(hkRuntimes, lsRuntimes, hkTourLengths, lsTourLengths);
  }

  writeResultsToFile(hkRuntimes, lsRuntimes, hkTourLengths, lsTourLengths);
  return 0;
}

void writeResultsToFile(const vector<long long>& hkRuntimes,
                        const vector<long long>& lsRuntimes,
                        const vector<int>& hkTourLengths,
                        const vector<int>& lsTourLengths) {
  ofstream outFile("./results.txt");
  outFile << "Iterations (n): " << to_string(lsRuntimes.size() + 2) << "\n\n";
  outFile << "Held-Karp Runtimes (ms): ";
  outFile << "[";
  for (long long runtime : hkRuntimes) {
    outFile << runtime << " ";
  }
  outFile << "]" << endl;

  outFile << "Local Search Runtimes (ms): ";
  outFile << "[";
  for (long long runtime : lsRuntimes) {
    outFile << runtime << " ";
  }
  outFile << "]" << endl;

  outFile << "Held-Karp Tour Lengths: ";
  outFile << "[";
  for (int tourLength : hkTourLengths) {
    outFile << tourLength << " ";
  }
  outFile << "]" << endl;

  outFile << "Local Search Tour Lengths: ";
  outFile << "[";
  for (int tourLength : lsTourLengths) {
    outFile << tourLength << " ";
  }
  outFile << "]" << endl;

  outFile.close();
  cout << "Results written to results.txt" << endl;
}
