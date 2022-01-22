function defineStructure() {
	addColumn("CODIGO");
	addColumn("DESCRICAO");
	addColumn("PRODUTO");
	addColumn("UNIDADE_MEDIDA");
	addColumn("ULTIMA_COMPRA");
	addColumn("TERMO_REFERENCIA");
	addColumn("FLUIG");
	addColumn("GERA_SC");
	addColumn("ULTIMO_VALOR");
	addColumn("PRAZO_FORNECEDOR");
	addColumn("BLOQUEADO");
	
	setKey(["CODIGO"]);
	addIndex(["CODIGO"]);
}

function createDataset(fields, constraints, sortFields) {
	log.info("ATUALIZAÇÃO DATASET VM_Produtos 1");
	var dataset = DatasetBuilder.newDataset();
	 dataset.addColumn("CODIGO");
	 dataset.addColumn("DESCRICAO");
	 dataset.addColumn("PRODUTO");
	 dataset.addColumn("UNIDADE_MEDIDA");
	 dataset.addColumn("ULTIMA_COMPRA");
	 dataset.addColumn("TERMO_REFERENCIA");
	 dataset.addColumn("FLUIG");
	 dataset.addColumn("GERA_SC");
	 dataset.addColumn("ULTIMO_VALOR");
	 dataset.addColumn("PRAZO_FORNECEDOR");
	 dataset.addColumn("BLOQUEADO");
	 
    var dados;
    var webservice = '/PRODUTO';
     
    
    try {
    	 var clientService = fluigAPI.getAuthorizeClientService();
	        var data = {
	            companyId : getValue("WKCompany") + '',
	            serviceCode : 'REST FLUIG',
	            endpoint : webservice,
	            method : 'get',// 'delete', 'patch', 'put', 'get'     
	            timeoutService: '360' // segundos	            	  
	        }
    
    var vo = clientService.invoke(JSON.stringify(data));
    
	        if(vo.getResult()== null || vo.getResult().isEmpty()){
	        	
	            var data = {
	    	            companyId : getValue("WKCompany") + '',
	    	            serviceCode : 'REST FLUIG ',
	    	            endpoint : webservice,
	    	            method : 'get',// 'delete', 'patch', 'put', 'get'     
	    	            timeoutService: '360' // segundos	            	  
	    	        }   	
	            vo = clientService.invoke(JSON.stringify(data));
	            
	        }
	        else if (vo.getResult()== null || vo.getResult().isEmpty()){
	        
	        	throw new Exception("Retorno está vazio");
	        }
    
    else{       
        dados = vo.getResult();
    }
    
    } catch(err) {
    	throw new Exception(err);
    }
    
   
    var objdata;  
    var objdata2;
      
    if(dados != null){
    	objdata2 = JSON.parse(dados);
    	objdata = objdata2.PRODUTOS;
		for(var i in objdata){
			var bloqueado;
			if (objdata[i].CBLOQUEADO != 1){
				bloqueado = "2";
			}
			else {
				bloqueado = objdata[i].CBLOQUEADO
			}
			
			dataset.addRow([objdata[i].CCODIGO, objdata[i].CDESCRICAO, objdata[i].CPRODUTO, objdata[i].CUNIDADE, objdata[i].CULTIMAC,objdata[i].CTERMOREF, objdata[i].CFLUIG, objdata[i].CGERASC, objdata[i].NULTIMOV,objdata[i].NPRAZOFOR,bloqueado]);	
							
		}
	}
		
    return dataset;

}



function getConstraints(constraints, field){
	
	if(constraints == null)
		return null;
	
	for(var i=0;i<constraints.length;i++){
		if(constraints[i].fieldName == field  ){		
			return constraints[i].initialValue;
		}
	}
	
	return null;
}



