function defineStructure() {
	addColumn("FILIAL");
	addColumn("MATRICULA");
	addColumn("FUNCIONARIO");
	addColumn("CPF_F");
	addColumn("CODIGO");
	addColumn("NOME_DEP");
	addColumn("DTNASC");
	addColumn("GENERO");

	
	setKey(["FILIAL","MATRICULA","CODIGO"]);
	//addIndex(["FILIAL","MATRICULA"]);
	//addIndex(["CPF"]);
}


function createDataset(fields, constraints, sortFields) {
	
	//retorna lista de funcionários
	
	var dataset = DatasetBuilder.newDataset();
    dataset.addColumn("FILIAL");
	dataset.addColumn("MATRICULA");
    dataset.addColumn("FUNCIONARIO");
    dataset.addColumn("CPF_F");
    dataset.addColumn("CODIGO");
    dataset.addColumn("NOME_DEP");
    dataset.addColumn("DTNASC");
    dataset.addColumn("GENERO");
   
           
    var dados;
    var webservice = '/DEPENDENTES';
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
       // log.info(vo.getResult());        
        dados = vo.getResult();
    }
    
    } catch(err) {
    	throw new Exception(err);
    }
    
    var objdata;  
    var objdata2;
      
    if(dados != null){
    	objdata2 = JSON.parse(dados);
    	objdata = objdata2.DEPENDENTES;
		for(var i in objdata){
				dataset.addRow([objdata[i].CFIL, objdata[i].CMATR, objdata[i].CNOMEF, objdata[i].CCPF, objdata[i].CCODIGO, objdata[i].CNOMEDEP, objdata[i].CDATANASC,objdata[i].CGENERO]);
			
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





