function createDataset(fields, constraints, sortFields) {
	
	//retorna lista de funcionários
	
	var dataset = DatasetBuilder.newDataset();
    dataset.addColumn("QUANTIDADE");
	dataset.addColumn("CPF");
    dataset.addColumn("NOME");
 
           
    var dados;
    var webservice = '/PENDENCIA_ADTO';
   // var emailFuncionario = null;
    
    //var emailFuncionario =  getConstraints(constraints, 'CEMAILFUN');
    
    
    
    
    
    try {
    	 var clientService = fluigAPI.getAuthorizeClientService();
	        var data = {
	            companyId : getValue("WKCompany") + '',
	            serviceCode : 'REST FLUIG',
	            endpoint : webservice,
	            method : 'get',// 'delete', 'patch', 'put', 'get'     
	            timeoutService: '100' // segundos	            	  
	        }
    
    var vo = clientService.invoke(JSON.stringify(data));
    
	        if(vo.getResult()== null || vo.getResult().isEmpty()){
	        	
	            var data = {
	    	            companyId : getValue("WKCompany") + '',
	    	            serviceCode : 'REST FLUIG 2',
	    	            endpoint : webservice,
	    	            method : 'get',// 'delete', 'patch', 'put', 'get'     
	    	            timeoutService: '100' // segundos	            	  
	    	        }   	
	            vo = clientService.invoke(JSON.stringify(data));
	            
	        }
	        else if (vo.getResult()== null || vo.getResult().isEmpty()){
	        
	        	throw new Exception("Retorno está vazio");
	        }
    
    else{
//        log.info(vo.getResult());        
        dados = vo.getResult();
    }
    
    } catch(err) {
    	throw new Exception(err);
    }
    
    var objdata;  
    var objdata2;
      
    if(dados != null){
    	objdata2 = JSON.parse(dados);
    	objdata = objdata2.PENDENCIASADIANTAMENTO;
		for(var i in objdata){										
				dataset.addRow([objdata[i].CQTDE, objdata[i].CCPF, objdata[i].CNOME]);
			}
	}
		
    return dataset;


    
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





