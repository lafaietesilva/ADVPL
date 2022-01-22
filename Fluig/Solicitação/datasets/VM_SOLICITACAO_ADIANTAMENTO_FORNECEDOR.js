function createDataset(fields, constraints, sortFields) {
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("RETORNO");
	 
	
	/*
	 * É necessário recuperar a data da aprovação do gestor e a data da aprovação do diretor para enviar e preencher a tabela SZ2
	 */
	
	
	 if(constraints !== null && constraints.length){
		 if(constraints[0].constraintType==ConstraintType.MUST && constraints[0].fieldName == "documentid") {
			 	var documentId = constraints[0].initialValue;
			// 	var dtAprovacao = constraints[1].initialValue;
			// 	var aprovador;
			 
			 	var c0 = DatasetFactory.createConstraint("documentid", documentId, documentId, ConstraintType.MUST);    
	    		var c1 = DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST);        		
	    		var solicitacao = DatasetFactory.getDataset("VM_SolicitacoesAdiantamentoFornecedor", null, new Array(c0,c1), null);
	    	
	    		//log.info("RETORNA SOLICITAÇÃO DE ADIANTAMENTO");
	    		//log.dir(solicitacao);
	    		/*
	    		
	    		if (solicitacao.getValue(0,"emailNivel1") !=null && solicitacao.getValue(0,"emailNivel1") !="") {
	    			aprovador = solicitacao.getValue(0,"emailNivel1");	    			
	    		}
	    		else if (solicitacao.getValue(0,"emailNivel7") !=null && solicitacao.getValue(0,"emailNivel7") !=""){
    				aprovador = solicitacao.getValue(0,"emailNivel7");
	    		}
	    		else if (solicitacao.getValue(0,"emailNivel5") !=null && solicitacao.getValue(0,"emailNivel5") !=""){
	    				aprovador = solicitacao.getValue(0,"emailNivel5");
	    		}
	    		
	    		*/
	    		
	    		var retornaProcessoSolicitacao = retornaSolicitacao(solicitacao.getValue(0,"metadata#card_index_id"),documentId,solicitacao.getValue(0,"companyid"));
        		var codSolicitacao = retornaProcessoSolicitacao.getValue(0,"workflowProcessPK.processInstanceId");
        	
					 try {
						 var clientService = fluigAPI.getAuthorizeClientService();
					        var data = {
						        	companyId : 1 + '',
						        	serviceCode : 'REST FLUIG',
						            endpoint : '/F_CADFN001',
						            method : 'POST',// 'delete', 'patch', 'put', 'get'     
						            timeoutService: '120', // segundos
						            params : {
						            	DATASOLICITACAO :'' + solicitacao.getValue(0,"dtSolicitacao") +'',	
						            	DATAVENCIMENTO :'' + solicitacao.getValue(0,"dtNecessidade") + '',
						            	VALORSOLICITADO : '' + solicitacao.getValue(0,"vl_adiantado") + '' ,
						            	VALORAPROVADO : '' + solicitacao.getValue(0,"vl_adiantado") + '' ,
						            	CPFFORNECEDOR :'' + solicitacao.getValue(0,"cnpjcpf") +'',	
						            	CODIGOFORNECEDOR :'' + solicitacao.getValue(0,"codigoFornecedor") +'',
						            	EMAILSOLICITANTE : '' + solicitacao.getValue(0,"emailSolicitante") +'',
						            	EMAILAPROVADOR	: '' + solicitacao.getValue(0,"emailNivel1") +'',
						            	EMAILDIRETOR	: '' + solicitacao.getValue(0,"emailNivel2") +'',						            	
						            	CCUSTO	: '' + solicitacao.getValue(0,"centrocusto") +'',
						            	PROJETO	: '' + solicitacao.getValue(0,"projeto") +'',	
						            	FONTE	: '' + solicitacao.getValue(0,"fontefinanciamento") +'',
						            	SOLICITACAO  : '' + codSolicitacao + '' ,
						            	FINALIDADE  : '' + solicitacao.getValue(0,"justificativa") +'',
						            	IDDOCUMENTO: '' + documentId + '',
						            	TIPOADIANTAMENTO: ''+"5" +'',
						            	PROCESSO: ''+ 9 +''
						            },
						          options : {
						             encoding : 'UTF-8',
						             mediaType: 'application/json'
						          }
						        }
				         
					        	log.info("----INTEGRAÇÃO ADIANTAMENTO A FORNECEDOR----");
					        log.dir(data);
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
