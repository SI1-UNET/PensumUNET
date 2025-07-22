import { useRef, useEffect } from "preact/hooks"; // Import from "preact/hooks"
import type { Node, Edge } from '../types'; // Type imports are correct
// import * as d3 from "d3";
// import { containsServerDirective } from "astro/runtime/server/render/server-islands.js";

interface CourseGraphProps {
    nodes: Node[];
    edges: Edge[];
}

function calculateTextSize(text: string,font_family: string, font_size: string, divWidth: string): [number, number] {
    const div = document.createElement("div");
    document.body.appendChild(div);
    div.style.fontSize = font_size;
    div.style.fontFamily = font_family;
    div.style.width = divWidth;
    div.style.background = "none";

    div.textContent = text;

    const width = div.clientWidth;
    const height = div.clientHeight;

    document.body.removeChild(div);

    return [width,height];
}

function calculateSVGSize(nodes: Node[], padding: number): [number, number] {
    const nodeWidth = 260;
    const width = Math.max(...nodes.map(n => n.x)) + nodeWidth + padding;
    const height = Math.max(...nodes.map(n => n.y + n.height)) + padding;
    // const width = Math.max(...nodes.map(n => n.x)) + nodeWidth;
    // const height = Math.max(...nodes.map(n => n.y + n.height));

    return [width, height];
}

function calculateNodesSizeAndPos(nodes: Node[], nodeXSpacing: number, nodeYSpacing: number, padding: number) {
    const nodesWidth = 260;
    nodes.forEach((node, index) => {
        const [_, height] = calculateTextSize(node.content,"Poppins", "12px", String(nodesWidth) + "px");
        node.height = height;
        node.width = nodesWidth;
        if (node.x == 0) {
            node.x = 0 + padding;
            // node.x = 0;
        } else {
            node.x = node.x * nodeXSpacing + node.x * nodesWidth + padding;
            // node.x = node.x * nodeXSpacing + node.x * nodesWidth;
        }

        if (node.y == 0) {
            node.y = 0 + padding;
            // node.y = 0;
        } else {
            node.y = nodes[index - 1].y + nodes[index - 1].height + nodeYSpacing;
        }

        // node.x = node.x * (nodesWidth + nodeXSpacing);
        // node.y = node.y * (height + nodeYSpacing);
    });
}

// Correct way to define a functional component in TypeScript with props
export default function CourseGraph({ nodes, edges }: CourseGraphProps) {
    if (!nodes || nodes.length === 0) {
        console.warn("No nodes provided to CourseGraph component.");
        return;
    }

    const svgRef = useRef<SVGSVGElement | null>(null);

    // const border = [20, 20, 20, 20];
    const padding = 20;

    useEffect(() => {
        const svgElement = svgRef.current;
        if (!svgElement) {
            return;
        }

        nodes.sort((nodea, nodeb) => {
            if (nodea !== nodeb) {
                return nodea.x - nodeb.x;
            }
            return nodea.y - nodeb.y;
        });

        const svg = d3.select(svgElement);
        svg.selectAll("*").remove();

        calculateNodesSizeAndPos(nodes, 20, 20, padding);

        const [width, height] = calculateSVGSize(nodes, padding);
        svg.attr("width", width)
           .attr("height", height);

        console.log(`svg width = ${width}, svg height = ${height}`)
        console.log(`window width = ${window.innerWidth}, window height = ${window.innerHeight}`)

        // nodes.forEach(node => {
        //     console.log(`contenido = ${node.content}, x = ${node.x}, y = ${node.y}, width = ${node.width}, height = ${node.height}`)
        // });
        //
        const g = svg.append("g")
            .attr("class", "container");
            // .attr("transform", `translate(${padding}, ${padding})`);


        const nodeElements = g.selectAll<SVGGElement, Node>(".node") // Specify types for selectAll
                              .data(nodes)
                              .enter()
                              .append("g")
                              .attr("class", "node");
                              // .attr("transform", d => `translate(${d.x},${d.y})`); // Node's (x,y) is its top-left corner

        nodeElements.append("rect")
                    .attr("width", d => d.width)
                    .attr("height", d => d.height)
                    .attr("x", d => d.x)
                    .attr("y", d => d.y)
                    .attr("fill", "#1063ab")
                    .attr("stroke", "#1063ab")
                    // .attr("stroke-width", 1.5)
                    .attr("rx", 5)
                    .attr("ry", 5);

        nodeElements.append("rect")
                    .attr("width", d => d.width - 4)
                    .attr("height", d => d.height - 4)
                    .attr("x", d => d.x + d.width / 2)
                    .attr("y", d => d.y + 2)
                    .attr("fill", "#ffffff")
                    .attr("stroke", "#ffffff")
                    .attr("rx", 5)
                    .attr("ry", 5);

        nodeElements.append("rect")
                    .attr("width", d => 20)
                    .attr("height", d => d.height - 4)
                    .attr("x", d => d.x + d.width / 2)
                    .attr("y", d => d.y + 2)
                    .attr("fill", "#ffffff")
                    .attr("stroke", "#ffffff")

        nodeElements.append("text")
                    // .attr("x", d => d.x + d.width / 2)
                    .attr("x", d => d.x + 12)
                    .attr("y", d => d.y + d.height / 2)
                    .attr("dy", ".35em") // Fine-tune vertical alignment for text baseline
                    // .attr("text-anchor", "middle") // Horizontally center the text based on its x coordinate
                    // .attr("y", d => d.y + calculateTextSize(d.content, "Poppins", "12px", "260px")[1])
                    .text(d => d.content)
                    .attr("fill", "white")
                    .style("font-size", "12px")
                    .style("font-family", "Poppins")
                    .style("pointer-events", "none");


        const zoomWidth = width > window.innerWidth  ? window.innerWidth : height;
        const zoomHeight = height > window.innerHeight ? window.innerHeight : height;

        const zoom = d3.zoom<SVGSVGElement, unknown>()
        .extent([[0, 0], [zoomWidth, zoomHeight]])
        .translateExtent([[0,0], [width, height]])
        .scaleExtent([1, 1])
        .on('zoom', (event) => {
            console.log(`event.transform: x=${event.transform.x}, y=${event.transform.y}`);
            g.attr('transform', event.transform);
        });

        svg.call(zoom).on("wheel.zoom", null);


        // const nodesElements = g.selectAll(".node")
        //                        .data(nodes)
        //                        .enter()
        //                        .append("rect")
        //                        .attr("width", d => d.width)
        //                        .attr("height", d => d.height)
        //                        .attr("x", d => d.x)
        //                        .attr("y", d => d.y)
        //                        .attr("fill", "#1063ab")
        //     //                 .attr("stroke", "#1063ab")
        //     //                 .attr("stroke-width", 1.5)
        //                        .attr("rx", 5) // Rounded corners
        //                        .attr("ry", 5);
        //
        // nodesElements.append("text")
        //     .attr("x", 3) // <--- Change this from d.x + 3 to just 3
        //     .attr("y", 2) // <--- Change this from d.y + 2 to just 2
        //     .text(d => d.content)
        //     .attr("fill", "white")
        //     .style("font-size", "12px")
        //     .style("font-family", "Poppins")
        //     .style("pointer-events", "none");


        // // 2. Draw Nodes (Rectangles)
        // const nodeElements = g.selectAll<SVGGElement, Node>(".node") // Specify types for selectAll
        // .data(nodes)
        // .enter()
        // .append("g")
        // .attr("class", "node");
        // // .attr("transform", d => `translate(${d.x},${d.y})`); // Node's (x,y) is its top-left corner
        // nodeElements.append("rect")
        //     .attr("width", d => d.width)
        //     .attr("height", d => d.height)
        //     .attr("fill", "lightblue")
        //     .attr("stroke", "steelblue")
        //     .attr("stroke-width", 1.5)
        //     .attr("rx", 5) // Rounded corners
        //     .attr("ry", 5)
        //     .attr("x", 0) // <--- Change this from d.x to 0
        //     .attr("y", 0); // <--- Change this from d.y to 0
        //
        //
        // nodeElements.append("text")
        //     .attr("x", 3) // <--- Change this from d.x + 3 to just 3
        //     .attr("y", 2) // <--- Change this from d.y + 2 to just 2
        //     .text(d => d.content)
        //     .attr("fill", "black")
        //     .style("font-size", "12px")
        //     .style("font-family", "Poppins")
        //     .style("pointer-events", "none");

        // nodeElements.append("rect")
        //     .attr("width", d => d.width)
        //     .attr("height", d => d.height)
        //     .attr("fill", "lightblue")
        //     .attr("stroke", "steelblue")
        //     .attr("stroke-width", 1.5)
        //     .attr("rx", 5) // Rounded corners
        //     .attr("ry", 5)
        //     .attr("x", d => d.x)
        //     .attr("y", d => d.y);
        //
        //
        // nodeElements.append("text")
        //     .attr("x", d => d.x + 3) // Center text horizontally within the 120px width
        //     .attr("y", d => d.y + 2) // Center text vertically within the 60px height
        //     // .attr("dy", ".35em") // Fine-tune vertical alignment
        //     // .attr("text-anchor", "middle") // Horizontally center text
        //     .text(d => d.content)
        //     .attr("fill", "black")
        //     .style("font-size", "12px")
        //     .style("font-family", "Poppins")
        //     .style("pointer-events", "none"); // Prevent text from blocking mouse events on rect


        // svg.data(nodes).attr('x', d=>d.x)

        // // Define dimensions and margins
        // const width = 1400; // You might want to make these props or calculate dynamically
        // const height = 800;
        // const margin = { top: 20, right: 20, bottom: 20, left: 20 };
        //
        // // svg.data(nodes).attr('x', d=>d.x)
        //
        // svg.attr("width", width)
        //     .attr("height", height);
        //
        // const zoom = d3.zoom<SVGSVGElement, unknown>()
        // .scaleExtent([1, 1]) // Limitar el zoom
        // .on('zoom', (event) => {
        //     g.attr('transform', event.transform);
        // });
        //
        // svg.call(zoom).on("wheel.zoom", null);
        //
        // // Create a group for the graph elements to apply transforms
        // const g = svg.append("g")
        // .attr("transform", `translate(${margin.left},${margin.top})`);
        //
        // // 1. Draw Edges (Lines for connections)
        // // Filter edges to only include those where both source and target nodes exist
        // // const validEdges = edges.filter(d => {
        // //     const sourceNode = nodes.find(node => node.id === d.from);
        // //     if (!sourceNode) {
        // //         console.warn(`Source node ${d.from} not found for edge.`);
        // //         return false;
        // //     }
        // //     // Check if all target nodes exist
        // //     const allTargetsExist = d.to.every(targetId => nodes.find(node => node.id === targetId));
        // //     if (!allTargetsExist) {
        // //         console.warn(`One or more target nodes not found for edge from ${d.from}.`);
        // //     }
        // //     return allTargetsExist;
        // // });
        //
        // const links = g.selectAll<SVGGElement, Edge>(".link") // Specify types for selectAll
        // .data(edges)
        // .enter()
        // .append("g")
        // .attr("class", "link");
        //
        // links.each(function(d: Edge) { // Explicitly type 'd' as Edge
        //     const sourceNode = nodes.find(node => node.id === d.from);
        //     if (!sourceNode) return; // Should not happen due to validEdges filter, but good for type safety
        //
        //     d.to.forEach(targetId => {
        //         const targetNode = nodes.find(node => node.id === targetId);
        //         if (!targetNode) return; // Should not happen
        //
        //         d3.select(this)
        //             .append("line")
        //             .attr("x1", sourceNode.x + 60) // Adjust x1, y1 to originate from the center of the source node
        //             .attr("y1", sourceNode.y + 30) // Assuming node width=120, height=60, so center is +60,+30 from top-left
        //             .attr("x2", targetNode.x + 60) // Adjust x2, y2 to point to the center of the target node
        //             .attr("y2", targetNode.y + 30)
        //             .attr("stroke", "#999")
        //             .attr("stroke-opacity", 0.6)
        //             .attr("stroke-width", 1.5)
        //             .attr("marker-end", "url(#arrowhead)"); // Add arrowhead marker
        //     });
        // });
        //
        // // Define the arrow marker
        // svg.append("defs").append("marker")
        //     .attr("id", "arrowhead")
        //     .attr("viewBox", "-0 -5 10 10")
        //     .attr("refX", 5) // Position of the marker end relative to the end of the path
        //     .attr("refY", 0)
        //     .attr("orient", "auto")
        //     .attr("markerWidth", 10)
        //     .attr("markerHeight", 10)
        //     .attr("xoverflow", "visible")
        //     .append("path")
        //     .attr("d", "M 0,-5 L 10,0 L 0,5 Z")
        //     .attr("fill", "#999")
        //     .style("stroke", "none");
        //
        // // 2. Draw Nodes (Rectangles)
        // const nodeElements = g.selectAll<SVGGElement, Node>(".node") // Specify types for selectAll
        // .data(nodes)
        // .enter()
        // .append("g")
        // .attr("class", "node")
        // .attr("transform", d => `translate(${d.x},${d.y})`); // Node's (x,y) is its top-left corner
        //
        // nodeElements.append("rect")
        //     .attr("width", 120)
        //     .attr("height", 60)
        //     .attr("fill", "lightblue")
        //     .attr("stroke", "steelblue")
        //     .attr("stroke-width", 1.5)
        //     .attr("rx", 5) // Rounded corners
        //     .attr("ry", 5)
        //     .attr("x", d => d.x)
        //     .attr("y", d => d.y);
        //
        //
        // nodeElements.append("text")
        //     .attr("x", d => d.x + 3) // Center text horizontally within the 120px width
        //     .attr("y", d => d.y + 2) // Center text vertically within the 60px height
        //     // .attr("dy", ".35em") // Fine-tune vertical alignment
        //     // .attr("text-anchor", "middle") // Horizontally center text
        //     .text(d => d.content)
        //     .attr("fill", "black")
        //     .style("font-size", "12px")
        //     .style("font-family", "Poppins")
        //     .style("pointer-events", "none"); // Prevent text from blocking mouse events on rect
        //
    }, [nodes, edges]); // Re-run effect if nodes or edges change

    return (
        // <div style={{ overflow: 'scroll', border: '1px solid #ff0000' }}>
        // <div style={{ overflow: 'scroll'}}>
        <div>
            <svg ref={svgRef}></svg>
        </div>
    );
}
