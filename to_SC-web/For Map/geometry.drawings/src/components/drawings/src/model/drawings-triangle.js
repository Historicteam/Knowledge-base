/**
 * Triangle model.
 */

Drawings.Triangle = function Triangle(point1, point2, point3) {
    Drawings.Triangle.superclass.constructor.apply(this, [[point1, point2, point3]]);
    this.square = null;
    this.perimeter = null;
};

extend(Drawings.Triangle, Drawings.Shape);

Drawings.Triangle.prototype.point1 = function () {
    return this.points[0];
};

Drawings.Triangle.prototype.point2 = function () {
    return this.points[1];
};

Drawings.Triangle.prototype.point3 = function () {
    return this.points[2];
};

Drawings.Triangle.prototype.setSquare = function (square) {
    this.square = square;
};

Drawings.Triangle.prototype.getSquare = function () {
    return this.square;
};

Drawings.Triangle.prototype.setPerimeter = function (perimeter) {
    this.perimeter = perimeter;
};

Drawings.Triangle.prototype.getPerimeter = function () {
    return this.perimeter;
};