/*
 * APONTAR WEBSERVICE DO PROTHEUS PARA TABELA CV0 QUE POSSUI OS CODIGOS DE ENTIDADES DE PROJETO
 * 
 */

function defineStructure() {
	addColumn("CODIGO");
	addColumn("DESCRICAO");
	addColumn("PRJ_ESPECIAL");
	
	setKey(["CODIGO"]);
	addIndex(["CODIGO"]);
}

function createDataset(fields, constraints, sortFields) {
	
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("CODIGO");
    dataset.addColumn("DESCRICAO");
    dataset.addColumn("PRJ_ESPECIAL");
    
   // var filtro = getConstraints(constraints, "Codigo");

    var dados;
    
    var webservice = '/PROJETO';
 	
 	try {
    	 var clientService = fluigAPI.getAuthorizeClientService();
    	 //realiza tentativa de conexão com link primario
 	        var data = {
 	            companyId : getValue("WKCompany") + '',
 	            serviceCode : 'REST FLUIG',
 	            endpoint : webservice,
 	            method : 'get',// 'delete', 'patch', 'put', 'get'     
 	            timeoutService: '100' // segundos	            	  
 	        }
    
    var vo = clientService.invoke(JSON.stringify(data));
    
 	        if(vo.getResult()== null || vo.getResult().isEmpty()){
 	        	//realiza tentativa de conexão com link secundario
 	            var data = {
 	    	            companyId : getValue("WKCompany") + '',
 	    	            serviceCode : 'REST FLUIG 2',
 	    	            endpoint :  webservice,
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
    	objdata = objdata2.PROJETOS;
		for(var i in objdata){
			dataset.addRow([objdata[i].CCODIGO, objdata[i].CDESCRICAO, objdata[i].CESPECIAL]);
		}
	}
		
    return dataset;

}

function getConstraints(constraints, field){
	if(constraints == null)
		return null;
	
	for(var i=0;i<constraints.length;i++){
		if(constraints[i].fieldName == field ){
			return constraints[i].initialValue;
		}
	}
	
	return null;
}