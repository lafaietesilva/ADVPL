function createDataset(fields, constraints, sortFields) {
	  var dataset = DatasetBuilder.newDataset();
	    dataset.addColumn("PROCESSO");
	    dataset.addColumn("SOLICITACAO");
	    dataset.addColumn("DATA_PAGAMENTO");
	    dataset.addColumn("DOCUMENTO_ID");
	    
	    var dados;
	   // var solicitacao ='1678';
	   
	    //constraints[0].fieldName == "documentid"
	    
	   
	    
	    if(constraints!==null && constraints.length){ //se tiver constraint filtra
	        if(constraints[0].constraintType==ConstraintType.MUST && constraints[0].fieldName == "documentid") { // implementação somente para o MUST      	
	        	var documentoId = constraints[0].initialValue;
	        	
	        	//var webservice = '/PAGAMENTOS/'+codSolicitacao;	
	        	var webservice = '/PAGAMENTOS/'+documentoId;	   
	        	
	        	 try {
	            	 var clientService = fluigAPI.getAuthorizeClientService();
	            	 //realiza tentativa de conexão com link primario
	         	        var data = {
	         	            companyId : getValue("WKCompany") + '',
	         	            serviceCode : 'REST FLUIG',
	         	            endpoint : webservice,
	         	            method : 'get',// 'delete', 'patch', 'put', 'get'     
	         	            timeoutService: '100' // segundos	            	  
	         	        }
	            
	         	       var vo = clientService.invoke(JSON.stringify(data));
				        
				        if(vo.getResult()== null || vo.getResult().isEmpty()){
				        	dataset.addRow(new Array("RETORNO VAZIO"));
				        }				      				      		   
				        else{      
				        	dados = vo.getResult();
				        	}
				    } 
					catch(err) {
						dataset.addRow([err.message]);
				    }
	        	 
	        	 
	        }
	    }
	    
	    var objdata;  
	    var objdata2;
	      
	    if(dados != null){
	    	objdata2 = JSON.parse(dados);
	    	objdata = objdata2.PAGAMENTOS;
	 		for(var i in objdata){
	 			dataset.addRow([objdata[i].CPROCESSO, objdata[i].CSOLICITACAO, objdata[i].CDTBAIXA,objdata[i].CDOCUMENTOID]);
	 		}
	 	}
	 		
	     return dataset;

	 }


	 function getConstraints(constraints, field){
	 	if(constraints == null)
	 		return null;
	 	
	 	for(var i=0;i<constraints.length;i++){
	 		if(constraints[i].fieldName == field ){
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