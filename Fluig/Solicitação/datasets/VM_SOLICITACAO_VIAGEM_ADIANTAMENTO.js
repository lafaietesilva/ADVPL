function createDataset(fields, constraints, sortFields) {
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("RETORNO");
	 
	
	//log.info("INTEGRAÇÃO ADIANTAMENTO");
	//log.dir(constraints);
	
	
	
	 if(constraints !== null && constraints.length){
		 if(constraints[0].constraintType==ConstraintType.MUST && constraints[0].fieldName == "documentid") {
			 	var documentId = constraints[0].initialValue;
			 
			 	var c0 = DatasetFactory.createConstraint("documentid", constraints[0].initialValue, constraints[0].initialValue, ConstraintType.MUST);    
	    		var c1 = DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST);        		
	    		var solicitacao = DatasetFactory.getDataset("VM_SolicitacoesViagens", null, new Array(c0,c1), null);
	    		
	    		var retornaProcessoSolicitacao = retornaSolicitacao(solicitacao.getValue(0,"metadata#card_index_id"),solicitacao.getValue(0,"documentid"),solicitacao.getValue(0,"companyid"));
        		var codSolicitacao = retornaProcessoSolicitacao.getValue(0,"workflowProcessPK.processInstanceId");
        	
         		 var passagem = solicitacao.getValue(0,"pedirPassagem"); 
    			 var dtRetorno;
    			 
    			 if (passagem == 'sim'){     				 
     				 if (solicitacao.getValue(0,"datapartida3") != "" && solicitacao.getValue(0,"datapartida3") != null){
    					 dtRetorno = retornoDataset.getValue(0,"datapartida3");
	    			 }
	    			 else if (solicitacao.getValue(0,"datapartida2") != "" && solicitacao.getValue(0,"datapartida2") != null){
	    				 dtRetorno = retornoDataset.getValue(0,"datapartida2");
	    			 }
	    			 else if (solicitacao.getValue(0,"dataretorno1") != "" && solicitacao.getValue(0,"dataretorno1") != null){
	    				 dtRetorno = solicitacao.getValue(0,"dataretorno1");
	    			 }
    				 
    			 }
    			 else {
    				 if (solicitacao.getValue(0,"datacheckout3") != "" && solicitacao.getValue(0,"datacheckout3") != null){
    					 dtRetorno = solicitacao.getValue(0,"datacheckout3");
	    			 }
	    			 else if (solicitacao.getValue(0,"datacheckout2") != "" && solicitacao.getValue(0,"datacheckout2") != null){
	    				 dtRetorno = solicitacao.getValue(0,"datacheckout2");
	    			 }
	    			 else if (solicitacao.getValue(0,"datacheckout") != "" && solicitacao.getValue(0,"datacheckout") != null){
	    				 dtRetorno = solicitacao.getValue(0,"datacheckout");
	    			 }
    			 }
        		
        		
					 try {
						 var clientService = fluigAPI.getAuthorizeClientService();
					        var data = {
						        	companyId : 1 + '',
						        	serviceCode : 'REST FLUIG',
						            endpoint : '/F_CADFN001',
						            method : 'POST',// 'delete', 'patch', 'put', 'get'     
						            timeoutService: '100', // segundos
						            params : {
						            	DATASOLICITACAO :'' + solicitacao.getValue(0,"datasolicitacao") +'',	
						            	DATAVENCIMENTO :'' + solicitacao.getValue(0,"dtNecessidade") + '',
						            	DATARETORNO :'' + dtRetorno + '',						            	
						            	VALORSOLICITADO : '' + solicitacao.getValue(0,"vl_solicitado") + '' ,
						            	VALORAPROVADO : '' + solicitacao.getValue(0,"vl_aprovado") + '' ,
						            	CPFFORNECEDOR :'' + solicitacao.getValue(0,"cpfpassageiro") +'',	
						            	EMAILSOLICITANTE	: '' + solicitacao.getValue(0,"emailsolicitante") +'',
						            	EMAILAPROVADOR	: '' + solicitacao.getValue(0,"emailGestor") +'',
						            	CCUSTO	: '' + solicitacao.getValue(0,"centrocustoAdto") +'',
						            	PROJETO	: '' + solicitacao.getValue(0,"projetoAdto") +'',	
						            	FONTE	: '' + solicitacao.getValue(0,"fontefinanciamentoAdto") +'',
						            	SOLICITACAO  : '' + codSolicitacao + '' ,
						            	FINALIDADE  : '' + solicitacao.getValue(0,"finalidade") +'',
						            	IDDOCUMENTO: '' + solicitacao.getValue(0,"documentid") + '',
						            	ITINERARIO  : '' + solicitacao.getValue(0,"itinerario")  +'',
						            	TIPOADIANTAMENTO: ''+"1" +'',
						            	PROCESSO: ''+ 8 +''
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
