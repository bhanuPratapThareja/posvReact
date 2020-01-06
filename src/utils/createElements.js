export const createVideoTag = () => {
    const video = document.createElement('video');
    video.setAttribute("width", "320px");
    video.setAttribute("height", "240px");
    video.setAttribute("id", "video")
    video.setAttribute("preload", "");
    video.setAttribute("autoplay", "");
    video.setAttribute("loop", "");
    video.setAttribute("muted", "");
    const booth = document.getElementById('booth');
    booth.prepend(video);
    return video;
}

export const createCanvas = () => {
    const canvas = document.createElement('canvas');
    canvas.setAttribute("width", "320px");
    canvas.setAttribute("height", "240px");
    canvas.setAttribute("id", "canvas");
    const booth = document.getElementById('booth');
    booth.prepend(canvas);
    return canvas;
}