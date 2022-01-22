function displayFields(form,customHTML){ 
	var activity = getValue('WKNumState');
	
	customHTML.append("<script>");
    customHTML.append("var ATIVIDADE_FLUIG = " + activity + ";");
    customHTML.append("</script>");

    
	if (activity == 0 || activity == 4) {
		form.setValue("solicitante", fluigAPI.getUserService().getCurrent().getFullName());
		form.setValue("emailsolicitnte", fluigAPI.getUserService().getCurrent().getEmail());
	}
	
	
}