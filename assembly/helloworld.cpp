#include <stdio.h>
#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
int main()
{
    printf("Hello world\n");
    return 0;
}
extern "C"
{
    EMSCRIPTEN_KEEPALIVE
    int AddNums(int a, int b)
    {
        return a + b;
    }
}