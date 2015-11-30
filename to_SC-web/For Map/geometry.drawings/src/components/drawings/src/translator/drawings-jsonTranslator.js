/**
 * Json translator.
 */

Drawings.JsonTranslator = {

    toJson: function (model) {
        return JSON.stringify(model);
    },

    fromJson: function (json) {
        var jsonModel = JSON.parse(json);
        var points = this._fromJsonPoints(jsonModel.points);
        var shapes = this._fromJsonShapes(jsonModel.shapes, points);
        return {points: points, shapes: shapes};
    },

    _fromJsonPoints: function (jsonPoints) {
        var points = [];

        jsonPoints.forEach(function (jsonPoint) {
            var point = new Drawings.Point(jsonPoint.x, jsonPoint.y);
            point.setName(jsonPoint.name);
            point.setId(jsonPoint.id);
            points.push(point);
        });

        return points;
    },

    _fromJsonShapes: function (jsonShapes, points) {
        var shapes = [];

        var parseMethodsMap = {};
        parseMethodsMap["Line"] = this._parseJsonLine;
        parseMethodsMap["Segment"] = this._parseJsonSegment;
        parseMethodsMap["Circle"] = this._parseJsonCircle;
        parseMethodsMap["Triangle"] = this._parseJsonTriangle;

        jsonShapes.forEach(function (jsonShape) {
            var shape = parseMethodsMap[jsonShape.className](jsonShape, points);
            shapes.push(shape);
        });

        return shapes;
    },

    _parseJsonLine: function(jsonLine, points) {
        var point1 = Drawings.Utils.getObjectById(points, jsonLine.points[0].id);
        var point2 = Drawings.Utils.getObjectById(points, jsonLine.points[1].id);

        var line = new Drawings.Line(point1, point2);
        line.setId(jsonLine.id);
        line.setName(jsonLine.name);
        return line;
    },

    _parseJsonCircle: function(jsonCircle, points) {
        var point1 = Drawings.Utils.getObjectById(points, jsonCircle.points[0].id);
        var point2 = Drawings.Utils.getObjectById(points, jsonCircle.points[1].id);

        var circle = new Drawings.Circle(point1, point2);
        circle.setId(jsonCircle.id);
        circle.setName(jsonCircle.name);
        circle.setRadius(jsonCircle.radius);
        return circle;
    },

    _parseJsonSegment: function(jsonSegment, points) {
        var point1 = Drawings.Utils.getObjectById(points, jsonSegment.points[0].id);
        var point2 = Drawings.Utils.getObjectById(points, jsonSegment.points[1].id);

        var segment = new Drawings.Segment(point1, point2);
        segment.setId(jsonSegment.id);
        segment.setName(jsonSegment.name);
        segment.setLength(jsonSegment.length);
        return segment;
    },

    _parseJsonTriangle: function(jsonTriangle, points) {
        var point1 = Drawings.Utils.getObjectById(points, jsonTriangle.points[0].id);
        var point2 = Drawings.Utils.getObjectById(points, jsonTriangle.points[1].id);
        var point3 = Drawings.Utils.getObjectById(points, jsonTriangle.points[2].id);

        var triangle = new Drawings.Triangle(point1, point2, point3);
        triangle.setId(jsonTriangle.id);
        triangle.setName(jsonTriangle.name);
        triangle.setSquare(jsonTriangle.square);
        return triangle;
    }
};