function createDataset(fields, constraints, sortFields) {
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("RETORNO");
	dataset.addColumn("NUMERO");
	
	var valorDiarias;
	var dataVencimento;
	var vl_tarifa;
	var fornecedor_tarifa;
	var dt_tarifa;
	var aRateio = new Array();

	 
	 if(constraints !== null && constraints.length){
		//INTEGRAÇÃO PARA SER REALIZADA PRECISA RECEBER UMA CONSTRAINT COM O CAMPO solicitacao NA POSIÇÃO 0 e do tipo MUST
		 if(constraints[0].constraintType==ConstraintType.MUST && constraints[0].fieldName == "documentid") {
			// log.info("entrando aqui 1");
	    		var c0 = DatasetFactory.createConstraint("documentid", constraints[0].initialValue, constraints[0].initialValue, ConstraintType.MUST);    
	    		var c1 = DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST);        		
	    		var solicitacao = DatasetFactory.getDataset("VM_SolicitacoesViagens", null, new Array(c0,c1), null);
	    		
	    		var retornaProcessoSolicitacao = retornaSolicitacao(solicitacao.getValue(0,"metadata#card_index_id"),solicitacao.getValue(0,"documentid"),solicitacao.getValue(0,"companyid"));
        		var codSolicitacao = retornaProcessoSolicitacao.getValue(0,"workflowProcessPK.processInstanceId");
        	
	    		
         		var c2 = DatasetFactory.createConstraint("metadata#id", constraints[0].initialValue, constraints[0].initialValue, ConstraintType.MUST);
	    		//var c2 = DatasetFactory.createConstraint("SOLICITACAO", codSolicitacao, codSolicitacao, ConstraintType.MUST);    
	    	    var itensSolicitacao = DatasetFactory.getDataset("VM_SolicitacoesViagemDadosPagamento", null, new Array(c2), null);    				  


				 try {
					//chama função que monta array de objetos dos itens do rateio
					 aRateio = preencheRateio(itensSolicitacao);
				 }
				 catch (erro){
					 dataset.addRow(["ERRO AO RECUPERAR RATEIO"]);
					 return dataset;
				 }
			  			
				 
				 if(aRateio === null || aRateio == ""){
					 dataset.addRow(new Array("NÃO FOI POSSÍVEL MONTAR AS INFORMAÇÕES DE PAGAMENTO"));
					 return dataset;
					 
				 }
					 //atribui constraints recebida de valor e datavencimento a variaveis
					 for (var a=0; a<constraints.length;a++){						
						 if (constraints[a].fieldName == "valorDiarias" ){
							 valorDiarias = constraints[a].initialValue;
						 }
						 else if (constraints[a].fieldName == "dataVencimento" ){
							 dataVencimento = constraints[a].initialValue;
							 							 
						 }
						 
						 else if (constraints[a].fieldName == "vl_tarifa" ){
							 vl_tarifa = constraints[a].initialValue;					 
							 
						 }
						 else if (constraints[a].fieldName == "dtTarifa" ){
							 dt_tarifa = constraints[a].initialValue;
							 									
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
					            	PROCESSO : '' + 1 + '' ,
					            	SOLICITACAO : '' + codSolicitacao + '' ,
					                SOLICITANTE : '' + solicitacao.getValue(0,"solicitante") +'',
					                VALORTOTAL : '' + valorDiarias + '' ,
					                DATASOLICITACAO :'' + solicitacao.getValue(0,"datasolicitacao") +'',	
					                EMAILSOLICITANTE : '' + solicitacao.getValue(0,"emailsolicitante") +'',
					                EMAILAPROVADOR : '' + solicitacao.getValue(0,"emailGestor") +'',
					                CPF				: '' + solicitacao.getValue(0,"cpfpassageiro") +'',
					                DATAVENCIMENTO  : '' + dataVencimento + '',
					        		RATEIODIGITADO: aRateio ,
					        		VALORTARIFA: '' + vl_tarifa +'',
					        		DATATARIFA: '' + dt_tarifa +'',
					        		IDDOCUMENTO: '' + solicitacao.getValue(0,"documentid") + '',
					        		EVENTO: '' + solicitacao.getValue(0,"dataset_solicitacaoevento") + ''
					            },						            
					          options : {
					             encoding : 'UTF-8',
					             mediaType: 'application/json'
					          },
					          headers: {
					              tenantid:'01,02'
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
					            //dataset.addRow(new Array("SUCESSO"));					           
					        	dataset.addRow(new Array("SUCESSO",JSON.parse(vo.getResult()).NUMERO));	
					            
					        }
					       
					        
				    	}  catch(err) {
							dataset.addRow([err.message]);
							
				        }	 
				    	
				    
					 
					 
	    	}
	 
	 }
	
    	
	 //dataset.addRow(new Array("RETORNO VAZIO"));
 
		return dataset;
	

}

function preencheRateio(solicitacao){
	   var rateio = new Array();
	   
	   for (var i=0; i < solicitacao.rowsCount ; i++){
			var obj = {
					ccusto : '' ,
					projeto :'' ,
					atividade :'' ,
					categoria :'' ,
					fonte :'' ,
					area :'' ,
					alocacao :'' ,
					conta : '' ,
					localizacao :''
					
			};		
			
			obj.ccusto =  '' + solicitacao.getValue(i, "CENTRO_CUSTO") +'';	
			obj.atividade = '' + solicitacao.getValue(i, "ATIVIDADE") +'';	
			obj.alocacao = '' + solicitacao.getValue(i, "ALOCACAO") +'';
			obj.localizacao = '' + solicitacao.getValue(i, "LOCALIZACAO") +'';		    					
			obj.percentual = 1 * parseFloat(solicitacao.getValue(i, "PERCENTUAL")) ;
			
			if (solicitacao.getValue(i, "PROJETO") != null){
				obj.projeto = '' + solicitacao.getValue(i, "PROJETO") +'';	
			}						    				
			if (solicitacao.getValue(i, "CATEGORIA") != null){
				obj.categoria = '' + solicitacao.getValue(i, "CATEGORIA") +'';
			}		    					
			if (solicitacao.getValue(i, "FONTE") != null){
				obj.fonte = '' + solicitacao.getValue(i, "FONTE") +'';
			}	    					
			if (solicitacao.getValue(i, "AREA")  != null){
				obj.area = '' + solicitacao.getValue(i, "AREA") +'';
			}									
			if (solicitacao.getValue(i, "CONTA_CONTABIL") != null){
				obj.conta = '' + solicitacao.getValue(i, "CONTA_CONTABIL") +'';	
			}
			
			rateio[i] = obj;	
			
			//log.info("--retorno rateio--");
			//log.dir(rateio[i]);
	   }
	 			   
	   return rateio;
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
