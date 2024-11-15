let blocks = document.getElementsByClassName("drawing-area")[0];
let addEdge = false;
let cnt = 21; // Start cnt from 4 so dynamic blocks begin after fixed blocks
let dist;

// Initialize the distance matrix once when the page loads
// Initialize the distance matrix once when the page loads
function initializeDistanceMatrix(size) {
  dist = new Array(size).fill(null).map(() => new Array(size).fill(Infinity));

  // Set distances for fixed edges
  fixedEdges.forEach(([start, end]) => {
    const startBlock = document.getElementById(start);
    const endBlock = document.getElementById(end);
    if (startBlock && endBlock) {
      const x1 = parseInt(startBlock.style.left, 10);
      const y1 = parseInt(startBlock.style.top, 10);
      const x2 = parseInt(endBlock.style.left, 10);
      const y2 = parseInt(endBlock.style.top, 10);
      const distance = Math.round(Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2) / 10);

      // Update the distance matrix
      dist[start][end] = distance;
      dist[end][start] = distance; // Assuming undirected graph

      console.log(`Distance set between ${start} and ${end}: ${distance}`);
    } else {
      console.warn(`Could not find start or end block for edge ${start}-${end}`);
    }
  });

  console.log("Distance Matrix:", dist);
}



const fixedBlocks = [
  { x: 460, y: 504, label: "0" },
  { x: 292, y: 495, label: "1" },
  { x: 296, y: 355, label: "2" },
  { x: 464, y: 356, label: "3" },
  { x: 462, y: 401, label: "4" },
  { x: 538, y: 401, label: "5" },
  { x: 544, y: 499, label: "6" },
  { x: 597, y: 501, label: "7" },
  { x: 595, y: 414, label: "8" },
  { x: 458, y: 561, label: "9" },
  { x: 298, y: 560, label: "10" },
  { x: 460, y: 606, label: "11" },
  { x: 342, y: 617, label: "12" },
  { x: 298, y: 598, label: "13" },
  { x: 198, y: 566, label: "14" },
  { x: 144, y: 568, label: "15" },
  { x: 150, y: 647, label: "16" },
  { x: 461, y: 311, label: "17" },
  { x: 580, y: 597, label: "18" },
  { x: 540, y: 454, label: "19" },
  { x: 464, y: 452, label: "20" },
];

const fixedEdges = [
  [1, 2],
  [2, 3],
  [1, 0],
  [3, 4],
  [4, 5],
  [4, 20],
  [0, 20],
  [20, 19],
  [5, 19],
  [0, 6],
  [19, 6],
  [6, 7],
  [5, 8],
  [8, 7],
  [17, 3],
  [9, 0],
  [9, 11],
  [11, 18],
  [11, 12],
  [12, 13],
  [13, 10],
  [10, 1],
  [14, 10],
  [15, 14],
  [15, 16],
  [9, 10],
];


window.addEventListener('DOMContentLoaded', () => {
  const canvasContainer = document.querySelector(".drawing-area");

  // Apply the header height as padding to push the canvas down
  canvasContainer.style.paddingTop = 105 + "px";

  document.querySelector('.run-btn').disabled = false;

  // Initialize distance matrix with size 'cnt'
  initializeDistanceMatrix(cnt);

  // Load and draw the image
  loadAndDrawImage();
});


// Select the canvas and set the context
const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d");

// Set explicit dimensions if not done already
canvas.width = 800; // Adjust to your image width
canvas.height = 640; // Adjust to your image height

// Function to load and draw the image
function loadAndDrawImage() {
  const mapImage = new Image();
  mapImage.src = 'img/HCMUTE_map.jpg'; // Ensure this path is correct

  mapImage.onload = function () {
    // Draw the image on the canvas after it fully loads
    ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);

    // Initialize fixed blocks after the image loads
    initializeFixedBlocks();
    initializeFixedEdges();  // Draw fixed edges after blocks
    initializeDistanceMatrix(cnt);
  };
}

// Function to initialize fixed blocks on page load
function initializeFixedBlocks() {
  fixedBlocks.forEach((block) => {
    appendFixedBlock(block.x, block.y, block.label);
  });
}

let alerted = localStorage.getItem("alerted") || "";
if (alerted !== "yes") {
  alert(
    "Read instructions before proceeding by clicking i-icon in the top-right corner"
  );
  localStorage.setItem("alerted", "yes");
}

// It is called when user starts adding edges by clicking on button given
const addEdges = () => {
  if (cnt < 2) {
    alert("Create atleast two nodes to add an edge");
    return;
  }

  addEdge = true;
  document.getElementById("add-edge-enable").disabled = true;
  document.getElementsByClassName("run-btn")[0].disabled = false;
  // Initializing array for adjacency matrix representation
  dist = new Array(cnt + 1)
    .fill(Infinity)
    .map(() => new Array(cnt + 1).fill(Infinity));
};

// Temporary array to store clicked elements to make an edge between the(max size =2)
let arr = [];

// Function to initialize fixed edges between specific nodes
function initializeFixedEdges() {
  fixedEdges.forEach(([start, end]) => {
    const startBlock = document.getElementById(start);
    const endBlock = document.getElementById(end);
    if (startBlock && endBlock) {
      const x1 = parseInt(startBlock.style.left, 10);
      const y1 = parseInt(startBlock.style.top, 10);
      const x2 = parseInt(endBlock.style.left, 10);
      const y2 = parseInt(endBlock.style.top, 10);
      drawLine(x1, y1, x2, y2, [start, end], true); // Bypass check with true
    }
  });
}

// Function to add a fixed block (does not increment cnt)
// Function to add a fixed block (does not increment cnt)
const appendFixedBlock = (x, y, label) => {
  const block = document.createElement("div");
  block.classList.add("block");
  block.style.top = `${y}px`;
  block.style.left = `${x}px`;
  block.style.transform = `translate(-50%, -50%)`;
  block.id = label; // Use fixed label as ID
  block.innerText = label; // Display fixed label
  blocks.appendChild(block);
};

// Function to add a dynamic block (increments cnt)
const appendBlock = (x, y) => {
  document.querySelector(".reset-btn").disabled = false;
  document.querySelector(".click-instruction").style.display = "none";

  const block = document.createElement("div");
  block.classList.add("block");
  block.style.top = `${y}px`;
  block.style.left = `${x}px`;
  block.style.transform = `translate(-50%, -50%)`;
  block.id = cnt;
  block.innerText = cnt; // Use cnt for dynamic blocks
  cnt++; // Increment cnt only for dynamic blocks

  // Click event for edge creation
  block.addEventListener("click", (e) => {
    e.stopPropagation();

    if (!addEdge) return;
    block.style.backgroundColor = "coral";
    arr.push(block.id);

    if (arr.length === 2) {
      drawUsingId(arr);
      arr = [];
    }
  });

  blocks.appendChild(block);
};


// Allow creating nodes on screen by clicking
blocks.addEventListener("click", (e) => {
  if (addEdge) return;

  // Get the x and y coordinates
  const x = e.x;
  const y = e.y;

  // Show an alert with both x and y coordinates
  console.log(`Click position: x = ${x}, y = ${y}`);

  // Create a block at the specified position
  appendBlock(x, y);
});



// Add click event listener to the drawing area

// Function to draw a line between nodes
// Draw lines with optional parameter to skip distance check
const drawLine = (x1, y1, x2, y2, ar, bypassCheck = false) => {
  // Skip distance check if bypassCheck is true
  if (!bypassCheck && dist[Number(ar[0])][Number(ar[1])] !== Infinity) {
    return;
  }

  const len = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  const slope = x2 - x1 ? (y2 - y1) / (x2 - x1) : y2 > y1 ? 90 : -90;

  // Set distances in the matrix if not bypassed
  if (!bypassCheck) {
    dist[Number(ar[0])][Number(ar[1])] = Math.round(len / 10);
    dist[Number(ar[1])][Number(ar[0])] = Math.round(len / 10);
  }

  // Draw the line
  const line = document.createElement("div");
  line.id = `line-${ar[0]}-${ar[1]}`;
  line.classList.add("line");
  line.style.width = `${len}px`;
  line.style.left = `${x1}px`;
  line.style.top = `${y1}px`;

  let p = document.createElement("p");
  p.classList.add("edge-weight");
  p.innerText = Math.round(len / 10);
  p.contentEditable = "true";
  p.inputMode = "numeric";
  p.addEventListener("blur", (e) => {
    if (isNaN(Number(e.target.innerText))) {
      alert("Enter valid edge weight");
      return;
    }
    const n1 = Number(p.closest(".line").id.split("-")[1]);
    const n2 = Number(p.closest(".line").id.split("-")[2]);
    dist[n1][n2] = Number(e.target.innerText);
    dist[n2][n1] = Number(e.target.innerText);
  });

  line.style.transform = `rotate(${x1 > x2 ? Math.PI + Math.atan(slope) : Math.atan(slope)}rad)`;
  p.style.transform = `rotate(${x1 > x2 ? (Math.PI + Math.atan(slope)) * -1 : Math.atan(slope) * -1}rad)`;

  line.append(p);
  blocks.appendChild(line);
};

// Function to get (x, y) coordinates of clicked node
const drawUsingId = (ar) => {
  if (ar[0] === ar[1]) {
    document.getElementById(arr[0]).style.backgroundColor = "#333";
    arr = [];
    return;
  }
  x1 = Number(document.getElementById(ar[0]).style.left.slice(0, -2));
  y1 = Number(document.getElementById(ar[0]).style.top.slice(0, -2));
  x2 = Number(document.getElementById(ar[1]).style.left.slice(0, -2));
  y2 = Number(document.getElementById(ar[1]).style.top.slice(0, -2));
  drawLine(x1, y1, x2, y2, ar);
};

// Function to start the algorithm when the "Run" button is clicked
function runAlgorithm() {
  const sourceNodeInput = document.getElementById("source-node").value;
  const sourceNode = parseInt(sourceNodeInput);

  // Validate the source node input
  if (isNaN(sourceNode) || sourceNode < 0 || sourceNode >= cnt) {
    alert("Please enter a valid source node ID within the range.");
    return;
  }

  // Run the shortest path algorithm
  findShortestPath(sourceNode);
}



// Function to find shortest path from given source to all other nodes
// Function to find shortest path from given source to all other nodes
const findShortestPath = (source) => {
  let visited = [];
  let unvisited = Array.from({ length: cnt }, (_, i) => i);
  clearScreen();

  document.getElementById(source).style.backgroundColor = "grey";

  let parent = Array(cnt).fill(-1);
  let cost = Array(cnt).fill(Infinity);
  cost[source] = 0;

  let minCost = Array(cnt).fill(Infinity);
  minCost[source] = 0;

  // Main Dijkstra's loop
  while (unvisited.length) {
    let mini = unvisited.reduce((a, b) => (cost[a] < cost[b] ? a : b));
    visited.push(mini);
    unvisited = unvisited.filter(node => node !== mini);

    console.log(`Visiting node ${mini}, Cost: ${cost[mini]}`);

    for (const j of unvisited) {
      if (dist[mini][j] !== Infinity && cost[j] > dist[mini][j] + cost[mini]) {
        cost[j] = dist[mini][j] + cost[mini];
        parent[j] = mini;
        console.log(`Updating cost for node ${j} to ${cost[j]}`);
      }
    }
    cost[mini] = Infinity;
  }

  console.log("Final Costs:", cost);
  indicatePath(parent, source);
};



// Updated indicatePath to take source as parameter
const indicatePath = async (parentArr, src) => {
  document.getElementsByClassName("path")[0].innerHTML = "";
  for (let i = 0; i < cnt; i++) {
    const p = document.createElement("p");
    p.innerText = `Path to ${i}: `;
    await printPath(parentArr, i, p);
  }
};

const printPath = async (parent, j, el_p) => {
  if (parent[j] === -1) {
    // This is the source node, so add it directly to the path
    el_p.innerText = el_p.innerText + " " + j;
    return;
  }
  await printPath(parent, parent[j], el_p); // Recursively build path from source to destination
  el_p.innerText = el_p.innerText + " " + j; // Append each node to the path

  document.getElementsByClassName("path")[0].style.padding = "1rem";
  document.getElementsByClassName("path")[0].appendChild(el_p);

  // Highlight the path on the graph by finding the corresponding line element
  let tmp;
  if (j < parent[j]) {
    tmp = document.getElementById(`line-${j}-${parent[j]}`);
  } else {
    tmp = document.getElementById(`line-${parent[j]}-${j}`);
  }

  // Apply color if the edge is found
  if (tmp) {
    await colorEdge(tmp);
  }
};


const colorEdge = async (el) => {
  if (el.style.backgroundColor !== "aqua") {
    await wait(1000);
    el.style.backgroundColor = "aqua";
    el.style.height = "8px";
  }
};

const clearScreen = () => {
  document.getElementsByClassName("path")[0].innerHTML = "";
  let lines = document.getElementsByClassName("line");
  for (line of lines) {
    line.style.backgroundColor = "#EEE";
    line.style.height = "5px";
  }
};

const resetDrawingArea = () => {
  blocks.innerHTML = "";

  const p = document.createElement("p");
  p.classList.add("click-instruction");
  p.innerHTML = "Click to create node";

  blocks.appendChild(p);
  document.getElementById("add-edge-enable").disabled = false;
  document.querySelector(".reset-btn").disabled = true;
  document.getElementsByClassName("path")[0].innerHTML = "";

  cnt = 0;
  dist = [];
  addEdge = false;
};

const wait = async (t) => {
  let pr = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("done!");
    }, t);
  });
  res = await pr;
};
