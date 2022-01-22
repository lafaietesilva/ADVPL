function displayFields(form,customHTML){ 
	var ABERTURA = 0;
	var SOLICITAR = 4;
	var ELABORAR = 10
	var ASSINAR = 18;
	var ANEXAR = 57;
	var CONFIGURAR = 51;
	
	
	var activity = getValue('WKNumState');
	var solicitante = getValue("WKUser");  
	
  	customHTML.append("<script>");
    customHTML.append("var ATIVIDADE_FLUIG = " + activity + ";");
    customHTML.append("</script>");
	
    
    form.setVisibleById("codCondPgto", false)
    form.setVisibleById("_codCondPgto", false)
    
    if (activity == ABERTURA || activity == SOLICITAR){
    	form.setVisibleById("tipoContrato", false);
    	form.setVisibleById("tipoRevisao", false);
    	form.setVisibleById("div_status", false);
    }
    else if (activity == ELABORAR ){
    	form.setVisibleById("div_status", false);
    }
    else if (activity == CONFIGURAR ){
    	form.setVisibleById("div_status", false);
    }
    
   
    
    
}