var Drawings = {};

function extend(child, parent) {
    var F = function () {
    };
    F.prototype = parent.prototype;
    child.prototype = new F();
    child.prototype.constructor = child;
    child.superclass = parent.prototype;
}

Drawings.DrawingMode = {
    POINT: 0,
    LINE: 1,
    SEGMENT: 2,
    TRIANGLE: 3,
    CIRCLE: 4
};

Drawings.FILL_COLOR = "DodgerBlue";
Drawings.STOKE_COLOR = "DodgerBlue";
Drawings.TRANSLATED_FILL_COLOR = "Blue";
Drawings.TRANSLATED_STROKE_COLOR = "Blue";