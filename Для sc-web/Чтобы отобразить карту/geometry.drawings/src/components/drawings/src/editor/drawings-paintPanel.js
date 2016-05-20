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