export function lightenHexColor(
    hex: string,
    lightnessAmount: number = 0.2,
    saturationAmount: number = 0
): [string, string, string, string, string] {
    hex = hex.replace(/^#/, '');

    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }

    const num = parseInt(hex, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;

    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case rNorm:
                h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
                break;
            case gNorm:
                h = (bNorm - rNorm) / d + 2;
                break;
            case bNorm:
                h = (rNorm - gNorm) / d + 4;
                break;
        }
        h /= 6;
    }

    // Adjust H and S
    s = Math.min(1, Math.max(0, s + saturationAmount));
    l = Math.min(1, Math.max(0, l + lightnessAmount));

    // Return as CSS hsl()
    const hDeg = Math.round(h * 360);
    const sPerc = Math.round(s * 100);
    const lPerc = Math.round(l * 100);

    const isBright = lPerc <= 62; // todo: magic number must be some real contrast-check
    const textColor = isBright ? "text-white" : "text-black";
    const bgColor = isBright ? "bg-white/30" : "bg-black/30";
    const outlineColor = isBright ? "outline-white" : "outline-black";
    const borderColor = isBright ? "border-white/30" : "border-black/30";

    return [textColor, bgColor, borderColor, outlineColor, `hsl(${hDeg}, ${sPerc}%, ${lPerc}%)`];
}