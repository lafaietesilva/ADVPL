function createDataset(fields, constraints, sortFields) {
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("RETORNO");
	dataset.addColumn("NUMERO");
	 
	var contacontabil;
	var tes;
	
	 if(constraints !== null && constraints.length){
		 if(constraints[0].constraintType==ConstraintType.MUST && constraints[0].fieldName == "documentid") {
			 	var documentId = constraints[0].initialValue;
			 
			 	var c0 = DatasetFactory.createConstraint("documentid", documentId, documentId, ConstraintType.MUST);    
	    		var c1 = DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST);        		
	    		var solicitacao = DatasetFactory.getDataset("VM_SolicitacoesCadastroProdutoServico", null, new Array(c0,c1), null);
	    		
	    		var retornaProcessoSolicitacao = retornaSolicitacao(solicitacao.getValue(0,"metadata#card_index_id"),documentId,solicitacao.getValue(0,"companyid"));
        		var codSolicitacao = retornaProcessoSolicitacao.getValue(0,"workflowProcessPK.processInstanceId");
        	
        		     
        		for (var a=0; a<constraints.length; a++){
        			if (constraints[a].fieldName == "contacontabil"){
        				contacontabil = constraints[a].initialValue;
            		} 
        			else if (constraints[a].fieldName == "tes"){
        				tes = constraints[a].initialValue;
        			}
        		}
        	 
        		
        		var aProdutos = new Array();
        		
            		 try {
						//chama função que monta array de objetos dos itens do rateio
            			 aProdutos = montaListaProduto(solicitacao);
					 }
					 catch (erro){
						 dataset.addRow(["ERRO AO BUSCAR PRODUTO"]);
						 return dataset;
					 }
				  			
					 
					 
			
	
        		
        		
					 try {
						 var clientService = fluigAPI.getAuthorizeClientService();
					        var data = {
						        	companyId : 1 + '',
						        	serviceCode : 'REST FLUIG',
						            endpoint : '/F_MATA010',
						            method : 'POST',// 'delete', 'patch', 'put', 'get'     
						            timeoutService: '360', // segundos
						            params : {
						            	PRODUTO : aProdutos						            	
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
		        					            //dataset.addRow(new Array("SUCESSO"));					           
		        					        	dataset.addRow(new Array("SUCESSO",JSON.parse(vo.getResult()).PRODUTO));	
		        					        	
		        					        }
					        
				    	}  catch(err) {
				    		dataset.addRow([err.message]);
											
				        }	 
				    	
				    
					 
					 
	    	}
	 
	 }
	
		return dataset;
	

}



function montaListaProduto(solicitacao){
	   var produto = new Array();
	   
	   for (var i=0; i < solicitacao.rowsCount ; i++){
			var obj = {
					TIPO :'',
					GRUPO :'',
					DESCRICAO :'',
					ESPECIFICO :'',
					UM :'',
					TES :'',
					CONTA :'',
					VALOR :'',
					FLUIG :''
					
			};		
			var descricao = solicitacao.getValue(i, "descricao");
			var tipo = solicitacao.getValue(i, "tipoG");
			
			obj.TIPO =  '' + tipo.toUpperCase() +'';	
			obj.GRUPO = '' + solicitacao.getValue(i, "grupo") +'';	
			obj.DESCRICAO = '' + descricao.trim() +'';	    					
			obj.UM = '' + solicitacao.getValue(i, "unidade") +'';
			obj.TES = '' + solicitacao.getValue(i, "tes") +'';
			obj.CONTA = '' + solicitacao.getValue(i, "codigoCContabil") +'';
			obj.VALOR = '' +  solicitacao.getValue(i, "vl_base")+'';
			obj.FLUIG = '' + solicitacao.getValue(i, "mostrafluig") +'';        				
			
			
			produto[i] = obj;	
				
	   }
	 			   
	   return produto;
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

