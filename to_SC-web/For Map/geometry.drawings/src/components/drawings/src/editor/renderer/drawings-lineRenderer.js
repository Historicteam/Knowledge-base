/**
 * Point renderer.
 */

Drawings.LineRenderer = function (board) {
    this.board = board;
};

Drawings.LineRenderer.prototype = {

    render: function (line) {
        this._drawLine(line);
    },

    erase: function(line) {
        var jxgLine = Drawings.Utils.getJxgObjectById(this.board, line.getId());
        this._eraseLine(jxgLine);
    },

    _drawLine: function (line) {
        var jxgPoint1 = Drawings.Utils.getJxgObjectById(this.board, line.point1().getId());
        var jxgPoint2 = Drawings.Utils.getJxgObjectById(this.board, line.point2().getId());

        var strokeColor = Drawings.Utils.getStrokeColor(line);

        var properties = {
            id: line.getId(),
            name: line.getName(),
            strokeColor: strokeColor
        };

        this.board.create('line', [jxgPoint1, jxgPoint2], properties);
    },

    _eraseLine: function(jxgLine) {
        this.board.removeObject(jxgLine);
    }
};