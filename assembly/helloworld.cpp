#include <stdio.h>
#include <emscripten.h>

extern "C"
{
    EMSCRIPTEN_KEEPALIVE
    int AddNums(int a, int b)
    {
        return a + b;
    }
}

EMSCRIPTEN_KEEPALIVE
int main()
{
    printf("Hello world, %d\n", AddNums(3, 5));
    return 0;
}
