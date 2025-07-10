import { useRef, useEffect } from "preact/hooks"; // Import from "preact/hooks"
import type { Node, Edge } from '../types'; // Type imports are correct
import * as d3 from "d3";

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

function calculateSVGWidth(nodes: Node[], nodeXSpacing: number): number {
    const nodeWidth = 260;
    const width = (Math.max(...nodes.map(n => n.x)) + 1) * (nodeWidth + nodeXSpacing);

    return width;
}

function calculateNodesSizeAndPos(nodes: Node[], nodeXSpacing: number, nodeYSpacing: number) {
    const nodesWidth = 260;
    nodes.forEach((node, index) => {
        const [_, height] = calculateTextSize(node.content,"Poppins", "12px", String(nodesWidth) + "px");
        node.height = height;
        node.width = nodesWidth;
        if (node.x == 0) {
            node.x = 0;
        } else {
            node.x = node.x * nodeXSpacing + node.x * nodesWidth;
        }

        if (node.y == 0) {
            node.y = 0;
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

        const width = calculateSVGWidth(nodes, 20);
        console.log(width);
        const height = 1000;
        svg.attr("width", width)
           .attr("height", height);

        calculateNodesSizeAndPos(nodes, 20, 20);

        // nodes.forEach(node => {
        //     console.log(`contenido = ${node.content}, x = ${node.x}, y = ${node.y}, width = ${node.width}, height = ${node.height}`)
        // });
        //
        const g = svg.append("g");

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
                    .attr("stroke-width", 1.5)
                    .attr("rx", 5)
                    .attr("ry", 5);

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
        <div style={{ overflow: 'scroll', border: '1px solid #ff0000' }}>
            <svg ref={svgRef}></svg>
        </div>
    );
}

// export default CourseGraph;

// export default function Curriculum({
//     // materias,
//     // prelaciones_mat,
//     // prelaciones_uc,
//     // semestres,
//     // departamentos,
//     // info_materias,
//     // xSpacing,
//     // ySpacing
// }) {
//
//     materias,
//     prelaciones_mat,
//     prelaciones_uc,
//     semestres,
//     departamentos,
//     info_materias,
//     xSpacing,
//     ySpacing
//     const { nodes, aristas } = transformar_info(materias, prelaciones_mat, prelaciones_uc, semestres, departamentos, info_materias, xSpacing, ySpacing);
//
//     const svgRef = useRef();
//     const [tooltip, setTooltip] = useState({ visible: false, content: '', x: 0, y: 0 });
//
//     useEffect(() => {
//         const svg = d3.select(svgRef.current);
//         svg.selectAll("*").remove(); // Limpia para redibujar
//
//         const width = 800;
//         const height = 600;
//         svg.attr("width", width).attr("height", height);
//
//         // Posicionamiento de nodos
//         const xSpacing = 200;
//         const ySpacing = 100;
//
//         // Asignar coordenadas
//         const nodesWithCoords = data.nodes.map(n => ({
//             ...n,
//             xCoord: n.x * xSpacing + 100,
//             yCoord: n.y * ySpacing + 50,
//         }));
//
//         // Dibujar enlaces (edges)
//         svg.selectAll("line")
//             .data(data.edges)
//             .enter()
//             .append("line")
//             .attr("x1", d => nodesWithCoords.find(n => n.id === d.from).xCoord)
//             .attr("y1", d => nodesWithCoords.find(n => n.id === d.from).yCoord)
//             .attr("x2", d => nodesWithCoords.find(n => n.id === d.to).xCoord)
//             .attr("y2", d => nodesWithCoords.find(n => n.id === d.to).yCoord)
//             .attr("stroke", "#ccc")
//             .attr("stroke-width", 2);
//
//         // Dibujar nodos
//         svg.selectAll("rect")
//             .data(nodesWithCoords)
//             .enter()
//             .append("rect")
//             .attr("x", d => d.xCoord - 60)
//             .attr("y", d => d.yCoord - 20)
//             .attr("width", 120)
//             .attr("height", 40)
//             .attr("rx", 6)
//             .attr("fill", "#1976d2")
//             .on("mouseover", (event, d) => {
//                 setTooltip({
//                     visible: true,
//                     content: d.tooltip || '',
//                     x: event.pageX + 10,
//                     y: event.pageY - 10,
//                 });
//             })
//             .on("mousemove", event => {
//                 setTooltip(prev => ({ ...prev, x: event.pageX + 10, y: event.pageY - 10 }));
//             })
//             .on("mouseout", () => {
//                 setTooltip({ visible: false, content: '', x: 0, y: 0 });
//             });
//
//         // Dibujar texto
//         svg.selectAll("text")
//             .data(nodesWithCoords)
//             .enter()
//             .append("text")
//             .attr("x", d => d.xCoord)
//             .attr("y", d => d.yCoord + 5)
//             .attr("text-anchor", "middle")
//             .attr("fill", "white")
//             .attr("font-size", "12px")
//             .text(d => d.id);
//
//     }, [data]);
//
//     return (
//         <div style={{ position: 'relative' }}>
//             <svg ref={svgRef}></svg>
//             {tooltip.visible && (
//                 <div style={{
//                     position: 'absolute',
//                     top: tooltip.y,
//                     left: tooltip.x,
//                     background: 'white',
//                     border: '2px solid black',
//                     padding: '10px',
//                     borderRadius: '8px',
//                     maxWidth: '250px',
//                     fontSize: '12px',
//                     pointerEvents: 'none',
//                     boxShadow: '0px 4px 12px rgba(0,0,0,0.2)',
//                     zIndex: 100,
//                 }}
//                     dangerouslySetInnerHTML={{ __html: tooltip.content }}
//                 />
//             )}
//         </div>
//     );
// };
//
//
//
// // const x = d3.scaleLinear([0, data.length - 1], [marginLeft, width - marginRight]);
// // const y = d3.scaleLinear(d3.extent(data), [height - marginBottom, marginTop]);
// // const line = d3.line((d, i) => x(i), y);
// //
// // k
// // return (
// //   <svg width={width} height={height}>
// //     <path fill="none" stroke="currentColor" strokeWidth="1.5" d={line(data)} />
// //     <g fill="white" stroke="currentColor" strokeWidth="1.5">
// //       {data.map((d, i) => (<circle key={i} cx={x(i)} cy={y(d)} r="2.5" />))}
// //     </g>
// //   </svg>
// // );
// }
