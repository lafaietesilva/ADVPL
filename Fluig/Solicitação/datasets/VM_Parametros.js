//VERIFICAR API PADRAO DO PROTHEUS POIS JA EXISTE MAS NÃO CONSEGUI FAZER RETORNAR LISTA DE PARAMETROS
//https://api.totvs.com.br/apidetails/SystemParameter_v1_000.json



function defineStructure() {
	addColumn("FILIAL");
	addColumn("CODIGO");
	addColumn("TIPO");
	addColumn("DESCRICAO");
	addColumn("VALOR");
		
	setKey(["FILIAL","CODIGO"]);
		
}

function createDataset(fields, constraints, sortFields) {
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("FILIAL");
	dataset.addColumn("CODIGO");
	dataset.addColumn("TIPO");
	dataset.addColumn("DESCRICAO");
    dataset.addColumn("VALOR");
    
	 
    
  
    
    var dados;
    var webservice = '/VM_PARAMETROS';
    
    try {
    	 var clientService = fluigAPI.getAuthorizeClientService();
	     //BUSCA SERVIÇO CADASTRADO PARA PROVEDOR PRINCIPAL 
    	 var data = {
	            companyId : getValue("WKCompany") + '',
	            serviceCode : 'REST FLUIG',
	            endpoint : webservice,
	            method : 'get',// 'delete', 'patch', 'put', 'get'     
	            timeoutService: '100' // segundos	            	  
	        }
    
    var vo = clientService.invoke(JSON.stringify(data));
    
    if(vo.getResult()== null || vo.getResult().isEmpty()){
    	//BUSCA SERVIÇO CADASTRADO PARA PROVEDOR SECUNDARIO EM CASO DE FALHA NO PRIMEIRO
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
        //log.info(vo.getResult());        
        dados = vo.getResult();
    }
    
    } catch(err) {
    	throw new Exception(err);
    }
    
     var objdata;
     
        if(dados != null){
    		objdata = JSON.parse(dados);
			for(var i in objdata){
				var valor = objdata[i].CVALOR;
				
				dataset.addRow([objdata[i].CFIL, objdata[i].CCODIGO, objdata[i].CTIPO, objdata[i].CDESC, valor.trim()]);			
		}
	}
	
	/*
	 * 
    var tempDataset = getDefaultValues();  
	 
    for(var a=0;a<   tempDataset.length;a++){
        dataset.addRow(new Array(tempDataset[a]["CODIGO"], tempDataset[a]["VALOR"]));
    }
    */
    
   return dataset;
	 
}

function getDefaultValues(){ // retorna valores default para serem filtrados
    return  [{
                CODIGO: "VM_PRVIAGN",                
                VALOR: "8"
            },
            {
            	CODIGO: "VM_PRVIAGI",               
            	VALOR: "15"
            }]
            
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
