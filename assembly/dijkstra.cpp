#include <stdio.h>
// #include <emscripten.h>
#include <emscripten/bind.h>
#include <string>
#include <vector>
#include <queue>

using namespace emscripten;

const int infinity = 9999999;

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
    Node()
    {
    }

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

class NodeQueue
{
private:
    Node node;
    float dist;

public:
    NodeQueue() {}
    NodeQueue(const Node &node_, const float dist_)
    {
        node = node_;
        dist = dist_;
    }

    Node getNode() const { return node; }
    void setNode(const Node &node_) { node = node_; }
    float getDist() const { return dist; }
    void setDist(const float dist_) { dist = dist_; }
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

typedef std::pair<Node, float> pqNode;

class Compare
{
public:
    bool operator()(NodeQueue a, NodeQueue b)
    {
        return a.getDist() > b.getDist();
    }
};

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

    std::string toString()
    {
        std::string res;

        res += "Nodes:\n";
        for (const auto &node : nodes)
        {
            res += "  (" + std::to_string(node.getX()) + ", " +
                   std::to_string(node.getY()) + ") Label: " +
                   std::to_string(node.getLabel()) + "\n";
        }

        res += "Edges:\n";
        for (const auto &edge : edges)
        {
            res += "  (" + std::to_string(edge.getLabel1()) + ", " + std::to_string(edge.getLabel2()) + ")\n";
        }

        return res;
    }

    std::vector<Node> findPath(int srcLabel, int destLabel)
    {
        Node *srcNode = nullptr;
        Node *destNode = nullptr;

        for (auto &node : nodes)
        {
            if (node.getLabel() == srcLabel)
            {
                srcNode = &node;
            }
            if (node.getLabel() == destLabel)
            {
                destNode = &node;
            }
            if (srcNode && destNode)
            {
                break;
            }
        }

        if (!srcNode || !destNode)
        {
            printf("Cannot find src node or dest node. Check your input data.\n");
            return {};
        }

        printf("Source Node: x-%d; y-%d; label-%d\n", srcNode->getX(), srcNode->getY(), srcNode->getLabel());
        printf("Destination Node: x-%d; y-%d; label-%d\n", destNode->getX(), destNode->getY(), destNode->getLabel());

        std::vector<Node> path = findPathDijkstra(*srcNode, *destNode);

        if (path.empty())
        {
            printf("No path found between the source and destination nodes.\n");
        }
        else
        {
            printf("Path found:\n");
            for (const auto &node : path)
            {
                printf("Node: x-%d; y-%d; label-%d\n", node.getX(), node.getY(), node.getLabel());
            }
        }

        return path;
    }

private:
    // calculate the euclidean distance between 2 nodes using pythagorean theorem
    float calculateDistance(Node srcNode, Node destNode)
    {
        int deltaX = destNode.getX() - srcNode.getX();
        int deltaY = destNode.getY() - srcNode.getY();

        return std::sqrt(deltaX * deltaX + deltaY * deltaY);
    }

    std::vector<Node> findPathDijkstra(Node srcNode, Node destNode)
    {
        //check if the starting node and destination node are the same
        if (srcNode.getLabel() == destNode.getLabel())
        {
            std::vector<Node> path;
            path.push_back(srcNode);
            return path;
        }

        //Create a priority queue, the node with the least distance is placed on top
        std::priority_queue<NodeQueue, std::vector<NodeQueue>, Compare> pq;
        // dist array stores the current smallest distance to get to a node
        float dis[nodes.size()];
        // prev array stores the previous node to get to a node in the shortest path
        Node prev[nodes.size()];

        //creating the initial dist array, set all the values to inifinity and the src node dist to 0
        printf("Initial dist arr:\n");
        for (int i = 0; i < nodes.size(); i++)
        {
            dis[i] = infinity;
            printf("%f,", dis[i]);
        }
        dis[srcNode.getLabel()] = 0;
        printf("Initial dist arr - at srcNode %f\n", dis[srcNode.getLabel()]);

        // printf("Initial Prev array:\n");
        // for (int i = 0; i < nodes.size(); i++)
        // {
        //     printf("index-%d, label-%d\n", i, prev[i].getLabel());
        // }

        //push the src node to the queue, this will be the starting point
        NodeQueue firstNodeQ(srcNode, 0);
        pq.push(firstNodeQ);

        //loop through the priority queue until it is empty
        while (pq.size())
        {
            printf("Priotiy Queue size %zu\n", pq.size());
            //get the node that has the smallest distance in the priority queue
            Node currentNode = pq.top().getNode();
            float curDist = pq.top().getDist();
            int currentLabel = currentNode.getLabel();
            pq.pop();

            printf("Current node-%d, dist-%f\n", currentLabel, curDist);

            //find all the edges of the current node
            for (const Edge &edge : edges)
            {
                if (edge.getLabel1() != currentLabel && edge.getLabel2() != currentLabel)
                {
                    continue;
                }
                
                //get the neighbor node
                int neighborLabel = (edge.getLabel1() == currentLabel) ? edge.getLabel2() : edge.getLabel1();

                Node neighborNode;
                for (const Node &node : nodes)
                {
                    if (node.getLabel() == neighborLabel)
                    {
                        neighborNode = node;
                        break;
                    }
                }

                //calculate the distance to get to the neighbor node from the current node
                float edgeWeight = calculateDistance(currentNode, neighborNode);
                float newDist = curDist + edgeWeight;

                //update dis array and prev array, push the neighbor node to the priority queue 
                //if the new dist is smaller than the current dist to go from the current node to the neighbor node
                if (newDist < dis[neighborLabel])
                {
                    dis[neighborLabel] = newDist;
                    prev[neighborLabel] = currentNode;
                    NodeQueue nodeQ(neighborNode, newDist);
                    pq.push(nodeQ);
                    printf("Push priority queue %d with new dist %f\n", neighborLabel, newDist);
                }
            }
        }


        printf("Final Prev array:\n");
        for (int i = 0; i < nodes.size(); i++)
        {
            printf("index-%d, label-%d\n", i, prev[i].getLabel());
        }

        //trace back the shortest path to go from src node to dest node using the prev arrya
        std::vector<Node>
            path;
        path.push_back(destNode);

        Node &traverseNode = prev[destNode.getLabel()];
        while (traverseNode.getLabel() != srcNode.getLabel())
        {
            path.push_back(traverseNode);
            traverseNode = prev[traverseNode.getLabel()];
        }
        path.push_back(srcNode);

        return path;
    }
};

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

    emscripten::register_vector<Node>("vector<Node>");
    emscripten::register_vector<Edge>("vector<Edge>");

    class_<Dijkstra>("Dijkstra")
        .constructor<>()
        .constructor<const std::vector<Node> &, const std::vector<Edge> &>()
        .property("nodes", &Dijkstra::getNodes, &Dijkstra::setNodes)
        .property("edges", &Dijkstra::getEdges, &Dijkstra::setEdges)
        .function("addNode", &Dijkstra::addNode)
        .function("addEdge", &Dijkstra::addEdge)
        .function("toString", &Dijkstra::toString)
        .function("findPath", &Dijkstra::findPath);
}