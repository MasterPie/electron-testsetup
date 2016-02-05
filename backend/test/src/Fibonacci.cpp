#include "Fibonacci.h"

Fibonacci::Fibonacci(){}

int Fibonacci::GetNthNumber(int n)
{
    if (n == 0)
        return 0;
    if (n == 1)
        return 1;
    if (n == 2)
        return 1;

    DoExpensiveOperation();

    return GetNthNumber(n - 1) + GetNthNumber(n - 2);
}

void Fibonacci::DoExpensiveOperation()
{
    //allocate a ton of memory and then do nothing with it and then ultimately release it
}
