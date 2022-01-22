function createDataset(fields, constraints, sortFields) {
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("RETORNO");
	 
	
	var cartao;
	
	
	 if(constraints !== null && constraints.length){
		 if(constraints[0].constraintType==ConstraintType.MUST && constraints[0].fieldName == "documentid") {
			 	var documentId = constraints[0].initialValue;
			 
			 	var c0 = DatasetFactory.createConstraint("documentid", documentId, documentId, ConstraintType.MUST);    
	    		var c1 = DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST);        		
	    		var solicitacao = DatasetFactory.getDataset("VM_SolicitacoesAdiantamentoFornecedor", null, new Array(c0,c1), null);
	    		
	    		var retornaProcessoSolicitacao = retornaSolicitacao(solicitacao.getValue(0,"metadata#card_index_id"),documentId,solicitacao.getValue(0,"companyid"));
        		var codSolicitacao = retornaProcessoSolicitacao.getValue(0,"workflowProcessPK.processInstanceId");
        	
        		
        		
				 //atribui constraints recebida de valor e datavencimento as variaveis
				 for (var a=0; a<constraints.length;a++){						
					 if (constraints[a].fieldName == "cartaocredito" ){
						 cartao = constraints[a].initialValue;
					 }					
					 					 
				 }
        		
        		
					 try {
						 var clientService = fluigAPI.getAuthorizeClientService();
					        var data = {
						        	companyId : 1 + '',
						        	serviceCode : 'REST FLUIG',
						            endpoint : '/F_FINA050',
						            method : 'POST',// 'delete', 'patch', 'put', 'get'     
						            timeoutService: '100', // segundos
						            params : {
						            	DATASOLICITACAO :'' + solicitacao.getValue(0,"dtSolicitacao") +'',	
						            	DATAVENCIMENTO :'' + solicitacao.getValue(0,"dtNecessidade") + '',
						            	VALORSOLICITADO : '' + solicitacao.getValue(0,"vl_adiantado") + '' ,
						            	VALORAPROVADO : '' + solicitacao.getValue(0,"vl_adiantado") + '' ,
						            	CPFFORNECEDOR :'' + solicitacao.getValue(0,"cgcFornecedor") +'',	
						            	CODIGOFORNECEDOR :'' + solicitacao.getValue(0,"codigoFornecedor") +'',
						            	EMAILSOLICITANTE : '' + solicitacao.getValue(0,"emailSolicitante") +'',
						            	EMAILAPROVADOR	: '' + solicitacao.getValue(0,"emailLider") +'',
						            	EMAILDIRETOR	: '' + solicitacao.getValue(0,"emaildiretor") +'',
						            	CCUSTO	: '' + solicitacao.getValue(0,"centrocusto") +'',
						            	PROJETO	: '' + solicitacao.getValue(0,"projeto") +'',	
						            	FONTE	: '' + solicitacao.getValue(0,"fontefinanciamento") +'',
						            	SOLICITACAO  : '' + codSolicitacao + '' ,
						            	FINALIDADE  : '' + solicitacao.getValue(0,"justificativa") +'',
						            	IDDOCUMENTO: '' + documentId + '',
						            	CARTAO: '' + cartao + '',
						            	PROCESSO: ''+"9" +''
						            },
						          options : {
						             encoding : 'UTF-8',
						             mediaType: 'application/json'
						          }
						        }
				         
					 		        var vo = clientService.invoke(JSON.stringify(data));
		        					        var obj = JSON.parse(vo.getResult());
		        					        if(vo.getResult()== null || vo.getResult().isEmpty()){
		         					        	dataset.addRow(new Array("RETORNO VAZIO"));
		        					        }        					                					       
		        					        else if((JSON.parse(vo.getResult()).errorMessage != null && JSON.parse(vo.getResult()).errorMessage != "")){
		        					        	dataset.addRow(new Array(JSON.parse(vo.getResult()).errorMessage));
		        					        }
		        					        else if (obj.CODIGO != "201"){
		        					        	dataset.addRow(new Array(obj.MSG));
		        					        }
		        					        else if (obj.CODIGO == "201"){	                    
		        					            dataset.addRow(new Array("SUCESSO"));					           
		        					            
		        					        }
					        
				    	}  catch(err) {
				    		dataset.addRow([err.message]);
											
				        }	 
				    	
				    
					 
					 
	    	}
	 
	 }
	
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
