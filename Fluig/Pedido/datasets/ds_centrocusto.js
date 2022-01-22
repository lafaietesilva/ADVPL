function createDataset(fields, constraints, sortFields) {
   var dados;
   
   
   var dsautorizacao = DatasetFactory.getDataset("ds_autorizacaoprotheus", null, null, null);   
   var token = dsautorizacao.getValue(0,"access_token");
     
 	try {
   	 var clientService = fluigAPI.getAuthorizeClientService();
           var data = {
	            companyId : getValue("WKCompany") + '',
	            serviceCode : 'REST_PROTHEUS',
	            endpoint : '/api/ctb/v1/CostCenters',
	            method : 'get',// 'delete', 'patch', 'put', 'get'     
	            timeoutService: '100', // segundos	            	  	            
		        headers : {		 
		             Authorization: 'Bearer ' + token + '' 	 	
		          }
	            
	        }
   
	        var vo = clientService.invoke(JSON.stringify(data));
  	        if (vo.getResult()== null || vo.getResult().isEmpty()){
	        
	        	throw new Exception("Retorno está vazio");
	        }
   
	        else{
	        		dados = vo.getResult();	
	        	
	        		/*
	        		if (vo.getHttpStatusResult() != 200){
		        		dados = vo.getResult();	
		        	}
		        	else {
		        		dados = vo.getResult();	
		        	}
		        	*/
	        	}
   
   } catch(err) {
   		throw new Exception(err);
   }
    
		
    return buildDataset(dados);

}



function buildDataset(content) {
    var dataset = DatasetBuilder.newDataset();

    var json = JSON.parse(content).items;
    var columns = new Array();
    
     for (var j = 0; j < json.length; j++) {
        var keys = Object.keys(json[j]);
        for (var k = 0; k < keys.length; k++) {
            if (columns.indexOf(keys[k]) == -1) {
                columns.push(keys[k]);
                dataset.addColumn(keys[k]);
            }
        }
    }

    for (var j = 0; j < json.length; j++) {
        var row = new Array();
        for (var i = 0; i < columns.length; i++) {
            var value = json[j][columns[i]];
            if (typeof value == 'object') {
                row.push(JSON.stringify(value));
            } else {
                row.push(value);
            }
        }
        dataset.addRow(row);
    }

    return dataset
}