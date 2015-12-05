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