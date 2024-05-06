#include <algorithm>
#include <limits>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <vector>

using namespace std;

int heldKarp(const unordered_set<int>& cities, int start,
             const vector<vector<int> >& distances,
             unordered_map<string, int>& cache) {
  if (cities.size() == 1) {
    int remainingCity = *cities.begin();
    return distances[start][remainingCity];
  }

  int minTourLength = numeric_limits<int>::max();
  string key = "";
  for (int city : cities) {
    key += to_string(city) + "-";
  }
  key += to_string(start);

  if (cache.find(key) != cache.end()) {
    return cache[key];
  }

  for (int city : cities) {
    if (city != start) {
      unordered_set<int> newCities = cities;
      newCities.erase(city);

      // tourLength = (start -> city) + (city -> .. -> tourEnd)
      int tourLength =
          heldKarp(newCities, city, distances, cache) + distances[start][city];
      minTourLength = min(minTourLength, tourLength);
    }
  }

  cache[key] = minTourLength;
  return minTourLength;
}

int tsp_hk(const vector<vector<int> >& distances) {
  int n = distances.size();
  unordered_map<string, int> cache;

  if (n <= 1) {
    return 0;
  }

  int minTourLength = numeric_limits<int>::max();

  for (int start = 0; start < n; start++) {
    unordered_set<int> cities;
    for (int i = 0; i < n; i++) {
      if (i != start) {
        cities.insert(i);
      }
    }

    int tourLength = heldKarp(cities, start, distances, cache);
    minTourLength = min(minTourLength, tourLength);
  }

  return minTourLength;
}