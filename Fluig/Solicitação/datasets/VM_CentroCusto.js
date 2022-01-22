//existe api totvs
//https://api.totvs.com.br/apidetails/CostCenter_v1_000.json
function defineStructure() {
	addColumn("CODIGO");
	addColumn("DESCRICAO");
	addColumn("TIPO");

	
	setKey(["CODIGO"]);
	addIndex(["CODIGO"]);
}

function createDataset(fields, constraints, sortFields) {
	
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("CODIGO");
    dataset.addColumn("DESCRICAO");
    dataset.addColumn("TIPO");
         

    var dados;
    
    try {
    	 var clientService = fluigAPI.getAuthorizeClientService();
	     //BUSCA SERVIÇO CADASTRADO PARA PROVEDOR PRINCIPAL 
    	 data = {
	            companyId : getValue("WKCompany") + '',
	            serviceCode : 'REST FLUIG',
	            endpoint : '/CENTRO_CUSTO',
	            method : 'get',// 'delete', 'patch', 'put', 'get'     
	            timeoutService: '100' // segundos	            	  
	        }
    
    var vo = clientService.invoke(JSON.stringify(data));
    
    if(vo.getResult()=== null || vo.getResult().isEmpty()){
    	//BUSCA SERVIÇO CADASTRADO PARA PROVEDOR SECUNDARIO EM CASO DE FALHA NO PRIMEIRO
        data = {
	            companyId : getValue("WKCompany") + '',
	            serviceCode : 'REST FLUIG 2',
	            endpoint : '/CENTRO_CUSTO',
	            method : 'get',// 'delete', 'patch', 'put', 'get'     
	            timeoutService: '100' // segundos	            	  
	        }   	
        vo = clientService.invoke(JSON.stringify(data));
        
    }
    else if (vo.getResult()=== null || vo.getResult().isEmpty()){
    
    	throw new Exception("Retorno está vazio");
    }
    
    else{
        //log.info(vo.getResult());        
    	dados = vo.getResult();
    }
    
    } catch(err) {
    	throw new Exception(err);
    }
    
   // var filtro = getConstraints(constraints, "DESCRICAO","CODIGO");
    
    var objdata;  
    var objdata2;
      
    if(dados != null){
    	objdata2 = JSON.parse(dados);
    	objdata = objdata2.CENTROCUSTO;
    	
		for(var i in objdata){
			dataset.addRow([objdata[i].CCODIGO, objdata[i].CDESCRICAO, objdata[i].CTIPO]);			
		}
	}
    	
    return dataset;

}




function getConstraints(constraints, field, field2){
	
	if(constraints === null)
		return null;
	
	for(var i=0;i<constraints.length;i++){
		if(constraints[i].fieldName == field || constraints[i].fieldName == field2 ){		
		
							
			return constraints[i].initialValue;
		}
	}
	
	return null;
}






