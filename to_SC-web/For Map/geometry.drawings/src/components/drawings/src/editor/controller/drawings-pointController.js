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