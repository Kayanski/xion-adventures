
export function setCursorPointer() {
    const canvas = document.querySelector("canvas");
    if (canvas) {
        canvas.style.cursor = "pointer"; // Change to pointer cursor
    }
}
export function setCursorDefault() {
    const canvas = document.querySelector("canvas");
    if (canvas) {
        canvas.style.cursor = "default"; // Reset to default cursor
    }
}