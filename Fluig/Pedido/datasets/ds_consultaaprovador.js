function createDataset(fields, constraints, sortFields) {	
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("EMAIL");

	var documentId;
	var aprovador;

	for (var a=0; a<constraints.length; a++){						
		 if (constraints[a].fieldName == "documentid" ){
			 documentId = constraints[a].initialValue;
			
		 }	
		 else  if (constraints[a].fieldName == "aprovador" ){
			 		aprovador = constraints[a].initialValue;
			 
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
        					            endpoint : '/RETAPROV',
        					            method : 'POST',   
        					            timeoutService: '600',
        					            params : {
        					            	cnpj : '' + solicitacao.getValue(0,"cnpj") + '' ,
        					            	aprovador : '' + aprovador +''        					               
        					            },
        					          options : {
        					             encoding : 'UTF-8',
        					             mediaType: 'application/json'
        					          } 
        					        }
        					        	var vo = clientService.invoke(JSON.stringify(data));        		        					        
        		        					        var obj = JSON.parse(vo.getResult());
        		        					        dataset.addRow(new Array(JSON.parse(vo.getResult()).email));
        		        					       
        					    } 
        						catch(err) {
        							dataset.addRow([err.message]);
        					    }

       return dataset;
}