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