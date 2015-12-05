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