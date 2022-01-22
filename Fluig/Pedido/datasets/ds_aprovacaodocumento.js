function createDataset(fields, constraints, sortFields) {	
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("RETORNO");

	var documentId;
	var aprovado;

	for (var a=0; a<constraints.length; a++){						
		 if (constraints[a].fieldName == "documentid" ){
			 documentId = constraints[a].initialValue;
			
		 }	
		 else  if (constraints[a].fieldName == "aprovado" ){
			 		aprovado = constraints[a].initialValue;
			 
		 }
				 					 
	 }
	 		    var constraints   = new Array();
    			constraints.push(DatasetFactory.createConstraint("documentid", documentId, documentId, ConstraintType.MUST));
    			constraints.push(DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST));
    			constraints.push(DatasetFactory.createConstraint("checkSecurity", "false", "false", ConstraintType.MUST));
    			constraints.push(DatasetFactory.createConstraint("userSecurityId", "admin", "admin", ConstraintType.MUST));
    			var solicitacao = DatasetFactory.getDataset("DSliberacaoDocumento", null, constraints, null);
				        	
    					 try{
        					        var clientService = fluigAPI.getAuthorizeClientService();
        					        var data = {
        					            companyId : 1 + '',
        					            //serviceCode : 'REST FLUIG',          
        					            serviceCode : 'REST_PROTHEUS',  
        					            endpoint : '/APROVAPC',
        					            method : 'POST',   
        					            timeoutService: '600',
        					            params : {
        					            	cnpj : '' + solicitacao.getValue(0,"cnpj") + '' ,
        					            	pedido : '' + solicitacao.getValue(0,"pedido") + '' ,
        					            	aprovador : '' + solicitacao.getValue(0,"aprovador") +'',
        					            	aprovado : '' + aprovado +'',   	
        					            	observacao : '' + solicitacao.getValue(0,"motivo") +'',
        					            	tipo : '' + solicitacao.getValue(0,"tipo") +''
        					               
        					            },
        					          options : {
        					             encoding : 'UTF-8',
        					             mediaType: 'application/json'
        					          } 
        					        }
 
        					       log.info("APROVAÇÃO DE DOCUMENTOS");
        					       log.dir(data);
        						        var vo = clientService.invoke(JSON.stringify(data));        		        					        
        		        					        var obj = JSON.parse(vo.getResult());
        		        					        if(vo.getResult()== null || vo.getResult().isEmpty()){
        		         					        	dataset.addRow(new Array("RETORNO VAZIO"));
        		        					        }  
        		        					        else if((JSON.parse(vo.getResult()).errorMessage != null && JSON.parse(vo.getResult()).errorMessage != "")){
        		        					        		dataset.addRow(new Array("Não foi possível efetivar a aprovação. Entre em contato com o Administrador do sistema."));	
        		        					        }
        		        					         else if (JSON.parse(vo.getResult()).status == "success"){
        		        					        	 	dataset.addRow(new Array("SUCESSO"));		
        		        					        }
        		        					         else if (JSON.parse(vo.getResult()).status == "error"){
        		        					        	 dataset.addRow(new Array(JSON.parse(vo.getResult()).message));	
        		        					        }
        		        					        
        		        					        log.info("RETORNO APROVAÇÃO");
        		         					        log.dir(JSON.parse(vo.getResult()));
        		        					        
        		        					        
        					    } 
        						catch(err) {
        							dataset.addRow([err.message]);
        					    }
        						
        						 log.info("RETORNO APROVACAO DE DOCUMENTO");
      					       log.dir(dataset);						
	return dataset;
}





//recebe como parametro:metadata#card_index_id, metadate#id, companyid
function retornaSolicitacao(cardindexdocumentid,carddocumentid,empresa){
	  var constraintsHistorico  = new Array();	    	 
		 constraintsHistorico.push(DatasetFactory.createConstraint("cardIndexDocumentId", cardindexdocumentid , cardindexdocumentid, ConstraintType.MUST));
		 constraintsHistorico.push(DatasetFactory.createConstraint("cardDocumentId", carddocumentid , carddocumentid, ConstraintType.MUST));	    	
		 constraintsHistorico.push(DatasetFactory.createConstraint("workflowProcessPK.companyId", empresa , empresa, ConstraintType.MUST));	    	
		 
   var historicoFormulario = DatasetFactory.getDataset("workflowProcess", null, constraintsHistorico, null);	       		 

   return historicoFormulario;
}