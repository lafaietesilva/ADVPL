function defineStructure() {
	addColumn("CODIGO");
	addColumn("DESCRICAO");
	//addColumn("BANCO");
	//addColumn("AGENCIA");
	//addColumn("CONTA_BANCO");
	//addColumn("DEBITO");
	//addColumn("CREDITO");

	setKey(["CODIGO"]);
	
}


function createDataset(fields, constraints, sortFields) {
	var dataset = DatasetBuilder.newDataset();
    dataset.addColumn("CODIGO");
	dataset.addColumn("DESCRICAO");
	//dataset.addColumn("BANCO");
	//dataset.addColumn("AGENCIA");
	//dataset.addColumn("CONTA_BANCO");
	//dataset.addColumn("DEBITO");
	//dataset.addColumn("CREDITO");
	
	
	    var dados;
	    
	    try {
	    	 var clientService = fluigAPI.getAuthorizeClientService();
		     //BUSCA SERVIÇO CADASTRADO PARA PROVEDOR PRINCIPAL 
	    	 var data = {
		            companyId : getValue("WKCompany") + '',
		            serviceCode : 'REST FLUIG',
		            endpoint : '/VM_NATUREZA',
		            method : 'get',// 'delete', 'patch', 'put', 'get'     
		            timeoutService: '100' // segundos	            	  
		        }
	    
	    var vo = clientService.invoke(JSON.stringify(data));
	    
	    if(vo.getResult()== null || vo.getResult().isEmpty()){
	    	//BUSCA SERVIÇO CADASTRADO PARA PROVEDOR SECUNDARIO EM CASO DE FALHA NO PRIMEIRO
	        var data = {
		            companyId : getValue("WKCompany") + '',
		            serviceCode : 'REST FLUIG 2',
		            endpoint : '/VM_NATUREZA',
		            method : 'get',// 'delete', 'patch', 'put', 'get'     
		            timeoutService: '100' // segundos	            	  
		        }   	
	        vo = clientService.invoke(JSON.stringify(data));
	        
	    }
	    else if (vo.getResult()== null || vo.getResult().isEmpty()){
	    
	    	throw new Exception("Retorno está vazio");
	    }
	    
	    else{
	        //log.info(vo.getResult());        
	    	dados = vo.getResult();
	    }
	    
	    } catch(err) {
	    	throw new Exception(err);
	    }
	    
	    var filtro = getConstraints(constraints, "DESCRICAO","CODIGO");
	    
	    var objdata;  
	    var objdata2;
	      
	    if(dados != null){
	    	objdata2 = JSON.parse(dados);
	    	objdata = objdata2.NATUREZAS;
			for(var i in objdata){
				if(filtro != null && (objdata[i].CDESCR.toUpperCase().indexOf(filtro.toUpperCase())  > -1 || objdata[i].CCODIGO.indexOf(filtro)  > -1)){
					//dataset.addRow([objdata[i].CCODIGO, objdata[i].CDESCR, objdata[i].cBanco, objdata[i].cAgencia, objdata[i].cConta, objdata[i].cDebito, objdata[i].cCredito]);	
					dataset.addRow([objdata[i].CCODIGO, objdata[i].CDESCR]);
				
				}
				if(filtro == null){
					//dataset.addRow([objdata[i].CCODIGO, objdata[i].CDESCR, objdata[i].cBanco, objdata[i].cAgencia, objdata[i].cConta, objdata[i].cDebito, objdata[i].cCredito]);
					dataset.addRow([objdata[i].CCODIGO, objdata[i].CDESCR]);
				}		
			}
		}
	    	
	    return dataset;

	
}


function getConstraints(constraints, field, field2){
	
	if(constraints == null)
		return null;
	
	for(var i=0;i<constraints.length;i++){
		if(constraints[i].fieldName == field || constraints[i].fieldName == field2 ){		
							
			return constraints[i].initialValue;
		}
	}
	
	return null;
}

