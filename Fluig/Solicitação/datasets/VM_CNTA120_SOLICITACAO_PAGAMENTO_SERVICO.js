function createDataset(fields, constraints, sortFields) {	
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("RETORNO");
		
//	 dataset.addRow(new Array("SUCESSO"));		
	 
//	 return dataset;
	 
	var aProdutos = new Array();
	var aRateio;
	var itens = new Array();
	var tipoViagem;
	var documentId;
	var emailcomprador;
	//default == 3
	var acao = 3;


	
    if(constraints !== null && constraints.length){
    	if(constraints[0].constraintType==ConstraintType.MUST && constraints[0].fieldName == "documentid") {
    		  		
    			var c0 = DatasetFactory.createConstraint("documentid", constraints[0].initialValue, constraints[0].initialValue, ConstraintType.MUST);	
    			var c1 = DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST);        		
        		var solicitacao = DatasetFactory.getDataset("VM_SolicitacoesPagamentoServico", null, new Array(c0,c1), null);
        	       		
        		documentId = solicitacao.getValue(0,"documentid");
                        	
        		var retornaProcessoSolicitacao = retornaSolicitacao(solicitacao.getValue(0,"metadata#card_index_id"),solicitacao.getValue(0,"documentid"),solicitacao.getValue(0,"companyid"));
        		var codSolicitacao = retornaProcessoSolicitacao.getValue(0,"workflowProcessPK.processInstanceId");
      	
        		
   			 try {
				 
				  var c1 = DatasetFactory.createConstraint("metadata#id", constraints[0].initialValue, constraints[0].initialValue, ConstraintType.MUST);    
				  var itensNota = DatasetFactory.getDataset("VM_SolicitacaoPagamentoServicoProdutos", null, new Array(c1), null);
				 // log.info("ITENS NOTA");
				//  log.dir(itensNota);
				  for (var i =0; i < itensNota.rowsCount; i++){
						aRateio = new Array();
						var temrateio = itensNota.getValue(i,"RATEIA");
						var item = itensNota.getValue(i,"ITEM");
						
						//log.info("tem rateio?");
						//log.info(temrateio);
						
						
						
						if(temrateio == "sim"){																
							var c1 = DatasetFactory.createConstraint("metadata#id", constraints[0].initialValue, constraints[0].initialValue, ConstraintType.MUST);
							var c2 = DatasetFactory.createConstraint("ITEM", item, item, ConstraintType.MUST);
				    	    var rateioItem = DatasetFactory.getDataset("VM_SolicitacoesPagamentoServicoDadosPagamento", null, new Array(c1,c2), null);    				  
				    	 
							 try {				 
								 aRateio = preencheRateio(rateioItem);
								// log.info("RATEIO PAGAMENTO");
								// log.dir(aRateio);
							 }
							 catch (erro){
								 dataset.addRow(["ERRO AO RECUPERAR RATEIO"]);
								 return dataset;
							 }
						  											 
							 if(aRateio === null || aRateio == ""){
								 dataset.addRow(new Array("NÃO FOI POSSÍVEL MONTAR AS INFORMAÇÕES DE PAGAMENTO"));
								 
							 }
						}
						else {
							aRateio = new Array();
						}
						
						//log.info("RETORNO RATEIO MEDICAO");
						//log.dir(aRateio);
						
						var obj = {
								PRODUTO : '' ,
								VALOR : '' ,
								QUANTIDADE : '' ,
								RATEIA : '' ,
								RATEIO : '' ,
								ITEM	: '' ,
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
									
						obj.PRODUTO =  '' + itensNota.getValue(i, "COD_PRODUTO") +'';	
						obj.RATEIA =  '' + itensNota.getValue(i, "RATEIA") +'';	
						obj.VALOR =  '' + itensNota.getValue(i, "VALOR_EMPENHADO") +'';	
						obj.QUANTIDADE =  '' + itensNota.getValue(i, "QUANTIDADE") +'';	
						obj.ITEM =  '' + itensNota.getValue(i, "ITEM") +'';	
						obj.RATEIO = aRateio ;
						obj.ccusto =  '' + itensNota.getValue(i, "CENTRO_CUSTO") +'';	
						obj.atividade = '' + itensNota.getValue(i, "ATIVIDADE") +'';	
						obj.alocacao = '' + itensNota.getValue(i, "ALOCACAO") +'';
						obj.localizacao = '' + itensNota.getValue(i, "LOCALIZACAO") +'';		    					
						
						
						
						if (itensNota.getValue(i, "PROJETO") != null){
							obj.projeto = '' + itensNota.getValue(i, "PROJETO") +'';	
						}						    				
						if (itensNota.getValue(i, "CATEGORIA") != null){
							obj.categoria = '' + itensNota.getValue(i, "CATEGORIA") +'';
						}		    					
						if (itensNota.getValue(i, "FONTE") != null){
							obj.fonte = '' + itensNota.getValue(i, "FONTE") +'';
						}	    					
						if (itensNota.getValue(i, "AREA")  != null){
							obj.area = '' + itensNota.getValue(i, "AREA") +'';
						}									
						if (itensNota.getValue(i, "CONTA_CONTABIL") != null){
							obj.conta = '' + itensNota.getValue(i, "CONTA_CONTABIL") +'';	
						}	

						aProdutos.push(obj);

						
					}
				 
				 
			 }
			 
			 catch (erro){
				 dataset.addRow(["ERRO AO MONTAR ITENS"]);
				 return dataset;
			 }
			         		
		 
			        							
        					 try{
        					        var clientService = fluigAPI.getAuthorizeClientService();
        					        var data = {
        					            companyId : 1 + '',
        					            serviceCode : 'REST FLUIG',
        					            endpoint : '/F_CNTA120',
        					            method : 'POST',// 'delete', 'patch', 'put', 'get'     
        					            timeoutService: '600', // segundos
        					            params : {
        					            	PROCESSO : '' + 12 + '' ,
        					            	SOLICITACAO : '' + codSolicitacao + '' ,
        					            	SOLICITANTE : '' + solicitacao.getValue(0,"solicitante") +'',
        					            	EMAILSOLICITANTE : '' + solicitacao.getValue(0,"emailsolicitante") +'', 
        					                DATASOLICITACAO :'' + solicitacao.getValue(0,"dtSolicitacao") +'',        					                
        					                CONTRATO : '' + solicitacao.getValue(0,"Numerocontrato") +'',
        					                REVISAO : '' + solicitacao.getValue(0,"revisao") +'',
        					                FILCTR : '' + solicitacao.getValue(0,"filial") +'',
        					                VENCIMENTO : '' + solicitacao.getValue(0,"dtVencimento") +'',
        					                COMPETENCIA : '' + solicitacao.getValue(0,"competencia") + "/"+ solicitacao.getValue(0,"Anocompetencia") + '',        					                
        					                ITENS: aProdutos ,
        					        		RATEIODIGITADO: '' + new Array( )+ '' ,
        					        		DOCUMENTID:''+ documentId +'',
        					        		EVENTO: '' + solicitacao.getValue(0,"dataset_solicitacaoevento") + ''
        					            },
        					          options : {
        					             encoding : 'UTF-8',
        					             mediaType: 'application/json'
        					          } ,
        					          headers: {
        					              tenantid:'01,02'
        					          }
        					        }
 
        					       log.info("INTEGRACAO MEDICAO DE CONTRATOS");
        					       log.dir(data);
        						        var vo = clientService.invoke(JSON.stringify(data));        		        					        
        		        					        var obj = JSON.parse(vo.getResult());
        		        					         					        
        		        					        if(vo.getResult()== null || vo.getResult().isEmpty()){
        		         					        	dataset.addRow(new Array("RETORNO VAZIO"));
        		        					        }        					                					       
        		        					        else if((JSON.parse(vo.getResult()).errorMessage != null && JSON.parse(vo.getResult()).errorMessage != "")){
        		        					        	dataset.addRow(new Array(JSON.parse(vo.getResult()).errorMessage));
        		        					        }
        		        					        else if (JSON.parse(vo.getResult()).CODIGO != "201"){
        		        					        	dataset.addRow(new Array(obj.MSG));
        		        					        	//log.info(obj.MSG);
        		        					        }
        		        					        else if (JSON.parse(vo.getResult()).CODIGO == "201"){	                    
        		        					            dataset.addRow(new Array("SUCESSO"));					           
        		        					            
        		        					        }
        					    } 
        						catch(err) {
        							dataset.addRow([err.message]);
        					    }

    		}
    		
    		
    }
    	 	
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
			if (solicitacao.getValue(i, "PROJETO") != null){
				obj.projeto = '' + solicitacao.getValue(i, "PROJETO") +'';	
			}		
			obj.atividade = '' + solicitacao.getValue(i, "ATIVIDADE") +'';	
			
			if (solicitacao.getValue(i, "CATEGORIA") != null){
				obj.categoria = '' + solicitacao.getValue(i, "CATEGORIA") +'';
			}		    					
			if (solicitacao.getValue(i, "FONTE") != null){
				obj.fonte = '' + solicitacao.getValue(i, "FONTE") +'';
			}	    					
			if (solicitacao.getValue(i, "AREA")  != null){
				obj.area = '' + solicitacao.getValue(i, "AREA") +'';
			}			
			obj.alocacao = '' + solicitacao.getValue(i, "ALOCACAO") +'';
			obj.conta = '' + solicitacao.getValue(i, "CONTA_CONTABIL") +'';	
			obj.localizacao = '' + solicitacao.getValue(i, "LOCALIZACAO") +'';		    					
			obj.percentual = parseFloat(solicitacao.getValue(i, "PERCENTUAL")) ;
			
		
			
			rateio[i] = obj;	
				
	   }
	 			   
	   return rateio;
}

function getConstraints(constraints, field){
	if(constraints == null)
		return null;
	
	for(var i=0;i<constraints.length;i++){
		if(constraints[i].fieldName == field){			
			return constraints[i].initialValue;
		}
	}
	
	return null;
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