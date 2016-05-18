OpenStreetMapComponent= {
    formats: ['format_openstreetmap'],
    factory: function(sandbox) {
        return new OpenStreetMapViewer(sandbox);
    }
};

var OpenStreetMapViewer = function(sandbox){

    this.sandbox = sandbox;
    this.container = '#' + sandbox.container;
    
    // ---- window interface -----
	
this.receiveData = function(data) {

var dfd = new jQuery.Deferred();
		
var objectName;
var objectCoordinates;


var getKeynodes = function () {

	var dfd1 = new jQuery.Deferred();
	var dfd2 = new jQuery.Deferred();
	var dfd3 = new jQuery.Deferred();
	var dfd4 = new jQuery.Deferred();
	var dfd5 = new jQuery.Deferred();

	SCWeb.core.Server.resolveScAddr([data], function (keynodes) {
		objectScAddr = keynodes[data];
		dfd1.resolve();
	});

	SCWeb.core.Server.resolveScAddr(['nrel_main_idtf'], function (keynodes) {
		nrelMainIdtfScAddr = keynodes['nrel_main_idtf'];
		dfd2.resolve();
	});

	SCWeb.core.Server.resolveScAddr(['lang_ru'], function (keynodes) {
		langRuScAddr = keynodes['lang_ru'];
		dfd3.resolve();
	});

	SCWeb.core.Server.resolveScAddr(['nrel_geographical_location'], function (keynodes) {
		nrelGeoraphicalLocationScAddr = keynodes['nrel_geographical_location'];
		dfd4.resolve();
	});

	SCWeb.core.Server.resolveScAddr(['nrel_WGS_84_translation'], function (keynodes) {
		nrelWGS84translationScAddr = keynodes['nrel_WGS_84_translation'];
		dfd5.resolve();
	});

	return $.when(dfd1, dfd2, dfd3, dfd4, dfd5)
}



function getNameOfObject () {

	var d = new jQuery.Deferred();

	window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F, [
		objectScAddr,
        sc_type_arc_common | sc_type_const,
        sc_type_link,
        sc_type_arc_pos_const_perm,
        nrelMainIdtfScAddr
		]).
	done(function(setOfNodes) {

	//setOfNodes[i][2] - множество ссылок на имя объекта 
    //Из множества ссылок ищем ту, которая с русским идентификатором

		for (var i=0; i < setOfNodes.length; i++) {
			window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_3F_A_F, [
        	langRuScAddr,
        	sc_type_arc_pos_const_perm,
       	    setOfNodes[i][2]			
			]).
			done(function(setOfNodes2) {

				//setOfNodes2[0][2] - искомая ссылка
				//Получим её содержимое

				window.sctpClient.get_link_content(setOfNodes2[0][2],'string').
				done(function(content) {
					objectName = content; 
					d.resolve();
				})
			});
		}
	});

	return d.promise();
}


function getCoordinatesOfObject ()
{
	var d = new jQuery.Deferred();

	window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F, [
		objectScAddr,
    	sc_type_arc_common | sc_type_const,
    	sc_type_node | sc_type_const,
    	sc_type_arc_pos_const_perm,
    	nrelGeoraphicalLocationScAddr
		]).
	done(function(setOfNodes){
		window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F, [
			setOfNodes[0][2],
            sc_type_arc_common | sc_type_const,
            sc_type_link,
          	sc_type_arc_pos_const_perm,
            nrelWGS84translationScAddr
			]).
		done(function(setNodes2){
			window.sctpClient.get_link_content(setNodes2[0][2],'string').done(function(content) { 
				objectCoordinates = content; 
				d.resolve();
			})
		})
	});

	return d.promise();
}


getKeynodes().done(function() {
	$.when(getNameOfObject(), getCoordinatesOfObject()).done(function() {

		var def = new jQuery.Deferred();

		var coordinate = objectCoordinates.split(',');
		localStorage.setItem('NameObj',objectName);
		localStorage.setItem('GeoObj', coordinate[0]);    //send lat to map.html
		localStorage.setItem('GeoObj2', coordinate[1]);

		def.resolve();
                localStorage.setItem('def', def);
});
});

		

$(this.container).empty();
$(this.container).append('<iframe width="640" height="480" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src=/static/components/html/map.html> </iframe>');
dfd.resolve();
return dfd.promise();
}

this.sandbox.eventDataAppend = $.proxy(this.receiveData, this);
this.sandbox.updateContent();
	
};


SCWeb.core.ComponentManager.appendComponentInitialize(OpenStreetMapComponent);



  
	


