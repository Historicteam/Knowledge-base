/**
 * Point model.
 */

Drawings.Point = function Point(x, y) {
    this.id = Drawings.Utils.randomUUID();
    this.x = x;
    this.y = y;
    this.name = '';
    this.className = this.constructor.name;
};

Drawings.Point.prototype.getId = function () {
    return this.id;
};

Drawings.Point.prototype.setId = function (id) {
    this.id = id;
};

Drawings.Point.prototype.getX = function () {
    return this.x;
};

Drawings.Point.prototype.setX = function (x) {
    this.x = x;
};

Drawings.Point.prototype.getY = function () {
    return this.y;
};

Drawings.Point.prototype.setY = function (y) {
    return this.y = y;
};

Drawings.Point.prototype.setXY = function (x, y) {
    this.x = x;
    this.y = y;
};

Drawings.Point.prototype.getName = function () {
    return this.name;
};

Drawings.Point.prototype.setName = function (name) {
    this.name = name;
};