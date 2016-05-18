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