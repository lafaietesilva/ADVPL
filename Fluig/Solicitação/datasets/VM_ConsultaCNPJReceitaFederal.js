function createDataset(fields, constraints, sortFields) {
	
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("SITUACAO");
    dataset.addColumn("CNPJ");
    dataset.addColumn("PORTE");
    
    var dados;
    var cnpj;
	var objdata;  
	var porte;
    
    log.info("------INICIA INTEGRAÇÃO COM RECEITA FEDERAL------")
    

	for (var a=0; a<constraints.length; a++){
		if (constraints[a].fieldName == "cgc"){
			cnpj = constraints[a].initialValue;
			
			}	
	}
    
    if (cnpj != "" && cnpj != undefined && cnpj != null){
    	  try {
  	    	 var clientService = fluigAPI.getAuthorizeClientService();
  		     //BUSCA SERVIÇO CADASTRADO PARA PROVEDOR PRINCIPAL 
  	    	 data = {
  		            companyId : getValue("WKCompany") + '',
  		            serviceCode : 'CNPJReceitaFederal',
  		            endpoint : '/'+ cnpj,
  		            method : 'get',// 'delete', 'patch', 'put', 'get'     
  		            timeoutService: '360' // segundos	            	  
  		        }
  	    
  	    var vo = clientService.invoke(JSON.stringify(data));
  	    
  	   if (vo.getResult()=== null || vo.getResult().isEmpty()){
  	    	throw new Exception("Retorno está vazio");
  	    }
  	    
  	    else{     
  	    	dados = vo.getResult();
  	    }
  	    
  	    } catch(err) {
  	    	throw new Exception(err);
  	    }
   
	    if(dados != null){    	    	
	    	objdata = JSON.parse(dados);
	    	if (objdata.porte == "MICRO EMPRESA"){
	    		porte = "ME";
	    	}
	    	else if (objdata.porte == "MICRO EMPRESA"){
	    		porte = "MEI";
	    	}
	    	else {
	    		porte ="";
	    	}
	    	
	    	dataset.addRow([objdata.situacao,objdata.cnpj,porte]);
	    	
		}
    
    }
    else {
    	log.info("--------CNPJ NÃO INFORMADO NA CONSTRAINT---------");
    }
	log.dir(dataset);
    log.info("--------FIM INTEGRAÇÃO COM RECEITA FEDERAL-----------");
    
    return dataset;

}






