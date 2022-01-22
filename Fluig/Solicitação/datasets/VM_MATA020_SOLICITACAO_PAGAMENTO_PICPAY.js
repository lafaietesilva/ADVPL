function createDataset(fields, constraints, sortFields) {	
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("RETORNO");
	dataset.addColumn("CODIGO");
	

	var cpf;
	var nome;

	 
	 	//é preciso gerar um novo token - para isso é preciso atualizar o dataset de autorizacao
		var autorizacao = DatasetFactory.getDataset("VM_AutorizacaoProtheus", null, null, null);   
		var token = autorizacao.getValue(0,"access_token");   
		
	    if(constraints !== null && constraints.length){
	    	if(constraints[0].constraintType==ConstraintType.MUST) {
	    		
	    		for (var a=0; a<constraints.length; a++){
        			if (constraints[a].fieldName == "cpf"){
        				cpf = constraints[a].initialValue;
            		}  
        			if (constraints[a].fieldName == "nome"){
        				nome = constraints[a].initialValue;
            		}
        		
        		}
        	
	    	}
	    }
		
		 try{
		        var clientService = fluigAPI.getAuthorizeClientService();
		        var data = {
		            companyId : 1 + '',
		            serviceCode : 'REST FLUIG',
		            endpoint : '/api/crm/v1/customerVendor',
		            method : 'POST',// 'delete', 'patch', 'put', 'get'     
		            timeoutService: '480', // segundos
		            headers : {		 
			             Authorization: 'Bearer ' + token + '' 	 	
			          },
		            params : {
		                "address": {
		                    "number": "",
		                    "address": "RUA TUPIS 38 20 ANDAR",
		                    "zipCode": "30190901",
		                    "state": {
		                        "stateId": "MG",
		                        "stateInternalId": "MG",
		                        "stateDescription": ""
		                    },
		                    "city": {
		                        "cityCode": "00203",
		                        "cityInternalId": "00203",
		                        "cityDescription": "ABAETE"
		                    }                
		                },
		                "storeId": "01",
		                "shortName":'' + nome.toUpperCase() + '',
		                "strategicCustomerType": "F",
		                "registerSituation": "2",
		                "GovernmentalInformation": [
		                    {
		                        "scope": "CPF|CNPJ",
		                        "issueOn": "CPF|CNPJ",
		                        "id": '' + cpf + '',
		                        "name": "CPF|CNPJ",
		                        "expireOn": "CPF|CNPJ"
		                    }
		                ],
		       
		               
		                "type": 2,

		                "name": '' + nome.toUpperCase() + ''
		            },
		          options : {
		             encoding : 'UTF-8',
		             mediaType: 'application/json'
		          }
		        }


		        var vo = clientService.invoke(JSON.stringify(data));        		        					        
 					       var obj = JSON.parse(vo.getResult());
 					
 					      // log.info("RETORNO API TOTVS - CADASTRO DE FORNECEDOR 6");
 					      // log.dir(JSON.parse(vo.getResult()).errorMessage[detailedMessage]);
 					      // log.info(obj.errorMessage);
 					 
 					        
 					        if(vo.getResult()== null || vo.getResult().isEmpty()){
 					        	dataset.addRow(new Array("ERROR 1",""));
 					        }        					                					       
 					        else if((JSON.parse(vo.getResult()).errorMessage != null && JSON.parse(vo.getResult()).errorMessage != "")){				        	
 					        		dataset.addRow(new Array("ERROR 2",JSON.parse(vo.getResult()).errorMessage));
 					        	
 					        }
 					        else {
 	 					       dataset.addRow(new Array("SUCESSO",obj.code));
 	 					     
 					        }
		    } 
			catch(err) {
				dataset.addRow("ERROR",[err.message]);
		    }
    	 	
	return dataset;
}

//JSON.parse(vo.getResult()).errorMessage
//obj.errorMessage
