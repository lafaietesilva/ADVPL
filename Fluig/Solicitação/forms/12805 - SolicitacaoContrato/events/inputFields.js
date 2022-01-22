function inputFields(form){

	var regEx = /^\d{4}-\d{2}-\d{2}$/;
	
	if (form.getValue('dataSolicitacao').match(regEx)) {
        var split = form.getValue('dataSolicitacao').split('-');
        form.setValue('dataSolicitacao', split[2] + '-' + split[1] + '-' + split[0]);
	
	}
	if (form.getValue('dtFim').match(regEx)) {
        var split = form.getValue('dtFim').split('-');
        form.setValue('dtFim', split[2] + '-' + split[1] + '-' + split[0]);
	
	}
	if (form.getValue('dtInicio').match(regEx)) {
        var split = form.getValue('dtInicio').split('-');
        form.setValue('dtInicio', split[2] + '-' + split[1] + '-' + split[0]);
	
	}

	
	
}