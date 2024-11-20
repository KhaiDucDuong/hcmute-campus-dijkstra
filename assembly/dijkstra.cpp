#include <stdio.h>
// #include <emscripten.h>
#include <string>
#include <vector>
#include <emscripten/bind.h>

using namespace emscripten;

int main()
{
    return 0;
}

// extern "C"
// {
class Node
{
private:
    int x;
    int y;
    int label;

public:
    Node(int x_, int y_, int label_)
    {
        x = x_;
        y = y_;
        label = label_;
    }

    int getX() const
    {
        return x;
    }

    int getY() const
    {
        return y;
    }

    int getLabel() const
    {
        return label;
    }

    void setX(int x_)
    {
        x = x_;
    }

    void setY(int y_)
    {
        y = y_;
    }

    void setLabel(const int &label_)
    {
        label = label_;
    }
};

class Edge
{
private:
    int label1;
    int label2;

public:
    // Constructor
    Edge(const int &label1_, const int &label2_)
        : label1(label1_), label2(label2_) {}

    // Getters
    int getLabel1() const
    {
        return label1;
    }

    int getLabel2() const
    {
        return label2;
    }

    // Setters
    void setLabel1(const int &label1_)
    {
        label1 = label1_;
    }

    void setLabel2(const int &label2_)
    {
        label2 = label2_;
    }
};

// EMSCRIPTEN_KEEPALIVE
// int accumulate(int *arr, int n)
// {
//     int sum = 0;
//     while (n)
//     {
//         sum += arr[--n];
//     }
//     return sum;
// }

class Dijkstra
{
private:
    std::vector<Node> nodes;
    std::vector<Edge> edges;

public:
    Dijkstra() {}

    Dijkstra(const std::vector<Node> &nodes_, const std::vector<Edge> &edges_)
        : nodes(nodes_), edges(edges_) {}

    std::vector<Node> getNodes() const
    {
        return nodes;
    }

    std::vector<Edge> getEdges() const
    {
        return edges;
    }

    void setNodes(const std::vector<Node> &nodes_)
    {
        nodes = nodes_;
    }

    void setEdges(const std::vector<Edge> &edges_)
    {
        edges = edges_;
    }

    void addNode(const Node &node)
    {
        nodes.push_back(node);
    }

    void addEdge(const Edge &edge)
    {
        edges.push_back(edge);
    }
};

// EMSCRIPTEN_KEEPALIVE int
// processGraph(const std::vector<Node> &nodes, const std::vector<Edge> &edges)
// {
//     int totalNodes = nodes.size();
//     int totalEdges = edges.size();
//     // Example: Just return the sum of nodes and edges as a dummy process
//     return totalNodes + totalEdges;
// }

EMSCRIPTEN_BINDINGS(graph)
{
    class_<Node>("Node")
        .constructor<const int, const int, const int>()
        .property("x", &Node::getX, &Node::setX)
        .property("y", &Node::getY, &Node::setY)
        .property("label", &Node::getLabel, &Node::setLabel);

    class_<Edge>("Edge")
        .constructor<const int, const int>()
        .property("label1", &Edge::getLabel1, &Edge::setLabel1)
        .property("label2", &Edge::getLabel2, &Edge::setLabel2);

    class_<Dijkstra>("Dijkstra")
        .constructor<const std::vector<Node> &, const std::vector<Edge> &>()
        .property("nodes", &Dijkstra::getNodes, &Dijkstra::setNodes)
        .property("edges", &Dijkstra::getEdges, &Dijkstra::setEdges)
        .function("addNode", &Dijkstra::addNode)
        .function("addEdge", &Dijkstra::addEdge);
    // emscripten::value_array<Node>("Node")
    //     .element(&Node::x)
    //     .element(&Node::y)
    //     .element(&Node::label);

    // emscripten::value_array<Edge>("Edge");

    // // emscripten::register_vector<Node>("vector<Node>");
    // // emscripten::register_vector<Edge>("vector<Edge>");

    // emscripten::function("processGraph", &processGraph);
}
// }