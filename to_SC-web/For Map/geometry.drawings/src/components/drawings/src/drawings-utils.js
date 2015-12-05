/**
 * Utils.
 */

Drawings.Utils = {

    selectPoints: function (objects) {
        return objects.filter(function (object) {
            return object instanceof Drawings.Point;
        })
    },

    selectShapes: function (objects) {
        return objects.filter(function (object) {
            return object instanceof Drawings.Shape;
        })
    },

    selectSegments: function (objects) {
        return objects.filter(function (object) {
            return object instanceof Drawings.Segment;
        })
    },

    selectTriangles: function (objects) {
        return objects.filter(function (object) {
            return object instanceof Drawings.Triangle;
        })
    },

    selectCircles: function (objects) {
        return objects.filter(function (object) {
            return object instanceof Drawings.Circle;
        })
    },

    getObjectById: function (objects, objectId) {
        return objects.filter(function (object) {
            return object.getId() == objectId;
        })[0];
    },

    getStrokeColor: function (shape) {
        return shape.sc_addr == null ? Drawings.STOKE_COLOR : Drawings.TRANSLATED_STROKE_COLOR;
    },

    getFillColor: function (shape) {
        return shape.sc_addr == null ? Drawings.FILL_COLOR : Drawings.TRANSLATED_FILL_COLOR;
    },

    getJxgObjectById: function (board, id) {
        return board.select(function (jxgObject) {
            return jxgObject.id == id;
        }).objectsList[0];
    },

    toModelObjects: function (model, jxgObjects) {
        var objects = [];

        for (var i = 0; i < jxgObjects.length; i++) {
            objects[i] = model.getModelObject(jxgObjects[i].id)
        }

        return objects;
    },

    generateLineName: function (line) {
        var point1Name = line.point1().getName();
        var point2Name = line.point2().getName();
        return point1Name && point2Name ? 'Прямая(' + point1Name + ';' + point2Name + ')' : '';
    },

    generateSegmentName: function (segment) {
        var point1Name = segment.point1().getName();
        var point2Name = segment.point2().getName();
        return point1Name && point2Name ? 'Отр(' + point1Name + ';' + point2Name + ')' : '';
    },

    generateCircleName: function (circle) {
        var point1Name = circle.point1().getName();
        var point2Name = circle.point2().getName();
        return point1Name && point2Name ? 'Окр(' + point1Name + ';' + point2Name + ')' : '';
    },

    generateTriangleName: function (triangle) {
        var point1Name = triangle.point1().getName();
        var point2Name = triangle.point2().getName();
        var point3Name = triangle.point3().getName();
        return point1Name && point2Name && point3Name ?
        'Треугк(' + point1Name + ';' + point2Name + ';' + point3Name + ')' : '';
    },

    randomUUID: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
};