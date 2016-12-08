
var autoSave=false;

function listGraph()
{

    Web.fill('../php/index.php?action=listgraph','#listName',{'after':function(data){
		if(data.length==0)
		{
			 $('#listName').html('');
			
		} else {
			 $('#g_'+$('#graph_id').html(), $('#listName')).css({'color':'red'});
		}
	}});
    
}


function loadGraph(id)
{
	$.get('../php/index.php?action=loadgraph&id='+id,function(data){
		var data=eval('('+data+')').returnValue;
		var doc = mxUtils.parseXml(data.context);
		$('#graph_id').html(data.id);
		$('#graph_name').html(data.name);
		$('#graph_context').html(data.context);
			myEditor.editor.setGraphXml(doc.documentElement);
			$('#listName').find("li").css({'color':'black'});
			$('#g_'+data.id, $('#listName')).css({'color':'red'});
	});
	
}

function editGraph(id)
{
	loadGraph(id);
	myEditor.actions.editorUi.showDialog(new EditFileDialog(myEditor.actions.editorUi).container, 520, 350, true, true);
}

function newGraph()
{
	autoSave=false;
	$('#graph_id').html('');
	$('#graph_name').html('');
	$('#graph_context').html('');
	var doc= mxUtils.parseXml('<mxGraphModel pageHeight="1169" pageWidth="826" pageScale="1" page="0" fold="1" connect="1" tooltips="1" guides="1" grid="1"><root><mxCell id="0"/><mxCell id="1" parent="0"/></root></mxGraphModel>');
	myEditor.editor.setGraphXml(doc.documentElement);
}




function saveGraph()
{
	var xml=mxUtils.getXml(myEditor.editor.getGraphXml());
    autoSave=true;

	$.post("../php/index.php",{'name':$('#graph_name').html(),'id':$('#graph_id').html(),'xml':xml,'action':'save'},function(ret){
		listGraph();
		var data=eval('('+ret+')');
		$('#graph_id').html(data.id);
		$('#graph_name').html(data.name);
		if(autoSave) {
		setTimeout(saveGraph,10000);
		}
	});


	
}

function login()
{

	$.post("../php/index.php",{'username':$('#username').val(),'pwd':$('#pwd').val(),'action':'login'},function(ret){
		if(ret=='1'){
			listGraph();
			myEditor.actions.editorUi.hideDialog();
		}
	});

}

function checkLogin()
{

	$.post("../php/index.php",{'username':$('#username').val(),'pwd':$('#pwd').val(),'action':'checklogin'},function(ret){
		if(ret=='1'){
			listGraph();
			myEditor.actions.editorUi.hideDialog();
		} else if(ret=='0') {
			myEditor.actions.editorUi.showDialog(new LoginDialog(myEditor.actions.editorUi).container, 300, 180, true, true);
			
		}
		//setTimeout(checkLogin,20000);
	});

}





$(document).ready(function(){

	


	

try{
checkLogin();


}catch(e)
{
	alert(e);
}

});

