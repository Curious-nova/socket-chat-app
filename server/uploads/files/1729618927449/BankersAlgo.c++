#include <iostream>
#include <vector>

using namespace std;

bool isSafe(int n, int m, vector<vector<int>> &allocation, vector<vector<int>> &max, vector<int> &available)
{
    vector<int> fn(n, 0);
    vector<int> ans(n, 0);
    int index = 0;

    vector<vector<int>> need(n, vector<int>(m, 0));
    for (int i = 0; i < n; i++)
    {
        for (int j = 0; j < m; j++)
        {
            need[i][j] = max[i][j] - allocation[i][j];
        }
    }

    cout << "Need Matrix:\n";
    for (int i = 0; i < n; i++)
    {
        for (int j = 0; j < m; j++)
        {
            cout << need[i][j] << " ";
        }
        cout << endl;
    }
    for (int k = 0; k < n; k++)
    {
        for (int i = 0; i < n; i++)
        {
            if (fn[i] == 0)
            {
                bool flag = false;
                for (int j = 0; j < m; j++)
                {
                    if (need[i][j] > available[j])
                    {
                        flag = true;
                        break;
                    }
                }

                if (!flag)
                {
                    ans[index++] = i;
                    for (int y = 0; y < m; y++)
                    {
                        available[y] += allocation[i][y];
                    }
                    fn[i] = 1;
                }
            }
        }
    }

    if (index == n)
    {
        cout << "Safe sequence is :\n";
        for (int i = 0; i < n - 1; i++)
        {
            cout << "P" << ans[i] << " -> ";
        }
        cout << "P" << ans[n - 1] << endl;
        return true;
    }
    else
    {
        cout << "The system is not in a safe state!" << endl;
        return false;
    }
}

int main()
{
    int n = 3;
    int m = 3;
    vector<vector<int>> allocation = {
        {1, 0, 2}, {0, 3, 1}, {1, 0, 2}
    };
    vector<vector<int>> max = {
        {4, 1, 2},
        {1, 5, 1},
        {1, 2, 3} 
    };
    vector<int> available = {2, 2, 0};
    isSafe(n, m, allocation, max, available);
    return 0;
}
