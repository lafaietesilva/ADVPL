function defineStructure() {
	addColumn("FORNECEDOR");
	addColumn("CPF");
	addColumn("NOME");
	addColumn("LIMITE");
	addColumn("QUANTIDADE");
	addColumn("CODIGOTIPO");
	addColumn("TIPO");
	
	setKey(["FORNECEDOR"]);
	addIndex(["FORNECEDOR"]);
	addIndex(["CPF"]);
}

function createDataset(fields, constraints, sortFields) {
	
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("FORNECEDOR");
	dataset.addColumn("CPF");
	dataset.addColumn("NOME");
	dataset.addColumn("LIMITE");
	dataset.addColumn("QUANTIDADE");   
	dataset.addColumn("CODIGOTIPO");
    dataset.addColumn("TIPO");
         

    var dados;
    
    try {
    	 var clientService = fluigAPI.getAuthorizeClientService();
	     //BUSCA SERVIÇO CADASTRADO PARA PROVEDOR PRINCIPAL 
    	 var data = {
	            companyId : getValue("WKCompany") + '',
	            serviceCode : 'REST FLUIG',
	            endpoint : '/RESPONSAVEIS_FFX',
	            method : 'get',// 'delete', 'patch', 'put', 'get'     
	            timeoutService: '100' // segundos	            	  
	        }
    
    var vo = clientService.invoke(JSON.stringify(data));
    
    if(vo.getResult()== null || vo.getResult().isEmpty()){
    	//BUSCA SERVIÇO CADASTRADO PARA PROVEDOR SECUNDARIO EM CASO DE FALHA NO PRIMEIRO
        var data = {
	            companyId : getValue("WKCompany") + '',
	            serviceCode : 'REST FLUIG 2',
	            endpoint : '/RESPONSAVEIS_FFX',
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
    	objdata = objdata2.RESPONSAVEISFFX;
		for(var i in objdata){
			if(filtro != null && (objdata[i].CNOME.toUpperCase().indexOf(filtro.toUpperCase())  > -1 || objdata[i].CCODIGO.indexOf(filtro)  > -1)){
				dataset.addRow([objdata[i].CCODIGO, objdata[i].CCPF, objdata[i].CNOME, objdata[i].CLIMITE, objdata[i].CQTDE, objdata[i].CCODTIPO, objdata[i].CTIPO]);
			
			}
			if(filtro == null){
				dataset.addRow([objdata[i].CCODIGO, objdata[i].CCPF, objdata[i].CNOME, objdata[i].CLIMITE, objdata[i].CQTDE, objdata[i].CCODTIPO, objdata[i].CTIPO]);		
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
			log.info("--------------DATASET CONTA CONTABIL-------------");
			log.info("CAMPO: "+field);
			log.info("CONSTRAINTS: "+constraints[i]);
			log.info("INFORMACAO DIGITADA: "+constraints[i].initialValue);
							
			return constraints[i].initialValue;
		}
	}
	
	return null;
}






