/* --- src/drawings-common.js --- */
var Drawings = {};

function extend(child, parent) {
    var F = function () {
    };
    F.prototype = parent.prototype;
    child.prototype = new F();
    child.prototype.constructor = child;
    child.superclass = parent.prototype;
}

Drawings.DrawingMode = {
    POINT: 0,
    LINE: 1,
    SEGMENT: 2,
    TRIANGLE: 3,
    CIRCLE: 4
};

Drawings.FILL_COLOR = "DodgerBlue";
Drawings.STOKE_COLOR = "DodgerBlue";
Drawings.TRANSLATED_FILL_COLOR = "Blue";
Drawings.TRANSLATED_STROKE_COLOR = "Blue";

/* --- src/drawings-utils.js --- */
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

/* --- src/model/drawings-shape.js --- */
/**
 * Shape model.
 */

Drawings.Shape = function Shape(points) {
    this.id = Drawings.Utils.randomUUID();
    this.name = '';
    this.points = points;
    this.className = this.constructor.name;
};

Drawings.Shape.prototype.getId = function () {
    return this.id;
};

Drawings.Shape.prototype.setId = function (id) {
    this.id = id;
};

Drawings.Shape.prototype.getName = function () {
    return this.name;
};

Drawings.Shape.prototype.setName = function (name) {
    return this.name = name;
};

Drawings.Shape.prototype.getPoints = function () {
    return this.points;
};

Drawings.Shape.prototype.getPoint = function (pointId) {
    return Drawings.Utils.getObjectById(this.points, pointId);
};

/* --- src/model/drawings-point.js --- */
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

/* --- src/model/drawings-line.js --- */
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

/* --- src/model/drawings-segment.js --- */
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


/* --- src/model/drawings-triangle.js --- */
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

/* --- src/model/drawings-circle.js --- */
/**
 * Circle model.
 */

Drawings.Circle = function Circle(point1, point2) {
    Drawings.Circle.superclass.constructor.apply(this, [[point1, point2]]);
    this.radius = null;
    this.center = null;
    this.length = null;
};

extend(Drawings.Circle, Drawings.Shape);

Drawings.Circle.prototype.point1 = function () {
    return this.points[0];
};

Drawings.Circle.prototype.point2 = function () {
    return this.points[1];
};

Drawings.Circle.prototype.setRadius = function (radius) {
    this.radius = radius;
};

Drawings.Circle.prototype.getRadius = function () {
    return this.radius;
};

Drawings.Circle.prototype.setCenter = function (center) {
    this.center = center;
};

Drawings.Circle.prototype.setLength = function (length) {
    this.length = length;
};

Drawings.Circle.prototype.getLength = function () {
    return this.length;
};

/* --- src/model/drawings-model.js --- */
/**
 * Drawings model.
 */

Drawings.Model = function Model() {
    this.points = [];
    this.shapes = [];
};

Drawings.Model.prototype = {

    onUpdateCallback: null,

    getModelObjects: function () {
        return [].concat(this.points, this.shapes);
    },

    getModelObject: function (objectId) {
        return Drawings.Utils.getObjectById(this.getModelObjects(), objectId);
    },

    getPoints: function () {
        return this.points;
    },

    getShapes: function () {
        return this.shapes;
    },

    getPoint: function (pointId) {
        return Drawings.Utils.getObjectById(this.points, pointId);
    },

    getShape: function (shapeId) {
        return Drawings.Utils.getObjectById(this.shapes, shapeId);
    },

    addPoint: function (point) {
        this.points.push(point);
        this._added([point]);
    },

    addPoints: function (points) {
        this.points = this.points.concat(points);
        this._added(points);
    },

    addShape: function (shape) {
        this.shapes.push(shape);
        this._added([shape]);
    },

    addShapes: function (shapes) {
        this.shapes = this.shapes.concat(shapes);
        this._added(shapes);
    },

    clear: function () {
        this._removed(this.shapes);
        this._removed(this.points);

        this.shapes.length = 0;
        this.points.length = 0;
        Drawings.ScTranslator.wipeOld();
    },

    updated: function (objects) {
        this._updated(objects)
    },

    onUpdate: function (callback) {
        this.onUpdateCallback = callback;
    },

    _added: function (objectsToAdd) {
        this.onUpdateCallback([], objectsToAdd, [])
    },

    _updated: function (objectsToUpdate) {
        this.onUpdateCallback([], [], objectsToUpdate);
    },

    _removed: function (objectsToRemove) {
        this.onUpdateCallback(objectsToRemove, [], []);
    }
};

/* --- src/translator/drawings-jsonTranslator.js --- */
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

/* --- src/translator/drawings-scTranslator.js --- */
/**
 * sc translator.
 */

Drawings.ScTranslator = {


    getKeyNode: function (node_name) {
        if (!this.hasOwnProperty(node_name) || this[node_name] == null) {
            var dfd = new jQuery.Deferred();
            var self = this;
            self[node_name] = null;
            window.sctpClient.find_element_by_system_identifier(node_name)
                .done(function (r) {
// if(r.resCode != SctpResultCode.SCTP_RESULT_OK){
                    if (r == null) {
                        alert("can't resolve " + node_name);// TODO: remove
// alert
                    }
                    self[node_name] = r;
                    dfd.resolve(self[node_name]);
                }).fail(function () {
                    self[node_name] = null;
                    dfd.resolve(self[node_name]);
                });
            return dfd.promise();
        }
    },
    getKeyNodes: function () {
        var dfd = new jQuery.Deferred();
        var my_array = [];
        var self = this;
        my_array.push(this.getKeyNode("concept_quantity"));
        my_array.push(this.getKeyNode("concept_segment"));
        my_array.push(this.getKeyNode("nrel_side"));
        my_array.push(this.getKeyNode("concept_triangle"));
        my_array.push(this.getKeyNode("concept_circle"));
        my_array.push(this.getKeyNode("concept_geometric_point"));// ?
        my_array.push(this.getKeyNode("concept_straight_line"));
        my_array.push(this.getKeyNode("nrel_boundary_point"));
        my_array.push(this.getKeyNode("nrel_inclusion"));
        my_array.push(this.getKeyNode("nrel_vertex"));
        my_array.push(this.getKeyNode("nrel_radius"));
        my_array.push(this.getKeyNode("nrel_system_identifier"));
        my_array.push(this.getKeyNode("nrel_length"));
        my_array.push(this.getKeyNode("nrel_center_of_circle"));
        my_array.push(this.getKeyNode("nrel_value"));
        my_array.push(this.getKeyNode("nrel_area"));
        my_array.push(this.getKeyNode("nrel_perimeter"));
        my_array.push(this.getKeyNode("concept_square"));
        my_array.push(this.getKeyNode("chart_arguments"));
        my_array.push(this.getKeyNode("sc_garbage")); // 15
        $.when.apply($, my_array).done(function () {
            dfd.resolve(my_array);
        }).fail(function () {
            dfd.reject(my_array);
        });
        return dfd.promise();
    },
    /*
     Add link with content into base_el.
     All parameters must be sc_addr
     */
    addNewLinkWithContent: function (content, base_el) {
        window.sctpClient.create_link().done(function (res) {
            window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.chart_arguments, res);
            window.sctpClient.set_link_content(res, content);
            self.addFiveConstructionIntoBase(r, res, self.nrel_system_identifier, base_el,
                sc_type_arc_common | sc_type_const);
        });
    },
    /*
     Add relation and quantity-value-answer construction.
     See segment length example
     relation must be sc_addr, value is an answer (for example shape.length)
     */
    addConstructionWithValueAndQuantity: function (relation, value) {
    },
    /*
     Add relation or attribute construction.
     All parameters must be sc_addr
     */
    addFiveConstruction: function (start_el, end_el, relOrAttr, arc_type) {
        window.sctpClient.create_arc(
            arc_type, start_el, end_el).done(function (res) {
                window.sctpClient.create_arc(
                    sc_type_arc_pos_const_perm, relOrAttr, res);
            });
    },
    /*
     Add relation or attribute construction and put all arcs into base_el.
     All parameters must be sc_addr.
     */
    addFiveConstructionIntoBase: function (start_el, end_el, relOrAttr, base_el, arc_type) {
        window.sctpClient.create_arc(
            arc_type, start_el, end_el).done(function (res) {
                window.sctpClient.create_arc(
                    sc_type_arc_pos_const_perm, relOrAttr, res).done(function (res1) {
                        window.sctpClient.create_arc(
                            sc_type_arc_pos_const_perm, base_el, res1);
                    });
                window.sctpClient.create_arc(
                    sc_type_arc_pos_const_perm, base_el, res);
                window.sctpClient.create_arc(
                    sc_type_arc_pos_const_perm, base_el, relOrAttr);
            });
    },
    putPoint: function (point) {
        var dfd = new jQuery.Deferred();
        if (point.hasOwnProperty("sc_addr") && point.sc_addr != null) {
            dfd.resolve(point.sc_addr);
            return dfd.promise();
        }
        var self = this;
        window.sctpClient.create_node(sc_type_node | sc_type_const).done(
            function (r) {
                point.sc_addr = r;
                if ("" != point.name) {
                    window.sctpClient.create_link().done(function (res) {
                        window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.chart_arguments, res);
                        window.sctpClient.set_link_content(res, point.name);
                        self.addFiveConstructionIntoBase(r, res, self.nrel_system_identifier, self.chart_arguments,
                            sc_type_arc_common | sc_type_const);
                    });
                }
                var arc1 = window.sctpClient.create_arc(
                    sc_type_arc_pos_const_perm, self.chart_arguments, r);
                var arc2 = window.sctpClient.create_arc(
                    sc_type_arc_pos_const_perm, self.concept_geometric_point, r);
                arc2.done(function (res) {
                    window.sctpClient.create_arc(
                        sc_type_arc_pos_const_perm, self.chart_arguments, res);
                })
                var arc3 = window.sctpClient.create_arc(
                    sc_type_arc_pos_const_perm, self.chart_arguments, self.concept_geometric_point);
                $.when(arc1, arc2, arc3).done(function () {
                    dfd.resolve(r);
                });
            }).fail(function () {
                dfd.reject();
                alert("1) create node for point failed");
            });
        return dfd.promise();
    },
// /
    putShape: function (shape) {
        var dfd = new jQuery.Deferred();
        if (shape.hasOwnProperty("sc_addr") && shape.sc_addr != null) {
            dfd.resolve(shape.sc_addr);
            return dfd.promise();
        }
        var self = this;
        window.sctpClient.create_node(sc_type_node | sc_type_const).done(
            function (r) {
                var points = shape.points;
                shape.sc_addr = r;
                var shapeType = self.concept_geometric_point;
                if (shape.className == 'Segment') {
                    shapeType = self.concept_segment;
                    for (var i = 0; i < points.length; i++) {
                        self.addFiveConstructionIntoBase(r, points[i].sc_addr, self.nrel_boundary_point,
                            self.chart_arguments, sc_type_arc_common | sc_type_const);
                    }
                    if (shape.length) {
                        self.addConstructionWithValueAndQuantity(self.nrel_length, shape.length);
                        var arc1 = window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.chart_arguments, self.nrel_length);
                        arc1.done(function (r1) {
                            var arc2 = window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.chart_arguments, self.nrel_value);
                            arc2.done(function (r2) {
                                window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.chart_arguments, self.concept_quantity);
                                window.sctpClient.create_node(sc_type_node | sc_type_const).done(function (quality_node) {
                                    window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.chart_arguments, quality_node);
                                    window.sctpClient.create_node(sc_type_node | sc_type_const).done(function (value_node) {
                                        window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.chart_arguments, value_node);
                                        window.sctpClient.create_node(sc_type_node | sc_type_const).done(function (answer_node) {
                                            self.addFiveConstruction(self.concept_quantity, quality_node, self.chart_arguments, sc_type_arc_pos_const_perm);
                                            window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.chart_arguments, answer_node);
                                            self.addFiveConstructionIntoBase(r, quality_node, self.nrel_length,
                                                self.chart_arguments, sc_type_arc_common | sc_type_const);
                                            self.addFiveConstructionIntoBase(value_node, quality_node, self.nrel_value,
                                                self.chart_arguments, sc_type_arc_common | sc_type_const);
                                            self.addFiveConstruction(value_node, answer_node, self.chart_arguments, sc_type_arc_pos_const_perm);
                                            window.sctpClient.create_link().done(function (res) {
                                                window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.chart_arguments, res);
                                                window.sctpClient.set_link_content(res, shape.length);
                                                self.addFiveConstructionIntoBase(answer_node, res, self.nrel_system_identifier, self.chart_arguments,
                                                    sc_type_arc_common | sc_type_const);
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    }
                }
                if (shape.className == 'Line') {
                    shapeType = self.concept_straight_line;
                    for (var i = 0; i < points.length; i++) {
                        self.addFiveConstruction(r, points[i].sc_addr, self.chart_arguments, sc_type_arc_pos_const_perm);
                    }
                }
                if (shape.className == 'Circle') {
                    shapeType = self.concept_circle;
                    if (shape.center) {
                        self.addFiveConstructionIntoBase(r, points[0].sc_addr, self.nrel_center_of_circle,
                            self.chart_arguments, sc_type_arc_common | sc_type_const);
                        self.addFiveConstruction(r, points[1].sc_addr, self.chart_arguments, sc_type_arc_pos_const_perm);
                    }
                    if (shape.radius) {
                        self.addFiveConstructionIntoBase(r, shape.radius.sc_addr, self.nrel_radius,
                            self.chart_arguments, sc_type_arc_common | sc_type_const);
                        window.sctpClient.create_node(sc_type_node | sc_type_const).done(function (createdNode) {
                            window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.chart_arguments, createdNode);
                            self.addFiveConstructionIntoBase(r, createdNode, self.nrel_radius,
                                self.chart_arguments, sc_type_arc_common | sc_type_const);
                            var arc1 = window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.chart_arguments, self.nrel_length);
                            arc1.done(function (r1) {
                                var arc2 = window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.chart_arguments, self.nrel_value);
                                arc2.done(function (r2) {
                                    window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.chart_arguments, self.concept_quantity);
                                    window.sctpClient.create_node(sc_type_node | sc_type_const).done(function (quality_node) {
                                        window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.chart_arguments, quality_node);
                                        window.sctpClient.create_node(sc_type_node | sc_type_const).done(function (value_node) {
                                            window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.chart_arguments, value_node);
                                            window.sctpClient.create_node(sc_type_node | sc_type_const).done(function (answer_node) {
                                                self.addFiveConstruction(self.concept_quantity, quality_node, self.chart_arguments, sc_type_arc_pos_const_perm);
                                                window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.chart_arguments, answer_node);
                                                self.addFiveConstructionIntoBase(createdNode, quality_node, self.nrel_length,
                                                    self.chart_arguments, sc_type_arc_common | sc_type_const);
                                                self.addFiveConstructionIntoBase(value_node, quality_node, self.nrel_value,
                                                    self.chart_arguments, sc_type_arc_common | sc_type_const);
                                                self.addFiveConstruction(value_node, answer_node, self.chart_arguments, sc_type_arc_pos_const_perm);
                                                window.sctpClient.create_link().done(function (res) {
                                                    window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.chart_arguments, res);
                                                    window.sctpClient.set_link_content(res, shape.radius);
                                                    self.addFiveConstructionIntoBase(answer_node, res, self.nrel_system_identifier, self.chart_arguments,
                                                        sc_type_arc_common | sc_type_const);
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    }
                    if (shape.length) {
                        var arc1 = window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.chart_arguments, self.nrel_length);
                        arc1.done(function (r1) {
                            var arc2 = window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.chart_arguments, self.nrel_value);
                            arc2.done(function (r2) {
                                window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.chart_arguments, self.concept_quantity);
                                window.sctpClient.create_node(sc_type_node | sc_type_const).done(function (quality_node) {
                                    window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.chart_arguments, quality_node);
                                    window.sctpClient.create_node(sc_type_node | sc_type_const).done(function (value_node) {
                                        window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.chart_arguments, value_node);
                                        window.sctpClient.create_node(sc_type_node | sc_type_const).done(function (answer_node) {
                                            self.addFiveConstruction(self.concept_quantity, quality_node, self.chart_arguments, sc_type_arc_pos_const_perm);
                                            window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.chart_arguments, answer_node);
                                            self.addFiveConstructionIntoBase(r, quality_node, self.nrel_length,
                                                self.chart_arguments, sc_type_arc_common | sc_type_const);
                                            self.addFiveConstructionIntoBase(value_node, quality_node, self.nrel_value,
                                                self.chart_arguments, sc_type_arc_common | sc_type_const);
                                            self.addFiveConstruction(value_node, answer_node, self.chart_arguments, sc_type_arc_pos_const_perm);
                                            window.sctpClient.create_link().done(function (res) {
                                                window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.chart_arguments, res);
                                                window.sctpClient.set_link_content(res, shape.length);
                                                self.addFiveConstructionIntoBase(answer_node, res, self.nrel_system_identifier, self.chart_arguments,
                                                    sc_type_arc_common | sc_type_const);
                                            });
                                        });
                                    });
                                });
                            });
                        });

                    }
                }
                if (shape.className == 'Triangle') {
                    shapeType = self.concept_triangle;
                    for (var i = 0; i < points.length; i++) {
                        self.addFiveConstructionIntoBase(r, points[i].sc_addr, self.nrel_vertex,
                            self.chart_arguments, sc_type_arc_common | sc_type_const);
                    }
                    if (!shape.hasOwnProperty('shapes')) {
                        shape.shapes = [];
                        shape.shapes[0] = shape.segment1;
                        shape.shapes[1] = shape.segment2;
                        shape.shapes[2] = shape.segment3;
                    }
                    for (var i = 0; i < shape.shapes.length; i++) {
                        self.addFiveConstructionIntoBase(r, shape.shapes[i].sc_addr, self.nrel_side,
                            self.chart_arguments, sc_type_arc_common | sc_type_const);
                    }
                    if (shape.perimeter) {
                        var arc1 = window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.chart_arguments, self.nrel_perimeter);
                        arc1.done(function (r1) {
                            var arc2 = window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.chart_arguments, self.nrel_value);
                            arc2.done(function (r2) {
                                window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.chart_arguments, self.concept_quantity);
                                window.sctpClient.create_node(sc_type_node | sc_type_const).done(function (quality_node) {
                                    window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.chart_arguments, quality_node);
                                    window.sctpClient.create_node(sc_type_node | sc_type_const).done(function (value_node) {
                                        window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.chart_arguments, value_node);
                                        window.sctpClient.create_node(sc_type_node | sc_type_const).done(function (answer_node) {
                                            self.addFiveConstruction(self.concept_quantity, quality_node, self.chart_arguments, sc_type_arc_pos_const_perm);
                                            window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.chart_arguments, answer_node);
                                            self.addFiveConstructionIntoBase(r, quality_node, self.nrel_perimeter,
                                                self.chart_arguments, sc_type_arc_common | sc_type_const);
                                            self.addFiveConstructionIntoBase(value_node, quality_node, self.nrel_value,
                                                self.chart_arguments, sc_type_arc_common | sc_type_const);
                                            self.addFiveConstruction(value_node, answer_node, self.chart_arguments, sc_type_arc_pos_const_perm);
                                            window.sctpClient.create_link().done(function (res) {
                                                window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.chart_arguments, res);
                                                window.sctpClient.set_link_content(res, shape.perimeter);
                                                self.addFiveConstructionIntoBase(answer_node, res, self.nrel_system_identifier, self.chart_arguments,
                                                    sc_type_arc_common | sc_type_const);
                                            });
                                        });
                                    });
                                });
                            });
                        });

                    }
                    if (shape.square) {
                        var arc1 = window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.chart_arguments, self.nrel_area);
                        arc1.done(function (r1) {
                            var arc2 = window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.chart_arguments, self.nrel_value);
                            arc2.done(function (r2) {
                                window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.chart_arguments, self.concept_quantity);
                                window.sctpClient.create_node(sc_type_node | sc_type_const).done(function (quality_node) {
                                    window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.chart_arguments, quality_node);
                                    window.sctpClient.create_node(sc_type_node | sc_type_const).done(function (value_node) {
                                        window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.chart_arguments, value_node);
                                        window.sctpClient.create_node(sc_type_node | sc_type_const).done(function (answer_node) {
                                            self.addFiveConstruction(self.concept_quantity, quality_node, self.chart_arguments, sc_type_arc_pos_const_perm);
                                            window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.chart_arguments, answer_node);
                                            self.addFiveConstructionIntoBase(r, quality_node, self.nrel_area,
                                                self.chart_arguments, sc_type_arc_common | sc_type_const);
                                            self.addFiveConstructionIntoBase(value_node, quality_node, self.nrel_value,
                                                self.chart_arguments, sc_type_arc_common | sc_type_const);
                                            self.addFiveConstruction(value_node, answer_node, self.chart_arguments, sc_type_arc_pos_const_perm);
                                            window.sctpClient.create_link().done(function (res) {
                                                window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.chart_arguments, res);
                                                window.sctpClient.set_link_content(res, shape.square);
                                                self.addFiveConstructionIntoBase(answer_node, res, self.nrel_system_identifier, self.chart_arguments,
                                                    sc_type_arc_common | sc_type_const);
                                            });
                                        });
                                    });
                                });
                            });
                        });

                    }

                }

                if ("" != shape.name) {
                    window.sctpClient.create_link().done(function (res) {
                        window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.chart_arguments, res);
                        window.sctpClient.set_link_content(res, shape.name);
                        self.addFiveConstructionIntoBase(r, res, self.nrel_system_identifier, self.chart_arguments,
                            sc_type_arc_common | sc_type_const);
                    });
                }
                var arc1 = window.sctpClient.create_arc(
                    sc_type_arc_pos_const_perm, self.chart_arguments, r);
                var arc2 = window.sctpClient
                    .create_arc(sc_type_arc_pos_const_perm, shapeType, r);
                arc2.done(function (result) {
                    window.sctpClient.create_arc(
                        sc_type_arc_pos_const_perm, self.chart_arguments, result);
                });
                var arc3 = window.sctpClient.create_arc(
                    sc_type_arc_pos_const_perm, self.chart_arguments, shapeType);
                $.when(arc1, arc2, arc3).done(function () {
                    dfd.resolve(r);
                });
            }).fail(function () {
                dfd.reject();
                alert("1) create node for shape failed");
            });
        return dfd.promise();
    },
// /
    pushPoints: function (points) {
        var dfd = new jQuery.Deferred();
        var my_array = [];
        var self = this;
        for (t in points) {
            my_array.push(this.putPoint(points[t]));
        }
        $.when.apply($, my_array).done(function () {
            dfd.resolve();
        }).fail(function () {
            dfd.reject();
        });
        return dfd.promise();
    },
    pushShapes: function (shapes) {
        var dfd = new jQuery.Deferred();
        var my_array1 = [];
        var self = this;
//put segments first
        for (t in shapes) {
            if (shapes[t].className != 'Point')
                my_array1.push(this.putShape(shapes[t]));
        }
        $.when.apply($, my_array1).done(function () {
            dfd.resolve();
        }).fail(function () {
            dfd.reject();
        });
        return dfd.promise();
    },


    getSystemAddrs: function () {
        var self = this;
        var dfd = new jQuery.Deferred();
        var sysArray = [];
        sysArray.push(self.concept_quantity);
        sysArray.push(self.concept_segment);
        sysArray.push(self.nrel_side);
        sysArray.push(self.concept_triangle);
        sysArray.push(self.concept_circle);
        sysArray.push(self.concept_geometric_point);
        sysArray.push(self.concept_straight_line);
        sysArray.push(self.nrel_boundary_point);
        sysArray.push(self.nrel_inclusion);
        sysArray.push(self.nrel_vertex);
        sysArray.push(self.nrel_radius);
        sysArray.push(self.nrel_system_identifier);
        sysArray.push(self.nrel_length);
        sysArray.push(self.nrel_center_of_circle);
        sysArray.push(self.nrel_value);
        sysArray.push(self.nrel_area);
        sysArray.push(self.nrel_perimeter);
        sysArray.push(self.concept_square);
        sysArray.push(self.chart_arguments);
        sysArray.push(self.sc_garbage);
        dfd.resolve(sysArray);
        return dfd.promise();
    },

    wipeOld: function () {
        var addrsOfNodesToWipe = [];
        var addrsOfArcsToWipe = [];
        var self = this;
        var dfd = new jQuery.Deferred();
        window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_3F_A_A, [
            self.chart_arguments,
            sc_type_arc_pos_const_perm,
            sc_type_node | sc_type_const])
            .done(function (res) {
                self.getSystemAddrs().done(function (resSystemNodes) {
                    var flag = true;
                    for (var i = 0; i < res.length; i++) {
                        for (var j = 0; j < resSystemNodes.length; j++) {
                            if (res [i][2] == resSystemNodes[j]) {
                                window.sctpClient.create_arc(sc_type_arc_pos_const_perm,
                                    self.sc_garbage, res [i][1]);
                                flag = false;
                            }
                        }
                        if (flag) {
                            addrsOfNodesToWipe.push(res[i][2]);
                            addrsOfArcsToWipe.push(res[i][1]);
                        }
                        else {
                            flag = true;
                        }
                    }
                    for (i = 0; i < addrsOfNodesToWipe.length; i++) {
                        window.sctpClient.create_arc(sc_type_arc_pos_const_perm,
                            self.sc_garbage, addrsOfNodesToWipe[i]);
                    }
                    for (i = 0; i < addrsOfArcsToWipe; i++) {
                        window.sctpClient.erase_element(addrsOfArcsToWipe[i]).done(function (res) {
                            console.log("delete " + addrsOfArcsToWipe[i]);
                        })
                    }
                });
                //console.log(addrsToWipe);
                dfd.resolve();
            }).fail(function () {
//alert("fail in wipeOld");
                dfd.resolve();
            });

        return dfd.promise();
    },

    calcTrianglePerimeter: function (model) {
        $('#textArea').val('');
        var triangleName = "";
        for (var i = 0; i < model.shapes.length; i++) {
            var triangle = model.shapes[i];
            if (triangle.className == 'Triangle') {
                var perim = 0;
                if (triangle.segment1.length != undefined && triangle.segment2.length != undefined && triangle.segment3.length != undefined) {
                    perim += parseInt(triangle.segment1.length) + parseInt(triangle.segment2.length) + parseInt(triangle.segment3.length);
                    if (triangle.name) {
                        triangleName = triangle.name.charAt(7) + triangle.name.charAt(9) + triangle.name.charAt(11);
                    } else {
                        triangleName = '';
                    }
                    $('#textArea').val($('#textArea').val() + "Perimeter of triangle " + triangleName + " is : " + perim + "\n");
                }
            }
        }
    },

    calcTriangleSquare: function (model) {
        $('#textArea').val('');
        var triangleName = "";
        for (var i = 0; i < model.shapes.length; i++) {
            var triangle = model.shapes[i];
            if (triangle.className == 'Triangle') {
                var square = 0;
                if (triangle.segment1.length != undefined && triangle.segment2.length != undefined && triangle.segment3.length != undefined) {
                    var side1 = parseInt(triangle.segment1.length);
                    var side2 = parseInt(triangle.segment2.length);
                    var side3 = parseInt(triangle.segment3.length)
                    var p = (side1 + side2 + side3) / 2;
                    square = Math.sqrt(p * (p - side1) * (p - side2) * (p - side3));
                    if (triangle.name) {
                        triangleName = triangle.name.charAt(7) + triangle.name.charAt(9) + triangle.name.charAt(11);
                    } else {
                        triangleName = '';
                    }
                    $('#textArea').val($('#textArea').val() + "Area of triangle  " + triangleName + " is : " + square + "\n");
                }
            }
        }
    },

    viewBasedKeyNode: function () {
        var addr;
        SCWeb.core.Server.resolveScAddr(['chart_arguments'], function (keynodes) {
            addr = keynodes['chart_arguments'];
            SCWeb.core.Server.resolveScAddr(["ui_menu_view_full_semantic_neighborhood"],
                function (data) {
                    var cmd = data["ui_menu_view_full_semantic_neighborhood"];
                    SCWeb.core.Server.doCommand(cmd,
                        [addr], function (result) {
                            if (result.question != undefined) {
                                SCWeb.ui.WindowManager.appendHistoryItem(result.question);
                            }
                        });
                });
        });
    },

    putModel: function (model) {
        SCWeb.ui.Locker.show();
        //var cleanup = this.wipeOld;
        var pushPts = this.pushPoints;
        var pushSh = this.pushShapes;
        var self = this;
        var dfd = this.getKeyNodes();
        //dfd.done(function (resArray) {
        //    return cleanup.call(self);
        //});
        dfd.done(function () {
            return pushPts.call(self, model.points).done(
                function () {
// foreach points add point-defined nodes and arcs
                    for (var i = 0; i < model.points.length; i++) {
                        var el = model.points[i];
                        if (el.hasOwnProperty("sc_addr")) {
                            document.getElementById(
                                model.paintPanel._getJxgObjectById(el
                                    .getId()).rendNode.id)
                                .setAttribute('sc_addr', el.sc_addr);
                            document.getElementById(
                                model.paintPanel._getJxgObjectById(el
                                    .getId()).rendNode.id)
                                .setAttribute('class', 'sc-no-default-cmd ui-no-tooltip');

                        }
                    }
                });
        });
        dfd.done(function () {
            return pushSh.call(self, model.shapes).done(
                function () {
// foreach shapes add shape-defined nodes and arcs
                    for (var i = 0; i < model.shapes.length; i++) {
                        var el = model.shapes[i];
                        if (el.hasOwnProperty("sc_addr")) {
                            document.getElementById(
                                model.paintPanel._getJxgObjectById(el
                                    .getId()).rendNode.id)
                                .setAttribute('sc_addr', el.sc_addr);
                            document.getElementById(
                                model.paintPanel._getJxgObjectById(el
                                    .getId()).rendNode.id)
                                .setAttribute('class', 'sc-no-default-cmd ui-no-tooltip');
                        }
                    }
                    SCWeb.ui.Locker.hide();
                });
        });
    }
};



/* --- src/editor/component/drawings-contextMenu.js --- */
Drawings.ContextMenu = function (selector, event) {
    this.selector = selector;
    this.event = event;
    this.id = Drawings.Utils.randomUUID();
};

Drawings.ContextMenu.prototype = {

    show: function (items) {
        var menu = this._buildMenu(items);
        $('body').append(menu);

        var contextMenu = this;
        $(document).on('click', 'html', function () {
            contextMenu.hide();
        });

        var autoH = menu.height() + 12;

        if ((this.event.pageY + autoH) > $('html').height()) {
            menu.css({
                top: this.event.pageY - 20 - autoH,
                left: this.event.pageX - 13
            }).show();
        }
        else {
            menu.css({
                top: this.event.pageY + 10,
                left: this.event.pageX - 13
            }).show();
        }
    },

    hide: function () {
        $('#' + this.id).remove();
    },

    _buildMenu: function (items) {
        var menu = $('<ul class="contextMenu" id="' + this.id + '"></ul>');

        for (var i = 0; i < items.length; i++) {
            var menuItem = this._buildMenuItem(items[i]);
            menu.append(menuItem);
        }

        return menu;
    },

    _buildMenuItem: function (item) {
        var menuItem = $('<li><a tabindex="-1" href="#">' + item.text + '</a></li>');

        var actionId = Drawings.Utils.randomUUID();

        menuItem.find('a').attr('id', actionId);
        $(document).on('click', '#' + actionId, item.action);

        return menuItem;
    }
};

/* --- src/editor/drawings-controller.js --- */
/**
 * Controller.
 */

Drawings.Controller = function (paintPanel, model) {
    this.paintPanel = paintPanel;
    model.paintPanel = paintPanel;
    this.model = model;

    this.pointController = new Drawings.PointController(this.model);
    this.segmentController = new Drawings.SegmentController(this.model);
    this.triangleController = new Drawings.TriangleController(this.model);
    this.circleController = new Drawings.CircleController(this.model);
    this.lineController = new Drawings.LineController(this.model);
};

Drawings.Controller.prototype = {

    drawingMode: Drawings.DrawingMode.POINT,

    points: [],

    mouseDownEvent: {},

    setDrawingMode: function (drawingMode) {
        this.drawingMode = drawingMode;
        this.points.length = 0;
    },

    handleEvent: function (event) {
        var LEFT_MOUSE_BUTTON = 1;
        var RIGHT_MOUSE_BUTTON = 3;

        if (event.type == 'mousedown' && event.which == LEFT_MOUSE_BUTTON) {
            this._handleLeftMouseDownEvent(event);
        }
        else if (event.type == 'mouseup' && event.which == LEFT_MOUSE_BUTTON) {
            this._handleLeftMouseUpEvent(event);
        }
        else if (event.type == 'mousedown' && event.which == RIGHT_MOUSE_BUTTON) {
            this._handleRightMouseDownEvent(event);
        }
    },

    _handleLeftMouseDownEvent: function (event) {
        this.mouseDownEvent = event;
    },

    _handleLeftMouseUpEvent: function (event) {
        var distance = this._getDistanceBetweenEvents(this.mouseDownEvent, event);
        if (distance < 0.25) {
            this._handleLeftMouseClickEvent(event);
        }
    },

    _handleLeftMouseClickEvent: function (event) {
        var point = this._getOrCreatePoint(event);
        if (point) {
            this._addPoint(point);
        }
    },

    _getOrCreatePoint: function (event) {
        var point;
        var jxgObject = this.paintPanel.getJxgObjects(event);
        var jxgPoint = this.paintPanel.getJxgPoint(event);

        if (jxgPoint) {
            point = this.model.getPoint(jxgPoint.id);
        }
        else {
            if(jxgObject.length >=1) {
                point = null
            }
            else {
                var coordinates = this.paintPanel.getMouseCoordinates(event);
                point = this._createPoint(coordinates);
            }
        }

        return point;
    },


    _handleContextMenuSolverEvent: function (event) {

        var controller = this;

        var contextMenu = new Drawings.ContextMenu('#' + 'solver', event);

        var setSolvePerimeterMenuItem = {
            text: 'Вычислить периметр',
            action: function () {
                controller._solvePerimeter();
            }
        };
        var setSolveSquareMenuItem = {
            text: 'Вычислить площадь',
            action: function () {
                controller._solveSquare();
            }
        };
        contextMenu.show([setSolvePerimeterMenuItem, setSolveSquareMenuItem]);
    },

    _solvePerimeter: function(){
        Drawings.ScTranslator.calcTrianglePerimeter(this.model);
    },

    _solveSquare: function(){
        Drawings.ScTranslator.calcTriangleSquare(this.model);
    },


    _createPoint: function (coordinates) {
        var point = new Drawings.Point(coordinates[0], coordinates[1]);
        this.model.addPoint(point);
        return point;
    },

    _addPoint: function (point) {
        this.points.push(point);

        if (this.drawingMode == Drawings.DrawingMode.POINT) {
            this.points.length = 0;
        }
        else if (this.drawingMode == Drawings.DrawingMode.LINE) {
            this._createLineIfPossible();
        }
        else if (this.drawingMode == Drawings.DrawingMode.SEGMENT) {
            this._createSegmentIfPossible();
        }
        else if (this.drawingMode == Drawings.DrawingMode.TRIANGLE) {
            this._createTriangleIfPossible();
        }
        else if (this.drawingMode == Drawings.DrawingMode.CIRCLE) {
            this._createCircleIfPossible();
        }
    },

    _createLineIfPossible: function () {
        if (this.points.length == 2) {
            var line = new Drawings.Line(this.points[0], this.points[1]);
            line.setName(Drawings.Utils.generateLineName(line));

            this.model.addShape(line);

            this.points.length = 0;
        }
    },

    _createSegmentIfPossible: function () {
        if (this.points.length == 2) {
            var segment = new Drawings.Segment(this.points[0], this.points[1]);
            segment.setName(Drawings.Utils.generateSegmentName(segment));

            this.model.addShape(segment);

            this.points.length = 0;
        }
        return segment;
    },

    _createCircleIfPossible: function () {
        if (this.points.length == 2) {
            var circle = new Drawings.Circle(this.points[0], this.points[1]);
            circle.setName(Drawings.Utils.generateCircleName(circle));
            //var radius = new Drawings.Segment(this.points[0], this.points[1]);
            //radius.setName(Drawings.Utils.generateSegmentName(radius));
            circle.setCenter(this.points[0])
            //circle.setRadius(radius);
            this.model.addShape(circle);
            //this.model.addShape(radius);
            this.points.length = 0;
        }
    },



    _getOrCreateSegment: function (point1, point2) {

        var segmentIsExist = false;
        var possibleSegmentIndex;
        for (var i = 0; i < this.model.getShapes().length; i++) {
            if (this.model.getShapes()[i].className == "Segment") {
                if (this.model.getShapes()[i].point1() == point1 && this.model.getShapes()[i].point2() == point2) {
                    segmentIsExist = true;
                    possibleSegmentIndex = i;
                }
            }
            }
            if (segmentIsExist) {
                return this.model.getShapes()[possibleSegmentIndex];
            }
            else {
                var segment = new Drawings.Segment(point1, point2);
                segment.setName(Drawings.Utils.generateSegmentName(segment));

                this.model.addShape(segment);
                return segment;
            }

    },

    _createTriangleIfPossible: function () {
        if (this.points.length == 3) {
            var triangle = new Drawings.Triangle(this.points[0], this.points[1], this.points[2]);
            triangle.setName(Drawings.Utils.generateTriangleName(triangle));

            var segment1 = this._getOrCreateSegment(this.points[0], this.points[1]);
            var segment2 = this._getOrCreateSegment(this.points[1], this.points[2]);
            var segment3 = this._getOrCreateSegment(this.points[2], this.points[0]);

            triangle.segment1 = segment1;
            triangle.segment2 = segment2;
            triangle.segment3 = segment3;

            this.model.addShape(triangle);

            this.points.length = 0;
        }
    },

    _handleRightMouseDownEvent: function (event) {
        var jxgObjects = this.paintPanel.getJxgObjects(event);
        var objects = Drawings.Utils.toModelObjects(this.model, jxgObjects);

        var points = Drawings.Utils.selectPoints(objects);
        var segments = Drawings.Utils.selectSegments(objects);
        var triangles = Drawings.Utils.selectTriangles(objects);
        var circles = Drawings.Utils.selectCircles(objects);

        if (points.length > 0) {
            var jxgPoint = Drawings.Utils.getJxgObjectById(this.paintPanel.getBoard(), points[0].getId());
            this.pointController.handleContextMenuEvent(jxgPoint, event);
        }
        else if (segments.length > 0) {
            var jxgSegment = Drawings.Utils.getJxgObjectById(this.paintPanel.getBoard(), segments[0].getId());
            this.segmentController.handleContextMenuEvent(jxgSegment, event);
        }
        else if (triangles.length > 0) {
            var jxgTriangle = Drawings.Utils.getJxgObjectById(this.paintPanel.getBoard(), triangles[0].getId());
            this.triangleController.handleContextMenuEvent(jxgTriangle, event);
        }
        else if (circles.length > 0) {
            var jxgCircle = Drawings.Utils.getJxgObjectById(this.paintPanel.getBoard(), circles[0].getId());
            this.circleController.handleContextMenuEvent(jxgCircle, event);
        }
    },

    _getDistanceBetweenEvents: function (event1, event2) {
        var event1Coordinates = this.paintPanel.getMouseCoordinates(event1);
        var x1 = event1Coordinates[0];
        var y1 = event1Coordinates[1];

        var event2Coordinates = this.paintPanel.getMouseCoordinates(event2);
        var x2 = event2Coordinates[0];
        var y2 = event2Coordinates[1];

        return Math.sqrt((x1 - x2) ^ 2 + (y1 - y2) ^ 2);
    }
};

/* --- src/editor/drawings-paintPanel.js --- */
/**
 * Paint panel.
 */

Drawings.PaintPanel = function (containerId, model) {
    this.containerId = containerId;

    this.model = model;

    this.controller = null;

    this.board = null;

    this.rendererMap = {};
};

Drawings.PaintPanel.prototype = {

    init: function () {
        this._initMarkup(this.containerId);

        this.board = this._createBoard();

        this._configureModel();

        this.controller = new Drawings.Controller(this, this.model);

        this.rendererMap["Point"] = new Drawings.PointRenderer(this.board);
        this.rendererMap["Line"] = new Drawings.LineRenderer(this.board);
        this.rendererMap["Segment"] = new Drawings.SegmentRenderer(this.board);
        this.rendererMap["Triangle"] = new Drawings.TriangleRenderer(this.board);
        this.rendererMap["Circle"] = new Drawings.CircleRenderer(this.board);
    },

    getBoard: function () {
        return this.board;
    },

    getJxgObjects: function (event) {
        return this.board.getAllObjectsUnderMouse(event);
    },

    getJxgPoint: function (event) {
        var jxgObjects = this.getJxgObjects(event);

        var jxgPoints = jxgObjects.filter(function (jxgObject) {
            return jxgObject instanceof JXG.Point;
        });

        return jxgPoints.length > 0 ? jxgPoints[0] : null;
    },

    getMouseCoordinates: function (event) {
        var coordinates = this.board.getUsrCoordsOfMouse(event);
        return [coordinates[0], coordinates[1]];
    },

    _initMarkup: function (containerId) {
        var container = $('#' + containerId);
        var paintPanel = this;

        // root element
        container.append('<div id="geometryEditor" class="geometryEditor"></div>');
        var editor = $('#geometryEditor');

        editor.append('<textarea id="textArea" rows="3"/>');
            // initialize toolbar markup
        editor.append('<div id="toolbar" class="toolbar"></div>');

        var toolbar = $('#toolbar');
        toolbar.append('<div id="pointButton" class="button point" title="Точка"></div>');
        toolbar.append('<div id="lineButton" class="button line" title="Прямая"></div>');
        toolbar.append('<div id="segmentButton" class="button segment" title="Отрезок"></div>');
        toolbar.append('<div id="triangleButton" class="button triangle" title="Треугольник"></div>');
        toolbar.append('<div id="circleButton" class="button circle" title="Окружность"></div>');
        toolbar.append('<div id="clearButton" class="button clear" title="Очистить"></div>');
        toolbar.append('<div id="saveToFile" class="button save" title="Сохранить"></div>');

        toolbar.append('<div id="load" class="button load" title="Загрузить"></div>');
        toolbar.append('<input id="fileInput" type="file">');
        toolbar.append('<div id="translateButton" class="button translate" title="Синхронизация"></div>');
        toolbar.append('<div id="viewButton" class="button view" title="Просмотр"></div>');
        toolbar.append('<div id="solveButton" class="button solve" title="Вычислить"></div>');

        $("#pointButton").bind("contextmenu", function(e) {
            e.preventDefault();
        });

        $('#pointButton').mousedown(function(event) {
                switch (event.which) {
                    case 1:
                        paintPanel.controller.setDrawingMode(Drawings.DrawingMode.POINT);
                        break;
                    case 3:
                        paintPanel.controller.pointController.handleContextDefinitionMenuEvent(event);
                        break;
                    default:
                        alert('You have a strange Mouse!');
                }
            }
        );

        $("#solveButton").bind("contextmenu", function(e) {
            e.preventDefault();
        });

        $('#solveButton').mousedown(function(event) {
                switch (event.which) {
                    case 1:
                        break;
                    case 3:
                        paintPanel.controller._handleContextMenuSolverEvent(event);
                        break;
                    default:
                        alert('You have a strange Mouse!');
                }
            }
        );



        $('#lineButton').mousedown(function(event) {
                switch (event.which) {
                    case 1:
                        paintPanel.controller.setDrawingMode(Drawings.DrawingMode.LINE);
                        break;
                    case 3:
                        paintPanel.controller.lineController.handleContextDefinitionMenuEvent(event);
                        break;
                    default:
                        alert('You have a strange Mouse!');
                }
            }
        );
        $("#lineButton").bind("contextmenu", function(e) {
            e.preventDefault();
        });

        $('#segmentButton').mousedown(function(event) {
                switch (event.which) {
                    case 1:
                        paintPanel.controller.setDrawingMode(Drawings.DrawingMode.SEGMENT);
                        break;
                    case 3:
                        paintPanel.controller.segmentController.handleContextDefinitionMenuEvent(event);
                        break;
                    default:
                        alert('You have a strange Mouse!');
                }
            }
        );
        $("#segmentButton").bind("contextmenu", function(e) {
            e.preventDefault();
        });

        $('#triangleButton').mousedown(function(event) {
                switch (event.which) {
                    case 1:
                        paintPanel.controller.setDrawingMode(Drawings.DrawingMode.TRIANGLE);
                        break;
                    case 3:
                        paintPanel.controller.triangleController.handleContextDefinitionMenuEvent(event);
                        break;
                    default:
                        alert('You have a strange Mouse!');
                }
            }
        );
        $("#triangleButton").bind("contextmenu", function(e) {
            e.preventDefault();
        });

        $('#circleButton').mousedown(function(event) {
                switch (event.which) {
                    case 1:
                        paintPanel.controller.setDrawingMode(Drawings.DrawingMode.CIRCLE);
                        break;
                    case 3:
                        paintPanel.controller.circleController.handleContextDefinitionMenuEvent(event);
                        break;
                    default:
                        alert('You have a strange Mouse!');
                }
            }
        );

        $("#circleButton").bind("contextmenu", function(e) {
            e.preventDefault();
        });

        $('#clearButton').click(function () {
            paintPanel.model.clear();
        });

        $('#saveToFile').click(function () {
            paintPanel._saveToFile();
        });

        $('#load').click(function () {
            $("#fileInput").click();
        });

        $('#fileInput').change(function () {
            paintPanel._loadFromFile();
        });

        $('#translateButton').click(function () {
            paintPanel._translate();
        });

        $('#viewButton').click(function () {
            paintPanel._viewBasedKeyNode();
        });

        // initialize board
        editor.append('<div id="board" class="board jxgbox"></div>');
    },

    _saveToFile: function () {
        var json = Drawings.JsonTranslator.toJson(this.model);
        this._download("model.js", json);
    },

    _download: function (filename, content) {
        var downloadLink = document.createElement('a');
        downloadLink.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(content));
        downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    },

    _loadFromFile: function () {
        var file = $('#fileInput')[0].files[0];
        var reader = new FileReader();

        var paintPanel = this;
        reader.onload = function () {
            var result = Drawings.JsonTranslator.fromJson(reader.result);

            paintPanel.model.clear();

            paintPanel.model.addPoints(result.points);
            paintPanel.model.addShapes(result.shapes);
        };

        if (file) {
            reader.readAsText(file);
        }
    },

    _translate: function () {
        Drawings.ScTranslator.putModel(this.model);
        // Redraw all (only translated ?) shapes after translation
        //this._redraw(this.model.getModelObjects());
    },

    _viewBasedKeyNode: function () {
        Drawings.ScTranslator.viewBasedKeyNode();
    },

    _createBoard: function () {
        var properties = {
            boundingbox: [-20, 20, 20, -20],
            showCopyright: false,
            grid: true,
            unitX: 20,
            unitY: 20
        };

        var board = JXG.JSXGraph.initBoard('board', properties);

        var paintPanel = this;

        board.on('mousedown', function (event) {
            paintPanel.controller.handleEvent(event);
        });

        board.on('mouseup', function (event) {
            paintPanel.controller.handleEvent(event);
        });

        return board;
    },

    _configureModel: function () {
        var paintPanel = this;

        paintPanel._drawModel(paintPanel.model);

        paintPanel.model.onUpdate(function (objectsToRemove, objectsToAdd, objectsToUpdate) {
            paintPanel._erase(objectsToRemove);
            paintPanel._draw(objectsToAdd);
            paintPanel._update(objectsToUpdate);
        });
    },

    _drawModel: function (model) {
        var objectsToDraw = [];
        objectsToDraw = objectsToDraw.concat(model.getPoints());
        objectsToDraw = objectsToDraw.concat(model.getShapes());
        this._draw(objectsToDraw);
    },

    _draw: function (modelObjects) {
        for (var i = 0; i < modelObjects.length; i++) {
            var renderer = this.rendererMap[modelObjects[i].className];
            renderer.render(modelObjects[i]);
        }
    },

    _erase: function (modelObjects) {
        for (var i = 0; i < modelObjects.length; i++) {
            var renderer = this.rendererMap[modelObjects[i].className];
            renderer.erase(modelObjects[i]);
        }
    },

    _redraw: function (modelObjects) {
        this._erase(modelObjects);
        this._draw(modelObjects);
    },

    _update: function (modelObjects) {
        var points = Drawings.Utils.selectPoints(modelObjects);
        var shapes = Drawings.Utils.selectShapes(modelObjects);

        this._updatePoints(points);
        this._updateShapes(shapes);
    },

    _updatePoints: function (points) {
        for (var i = 0; i < points.length; i++) {
            var point = points[i];

            var connectedShapes = this._getConnectedShapes(point);

            this._erase(connectedShapes);
            this._redraw([point]);
            this._draw(connectedShapes);
        }
    },

    _getConnectedShapes: function (point) {
        var shapes = this.model.getShapes();
        var connectedShapes = [];

        for (var i = 0; i < shapes.length; i++) {
            var pointIndex = shapes[i].getPoints().indexOf(point);

            if (pointIndex >= 0) {
                connectedShapes.push(shapes[i]);
            }
        }

        return connectedShapes;
    },

    _updateShapes: function (shapes) {
        this._redraw(shapes);
    },

    _getJxgObjectById: function (id) {
        console.log('This function is deprecated. Use instead: Drawings.Utils.getJxgObjectById(board, id).');

        return this.board.select(function (jxgObject) {
            return jxgObject.id == id;
        }).objectsList[0];
    }
};

/* --- src/editor/renderer/drawings-pointRenderer.js --- */
/**
 * Point renderer.
 */

Drawings.PointRenderer = function (board) {
    this.board = board;
};

Drawings.PointRenderer.prototype = {

    render: function (point) {
        this._drawPoint(point);
    },

    erase: function(point) {
        var jxgPoint = Drawings.Utils.getJxgObjectById(this.board, point.getId());

        this._erasePointName(jxgPoint);
        this._erasePoint(jxgPoint);
    },

    _drawPoint: function (point) {
        var strokeColor = Drawings.Utils.getStrokeColor(point);
        var fillColor = Drawings.Utils.getFillColor(point);

        var properties = {
            id: point.getId(),
            name: point.getName(),
            showInfobox: false,
            strokeColor: strokeColor,
            fillColor: fillColor
        };

        var jxgPoint = this.board.create('point', [point.getX(), point.getY()], properties);

        jxgPoint.coords.on('update', function () {
            point.setXY(this.X(), this.Y());
        }, jxgPoint);
    },

    _erasePointName: function(jxgPoint) {
        if (jxgPoint.textLabel) {
            this.board.removeObject(jxgPoint.textLabel);
        }
    },

    _erasePoint: function(jxgPoint) {
        this.board.removeObject(jxgPoint);
    }
};

/* --- src/editor/renderer/drawings-lineRenderer.js --- */
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

/* --- src/editor/renderer/drawings-segmentRenderer.js --- */
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

/* --- src/editor/renderer/drawings-triangleRenderer.js --- */
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

/* --- src/editor/renderer/drawings-circleRenderer.js --- */
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

/* --- src/editor/controller/drawings-pointController.js --- */
/**
 * Point controller.
 */

Drawings.PointController = function (model) {
    this.model = model;
};

Drawings.PointController.prototype = {

    handleContextMenuEvent: function (jxgPoint, event) {
        var point = this.model.getPoint(jxgPoint.id);

        var controller = this;

        var contextMenu = new Drawings.ContextMenu('#' + jxgPoint.rendNode.id, event);


        var setNameMenuItem = {
            text: 'Задать имя точки',
            action: function () {
                controller._setNameAction(point);
            }
        };

        contextMenu.show([setNameMenuItem]);
    },

    handleContextDefinitionMenuEvent: function (event){

        var contextDefinitionMenu = new Drawings.ContextMenu('#' + 'pointDefinition', event);
        var setDefinitionMenuItem = {
            text: 'Просмотр определения',
            action: function(){
                var addr;
                var attr;
                SCWeb.core.Server.resolveScAddr(['rrel_finding_definition'], function (keynodes) {
                    attr = keynodes['rrel_finding_definition'];
                });
                SCWeb.core.Server.resolveScAddr(['concept_geometric_point'], function (keynodes) {
                    addr = keynodes['concept_geometric_point'];
                    SCWeb.core.Server.resolveScAddr(["ui_menu_file_for_finding_definitions"],
                        function (data) {
                            var cmd = data["ui_menu_file_for_finding_definitions"];
                            SCWeb.core.Server.doCommand(cmd,
                                [addr], function (result) {
                                    if (result.question != undefined) {
                                        var date = new Date();
                                        var curDate = null;
                                        do {curDate = new Date();}
                                        while (curDate-date < 3000);
                                        window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F, [
                                            addr,
                                            sc_type_arc_pos_const_perm,
                                            sc_type_link,
                                            sc_type_arc_pos_const_perm,
                                            attr]).
                                            done(function(linkNode){
                                                window.sctpClient.get_link_content(linkNode[0][2],'string').done(function(content)
                                                {
                                                    $('#textArea').val(content);
                                                });
                                            }).fail(function(r){
                                                console.log("fail");
                                            });
                                    }
                                });
                        });
                });
            }
        }
        contextDefinitionMenu.show([setDefinitionMenuItem]);
    },

    _setNameAction: function (point) {
        var name = prompt('Введите имя точки:');

        if (name != null) {
            point.setName(name);
            this.model.updated([point]);
        }
    }
};

/* --- src/editor/controller/drawings-segmentController.js --- */
/**
 * Segment controller.
 */

Drawings.SegmentController = function (model) {
    this.model = model;
};

Drawings.SegmentController.prototype = {

    handleContextMenuEvent: function (jxgSegment, event) {
        var segment = this.model.getShape(jxgSegment.id);

        var controller = this;

        var contextMenu = new Drawings.ContextMenu('#' + jxgSegment.rendNode.id, event);

        var setLengthMenuItem = {
            text: 'Задать длину',
            action: function () {
                controller._setLengthAction(segment);
            }
        };

        contextMenu.show([setLengthMenuItem]);
    },

    handleContextDefinitionMenuEvent: function (event){

        var contextDefinitionMenu = new Drawings.ContextMenu('#' + 'segmentDefinition', event);
        var setDefinitionMenuItem = {
            text: 'Просмотр определения',
            action: function(){
                var addr;
                var attr;
                SCWeb.core.Server.resolveScAddr(['rrel_finding_definition'], function (keynodes) {
                    attr = keynodes['rrel_finding_definition'];
                });
                SCWeb.core.Server.resolveScAddr(['concept_segment'], function (keynodes) {
                    addr = keynodes['concept_segment'];
                    SCWeb.core.Server.resolveScAddr(["ui_menu_file_for_finding_definitions"],
                        function (data) {
                            var cmd = data["ui_menu_file_for_finding_definitions"];
                            SCWeb.core.Server.doCommand(cmd,
                                [addr], function (result) {
                                    if (result.question != undefined) {
                                        var date = new Date();
                                        var curDate = null;
                                        do {curDate = new Date();}
                                        while (curDate-date < 3000);
                                        window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F, [
                                            addr,
                                            sc_type_arc_pos_const_perm,
                                            sc_type_link,
                                            sc_type_arc_pos_const_perm,
                                            attr]).
                                            done(function(linkNode){
                                                window.sctpClient.get_link_content(linkNode[0][2],'string').done(function(content)
                                                {
                                                    $('#textArea').val(content);
                                                });
                                            });
                                    }
                                });
                        });
                });
            }
        }
        contextDefinitionMenu.show([setDefinitionMenuItem]);
    },

    _setLengthAction: function (segment) {
        var length = prompt('Введите длину отрезка:');

        if (length != null) {
            segment.setLength(length);
            this.model.updated([segment]);
        }
    }
};

/* --- src/editor/controller/drawings-triangleController.js --- */
/**
 * Triangle controller.
 */

Drawings.TriangleController = function (model) {
    this.model = model;
};

Drawings.TriangleController.prototype = {

    handleContextMenuEvent: function (jxgTriangle, event) {
        var triangle = this.model.getShape(jxgTriangle.id);

        var controller = this;

        var contextMenu = new Drawings.ContextMenu('#' + jxgTriangle.rendNode.id, event);

        var setNameMenuItem = {
            text: 'Задать имя',
            action: function () {
                controller._setNameAction(triangle);
            }
        };

        var setSquareMenuItem = {
            text: 'Задать площадь',
            action: function () {
                controller._setSquareAction(triangle);
            }
        };

        var setPerimeterMenuItem = {
            text: 'Задать периметр',
            action: function () {
                controller._setPerimeterAction(triangle);
            }
        };

        contextMenu.show([setNameMenuItem, setSquareMenuItem, setPerimeterMenuItem]);
    },

    handleContextDefinitionMenuEvent: function (event){

        var contextDefinitionMenu = new Drawings.ContextMenu('#' + 'triangleDefinition', event);
        var setDefinitionMenuItem = {
            text: 'Просмотр определения',
            action: function(){
                var addr;
                var attr;
                SCWeb.core.Server.resolveScAddr(['rrel_finding_definition'], function (keynodes) {
                    attr = keynodes['rrel_finding_definition'];
                });
                SCWeb.core.Server.resolveScAddr(['concept_triangle'], function (keynodes) {
                    addr = keynodes['concept_triangle'];
                    SCWeb.core.Server.resolveScAddr(["ui_menu_file_for_finding_definitions"],
                        function (data) {
                            var cmd = data["ui_menu_file_for_finding_definitions"];
                            SCWeb.core.Server.doCommand(cmd,
                                [addr], function (result) {
                                    if (result.question != undefined) {
                                        var date = new Date();
                                        var curDate = null;
                                        do {curDate = new Date();}
                                        while (curDate-date < 3000);
                                        window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F, [
                                            addr,
                                            sc_type_arc_pos_const_perm,
                                            sc_type_link,
                                            sc_type_arc_pos_const_perm,
                                            attr]).
                                            done(function(linkNode){
                                                window.sctpClient.get_link_content(linkNode[0][2],'string').done(function(content)
                                                {
                                                    $('#textArea').val(content);
                                                });
                                            });
                                    }
                                });
                        });
                });
            }

        }
        contextDefinitionMenu.show([setDefinitionMenuItem]);
    },

    _setNameAction: function (triangle) {
        var name = prompt('Введите имя треугольника:');

        if (name != null) {
            triangle.setName(name);
            this.model.updated([triangle]);
        }
    },

    _setPerimeterAction: function (triangle) {
        var perimeter = prompt('Введите периметр треугольника:');

        if (perimeter != null) {
            triangle.setPerimeter(perimeter);
            this.model.updated([triangle]);
        }
    },

    _setSquareAction: function (triangle) {
        var square = prompt('Введите площадь треугольника:');

        if (square != null) {
            triangle.setSquare(square);
            this.model.updated([triangle]);
        }
    }
};

/* --- src/editor/controller/drawings-circleController.js --- */
Drawings.CircleController = function(model) {
    this.model = model;
};

Drawings.CircleController.prototype = {

    handleContextMenuEvent: function (jxgCircle, event) {
        var circle = this.model.getShape(jxgCircle.id);

        var controller = this;

        var contextMenu = new Drawings.ContextMenu('#' + jxgCircle.rendNode.id, event);

        var setRadiusMenuItem = {
            text: 'Задать радиус',
            action: function () {
                controller._setRadiusAction(circle);
            }
        };
        var setLengthMenuItem = {
            text: 'Задать длину окружости',
            action: function () {
                controller._setLengthAction(circle);
            }
        };
        contextMenu.show([setRadiusMenuItem, setLengthMenuItem]);
    },

    handleContextDefinitionMenuEvent: function (event){

        var contextDefinitionMenu = new Drawings.ContextMenu('#' + 'circleDefinition', event);
        var setDefinitionMenuItem = {
            text: 'Просмотр определения',
            action: function(){
                var addr;
                var attr;
                SCWeb.core.Server.resolveScAddr(['rrel_finding_definition'], function (keynodes) {
                    attr = keynodes['rrel_finding_definition'];
                });
                SCWeb.core.Server.resolveScAddr(['concept_circle'], function (keynodes) {
                    addr = keynodes['concept_circle'];
                    SCWeb.core.Server.resolveScAddr(["ui_menu_file_for_finding_definitions"],
                        function (data) {
                            var cmd = data["ui_menu_file_for_finding_definitions"];
                            SCWeb.core.Server.doCommand(cmd,
                                [addr], function (result) {
                                    if (result.question != undefined) {
                                        var date = new Date();
                                        var curDate = null;
                                        do {curDate = new Date();}
                                        while (curDate-date < 3000);
                                        window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F, [
                                            addr,
                                            sc_type_arc_pos_const_perm,
                                            sc_type_link,
                                            sc_type_arc_pos_const_perm,
                                            attr]).
                                            done(function(linkNode){
                                                window.sctpClient.get_link_content(linkNode[0][2],'string').done(function(content)
                                                {
                                                    $('#textArea').val(content);
                                                });
                                            });
                                    }
                                });
                        });
                });
            }
        }
        contextDefinitionMenu.show([setDefinitionMenuItem]);
    },

    _setRadiusAction: function (circle) {
        var radiusLength = prompt('Введите длину радиуса');

        if (radiusLength != null) {
            circle.setRadius(radiusLength);
            this.model.updated([circle]);
        }
    },
    _setLengthAction: function (circle) {
        var length = prompt('Введите длину окружности:');
        if (length != null) {
            circle.setLength(length);
            this.model.updated([circle]);
        }
    }
}

/* --- src/editor/controller/drawings-lineController.js --- */
/**
 * Created by qosmio on 24.05.15.
 */
Drawings.LineController = function(model) {
    this.model = model;
};

Drawings.LineController.prototype = {

    handleContextDefinitionMenuEvent: function (event){

        var contextDefinitionMenu = new Drawings.ContextMenu('#' + 'lineDefinition', event);
        var setDefinitionMenuItem = {
            text: 'Просмотр определения',
            action: function(){
                var addr;
                var attr;
                SCWeb.core.Server.resolveScAddr(['rrel_finding_definition'], function (keynodes) {
                    attr = keynodes['rrel_finding_definition'];
                });
                SCWeb.core.Server.resolveScAddr(['concept_straight_line'], function (keynodes) {
                    addr = keynodes['concept_straight_line'];
                    SCWeb.core.Server.resolveScAddr(["ui_menu_file_for_finding_definitions"],
                        function (data) {
                            var cmd = data["ui_menu_file_for_finding_definitions"];
                            SCWeb.core.Server.doCommand(cmd,
                                [addr], function (result) {
                                    if (result.question != undefined) {
                                        var date = new Date();
                                        var curDate = null;
                                        do {curDate = new Date();}
                                        while (curDate-date < 3000);
                                        window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F, [
                                            addr,
                                            sc_type_arc_pos_const_perm,
                                            sc_type_link,
                                            sc_type_arc_pos_const_perm,
                                            attr]).
                                            done(function(linkNode){
                                                window.sctpClient.get_link_content(linkNode[0][2],'string').done(function(content)
                                                {
                                                    $('#textArea').val(content);
                                                });
                                             }).fail(function(r){console.log("fail")});
                                    }
                                });
                        });
                });
            }
        }
        contextDefinitionMenu.show([setDefinitionMenuItem]);
    }


}


/* --- src/drawings-component.js --- */
/**
 * Drawings component.
 */
Drawings.GeomDrawComponent = {
    ext_lang: 'geometry_code',
    formats: ['format_geometry_json'],
    struct_support: true,
    factory: function (sandbox) {
        return new Drawings.GeomDrawWindow(sandbox);
    }
};

Drawings.GeomDrawWindow = function (sandbox) {
    this.sandbox = sandbox;
    this.model = new Drawings.Model();
    this.paintPanel = new Drawings.PaintPanel(this.sandbox.container, this.model);
    this.paintPanel.init();
    this.recieveData = function (data) {
        console.log("in recieve data" + data);
    };

    var scElements = {};

    function drawAllPoints() {
        var points = [];
        var dfd = new jQuery.Deferred();
       // for (var addr in scElements) {
            jQuery.each(scElements, function(j, val){
                var obj = scElements[j];
                if (!obj || obj.translated) return;
// check if object is an arc
                if (obj.data.type & sc_type_arc_pos_const_perm) {
                    var begin = obj.data.begin;
                    var end = obj.data.end;
                    // if it connect point set and point, then create the last one
                    if (end && (begin == self.keynodes.point)) {
                        points.push(end);
                        obj.translated = true;
                    }
                }

        });
        if (points.length == 0){
            SCWeb.ui.Locker.hide();
            dfd.resolve();
            return dfd.promise();
        }
/*        var searchDef = searchDefinition(4292214785);
        var searchDef = searchDefinition(1633026049);
        searchDef.done(function(content){
            alert(content);
        });*/
        var dfd2 = drawPointsWithIdtf(points);
        dfd2.done(function (r) {
            //console.log("pointswithIdtf Translated");
            var res = drawAllSegments();
            res.done(function(r1){
               // console.log("segments Translated");
                var resOfLines = drawAllLines();
                resOfLines.done(function (res){
                  //  console.log("lines Translated");
                    var resOfCircles = drawAllCircles();
                    resOfCircles.done(function(res2){
                        var resOfTriangles = drawAllTriangles();
                        resOfTriangles.done(function(res3){
                            SCWeb.ui.Locker.hide();
                        });
                    });

                });

            });
        });
        dfd.resolve();
        return dfd.promise();
    }


    function drawAllTriangles(){

        var dfd = new jQuery.Deferred();
        jQuery.each(scElements, function(j, val){
            // console.log(val);
            var obj = scElements[j];
            if (!obj || obj.translated) return;
// check if object is an arc
            if (obj.data.type & sc_type_arc_pos_const_perm) {
                var begin = obj.data.begin;
                var end = obj.data.end;
                if (end && (begin == self.keynodes.triangle)) {
                    var point1;
                    var point2;
                    var point3;
                    var pointsAddrs = [];
                    window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F, [
                        end,
                        sc_type_arc_common | sc_type_const,
                        sc_type_node | sc_type_const,
                        sc_type_arc_pos_const_perm,
                        self.keynodes.vertex])
                        .done(function (res) {
                            window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_3F_A_A, [
                                self.keynodes.point,
                                sc_type_arc_pos_const_perm,
                                sc_type_node | sc_type_const])
                                .done(function (iteratingPoints) {
                                    for(i = 0; i < res.length; i++ ) {
                                        for(indexOfPoints = 0; indexOfPoints < iteratingPoints.length; indexOfPoints++){
                                            if(res[i][2] == iteratingPoints[indexOfPoints][2]){
                                                if (pointsAddrs.length < 3) {
                                                    pointsAddrs.push(res[i][2]);
                                                }
                                            }
                                        }
                                    }

                                    for (var index = 0; index < self.model.points.length; index++) {
                                        if (self.model.points[index].sc_addr == pointsAddrs[0]) {
                                            point1 = self.model.points[index];
                                        } else if (self.model.points[index].sc_addr == pointsAddrs[1]) {
                                            point2 = self.model.points[index];
                                        }else if (self.model.points[index].sc_addr == pointsAddrs[2]) {
                                            point3 = self.model.points[index];
                                        }
                                    }
                                    var triangle = new Drawings.Triangle(point1, point2, point3);
                                    triangle.sc_addr = end;
                                    self.model.addShape(triangle);
                                    //adding sc-addr
                                    document.getElementById(self.model.paintPanel._getJxgObjectById(triangle.getId()).rendNode.id).setAttribute('sc_addr', end);
                                    document.getElementById(self.model.paintPanel._getJxgObjectById(triangle.getId()).rendNode.id)
                                        .setAttribute("class", 'sc-no-default-cmd');
                                    var translateSquare = translateRelation(end, self.keynodes.area);
                                    translateSquare.done(function(resDfd) {
                                        //console.log("our content is " + resDfd);
                                        triangle.setSquare(resDfd);
                                        self.model.updated([triangle]);

                                    });
                                    var translateSquare = translateRelation(end, self.keynodes.perimeter);
                                    translateSquare.done(function(resDfd2) {
                                        //console.log("our content is " + resDfd);
                                        triangle.setPerimeter(resDfd2);
                                        self.model.updated([triangle]);
                                    });
                                    obj.translated = true;
                                    //dfd.resolve();
                                });
                        })
                        .fail( function(){

                            //console.log("at fail___", end);
                           // dfd.resolve();
                        });
                }
            }

        });
        dfd.resolve();
        return dfd.promise();

    }




    function drawAllCircles() {

        var dfd = new jQuery.Deferred();
        jQuery.each(scElements, function(j, val){
            // console.log(val);
            var obj = scElements[j];
            if (!obj || obj.translated) return;
// check if object is an arc
            if (obj.data.type & sc_type_arc_pos_const_perm) {
                var begin = obj.data.begin;
                var end = obj.data.end;
                if (end && (begin == self.keynodes.circle)) {
                    var point1;
                    var point2;
                    var pointsAddrs = [];
                    window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_3F_A_A, [
                        end,
                        sc_type_arc_pos_const_perm,
                        sc_type_node | sc_type_const])
                        .done(function (res) {

                            window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_3F_A_A, [
                                self.keynodes.point,
                                sc_type_arc_pos_const_perm,
                                sc_type_node | sc_type_const])
                                .done(function (iteratingPoints) {
                                    window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F, [
                                        end,
                                        sc_type_arc_common | sc_type_const,
                                        sc_type_node | sc_type_const,
                                        sc_type_arc_pos_const_perm,
                                        self.keynodes.centerOfCircle]).
                                        done(function(iteratingCenter) {
                                            pointsAddrs.push(iteratingCenter[0][2]);

                                            for (i = 0; i < res.length; i++) {
                                                for (indexOfPoints = 0; indexOfPoints < iteratingPoints.length; indexOfPoints++) {
                                                    if (res[i][2] == iteratingPoints[indexOfPoints][2]) {
                                                        if (pointsAddrs.length < 2) {
                                                            pointsAddrs.push(res[i][2]);
                                                        }
                                                    }
                                                }
                                            }
                                           // console.log("iteratingPOints " + iteratingPoints);
                                            for (var index = 0; index < self.model.points.length; index++) {
                                                if (self.model.points[index].sc_addr == pointsAddrs[0]) {
                                                    point1 = self.model.points[index];
                                                } else if (self.model.points[index].sc_addr == pointsAddrs[1]) {
                                                    point2 = self.model.points[index];
                                                }
                                            }
                                            var circle = new Drawings.Circle(point1, point2);
                                            circle.sc_addr = end;
                                            self.model.addShape(circle);
                                            //adding sc-addr
                                            document.getElementById(self.model.paintPanel._getJxgObjectById(circle.getId()).rendNode.id).setAttribute('sc_addr', end);
                                            document.getElementById(self.model.paintPanel._getJxgObjectById(circle.getId()).rendNode.id)
                                                .setAttribute('class', 'sc-no-default-cmd ui-no-tooltip');
                                            var translateLen = translateRelation(end, self.keynodes.length);
                                            translateLen.done(function(resDfd) {
                                                //console.log("our content is " + resDfd);
                                                circle.setLength(resDfd);
                                                self.model.updated([circle]);

                                            });
                                            window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F, [
                                                end,
                                                sc_type_arc_common | sc_type_const,
                                                sc_type_node | sc_type_const,
                                                sc_type_arc_pos_const_perm,
                                                self.keynodes.radiusOfCircle]).
                                                done(function(iteratingRadius){
                                                    var translateRadius = translateRelation(iteratingRadius[0][2], self.keynodes.length);
                                                    translateRadius.done(function(resOfTranslRadDfd){
                                                        circle.setRadius(resOfTranslRadDfd);
                                                        self.model.updated([circle]);
                                                        obj.translated = true;
                                                        //dfd.resolve();
                                                    });
                                                });

                                        });
                                });
                        })
                        .fail( function(){

                           // console.log("at fail___", end);

                        });
                }
            }
        });
        dfd.resolve();
        return dfd.promise();
    }


    function drawAllLines() {
       // console.log("at drawAllLines");
        var dfd = new jQuery.Deferred();
        jQuery.each(scElements, function(j, val){
           // console.log(val);
            var obj = scElements[j];
            if (!obj || obj.translated) return;
// check if object is an arc
            if (obj.data.type & sc_type_arc_pos_const_perm) {
                var begin = obj.data.begin;
                var end = obj.data.end;
                if (end && (begin == self.keynodes.line)) {
                    var point1;
                    var point2;
                    var pointsAddrs = [];
                    window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_3F_A_A, [
                        end, sc_type_arc_pos_const_perm,
                        sc_type_node | sc_type_const])
                        .done(function (res) {
                                window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_3F_A_A, [
                                        self.keynodes.point,
                                        sc_type_arc_pos_const_perm,
                                        sc_type_node | sc_type_const])
                                .done(function (iteratingPoints) {
                                        for(i = 0; i < res.length; i++ ) {
                                            for(indexOfPoints = 0; indexOfPoints < iteratingPoints.length; indexOfPoints++){
                                                if(res[i][2] == iteratingPoints[indexOfPoints][2]){
                                                    if (pointsAddrs.length < 2) {
                                                        pointsAddrs.push(res[i][2]);
                                                    }
                                                }
                                            }
                                        }

                                    for (var index = 0; index < self.model.points.length; index++) {
                                        if (self.model.points[index].sc_addr == pointsAddrs[0]) {
                                            point1 = self.model.points[index];
                                        } else if (self.model.points[index].sc_addr == pointsAddrs[1]) {
                                            point2 = self.model.points[index];
                                        }
                                    }
                                    var line = new Drawings.Line(point1, point2);
                                    line.sc_addr = end;
                                    self.model.addShape(line);
                                    //adding sc-addr
                                    document.getElementById(self.model.paintPanel._getJxgObjectById(line.getId()).rendNode.id).setAttribute('sc_addr', end);
                                        document.getElementById(self.model.paintPanel._getJxgObjectById(line.getId()).rendNode.id)
                                            .setAttribute('class', 'sc-no-default-cmd ui-no-tooltip');
                                        obj.translated = true;
                                        //dfd.resolve();
                                    });
                        })
                        .fail( function(){

                          //  console.log("at fail___", end);
                         //   dfd.resolve();
                        });
                }
            }
        });

        dfd.resolve();
        return dfd.promise();
    }



    function translateRelation(node, relation){

        var dfd = new jQuery.Deferred();
        window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F, [
            node,
            sc_type_arc_common | sc_type_const,
            sc_type_node | sc_type_const,
            sc_type_arc_pos_const_perm,
            relation]).
            done(function(relationNodes){
                window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5A_A_F_A_F, [
                    sc_type_node | sc_type_const,
                    sc_type_arc_common | sc_type_const,
                    relationNodes[0][2],
                    sc_type_arc_pos_const_perm,
                    self.keynodes.value]).
                    done(function(valueNodes){
                        window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_3F_A_A, [
                            valueNodes[0][0],
                            sc_type_arc_pos_const_perm,
                            sc_type_node | sc_type_const]).
                            done(function(sysValueNodes){
                               // console.log(sysValueNodes[0][2]);
                                window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F, [
                                    sysValueNodes[0][2],
                                    sc_type_arc_common | sc_type_const,
                                    sc_type_link,
                                    sc_type_arc_pos_const_perm,
                                    self.keynodes.identifier]).
                                    done(function(linkNodes){
                                        //console.log("yes");
                                        window.sctpClient.get_link_content(linkNodes[0][2],'string').done(function(content){
                                            //console.log('content '+ content);
                                            dfd.resolve(content);
                                        });
                                    }).
                                    fail(function(){
                                       // console.log("nooooo");
                                    })
                            });
                    });

            }).fail(function(fail){
                dfd.resolve();
            });
       // dfd.resolve();
        return dfd.promise();
    }


        function drawAllSegments() {
    //    console.log("at drawAllSegments");
        var dfd = new jQuery.Deferred();
            jQuery.each(scElements, function(j, val){
                // console.log(val);
                var obj = scElements[j];
            if (!obj || obj.translated) return;
// check if object is an arc
            if (obj.data.type & sc_type_arc_pos_const_perm) {
                var begin = obj.data.begin;
                var end = obj.data.end;
                if (end && (begin == self.keynodes.segment)) {
                    var point1;
                    var point2;
                   // console.log("THe first end is ", end);
                    window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F, [
                        end, sc_type_arc_common | sc_type_const,
                        sc_type_node | sc_type_const, sc_type_arc_pos_const_perm, self.keynodes.boundary]).
                        done(function (res) {
                            var point1_addr = res[0][2];
                            var point2_addr = res[1][2];
                            for (var index = 0; index < self.model.points.length; index++) {
                                if (self.model.points[index].sc_addr == point1_addr) {
                                    point1 = self.model.points[index];
                                } else if (self.model.points[index].sc_addr == point2_addr) {
                                    point2 = self.model.points[index];
                                }
                            }
                            //console.log("point1="+point1_addr);
                            //console.log("point2="+point2_addr);
                            var segment = new Drawings.Segment(point1, point2);
                            segment.sc_addr = end;
                            self.model.addShape(segment);
                            //adding sc-addr
                           // console.log("THe resvar is ", resvar);
                           // console.log("THe second end is ", end);
                            document.getElementById(self.model.paintPanel._getJxgObjectById(segment.getId()).rendNode.id).setAttribute('sc_addr', end);
                            document.getElementById(self.model.paintPanel._getJxgObjectById(segment.getId()).rendNode.id)
                                .setAttribute('class', 'sc-no-default-cmd ui-no-tooltip');
                            //dfd.resolve();
                            var translateLen = translateRelation(end, self.keynodes.length);
                            translateLen.done(function(resDfd){
                              //  console.log("our content is " + resDfd);
                                segment.setLength(resDfd);
                                self.model.updated([segment]);
                                obj.translated = true;
                            });
                        });
                }
            }
        });
        dfd.resolve();
        return dfd.promise();
    }


    function drawAllOtherShapes() {
        var dfd = new jQuery.Deferred();
        for (var addr in scElements) {
            var obj = scElements[addr];
            if (!obj || obj.translated) continue;
// check if object is an arc
            if (obj.data.type & sc_type_arc_pos_const_perm) {
                var begin = obj.data.begin;
                var end = obj.data.end;
                if (end && (begin == self.keynodes.line)) {
                    console.log("update draw line");
                    var point1 = new Drawings.Point((Math.random() - 0.5) * 15.0, (Math.random() - 0.5) * 15.0);
                    var point2 = new Drawings.Point((Math.random() - 0.5) * 15.0, (Math.random() - 0.5) * 15.0);
                    var line = new Drawings.Line(point1, point2);
                    self.model.addPoint(point1);
                    self.model.addPoint(point2);
                    self.model.addShape(line);
                    document.getElementById(self.model.paintPanel._getJxgObjectById(line.getId()).rendNode.id).setAttribute('sc_addr', end);
                    obj.translated = true;
                } else if (end && (begin == self.keynodes.triangle)) {
                    console.log("update draw triangle");
                    var point1 = new Drawings.Point((Math.random() - 0.5) * 15.0, (Math.random() - 0.5) * 15.0);
                    var point2 = new Drawings.Point((Math.random() - 0.5) * 15.0, (Math.random() - 0.5) * 15.0);
                    var point3 = new Drawings.Point((Math.random() - 0.5) * 15.0, (Math.random() - 0.5) * 15.0);
                    var triangle = new Drawings.Triangle(point1, point2, point3);
                    self.model.addPoint(point1);
                    self.model.addPoint(point2);
                    self.model.addPoint(point3);
                    self.model.addShape(triangle);
                    document.getElementById(self.model.paintPanel._getJxgObjectById(triangle.getId()).rendNode.id).setAttribute('sc_addr', end);
                    obj.translated = true;
                } else if (end && (begin == self.keynodes.circle)) {
                    console.log("update draw circle");
                    var point1 = new Drawings.Point((Math.random() - 0.5) * 10.0, (Math.random() - 0.5) * 10.0);
                    var point2 = new Drawings.Point((Math.random() - 0.5) * 10.0, (Math.random() - 0.5) * 10.0);
                    var circle = new Drawings.Circle(point1, point2);
                    self.model.addPoint(point1);
                    self.model.addPoint(point2);
                    self.model.addShape(circle);
                    document.getElementById(self.model.paintPanel._getJxgObjectById(circle.getId()).rendNode.id).setAttribute('sc_addr', end);
                    obj.translated = true;
                }
                dfd.resolve();
            }
        }
        return dfd.promise();
    }

    // points - array of points sc_addrs
    function drawPointsWithIdtf(points) {
        //console.log("points here" + points);
        var dfd = new jQuery.Deferred();
        for (var i = 0; i < points.length; i++) {
            ( function(index){
            var res1 = window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F, [
                points[i], sc_type_arc_common | sc_type_const,
                sc_type_link, sc_type_arc_pos_const_perm, self.keynodes.identifier]);
            res1.done(function (res) {
                window.sctpClient.get_link_content(res[0][2], 'string').done(function (idtf) {
                    var point = new Drawings.Point((Math.random() - 0.5) * 15.0, (Math.random() - 0.5) * 15.0);
                    point.name = idtf;
                    point.sc_addr = points[index];
                    self.model.addPoint(point);
                    //adding sc-addr
                    document.getElementById(self.model.paintPanel._getJxgObjectById(point.getId()).rendNode.id).setAttribute('sc_addr', points[index]);
                    document.getElementById(self.model.paintPanel._getJxgObjectById(point.getId()).rendNode.id)
                        .setAttribute('class', 'sc-no-default-cmd ui-no-tooltip');
                   // console.log("point with idtf");
                  //  console.log("index="+index);
                    if (index == points.length - 1){
                      //  console.log("resolved");
                        dfd.resolve();
                    }
                    //dfd.resolve();
                });
            });
            res1.fail(function () {
                var point = new Drawings.Point((Math.random() - 0.5) * 15.0, (Math.random() - 0.5) * 15.0);
                point.sc_addr = points[index];
                self.model.addPoint(point);
                //adding sc-addr
                document.getElementById(self.model.paintPanel._getJxgObjectById(point.getId()).rendNode.id).setAttribute('sc_addr', points[index]);
                document.getElementById(self.model.paintPanel._getJxgObjectById(point.getId()).rendNode.id)
                    .setAttribute('class', 'sc-no-default-cmd ui-no-tooltip');
                //console.log("point bez idtf");
                //console.log("index="+index);
                if (index == points.length - 1){
                    //console.log("resolved");
                    dfd.resolve();
                }
                //dfd.resolve();
            });})(i);

        }
       //dfd.resolve();
        return dfd.promise();
    }

// resolve keynodes
    var self = this;
    this.needUpdate = false;
    this.requestUpdate = function () {
        var updateVisual = function () {
// check if object is an arc
            var dfd1 = drawAllPoints();
            dfd1.done(function (r) {
                return;
                //  drawAllSegments();
            });


/// @todo: Don't update if there are no new elements
            window.clearTimeout(self.structTimeout);
            delete self.structTimeout;
            if (self.needUpdate)
                self.requestUpdate();
            return dfd1.promise();
        };
        self.needUpdate = true;
        if (!self.structTimeout) {
            self.needUpdate = false;
            SCWeb.ui.Locker.show();
            self.structTimeout = window.setTimeout(updateVisual, 1000);
        }
    }
    this.keynodes = new Object();
    SCWeb.core.Server.resolveScAddr(['concept_geometric_point',
    ], function (keynodes) {
        self.keynodes.point = keynodes['concept_geometric_point'];
        self.needUpdate = true;
        self.requestUpdate();
    });
    SCWeb.core.Server.resolveScAddr(['concept_segment',
    ], function (keynodes) {
        self.keynodes.segment = keynodes['concept_segment'];
        self.needUpdate = true;
        self.requestUpdate();
    });
    SCWeb.core.Server.resolveScAddr(['concept_straight_line',
    ], function (keynodes) {
        self.keynodes.line = keynodes['concept_straight_line'];
        self.needUpdate = true;
        self.requestUpdate();
    });
    SCWeb.core.Server.resolveScAddr(['concept_triangle',
    ], function (keynodes) {
        self.keynodes.triangle = keynodes['concept_triangle'];
        self.needUpdate = true;
        self.requestUpdate();
    });
    SCWeb.core.Server.resolveScAddr(['concept_circle',
    ], function (keynodes) {
        self.keynodes.circle = keynodes['concept_circle'];
        self.needUpdate = true;
        self.requestUpdate();
    });
    SCWeb.core.Server.resolveScAddr(['nrel_system_identifier',
    ], function (keynodes) {
        self.keynodes.identifier = keynodes['nrel_system_identifier'];
        self.needUpdate = true;
        self.requestUpdate();
    });
    SCWeb.core.Server.resolveScAddr(['nrel_boundary_point',
    ], function (keynodes) {
        self.keynodes.boundary = keynodes['nrel_boundary_point'];
        self.needUpdate = true;
        self.requestUpdate();
    });
    SCWeb.core.Server.resolveScAddr(['nrel_value',
    ], function (keynodes) {
        self.keynodes.value = keynodes['nrel_value'];
        self.needUpdate = true;
        self.requestUpdate();
    });
    SCWeb.core.Server.resolveScAddr(['nrel_length',
    ], function (keynodes) {
        self.keynodes.length = keynodes['nrel_length'];
        self.needUpdate = true;
        self.requestUpdate();
    });
    SCWeb.core.Server.resolveScAddr(['nrel_center_of_circle',
    ], function (keynodes) {
        self.keynodes.centerOfCircle = keynodes['nrel_center_of_circle'];
        self.needUpdate = true;
        self.requestUpdate();
    });
    SCWeb.core.Server.resolveScAddr(['nrel_radius',
    ], function (keynodes) {
        self.keynodes.radiusOfCircle = keynodes['nrel_radius'];
        self.needUpdate = true;
        self.requestUpdate();
    });
    SCWeb.core.Server.resolveScAddr(['nrel_vertex',
    ], function (keynodes) {
        self.keynodes.vertex = keynodes['nrel_vertex'];
        self.needUpdate = true;
        self.requestUpdate();
    });
    SCWeb.core.Server.resolveScAddr(['nrel_sc_text_translation',
    ], function (keynodes) {
        self.keynodes.text_translation = keynodes['nrel_sc_text_translation'];
        self.needUpdate = true;
        self.requestUpdate();
    });
    SCWeb.core.Server.resolveScAddr(['nrel_area',
    ], function (keynodes) {
        self.keynodes.area = keynodes['nrel_area'];
        self.needUpdate = true;
        self.requestUpdate();
    });
    SCWeb.core.Server.resolveScAddr(['sc_definition',
    ], function (keynodes) {
        self.keynodes.definition = keynodes['sc_definition'];
        self.needUpdate = true;
        self.requestUpdate();
    });
    SCWeb.core.Server.resolveScAddr(['rrel_key_sc_element',
    ], function (keynodes) {
        self.keynodes.key_sc_element= keynodes['rrel_key_sc_element'];
        self.needUpdate = true;
        self.requestUpdate();
    });
    SCWeb.core.Server.resolveScAddr(['rrel_example',
    ], function (keynodes) {
        self.keynodes.example= keynodes['rrel_example'];
        self.needUpdate = true;
        self.requestUpdate();
    });
    SCWeb.core.Server.resolveScAddr(['nrel_perimeter',
    ], function (keynodes) {
        self.keynodes.perimeter = keynodes['nrel_perimeter'];
        self.needUpdate = true;
        self.requestUpdate();
    });
    this.eventStructUpdate = function (added, element, arc) {
        window.sctpClient.get_arc(arc).done(function (r) {
            var addr = r[1];
            window.sctpClient.get_element_type(addr).done(function (t) {
                var type = t;
                var obj = new Object();
                obj.data = new Object();
                obj.data.type = type;
                obj.data.addr = addr;
                if (type & sc_type_arc_mask) {
                    window.sctpClient.get_arc(addr).done(function (a) {
                        obj.data.begin = a[0];
                        obj.data.end = a[1];
                        scElements[addr] = obj;
                        self.requestUpdate();
                    });
                }
            });
        });
    };
// delegate event handlers
    this.sandbox.eventDataAppend = $.proxy(this.receiveData, this);
    this.sandbox.eventStructUpdate = $.proxy(this.eventStructUpdate, this);
    this.sandbox.updateContent();
};
SCWeb.core.ComponentManager.appendComponentInitialize(Drawings.GeomDrawComponent);

