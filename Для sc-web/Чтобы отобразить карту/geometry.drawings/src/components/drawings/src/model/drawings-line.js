/**
 * Line model.
 */

Drawings.Line = function Line(point1, point2) {
    Drawings.Line.superclass.constructor.apply(this, [[point1, point2]]);
};

extend(Drawings.Line, Drawings.Shape);

Drawings.Line.prototype.point1 = function () {
    return this.points[0];
};

Drawings.Line.prototype.point2 = function () {
    return this.points[1];
};