/**
 * Point renderer.
 */

Drawings.SegmentRenderer = function (board) {
    this.board = board;
};

Drawings.SegmentRenderer.prototype = {

    render: function (segment) {
        var jxgSegment = this._drawSegment(segment);

        if (segment.length != null) {
            this._drawSegmentLength(jxgSegment, segment);
        }
    },

    erase: function(segment) {
        var jxgSegment = Drawings.Utils.getJxgObjectById(this.board, segment.getId());

        this._eraseSegmentLength(jxgSegment);
        this._eraseSegment(jxgSegment);
    },

    _drawSegment: function (segment) {
        var jxgPoint1 = Drawings.Utils.getJxgObjectById(this.board, segment.point1().getId());
        var jxgPoint2 = Drawings.Utils.getJxgObjectById(this.board, segment.point2().getId());

        var strokeColor = Drawings.Utils.getStrokeColor(segment);

        var properties = {
            id: segment.getId(),
            name: segment.getName(),
            straightFirst: false,
            straightLast: false,
            strokeColor: strokeColor
        };

        return this.board.create('line', [jxgPoint1, jxgPoint2], properties);
    },

    _drawSegmentLength: function (jxgSegment, segment) {
        var point1 = segment.point1();
        var point2 = segment.point2();

        var labelX = function () {
            return (point1.getX() + point2.getX()) / 1.95 + 0.5;
        };

        var labelY = function () {
            return (point1.getY() + point2.getY()) / 1.95 + 0.6;
        };

        var properties = {
            fontSize: 16
        };

        jxgSegment.textLabel = this.board.create('text', [labelX, labelY, segment.getLength()], properties);
    },

    _eraseSegmentLength: function(jxgSegment) {
        if (jxgSegment.textLabel) {
            this.board.removeObject(jxgSegment.textLabel);
        }
    },

    _eraseSegment: function(jxgSegment) {
        this.board.removeObject(jxgSegment);
    }
};