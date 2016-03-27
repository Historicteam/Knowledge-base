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