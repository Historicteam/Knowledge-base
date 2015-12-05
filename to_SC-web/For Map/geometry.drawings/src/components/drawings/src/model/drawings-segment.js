/**
 * Segment model.
 */

Drawings.Segment = function Segment(point1, point2) {
    Drawings.Segment.superclass.constructor.apply(this, [[point1, point2]]);
    this.length = null;
};

extend(Drawings.Segment, Drawings.Shape);

Drawings.Segment.prototype.point1 = function () {
    return this.points[0];
};

Drawings.Segment.prototype.point2 = function () {
    return this.points[1];
};

Drawings.Segment.prototype.setLength = function (length) {
    this.length = length;
};

Drawings.Segment.prototype.getLength = function () {
    return this.length;
};
