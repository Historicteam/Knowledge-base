/* --- src/openstreetmap.js --- */
var Openstreetmap = Openstreetmap || { version: "0.1.0" };

/* --- src/openstreetmap-component.js --- */
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
		


  var objName;
  var objCoord;



		var a1 = $.Deferred(), a2 = $.Deferred();

	SCWeb.core.Server.resolveScAddr([data], function(addr1) {
		 SCWeb.core.Server.resolveScAddr(['nrel_main_idtf'], function (addr2) {
            window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F, [
            addr1[data],
            sc_type_arc_common | sc_type_const,
            sc_type_link,
            sc_type_arc_pos_const_perm,
            addr2['nrel_main_idtf']
			]).
		    done(function(setNodes){
			SCWeb.core.Server.resolveScAddr(['lang_ru'], function (addr3) {
			for (var i=0; i<setNodes.length; i++)
			{
			window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_3F_A_F, [
            addr3['lang_ru'],
            sc_type_arc_pos_const_perm,
            setNodes[i][2]
			]).
		    done(function(setNodes2)
		    {
            window.sctpClient.get_link_content(setNodes2[0][2],'string').done(function(content){objName = content; a1.resolve(); } ).fail(function(){
           alert('nooooo1');
           });	
			});
			}
			});
		}).fail(function(){
           alert('nooooo2');
			});
           });  
    
		
			SCWeb.core.Server.resolveScAddr(['nrel_geographical_location'], function (addr2) {
                window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F, [
            addr1[data],
            sc_type_arc_common | sc_type_const,
            sc_type_node | sc_type_const,
            sc_type_arc_pos_const_perm,
            addr2['nrel_geographical_location']
			]).
		    done(function(setNodes){
                SCWeb.core.Server.resolveScAddr(['nrel_WGS_84_translation'], function (addr3) {
         						    window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F, [
            						setNodes[0][2],
            						sc_type_arc_common | sc_type_const,
            						sc_type_link,
            						sc_type_arc_pos_const_perm,
            						addr3['nrel_WGS_84_translation']
			]).
		    done(function(setNodes2){
			     window.sctpClient.get_link_content(setNodes2[0][2],'string').done(function(content2){ 
					 objCoord = content2; a2.resolve();
				 })
                });
			
    			});
				});
			});
		
		
			});
	
		
		
		
		
		$.when(a1, a2).done(function() {
		var coordinate = objCoord.split(',');
		localStorage.setItem('NameObj',objName);
        localStorage.setItem('GeoObj', coordinate[0]);    //send lat to map.html
        localStorage.setItem('GeoObj2', coordinate[1]);
		
		});

		

    $(this.container).empty();
	$(this.container).append('<iframe width="1000" height="520" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src=/static/components/html/map.html> </iframe>');
	dfd.resolve();
    return dfd.promise();
    }

    this.sandbox.eventDataAppend = $.proxy(this.receiveData, this);
    this.sandbox.updateContent();
	
	
 
};


SCWeb.core.ComponentManager.appendComponentInitialize(OpenStreetMapComponent);



  
	




