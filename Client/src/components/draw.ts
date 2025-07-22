export function drawRoundedRect(x: number,  y: number, width: number, height: number): SVGPathElement {
    const path = document.createElementNS('http://www.w3.org/2000/svg','path');
    const r = 10;
    const d = `
        M ${x + r},${y}
        h ${width - 2 * r}
        a ${r},${r} 0 0 1 ${r},${r}
        v ${height - 2 * r}
        a ${r},${r} 0 0 1 -${r},${r}
        h ${-(width - 2 * r)}
        a ${r},${r} 0 0 1 -${r},-${r}
        v ${-(height - 2 * r)}
        a ${r},${r} 0 0 1 ${r},-${r}
        Z
    `;
    path.setAttribute('d', d.trim())
    path.setAttribute('fill', '#000000')
    return path;
}

export function drawRoundedRectType1(x: number,  y: number, width: number, height: number): SVGPathElement {
    const path = document.createElementNS('http://www.w3.org/2000/svg','path');
    const r = 10;
    const d = `
        M ${x + r},${y}
        h ${width - 2 * r}
        a ${r},${r} 0 0 1 ${r},${r}
        v ${height - 2 * r}
        a ${r},${r} 0 0 1 -${r},${r}
        h ${-(width - r)}
        v ${-(height)}
        Z
    `;
    path.setAttribute('d', d.trim())
    path.setAttribute('fill', '#000000')
    return path;
}

export function drawRoundedRectType2(x: number,  y: number, width: number, height: number): SVGPathElement {
    const path = document.createElementNS('http://www.w3.org/2000/svg','path');
    const r = 10;
    const d = `
        M ${x},${y}
        h ${width}
        v ${height - r}
        a ${r},${r} 0 0 1 -${r},${r}
        h ${-(width - 2 * r)}
        a ${r},${r} 0 0 1 -${r},-${r}
        v ${-(height - r)}
        Z
    `;
    path.setAttribute('d', d.trim())
    path.setAttribute('fill', '#000000')
    return path;
}

export function drawRoundedRectWithTail(x: number,  y: number, width: number, height: number): SVGPathElement {
    const path = document.createElementNS('http://www.w3.org/2000/svg','path');
    const r = 10;
    const t = 10;
    const d = `
        M ${x} ${y}
        L ${x+t} ${y+t}
        h ${width - t - r}
        a ${r},${r} 0 0 1 ${r},${r}
        v ${height - 2 * r}
        a ${r},${r} 0 0 1 -${r},${r}
        h ${-(width - 2 * r)}
        a ${r},${r} 0 0 1 -${r},-${r}
        v ${-(height - 2 * r)}
        Z
    `;
    path.setAttribute('d', d.trim())
    path.setAttribute('fill', '#000000')
    return path;
}

export function drawTextVerticalCenter(text: string, x: number, y: number, width: number, height: number): SVGTextElement {
    const textElement = document.createElementNS('http://www.w3.org/2000/svg','text');
    textElement.setAttribute('x', `0`);
    textElement.setAttribute('y', `0`);
    textElement.setAttribute('dominant-baseline', 'hanging');
    textElement.setAttribute('font-family', 'Poppins');
    textElement.setAttribute('font-size', '16px');
    textElement.style = "user-select: none; fill: #000000;";
    textElement.textContent = "te odio texto en svgs aaaaaaaa"
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

function getLimitedStrHeight(text: string, maxWidth: number): number {
    const {lineHeight, lineWidth} = getStrBoxSize(text);

    const lines = Math.ceil(lineWidth / maxWidth);
    return lines * (lineHeight);
}

function coordsTextVertical(text: string, boxX: number, boxY: number, boxHeight: number, boxWidth: number): {x: number, y: number} {
    const textHeight = getLimitedStrHeight(text, boxWidth)
    return {
        x: boxX,
        y: boxY + (boxHeight - textHeight)/2, // por alguna razon 0.5 hace que se vea mejor
    }
}

function breakString(text: string, maxWidth: number): {labels: string[], lines: number} {
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

    return {labels: lines, lines: lines.length};
}
