#pragma once
#include <algorithm>
#include <cstdlib>
#include <ctime>
#include <limits>
#include <random>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <vector>

using namespace std;

int heldKarp(const unordered_set<int>& cities, int start,
             const vector<vector<int> >& distances,
             unordered_map<string, int>& cache);

int tsp_hk(const vector<vector<int> >& distances);

int calculateRouteLength(const vector<int>& route,
                         const vector<vector<int> >& distances);

vector<int> randomRoute(int n);
vector<int> optSwap(const vector<int>& route);
int tsp_ls(const vector<vector<int> >& distances);