/**
 * Circle renderer.
 */

Drawings.CircleRenderer = function (board) {
    this.board = board;
};

Drawings.CircleRenderer.prototype = {

    render: function (circle) {
        var jxgCircle = this._drawCircle(circle);

        if (circle.length != null) {
            this._drawCircleLength(jxgCircle, circle);
        }
        if (circle.radius != null) {
            this._drawRadiusLength(jxgCircle, circle);
        }
    },

    _drawRadiusLength: function(jxgCircle, circle){

        var point1 = circle.point1();

        var labelX = function () {
            return ( point1.getX()) + 0.5;
        };

        var labelY = function () {
            return (point1.getY()) - 1;
        };

        var properties = {
            fontSize: 12
        };

        jxgCircle.textLabelRadius = this.board.create('text', [labelX, labelY, 'radius = ' + circle.getRadius()], properties);
    },

    _drawCircleLength: function(jxgCircle, circle){

        var point2 = circle.point2();

        var labelX = function () {
            return ( point2.getX()) + 0.5;
        };

        var labelY = function () {
            return (point2.getY()) - 1;
        };

        var properties = {
            fontSize: 12
        };

        jxgCircle.textLabelLength = this.board.create('text', [labelX, labelY, 'length = ' + circle.getLength()], properties);
    },

    erase: function(circle) {
        var jxgCircle = Drawings.Utils.getJxgObjectById(this.board, circle.getId());

        this._eraseCircleLength(jxgCircle);
        this._eraseRadiusLength(jxgCircle);
        this._eraseCircle(jxgCircle);
    },

    _eraseCircleLength: function(jxgCircle){
        if (jxgCircle.textLabelLength ) {
            this.board.removeObject(jxgCircle.textLabelLength );
        }

    },

    _eraseRadiusLength: function(jxgCircle){

        if (jxgCircle.textLabelRadius) {
            this.board.removeObject(jxgCircle.textLabelRadius);
        }
    },

    _drawCircle: function (circle) {
        var jxgPoint1 = Drawings.Utils.getJxgObjectById(this.board, circle.point1().getId());
        var jxgPoint2 = Drawings.Utils.getJxgObjectById(this.board, circle.point2().getId());

        var strokeColor = Drawings.Utils.getStrokeColor(circle);

        var properties = {
            id: circle.getId(),
            name: circle.getName(),
            straightFirst: false,
            straightLast: false,
            strokeColor: strokeColor
        };

        return this.board.create('circle', [jxgPoint1, jxgPoint2], properties);
    },

    _eraseCircle: function(jxgCircle) {
        this.board.removeObject(jxgCircle);
    }
};