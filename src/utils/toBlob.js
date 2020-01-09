export const getBlob = convertMe => {
    console.log(convertMe)
    var UTF = {};
    var out = "";
    UTF.U16to8 = function (convertMe) {
        
        for (var i = 0; i < convertMe.length; i++) {
            var charCode = convertMe.charCodeAt(i);
            out += String.fromCharCode(~~(charCode / 256));
            out += String.fromCharCode(charCode % 256);
        }
        console.log(out)
        return out;
    }
}