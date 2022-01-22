function createDataset(fields, constraints, sortFields) {
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("RETORNO");
	
	var pedido;
	var cnpj;
	var aSolicitacoes = new Array();
	var retorno;
	 
	for (var a=0; a<constraints.length; a++){
		if (constraints[a].fieldName == "pedido"){
			pedido = constraints[a].initialValue; 
			
		}
		else if (constraints[a].fieldName == "cnpj"){
			cnpj = constraints[a].initialValue; 
			
		}
	
	}
	
	 var constraintsForm   = new Array();
	 constraintsForm.push(DatasetFactory.createConstraint("pedido", pedido, pedido, ConstraintType.MUST));
	 constraintsForm.push(DatasetFactory.createConstraint("cnpj", cnpj, cnpj, ConstraintType.MUST));
	 //constraintsForm.push(DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST));
	 var datasetForm = DatasetFactory.getDataset("DSliberacaoDocumento", null, constraintsForm, null);
	
	if (datasetForm.rowsCount > 0) {
		for (var i = 0; i < datasetForm.rowsCount; i++){
			var solicitacao = datasetForm.getValue(i,"solicitacao");
			
			var constraintsHistorico  = new Array();	    	 
			constraintsHistorico.push(DatasetFactory.createConstraint("workflowProcessPK.processInstanceId", solicitacao , solicitacao, ConstraintType.MUST));	    	
			var datasetProcesso = DatasetFactory.getDataset("workflowProcess", null, constraintsHistorico, null);
			
			 if (datasetProcesso.rowsCount > 0){
				 var statusSolicitacao = datasetProcesso.getValue(0,"status");
				 if (statusSolicitacao == 0){
					 aSolicitacoes.push(listaSolicitacoes(solicitacao)); 
				 }
			}
		}	
	}
	
	 if (aSolicitacoes.length > 0){
		 retorno = deletaSolicitacoesAC(aSolicitacoes);
	 }
	 else {
		 dataset.addRow(new Array("SUCCESS"));	
	 }

	 if (retorno != undefined){
		 var obj = retorno.content;
		 //log.dir(obj);
		 
		 if (obj.failCount > 0 ) {
			 log.info("Erro ao cancelar solicitações.");
			 dataset.addRow(new Array("ERROR"));	
		 } else {
			 dataset.addRow(new Array("SUCCESS"));	
		 }
	 }
	

	 
	 
	 return dataset;
}


function listaSolicitacoes(process){
	 var solicitacao = {
			 processInstanceId: ''+process +''
	 };
	 
	 return solicitacao;
}


function deletaSolicitacoesAC(aSolicitacoes){
	var dados;  
   
	try{
        var clientService = fluigAPI.getAuthorizeClientService();
        var data = {                                                   
            companyId : getValue("WKCompany") + '',
            //serviceCode : 'fluig',          
            serviceCode : 'API_FLUIG',         
            endpoint : '/api/public/2.0/workflows/cancelInstances',  
            method : 'POST',                                        
            timeoutService: '100',
            params : {
            	cancelText	: '' + "Pedido alterado/cancelado no Protheus" +'',
            		cancelInstanceList : 
            			 	aSolicitacoes
            	}
        }       
   
        var vo = clientService.invoke(JSON.stringify(data));
 
        if(vo.getResult()== null || vo.getResult().isEmpty()){
        	return "RETORNO VAZIO";
        }        					                					       
        else {
        		return JSON.parse(vo.getResult());
        }
       
        
    } catch(err) {
    	log.error("------FALHA NO CANCELAMENTO DE PEDIDOS----");
    }
  

	
}