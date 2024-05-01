#include <algorithm>
#include <cstdlib>
#include <ctime>
#include <random>
#include <vector>

using namespace std;

int calculateRouteLength(const vector<int>& route,
                         const vector<vector<int> >& distances) {
  int length = 0;
  for (size_t i = 0; i < route.size() - 1; i++) {
    length += distances[route[i]][route[i + 1]];
  }
  return length;
}

vector<int> randomRoute(int n) {
  vector<int> route(n);
  for (int i = 0; i < n; i++) {
    route[i] = i;
  }
  random_device rd;
  mt19937 g(rd());
  shuffle(route.begin(), route.end(), g);
  return route;
}

vector<int> optSwap(const vector<int>& route) {
  int n = route.size();
  random_device rd;
  mt19937 g(rd());
  uniform_int_distribution<int> dist(0, n - 2);
  int i = dist(g);
  int k = i + 1 + dist(g) % (n - i - 1);

  vector<int> newRoute = route;
  while (i < k) {
    swap(newRoute[i], newRoute[k]);
    i++;
    k--;
  }
  return newRoute;
}

int tsp_ls(const vector<vector<int> >& distances) {
  int n = distances.size();
  int maxIterations = n * n * n;
  int maxConsecutiveNonImprovements = maxIterations;

  vector<int> route = randomRoute(n);
  int shortestDistance = calculateRouteLength(route, distances);
  int bestDistance = shortestDistance;
  int consecutiveNonImprovements = 0;

  while (consecutiveNonImprovements < maxConsecutiveNonImprovements) {
    vector<int> newRoute = optSwap(route);
    int newDistance = calculateRouteLength(newRoute, distances);

    if (newDistance < shortestDistance) {
      route = newRoute;
      shortestDistance = newDistance;
      consecutiveNonImprovements = 0;
      if (newDistance < bestDistance) {
        bestDistance = newDistance;
      }
    } else {
      consecutiveNonImprovements++;
    }
  }

  return bestDistance;
}