function createDataset(fields, constraints, sortFields) {	
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("RETORNO");
	dataset.addColumn("CODIGO");
	

	var cpf;
	var nome;
	var razaosocial;
	var nomeFantasia;
	var banco;
	var agencia;
	var contabancaria;
	var digitoAgencia ="";
	var digitoConta;
	var modalidade;
	var tipoconta;
	
	    if(constraints !== null && constraints.length){
	    	if(constraints[0].constraintType==ConstraintType.MUST) {
	    		
	    		for (var a=0; a<constraints.length; a++){
        			if (constraints[a].fieldName == "cpf"){
        				cpf = constraints[a].initialValue;
            		}  
        			if (constraints[a].fieldName == "nome"){
        				nome = constraints[a].initialValue;
        				nome = nome.trim();
        				razaosocial = nome.toUpperCase();
        				var separacaoNome = razaosocial.split(" ");
        				var tamanho = separacaoNome.length;
        				var nreduz = separacaoNome[0] + " " + separacaoNome[tamanho-1];
        				nomeFantasia = nreduz.substring(0, 20);
        			
            		}
        			if (constraints[a].fieldName == "modalidade"){
        				modalidade = constraints[a].initialValue;
            		}
        			if (constraints[a].fieldName == "banco"){
        				banco = constraints[a].initialValue;
        					
            		} 
        			if (banco != null && banco != undefined && banco != ""){
        			 
            			if (constraints[a].fieldName == "agencia"){
            				agencia = constraints[a].initialValue;
              				if (agencia != "" && agencia != undefined && agencia != null){
                				if(banco.trim() =="001" || banco.trim() =="237"){
                					var numeroagencia = agencia.split("-");
                    				agencia = numeroagencia[0];
                					digitoAgencia = numeroagencia[1];
                				}
            				}
            		
            			
                		} 
            			if (constraints[a].fieldName == "contabancaria"){
            				contabancaria = constraints[a].initialValue;
            				if (contabancaria != "" && contabancaria != undefined && contabancaria != null){
             					var numeroconta = contabancaria.split("-");
            					contabancaria = numeroconta[0];
            					digitoConta = numeroconta[1];
            				
            				
            				}
            				

            				
                		}
            			
            			if (constraints[a].fieldName == "tipoconta"){
            				tipoconta = constraints[a].initialValue;
            				var tipo = tipoconta.split("-");
            				tipoconta = tipo[0];
            					
                		}
            			
            			
        			}
        			 
        			 
        		
        		}
        	
	    	}
	    }
		
		 try{
			// log.info("ENTROU NA INTEGRAÇÃO 0");
		        var clientService = fluigAPI.getAuthorizeClientService();
		       // log.info(banco);
		        
		        if (modalidade =="picpay" || modalidade =="ordem_pagamento"){
		        	//log.info("ENTROU NA INTEGRAÇÃO 1");
		        	  var data = {
			  		            companyId : 1 + '',
			  		            serviceCode : 'REST FLUIG',
			  		            endpoint : '/api/crm/v1/customerVendor',
			  		            method : 'POST',// 'delete', 'patch', 'put', 'get'     
			  		            timeoutService: '480',
			  		            params : {
			  		                "address": {
			  		                    "number": "",
			  		                    "address": "RUA DO FOGO, N 22",
			  		                    "zipCode": "50010340",
			  		                    "state": {
			  		                        "stateId": "PE",
			  		                        "stateInternalId": "PE",
			  		                        "stateDescription": ""
			  		                    },
			  		                    "city": {
			  		                        "cityCode": "11606",
			  		                        "cityInternalId": "11606",
			  		                        "cityDescription": "RECIFE"
			  		                    }                
			  		                },
			  		                "storeId": "01",
			  		                "shortName":'' + nomeFantasia + '',
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
			  		                "name": '' + razaosocial + ''
			  		            },
			  		          options : {
			  		             encoding : 'UTF-8',
			  		             mediaType: 'application/json'
			  		          }
		  		        }
		        }
		        else if (modalidade =="transferencia"){
		        	//log.info("entrou aqui 2");
		        	  var data = {
		  		            companyId : 1 + '',
		  		            serviceCode : 'REST FLUIG',
		  		            endpoint : '/api/crm/v1/customerVendor',
		  		            method : 'POST',// 'delete', 'patch', 'put', 'get'     
		  		            timeoutService: '480',
		  		            params : {
		  		                "address": {
		  		                    "number": "",
		  		                    "address": "RUA DO FOGO, N 22",
		  		                    "zipCode": "50010340",
		  		                    "state": {
		  		                        "stateId": "PE",
		  		                        "stateInternalId": "PE",
		  		                        "stateDescription": ""
		  		                    },
		  		                    "city": {
		  		                        "cityCode": "11606",
		  		                        "cityInternalId": "11606",
		  		                        "cityDescription": "RECIFE"
		  		                    }                
		  		                },
		  		                "listOfBankingInformation": [
		  		                                             {
		  		                                                 "checkingAccountNumber": '' +contabancaria+ '',
		  		                                                 "currencyAccount": 1,
		  		                                                 "bankCode": '' +banco.trim()+ '',
		  		                                                 "branchCode": '' +agencia.trim()+ '',
		  		                                                 "checkingAccountType": ''+tipoconta+'',
		  		                                                 "branchKey": '' +digitoAgencia+ '',
		  		                                                 "bankInternalId": "",
		  		                                                 "bankName": "",
		  		                                                 "mainAccount": "1",
		  		                                                 "checkingAccountNumberKey": '' +digitoConta+ ''
		  		                                             }
		  		                                         ],
		  		                "storeId": "01",
		  		                "shortName":'' + nomeFantasia + '',
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

		  		                "name": '' + razaosocial + ''
		  		            },
		  		          options : {
		  		             encoding : 'UTF-8',
		  		             mediaType: 'application/json'
		  		          }
		  		        }
		        }
		      
		      
		        

		       //log.info("INTEGRAÇÃO FINAL FORNECEDOR 1");
		      // log.dir(data);
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

function remover_acentos_espaco(str) {
    return str.normalize("NFD").replace(/[^a-zA-Zs]/g, "");
}
