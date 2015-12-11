/**
 * Point renderer.
 */

Drawings.TriangleRenderer = function (board) {
    this.board = board;
};

Drawings.TriangleRenderer.prototype = {

    render: function (triangle) {
        var jxgTriangle = this._drawTriangle(triangle);

        if (triangle.getSquare() != null) {
            this._drawTriangleSquare(jxgTriangle, triangle);
        }
        if (triangle.getPerimeter() != null) {
            this._drawTrianglePerimeter(jxgTriangle, triangle);
        }
    },

    erase: function(triangle) {
        var jxgTriangle = Drawings.Utils.getJxgObjectById(this.board, triangle.getId());

        this._eraseTriangleSquare(jxgTriangle);
        this._eraseTrianglePerimeter(jxgTriangle);
        this._eraseTriangle(jxgTriangle);
    },

    _drawTriangle: function (triangle) {
        var jxgPoint1 = Drawings.Utils.getJxgObjectById(this.board, triangle.point1().getId());
        var jxgPoint2 = Drawings.Utils.getJxgObjectById(this.board, triangle.point2().getId());
        var jxgPoint3 = Drawings.Utils.getJxgObjectById(this.board, triangle.point3().getId());

        var strokeColor = Drawings.Utils.getStrokeColor(triangle);
        var fillColor = Drawings.Utils.getFillColor(triangle);

        var properties = {
            id: triangle.getId(),
            name: triangle.getName(),
            straightFirst: false,
            straightLast: false,
            hasInnerPoints: true,
            strokeColor: strokeColor,
            fillColor: fillColor
        };

        return this.board.create('polygon', [jxgPoint1, jxgPoint2, jxgPoint3], properties);
    },

    _drawTriangleSquare: function (jxgTriangle, triangle) {
        var point1 = triangle.point1();
        var point2 = triangle.point2();
        var point3 = triangle.point3();

        var labelX = function () {
            return (point1.getX() + point2.getX() + point3.getX()) / 3;
        };

        var labelY = function () {
            return (point1.getY() + point2.getY() + point3.getY()) / 3;
        };

        var properties = {
            fontSize: 13
        };

        jxgTriangle.textLabelSquare = this.board.create('text', [labelX, labelY, "square = " + triangle.getSquare()], properties);
    },

    _eraseTriangleSquare: function(jxgTriangle) {
        if (jxgTriangle.textLabelSquare) {
            this.board.removeObject(jxgTriangle.textLabelSquare);
        }
    },

    _drawTrianglePerimeter: function (jxgTriangle, triangle) {
        var point1 = triangle.point1();
        var point2 = triangle.point2();
        var point3 = triangle.point3();

        var labelX = function () {
            return (point1.getX() + point2.getX() + point3.getX()) / 3;
        };

        var labelY = function () {
            return (point1.getY() + point2.getY() + point3.getY()) / 3 + 0.7;
        };

        var properties = {
            fontSize: 13
        };

        jxgTriangle.textLabelPerimeter = this.board.create('text', [labelX, labelY, "perimeter = " + triangle.getPerimeter()], properties);
    },

    _eraseTrianglePerimeter: function(jxgTriangle) {
        if (jxgTriangle.textLabelPerimeter) {
            this.board.removeObject(jxgTriangle.textLabelPerimeter);
        }
    },

    _eraseTriangle: function(jxgTriangle) {
        this.board.removeObject(jxgTriangle);
    }
};