export const getDevice = () => {
    let device;
    if (navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)){
            device = 'mobile'
        } else {
            device = 'desktop'
        }
        return device
}

export const getIfIOS = () => {
    const iOS = /iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    return iOS;
}