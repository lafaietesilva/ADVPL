function validateForm(form){
	var ABERTURA = 0;
	var SOLICITAR = 4;
	var ELABORAR = 10
	var ASSINAR = 18;
	var ANEXAR = 57;
	var CONFIGURAR = 51;
	
	var activity = getValue('WKNumState');
	var nextAtv  = getValue("WKNextState");	

	if (activity == ABERTURA || activity == SOLICITAR){
		if (form.getValue("finalidade") == null || form.getValue("finalidade") == "") {
            throw "Você precisa informar o objeto do contrato.";
        }
		if (form.getValue("negociacao") == null || form.getValue("negociacao") == "") {
            throw "Você precisa informar os termos da negociação.";
        }
		if (form.getValue("dtInicio") == null || form.getValue("dtInicio") == "") {
            throw "Você precisa informar a data para inicio da execução do serviço.";
        }
	   if (form.getValue("dtFim") == null || form.getValue("dtFim") == "") {
            throw "Você precisa informar a data para termino da execução do serviço.";
        }
	   
	   if (form.getValue("definicaoValor") == null || form.getValue("definicaoValor") == "") {
            throw "Você precisa informar o campo de definição de valor.";
        }
	    
	   if (form.getValue("condicaoPgto") == null || form.getValue("condicaoPgto") == "" ) {
			 throw "Você precisa informar a condição de pagamento.";
	    }
	   
	}
	else if (activity == CONFIGURAR ){
		if (form.getValue("tipoRevisao") == "" && form.getValue("tipoContrato") == "" ) {
	           throw "Você precisa escolher um tipo de contrato ou um tipo de revisão.";
	    }

	}
	
	else if (activity == ASSINAR){
			if (nextAtv == 37){		
				if (form.getValue("statusContrato") == null || form.getValue("statusContrato") == "" ){
					 throw "Você precisa indicar se o contrato foi assinado ou recusado pelo fornecedor.";
				}		
			}
		
		
	}
}