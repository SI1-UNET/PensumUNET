import { useRef, useEffect } from 'preact/hooks';
import type { Node, Edge } from '../types';
import { drawRoundedRect, drawRoundedRectType1, drawRoundedRectType2, drawRoundedRectWithTail } from './draw.ts'

const nodeWidth = 260;
const ucWidth = 50;

const svgPadding = 20;
const nodePadding = 3;
const textPadding = 3;

const hSpaceBetweenNodes = 50;
const vSpaceBetweenNodes = 30;

interface CourseGraphProps {
    nodes: Node[];
    edges: Edge[];
}

function getStrBoxSize(text: string, font: string = '16px Poppins'): {lineWidth: number; lineHeight: number} {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (context == null)
        return {lineWidth: -1, lineHeight: -1};
    context.font = font;
    return { 
        lineWidth: context.measureText(text).width,
        lineHeight: context.measureText(text).fontBoundingBoxAscent + context.measureText(text).fontBoundingBoxDescent,
    };
}

function getStrTextHeight(text: string, font: string = "16px Poppins"): number {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (context == null)
        return 0;
    context.font = font;
    context.textBaseline = 'top'
    return context.measureText(text).actualBoundingBoxDescent;
}


function getLimitedStrHeight(text: string, maxWidth: number): number {
    const {lineHeight, lineWidth} = getStrBoxSize(text);

    const lines = Math.ceil(lineWidth / maxWidth);
    console.log(`text= ${text}, lineWidth =${lineWidth}, maxWidth = ${maxWidth}`);
    return lines * (lineHeight);
}

function calculateSVGSize(nodes: Node[], padding: number): {SVGWidth: number, SVGHeight: number} {
    return {
        SVGWidth: Math.max(...nodes.map(n => n.x + n.width + getModalWidth(n)/2)) + svgPadding,
        SVGHeight: Math.max(...nodes.map(n => n.y + n.height + getModalHeight(n))) + svgPadding,
        // SVGWidth: Math.max(...nodes.map(n => n.x + n.width)) + svgPadding,
        // SVGHeight: Math.max(...nodes.map(n => n.y + n.height)) + svgPadding,
    };
}

function calculateNodesSizeAndPos(nodes: Node[]) {
    const nodesWidth = 260;
    nodes.forEach((node, index) => {
        const lineHeight = getLimitedStrHeight(node.content, nodesWidth - ucWidth - textPadding * 2)
        node.height = lineHeight + textPadding * 2;
        node.width = nodesWidth;
        if (node.x == 0) {
            node.x = 0 + svgPadding;
        } else {
            node.x = node.x * hSpaceBetweenNodes + node.x * nodesWidth + svgPadding;
        }
        if (node.y == 0) {
            node.y = 0 + svgPadding;
        } else {
            node.y = nodes[index - 1].y + nodes[index - 1].height + vSpaceBetweenNodes;
        }
    });
}

function centerTextVertical(text: string, boxX: number, boxY: number, boxHeight: number, boxWidth: number): {x: number, y: number} {
    const textHeight = getLimitedStrHeight(text, boxWidth)
    return {
        x: boxX,
        y: boxY + (boxHeight - textHeight)/2, // por alguna razon 0.5 hace que se vea mejor
    }
}

function breakString(text: string, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
        const {lineWidth} = getStrBoxSize(currentLine + (currentLine === '' ? '' : ' ') + word);
        if (lineWidth && lineWidth <= maxWidth) {
            currentLine += (currentLine === '' ? '' : ' ') + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }

    if (currentLine !== '') {
        lines.push(currentLine);
    }

    return lines;
}

function createRect1(node: Node): SVGRectElement  {
    const rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
    rect.setAttribute('x', `${node.x}`)
    rect.setAttribute('y', `${node.y}`)
    rect.setAttribute('width', `${node.width}px`)
    rect.setAttribute('height', `${node.height}px`)
    rect.setAttribute('fill', '#00519f')
    rect.setAttribute('rx', '10px')
    rect.setAttribute('ry', '10px')

    return rect;
}

function createRect2(node: Node): SVGPathElement  {
    const path = document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('d', `M${node.x + nodeWidth - ucWidth},${node.y + 3} h${ucWidth - 10} a10,10 0 0 1 7,7 v${node.height - 20} a10,10 0 0 1 -7,7 h${-ucWidth + 10} Z`)
    path.setAttribute('fill', '#ffffff')

    return path;
}

function createTextCentered1(node: Node): SVGTextElement {
    const text = document.createElementNS('http://www.w3.org/2000/svg','text');
    const label = breakString(node.content, nodeWidth - ucWidth - 6);
    const cordsText = centerTextVertical(node.content, node.x, node.y, node.height, node.width - ucWidth - textPadding * 2)
    const { lineHeight } = getStrBoxSize(node.content)

    text.setAttribute('x', `${node.x + textPadding}`);
    text.setAttribute('y', `${cordsText.y + textPadding + 0.5}`);
    text.setAttribute('width', `${node.width - ucWidth - textPadding * 2}`);
    text.setAttribute('dominant-baseline', 'hanging');
    text.setAttribute('font-family', 'Poppins');
    text.setAttribute('font-size', '16px');
    text.style = "user-select: none; fill: #ffffff;";

    label.forEach((word, index) => {
        const tspan = document.createElementNS('http://www.w3.org/2000/svg','tspan');
        tspan.setAttribute('x', `${node.x + textPadding}`)
        if (index == 0) {
            tspan.setAttribute('dy', `0`)
        } else {
            tspan.setAttribute('dy', `${lineHeight}`)
        }
        tspan.textContent = word;
        text.appendChild(tspan);
    })

    return text;
}

function createTextCentered2(node: Node): SVGTextElement {
    const text = document.createElementNS('http://www.w3.org/2000/svg','text');
    const coordsText = centerTextVertical(String(node.uc), node.x + nodeWidth - ucWidth, node.y, node.height, ucWidth - textPadding * 2)

    text.setAttribute('x', `${node.x + node.width - ucWidth + textPadding}`);
    text.setAttribute('y', `${coordsText.y + textPadding + 0.5}`);
    text.setAttribute('width', `${ucWidth - textPadding * 2}`);
    text.setAttribute('dominant-baseline', 'hanging');
    text.setAttribute('font-family', 'Poppins');
    text.setAttribute('font-size', '16px');
    text.style = "user-select: none; fill: #00519f;";
    text.textContent =  `${node.uc}UC`;

    return text;
}

function createGNode(node: Node): SVGGElement {
    const g = document.createElementNS('http://www.w3.org/2000/svg','g');

    g.setAttribute('class', 'node');
    g.setAttribute('id', `${node.id}`);
    g.appendChild(createRect1(node));
    g.appendChild(createRect2(node));
    g.appendChild(createTextCentered1(node));
    g.appendChild(createTextCentered2(node));

    g.addEventListener('click', (e) => {
        console.log(`El nodo ${node.id} fue clickeado`);
    })

    return g;
}

function getModalHeight(node: Node): number {
    const height_Title = getLimitedStrHeight(node.departamento, node.width - textPadding * 2)
    const height_Info = getLimitedStrHeight(node.info, node.width - textPadding * 2)

    return height_Title + textPadding * 2 + height_Info + textPadding * 2;
}

function getModalWidth(node: Node): number {
    return node.width;
}

function createRectModal1(node: Node): SVGPathElement  {
    const modal_width = node.width;

    const height_Title = getLimitedStrHeight(node.departamento, node.width - textPadding * 2)
    console.log(node.departamento);
    console.log(height_Title);
    
    const height_Info = getLimitedStrHeight(node.info, node.width - textPadding * 2)

    const modal_height = height_Title + textPadding * 2 + height_Info + textPadding * 2;


    const path = document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('d', `M${node.x + nodeWidth/2},${node.y + node.height} v${modal_height + 3} a10,10 0 0 0 7,7 h${modal_width-7*2} a10,10 0 0 0 7,-7 v${-modal_height+7*2} a10,10 0 0 0 -7,-7 h${-modal_width + 7 * 2} Z`)
    path.setAttribute('fill', '#000000')

    return path;
}

function createRectModal2(node: Node): SVGPathElement  {
    const modal_width = node.width;

    const height_Title = getLimitedStrHeight(node.departamento, node.width - textPadding * 2)
    const height_Info = getLimitedStrHeight(node.info, node.width - textPadding * 2)

    const path = document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('d', `M${node.x + nodeWidth/2 + 3},${node.y + node.height + 10 + height_Title + textPadding} v${height_Info + textPadding} a10,10 0 0 0 ${7-textPadding},${7-textPadding} h${modal_width-7*2} a10,10 0 0 0 ${7-textPadding},-${7-textPadding} v-${height_Info + textPadding}Z`)
    path.setAttribute('fill', '#ffffff')

    return path;
}

function createTextModal1(node: Node): SVGTextElement {
    const textDim = getStrBoxSize(node.departamento)

    const text = document.createElementNS('http://www.w3.org/2000/svg','text');

    const modal_width = node.width;

    const label = breakString(node.departamento, modal_width - textPadding * 2);

    // const textHeight = getFullTextHeight(node.departamento);
    const height_Title = getLimitedStrHeight(node.departamento, node.width - textPadding * 2);

    const coords = centerTextVertical(node.departamento, node.x + node.width/2, node.y + node.height + 10, height_Title + textPadding * 2, node.width);

    text.setAttribute('x', `${coords.x}`);
    text.setAttribute('y', `${coords.y + 2}`);
    text.setAttribute('width', `${modal_width - textPadding * 2}`);
    text.setAttribute('dominant-baseline', 'hanging');
    text.setAttribute('font-family', 'Poppins');
    text.setAttribute('font-size', '16px');
    text.style = "user-select: none; fill: #ffffff;";

    label.forEach((word, index) => {
        const tspan = document.createElementNS('http://www.w3.org/2000/svg','tspan');
        tspan.setAttribute('x', `${node.x + node.width/2 + textPadding}`)
        if (index == 0) {
            tspan.setAttribute('dy', `0`)
        } else {
            tspan.setAttribute('dy', `${textDim.lineHeight}`)
        }
        tspan.textContent = word;
        text.appendChild(tspan);
    })

    return text;
}

// function createTextModal2(node: Node): SVGTextElement {
//     const textDim = getTextDimensions(node.info)
//     if (!textDim) {
//         return document.createElementNS('http://www.w3.org/2000/svg','text');
//     }
//
//     const text = document.createElementNS('http://www.w3.org/2000/svg','text');
//
//     const modal_width = node.width;
//
//     const label = breakString(node.info, modal_width - textPadding * 2);
//
//     const textHeight = getLineBoxHeight(node.info);
//     const height_Title = getFullTextHeight(node.departamento, node.width - textPadding * 2)
//     const height_Info = getFullTextHeight(node.info, node.width - textPadding * 2)
//
//     text.setAttribute('x', `${node.x + node.width/2}`);
//     text.setAttribute('y', `${node.y + node.height + 10 + height_Title + textPadding + ((height_Info + textPadding) - textHeight)/2}`);
//     text.setAttribute('width', `${modal_width - textPadding * 2}`);
//     text.setAttribute('dominant-baseline', 'hanging');
//     text.setAttribute('font-family', 'Poppins');
//     text.setAttribute('font-size', '16px');
//     text.style = "user-select: none; fill: #000000;";
//
//     label.forEach((word, index) => {
//         const tspan = document.createElementNS('http://www.w3.org/2000/svg','tspan');
//         tspan.setAttribute('x', `${node.x + node.width/2 + textPadding}`)
//         if (index == 0) {
//             tspan.setAttribute('dy', `0`)
//         } else {
//             tspan.setAttribute('dy', `${textDim.lineHeight}`)
//         }
//         tspan.textContent = word;
//         text.appendChild(tspan);
//     })
//
//     return text;
// }

function createModal(node: Node): SVGGElement {
    const g = document.createElementNS('http://www.w3.org/2000/svg','g');

    g.setAttribute('class', 'modal');
    g.appendChild(createRectModal1(node));
    g.appendChild(createRectModal2(node));
    g.appendChild(createTextModal1(node));
    // g.appendChild(createTextModal2(node));

    g.style.visibility = 'hidden';

    return g;
}

function addModalsEventListeners() {
    const svg = document.querySelector<SVGSVGElement>('svg');
    const modals = document.querySelectorAll<SVGGElement>('.modal');
    const nodes = document.querySelectorAll<SVGGElement>('.node');

    if (!svg || !modals || !nodes) {
        return;
    }

    const hideAllModals = () => {
        modals.forEach((modal) => {
            modal.style.visibility = 'hidden';
        });
    };

    svg.addEventListener('click', (event) => {
        if (!(event.target instanceof Element)) {
            return;
        }

        const isClickOnNode = event.target.closest('.node');
        const isClickOnModal = event.target.closest('.modal[style*="visibility: visible"]');
        
        if (!isClickOnNode && !isClickOnModal) {
            hideAllModals();
        }
    });
    nodes.forEach((node, index) => {
        node.addEventListener('click', (event) => {
            event.stopPropagation();
            if (modals[index]) {
                if (modals[index].style.visibility === 'visible') {
                    modals[index].style.visibility = 'hidden';
                } else {
                    hideAllModals();
                    modals[index].style.visibility = 'visible';
                }
            }
        });
    });
}

function moveModals(svg: SVGSVGElement) {
    const modals = document.querySelectorAll('.modal')
    const firstNode = document.querySelector('.node');

    if (!firstNode) {
        return;
    }

    modals.forEach((modal) => {
        svg.appendChild(modal)
    });
}


function setScrollForElement(element: HTMLElement) {
    let isDragging = false;
    let startX: number;
    let startY: number;
    let scrollLeft: number;
    let scrollTop: number;
    const DRAG_THRESHOLD: number = 5;

    element.addEventListener('mousedown', (e) => {
        isDragging = false;
        startX = e.pageX - element.offsetLeft;
        startY = e.pageY - element.offsetTop;
        scrollLeft = element.scrollLeft;
        scrollTop = element.scrollTop;
    });

    element.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
        }
    });

    element.addEventListener('mouseup', () => {
        if (isDragging) {
            console.log('arrastre')
        } else {
            console.log('click')
        }

        isDragging = false;
    });

    element.addEventListener('mousemove', (e) => {
        if (e.buttons === 1) { // Comprobamos si el botón principal del ratón está presionado (para arrastrar)
            const currentX = e.pageX;
            const currentY = e.pageY;
            const deltaX = Math.abs(currentX - startX);
            const deltaY = Math.abs(currentY - startY);

            // Si el movimiento excede el umbral, es un arrastre
            if (deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD) {
                isDragging = true;
                e.preventDefault(); // Prevent text selection and other default behaviors

                const x = e.pageX - element.offsetLeft;
                const y = e.pageY - element.offsetTop;
                const walkX = (x - startX); // How far the mouse has moved horizontally
                const walkY = (y - startY); // How far the mouse has moved vertically

                element.scrollLeft = scrollLeft - walkX;
                element.scrollTop = scrollTop - walkY;
            }
        }
    });

    // --- Touch Events for Mobile Devices ---
    element.addEventListener('touchstart', (e) => {
        isDragging = true;
        const touch = e.touches[0];
        startX = touch.pageX - element.offsetLeft;
        startY = touch.pageY - element.offsetTop;
        scrollLeft = element.scrollLeft;
        scrollTop = element.scrollTop;
    });

    element.addEventListener('touchend', () => {
        isDragging = false;
    });

    element.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault(); // Prevent default scrolling/zooming

        const touch = e.touches[0];
        const x = touch.pageX - element.offsetLeft;
        const y = touch.pageY - element.offsetTop;
        const walkX = (x - startX);
        const walkY = (y - startY);

        element.scrollLeft = scrollLeft - walkX;
        element.scrollTop = scrollTop - walkY;
    });

}


export default function CourseGraph({ nodes, edges }: CourseGraphProps) {
    if (!nodes || nodes.length === 0) {
        console.warn('No nodes provided to CourseGraph component.');
        return;
    }

    const svgRef = useRef<SVGSVGElement | null>(null);
    const divRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const svgElement = svgRef.current;
        if (svgElement == null) {
            return;
        }

        const divElement = divRef.current;
        if (divElement == null) {
            return;
        }

        nodes.sort((nodea, nodeb) => {
            if (nodea.x !== nodeb.x) {
                return nodea.x - nodeb.x;
            }
            return nodea.y - nodeb.y;
        })

        calculateNodesSizeAndPos(nodes);

        const {SVGWidth, SVGHeight} = calculateSVGSize(nodes, svgPadding)

        svgElement.setAttribute('width', `${SVGWidth}px`);
        svgElement.setAttribute('height', `${SVGHeight}px`);

        svgElement.appendChild(drawRoundedRect(20, 20, 100, 100))
        svgElement.appendChild(drawRoundedRectType1(130, 20, 100, 100))
        svgElement.appendChild(drawRoundedRectType2(240, 20, 100, 100))
        svgElement.appendChild(drawRoundedRectWithTail(350, 20, 100, 100))
        const text = document.createElementNS('http://www.w3.org/2000/svg','text');
        text.setAttribute('x', `0`);
        text.setAttribute('y', `0`);
        text.setAttribute('dominant-baseline', 'hanging');
        text.setAttribute('font-family', 'Poppins');
        text.setAttribute('font-size', '16px');
        text.style = "user-select: none; fill: #000000;";
        text.textContent = "te odio texto en svgs aaaaaaaa"
        svgElement.appendChild(text)
        console.log(getStrBoxSize("te odio texto en svgs aaaaaaaa"))

        // nodes.forEach((node) => {
            // node.departamento = "departamento de departamentos de algun departamento no se pq me haces esto";
            // svgElement.appendChild(createGNode(node));
            // svgElement.appendChild(createModal(node));
        // });

        moveModals(svgElement);
        addModalsEventListeners();

        setScrollForElement(divElement);
    }, [nodes, edges])

    return (
        <div ref={divRef} style={{overflow: 'hidden', border: '1px solid #ff0000' }} >
            <svg ref={svgRef}></svg>
        </div>
    );
}


// import { useRef, useEffect } from 'preact/hooks';
// import type { Node, Edge } from '../types';
//
// const nodeWidth = 260;
// const ucWidth = 50;
//
// const svgPadding = 20;
// const nodePadding = 3;
// const textPadding = 3;
//
// const hSpaceBetweenNodes = 50;
// const vSpaceBetweenNodes = 30;
//
// interface CourseGraphProps {
//     nodes: Node[];
//     edges: Edge[];
// }
//
// interface TextSize {
//     width: number;
//     totalLineHeight: number;
// }
//
// function getTextDimensions(text: string, font: string = "16px Poppins") : TextSize | null {
//     const canvas = document.createElement("canvas");
//     const context = canvas.getContext("2d");
//     if (context == null)
//         return null;
//     context.font = font;
//     return { 
//         width: context.measureText(text).width,
//         totalLineHeight: context.measureText(text).fontBoundingBoxAscent + context.measureText(text).fontBoundingBoxDescent,
//     };
// }
//
// function getLineBoxHeight(text: string, font: string = "16px Poppins"): number {
//     const canvas = document.createElement("canvas");
//     const context = canvas.getContext("2d");
//     if (context == null)
//         return 0;
//     context.font = font;
//     context.textBaseline = 'top'
//     return context.measureText(text).actualBoundingBoxDescent;
// }
//
// function breakString(text: string, maxWidth: number): string[] {
//     const words = text.split(' ');
//     const lines = [];
//     let currentLine = '';
//
//     for (const word of words) {
//         const lineWidth = getTextDimensions(currentLine + (currentLine === '' ? '' : ' ') + word)?.width;
//         if (lineWidth && lineWidth <= maxWidth) {
//             currentLine += (currentLine === '' ? '' : ' ') + word;
//         } else {
//             lines.push(currentLine);
//             currentLine = word;
//         }
//     }
//
//     if (currentLine !== '') {
//         lines.push(currentLine);
//     }
//
//     return lines;
// }
//
// function getFullTextHeight(text: string, maxWidth: number): number {
//     const dimensions = getTextDimensions(text);
//     if (!dimensions) {
//         return -1;
//     }
//     const lines = Math.ceil(dimensions.width / maxWidth);
//     return Math.trunc(lines * (dimensions.totalLineHeight));
// }
//
// function calculateSVGSize(nodes: Node[], padding: number): [number, number] {
//     const width = Math.max(...nodes.map(n => n.x + getModalWidth(n))) + nodeWidth/2 + padding;
//     const height = Math.max(...nodes.map(n => n.y + n.height + getModalHeight(n))) + padding;
//     return [width, height];
// }
//
// function calculateNodesSizeAndPos(nodes: Node[], nodeXSpacing: number, nodeYSpacing: number, svgPadding: number) {
//     const nodesWidth = 260;
//     nodes.forEach((node, index) => {
//         const height = getFullTextHeight(node.content, nodesWidth - ucWidth - textPadding * 2)
//         node.height = height + 10;
//         node.width = nodesWidth;
//         if (node.x == 0) {
//             node.x = 0 + svgPadding;
//         } else {
//             node.x = node.x * nodeXSpacing + node.x * nodesWidth + svgPadding;
//         }
//
//         if (node.y == 0) {
//             node.y = 0 + svgPadding;
//         } else {
//             node.y = nodes[index - 1].y + nodes[index - 1].height + nodeYSpacing;
//         }
//     });
// }
//
// function createRect1(node: Node): SVGRectElement  {
//     const rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
//     rect.setAttribute('x', `${node.x}`)
//     rect.setAttribute('y', `${node.y}`)
//     rect.setAttribute('width', `${node.width}px`)
//     rect.setAttribute('height', `${node.height}px`)
//     rect.setAttribute('fill', '#00519f')
//     rect.setAttribute('rx', '10px')
//     rect.setAttribute('ry', '10px')
//
//     return rect;
// }
//
// function createRect2(node: Node): SVGPathElement  {
//     const path = document.createElementNS('http://www.w3.org/2000/svg','path');
//     path.setAttribute('d', `M${node.x + nodeWidth - ucWidth},${node.y + 3} h${ucWidth - 10} a10,10 0 0 1 7,7 v${node.height - 20} a10,10 0 0 1 -7,7 h${-ucWidth + 10} Z`)
//     path.setAttribute('fill', '#ffffff')
//
//     return path;
// }
//
// function createTextCentered1(node: Node): SVGTextElement {
//     const textDim = getTextDimensions(node.content)
//     if (!textDim) {
//         return document.createElementNS('http://www.w3.org/2000/svg','text');
//     }
//
//     const text = document.createElementNS('http://www.w3.org/2000/svg','text');
//     const label = breakString(node.content, nodeWidth - ucWidth - 6);
//     text.setAttribute('x', `${node.x + 3}`);
//     text.setAttribute('y', `${node.y + 5 + 3 + 1}`);
//     text.setAttribute('width', `${node.width - ucWidth - 6}`);
//     text.setAttribute('dominant-baseline', 'hanging');
//     text.setAttribute('font-family', 'Poppins');
//     text.setAttribute('font-size', '16px');
//     text.style = "user-select: none; fill: #ffffff;";
//
//     label.forEach((word, index) => {
//         const tspan = document.createElementNS('http://www.w3.org/2000/svg','tspan');
//         tspan.setAttribute('x', `${node.x + 3}`)
//         if (index == 0) {
//             tspan.setAttribute('dy', `0`)
//         } else {
//             tspan.setAttribute('dy', `${textDim.totalLineHeight}`)
//         }
//         tspan.textContent = word;
//         text.appendChild(tspan);
//     })
//
//     return text;
// }
//
// function createTextCentered2(node: Node): SVGTextElement {
//     const textDim = getTextDimensions(node.content)
//     if (!textDim) {
//         return document.createElementNS('http://www.w3.org/2000/svg','text');
//     }
//     const alturaTexto = getLineBoxHeight(String(node.uc))
//     if (!alturaTexto) {
//         return document.createElementNS('http://www.w3.org/2000/svg','text');
//     }
//
//     const text = document.createElementNS('http://www.w3.org/2000/svg','text');
//
//     text.setAttribute('x', `${node.x + node.width - ucWidth + textPadding}`);
//     text.setAttribute('y', `${node.y + 2 + ((node.height - 6) - alturaTexto)/2}`);
//     text.setAttribute('width', `${ucWidth - 6}`);
//     text.setAttribute('dominant-baseline', 'hanging');
//     text.setAttribute('font-family', 'Poppins');
//     text.setAttribute('font-size', '16px');
//     text.style = "user-select: none; fill: #00519f;";
//     text.textContent =  `${node.uc}UC`;
//
//     return text;
// }
//
// function createGNode(node: Node): SVGGElement {
//     const g = document.createElementNS('http://www.w3.org/2000/svg','g');
//
//     g.setAttribute('class', 'node');
//     g.setAttribute('id', `${node.id}`);
//     g.appendChild(createRect1(node));
//     g.appendChild(createRect2(node));
//     g.appendChild(createTextCentered1(node));
//     g.appendChild(createTextCentered2(node));
//
//     g.addEventListener('click', (e) => {
//         console.log(`El nodo ${node.id} fue clickeado`);
//     })
//
//     return g;
// }
//
// function getModalHeight(node: Node): number {
//     const height_Title = getFullTextHeight(node.departamento, node.width - textPadding * 2)
//     const height_Info = getFullTextHeight(node.info, node.width - textPadding * 2)
//
//     return height_Title + textPadding * 2 + height_Info + textPadding * 2;
// }
//
// function getModalWidth(node: Node): number {
//     return node.width;
// }
//
// function createRectModal1(node: Node): SVGPathElement  {
//     const modal_width = node.width;
//
//     const height_Title = getFullTextHeight(node.departamento, node.width - textPadding * 2)
//     const height_Info = getFullTextHeight(node.info, node.width - textPadding * 2)
//
//     const modal_height = height_Title + textPadding * 2 + height_Info + textPadding * 2;
//
//
//     const path = document.createElementNS('http://www.w3.org/2000/svg','path');
//     path.setAttribute('d', `M${node.x + nodeWidth/2},${node.y + node.height} v${modal_height + 3} a10,10 0 0 0 7,7 h${modal_width-7*2} a10,10 0 0 0 7,-7 v${-modal_height+7*2} a10,10 0 0 0 -7,-7 h${-modal_width + 7 * 2} Z`)
//     path.setAttribute('fill', '#000000')
//
//     return path;
// }
//
// function createRectModal2(node: Node): SVGPathElement  {
//     const modal_width = node.width;
//
//     const height_Title = getFullTextHeight(node.departamento, node.width - textPadding * 2)
//     const height_Info = getFullTextHeight(node.info, node.width - textPadding * 2)
//
//     const path = document.createElementNS('http://www.w3.org/2000/svg','path');
//     path.setAttribute('d', `M${node.x + nodeWidth/2 + 3},${node.y + node.height + 10 + height_Title + textPadding} v${height_Info + textPadding} a10,10 0 0 0 ${7-textPadding},${7-textPadding} h${modal_width-7*2} a10,10 0 0 0 ${7-textPadding},-${7-textPadding} v-${height_Info + textPadding}Z`)
//     path.setAttribute('fill', '#ffffff')
//
//     return path;
// }
//
// function createTextModal1(node: Node): SVGTextElement {
//     const textDim = getTextDimensions(node.departamento)
//     if (!textDim) {
//         return document.createElementNS('http://www.w3.org/2000/svg','text');
//     }
//
//     const text = document.createElementNS('http://www.w3.org/2000/svg','text');
//
//     const modal_width = node.width;
//
//     const label = breakString(node.departamento, modal_width - textPadding * 2);
//
//     const textHeight = getLineBoxHeight(node.departamento);
//     const height_Title = getFullTextHeight(node.departamento, node.width - textPadding * 2)
//
//     text.setAttribute('x', `${node.x + node.width/2}`);
//     text.setAttribute('y', `${node.y + node.height + 10 + ((height_Title + textPadding) - textHeight)/2}`);
//     text.setAttribute('width', `${modal_width - textPadding * 2}`);
//     text.setAttribute('dominant-baseline', 'hanging');
//     text.setAttribute('font-family', 'Poppins');
//     text.setAttribute('font-size', '16px');
//     text.style = "user-select: none; fill: #ffffff;";
//
//     label.forEach((word, index) => {
//         const tspan = document.createElementNS('http://www.w3.org/2000/svg','tspan');
//         tspan.setAttribute('x', `${node.x + node.width/2 + textPadding}`)
//         if (index == 0) {
//             tspan.setAttribute('dy', `0`)
//         } else {
//             tspan.setAttribute('dy', `${textDim.totalLineHeight}`)
//         }
//         tspan.textContent = word;
//         text.appendChild(tspan);
//     })
//
//     return text;
// }
//
// function createTextModal2(node: Node): SVGTextElement {
//     const textDim = getTextDimensions(node.info)
//     if (!textDim) {
//         return document.createElementNS('http://www.w3.org/2000/svg','text');
//     }
//
//     const text = document.createElementNS('http://www.w3.org/2000/svg','text');
//
//     const modal_width = node.width;
//
//     const label = breakString(node.info, modal_width - textPadding * 2);
//
//     const textHeight = getLineBoxHeight(node.info);
//     const height_Title = getFullTextHeight(node.departamento, node.width - textPadding * 2)
//     const height_Info = getFullTextHeight(node.info, node.width - textPadding * 2)
//
//     text.setAttribute('x', `${node.x + node.width/2}`);
//     text.setAttribute('y', `${node.y + node.height + 10 + height_Title + textPadding + ((height_Info + textPadding) - textHeight)/2}`);
//     text.setAttribute('width', `${modal_width - textPadding * 2}`);
//     text.setAttribute('dominant-baseline', 'hanging');
//     text.setAttribute('font-family', 'Poppins');
//     text.setAttribute('font-size', '16px');
//     text.style = "user-select: none; fill: #000000;";
//
//     label.forEach((word, index) => {
//         const tspan = document.createElementNS('http://www.w3.org/2000/svg','tspan');
//         tspan.setAttribute('x', `${node.x + node.width/2 + textPadding}`)
//         if (index == 0) {
//             tspan.setAttribute('dy', `0`)
//         } else {
//             tspan.setAttribute('dy', `${textDim.totalLineHeight}`)
//         }
//         tspan.textContent = word;
//         text.appendChild(tspan);
//     })
//
//     return text;
// }
//
// function createModal(node: Node): SVGGElement {
//     const g = document.createElementNS('http://www.w3.org/2000/svg','g');
//
//     g.setAttribute('class', 'modal');
//     g.appendChild(createRectModal1(node));
//     g.appendChild(createRectModal2(node));
//     g.appendChild(createTextModal1(node));
//     g.appendChild(createTextModal2(node));
//
//     g.style.visibility = 'hidden';
//
//     return g;
// }
//
// function addModalsEventListeners() {
//     const svg = document.querySelector<SVGSVGElement>('svg');
//     const modals = document.querySelectorAll<SVGGElement>('.modal');
//     const nodes = document.querySelectorAll<SVGGElement>('.node');
//
//     if (!svg || !modals || !nodes) {
//         return;
//     }
//
//     const hideAllModals = () => {
//         modals.forEach((modal) => {
//             modal.style.visibility = 'hidden';
//         });
//     };
//
//     svg.addEventListener('click', (event) => {
//         if (!(event.target instanceof Element)) {
//             return;
//         }
//
//         const isClickOnNode = event.target.closest('.node');
//         const isClickOnModal = event.target.closest('.modal[style*="visibility: visible"]');
//
//         if (!isClickOnNode && !isClickOnModal) {
//             hideAllModals();
//         }
//     });
//     nodes.forEach((node, index) => {
//         node.addEventListener('click', (event) => {
//             event.stopPropagation();
//             if (modals[index]) {
//                 if (modals[index].style.visibility === 'visible') {
//                     modals[index].style.visibility = 'hidden';
//                 } else {
//                     hideAllModals();
//                     modals[index].style.visibility = 'visible';
//                 }
//             }
//         });
//     });
// }
//
// function moveModals(svg: SVGSVGElement) {
//     const modals = document.querySelectorAll('.modal')
//     const firstNode = document.querySelector('.node');
//
//     if (!firstNode) {
//         return;
//     }
//
//     modals.forEach((modal) => {
//         svg.appendChild(modal)
//     });
// }
//
//
// function setScrollForElement(element: HTMLElement) {
//     let isDragging = false;
//     let startX: number;
//     let startY: number;
//     let scrollLeft: number;
//     let scrollTop: number;
//     const DRAG_THRESHOLD: number = 5;
//
//     element.addEventListener('mousedown', (e) => {
//         isDragging = false;
//         startX = e.pageX - element.offsetLeft;
//         startY = e.pageY - element.offsetTop;
//         scrollLeft = element.scrollLeft;
//         scrollTop = element.scrollTop;
//     });
//
//     element.addEventListener('mouseleave', () => {
//         if (isDragging) {
//             isDragging = false;
//         }
//     });
//
//     element.addEventListener('mouseup', () => {
//         if (isDragging) {
//             console.log('arrastre')
//         } else {
//             console.log('click')
//         }
//
//         isDragging = false;
//     });
//
//     element.addEventListener('mousemove', (e) => {
//         if (e.buttons === 1) { // Comprobamos si el botón principal del ratón está presionado (para arrastrar)
//             const currentX = e.pageX;
//             const currentY = e.pageY;
//             const deltaX = Math.abs(currentX - startX);
//             const deltaY = Math.abs(currentY - startY);
//
//             // Si el movimiento excede el umbral, es un arrastre
//             if (deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD) {
//                 isDragging = true;
//                 e.preventDefault(); // Prevent text selection and other default behaviors
//
//                 const x = e.pageX - element.offsetLeft;
//                 const y = e.pageY - element.offsetTop;
//                 const walkX = (x - startX); // How far the mouse has moved horizontally
//                 const walkY = (y - startY); // How far the mouse has moved vertically
//
//                 element.scrollLeft = scrollLeft - walkX;
//                 element.scrollTop = scrollTop - walkY;
//             }
//         }
//     });
//
//     // --- Touch Events for Mobile Devices ---
//     element.addEventListener('touchstart', (e) => {
//         isDragging = true;
//         const touch = e.touches[0];
//         startX = touch.pageX - element.offsetLeft;
//         startY = touch.pageY - element.offsetTop;
//         scrollLeft = element.scrollLeft;
//         scrollTop = element.scrollTop;
//     });
//
//     element.addEventListener('touchend', () => {
//         isDragging = false;
//     });
//
//     element.addEventListener('touchmove', (e) => {
//         if (!isDragging) return;
//         e.preventDefault(); // Prevent default scrolling/zooming
//
//         const touch = e.touches[0];
//         const x = touch.pageX - element.offsetLeft;
//         const y = touch.pageY - element.offsetTop;
//         const walkX = (x - startX);
//         const walkY = (y - startY);
//
//         element.scrollLeft = scrollLeft - walkX;
//         element.scrollTop = scrollTop - walkY;
//     });
//
// }
//
//
// export default function CourseGraph({ nodes, edges }: CourseGraphProps) {
//     if (!nodes || nodes.length === 0) {
//         console.warn('No nodes provided to CourseGraph component.');
//         return;
//     }
//
//     const svgRef = useRef<SVGSVGElement | null>(null);
//     const divRef = useRef<HTMLDivElement | null>(null);
//
//     useEffect(() => {
//         const svgElement = svgRef.current;
//         if (svgElement == null) {
//             return;
//         }
//
//         const divElement = divRef.current;
//         if (divElement == null) {
//             return;
//         }
//
//         nodes.sort((nodea, nodeb) => {
//             if (nodea.x !== nodeb.x) {
//                 return nodea.x - nodeb.x;
//             }
//             return nodea.y - nodeb.y;
//         })
//
//         calculateNodesSizeAndPos(nodes, hSpaceBetweenNodes, vSpaceBetweenNodes, svgPadding);
//
//         const [svgWidth, svgHeight] = calculateSVGSize(nodes, svgPadding)
//
//         svgElement.setAttribute('width', `${svgWidth}px`);
//         svgElement.setAttribute('height', `${svgHeight}px`);
//
//         nodes.forEach((node) => {
//             node.info = 'aiorstno aoirysunt ouyafw asirteno fyau jarsietn  asiutn ';
//             node.departamento = 'aiorstno aoirysunt ouyafw asirteno fyau jarsietn  asiutn ';
//
//             svgElement.appendChild(createGNode(node));
//             svgElement.appendChild(createModal(node));
//         });
//
//         moveModals(svgElement);
//         addModalsEventListeners();
//
//         setScrollForElement(divElement);
//     }, [nodes, edges])
//
//     return (
//         <div ref={divRef} style={{overflow: 'hidden', border: '1px solid #ff0000' }} >
//             <svg ref={svgRef}></svg>
//         </div>
//     );
// }
