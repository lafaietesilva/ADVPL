function defineStructure() {
	addColumn("CPF");
	addColumn("EMAIL");
	addColumn("DATA_INICIO");
	addColumn("DATA_FIM");
	addColumn("STATUS");
	
	
	
	setKey(["CPF"]);
	
}

function createDataset(fields, constraints, sortFields) {
	
	var dataset = DatasetBuilder.newDataset();
	 dataset.addColumn("CPF");
	 dataset.addColumn("EMAIL");
	 dataset.addColumn("DATA_INICIO");
	 dataset.addColumn("DATA_FIM");
	 dataset.addColumn("STATUS");

	 
    var dados;
    var webservice = '/AFASTADOS';
     
    
    try {
    	 var clientService = fluigAPI.getAuthorizeClientService();
	        var data = {
	            companyId : getValue("WKCompany") + '',
	            serviceCode : 'REST FLUIG',
	            endpoint : webservice,
	            method : 'get',// 'delete', 'patch', 'put', 'get'     
	            timeoutService: '100' // segundos	      
	          
	            	/*,headers : {		 
		             Authorization: 'Bearer eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJUT1RWUy1BRFZQTC1GV0pXVCIsInN1YiI6IkFkbWluaXN0cmFkb3IiLCJpYXQiOjE1ODY4MzIwNjcsInVzZXJpZCI6IjAwMDAwMCIsImV4cCI6MTU4NjgzNTY2NywiZW52SWQiOiJEQURPU0FEVlRFU1RFIn0.nmY/dSEpOeoJlObhgx/PPdGrQ6vwVs/wijCCV9rJpRQtZoPeo2v9bwPkwnHKJYy3MKlXZ7Wif/a03VzxwGhAUnR1ngIzs5nx5bocsAjnkKbDBID2WUTtOuIejCh3GbsCunGH9bQRKCn5orP74ycd0Ijjs39YFBmD80mjMaAaOAi24orfCHr0IN7YbksYTBRFQ33qwl5j4GijcdNVqISfZsH1TK1Yq9b2aOAJqYZEqSgj51J6I71TRD1rImJpZAVy1Tbl5pjqptJTd53OsKbM/BxtD8JhA/S923mupgqNuKTraRfo7hJ6X3F0S5JQEYW9xdkDqZiHJoHdNl0OihzNRg=='
		          }
	            	*/
	        }
    
    var vo = clientService.invoke(JSON.stringify(data));
    
	        if(vo.getResult()== null || vo.getResult().isEmpty()){
	        	
	            var data = {
	    	            companyId : getValue("WKCompany") + '',
	    	            serviceCode : 'REST FLUIG ',
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
    var objafastado;
    //var filtro = getConstraints(constraints, "DESC_COMPETENCIA");
    
    if(dados != null){
    	objafastado = JSON.parse(dados);
    	objdata = objafastado.AFASTADOS;
		for(var i in objdata){
			dataset.addRow([objdata[i].CCPF, objdata[i].CEMAILF, objdata[i].CDATAI, objdata[i].CDATAF, objdata[i].CSTATUS]);					
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





