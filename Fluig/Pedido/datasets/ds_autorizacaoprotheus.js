function createDataset(fields, constraints, sortFields) {
   var dados;
    
   var webservice = '/api/oauth2/v1/token?grant_type=password&password=987654&username=raphael.np3';
   
	try {
   	 var clientService = fluigAPI.getAuthorizeClientService();
	        var data = {
	            companyId : getValue("WKCompany") + '',
	            serviceCode : 'REST_PROTHEUS',//codigo do serviço criado no Fluig
	            endpoint : webservice,
	            method : 'POST',// 'delete', 'patch', 'put', 'get'     
	            timeoutService: '120' // segundos	            	  	            		      	           
	        }
   
	        var vo = clientService.invoke(JSON.stringify(data));
   
	        if (vo.getResult()== null || vo.getResult().isEmpty()){
	        
	        	throw new Exception("Retorno está vazio");
	        }
   
	        else{     
	        	dados = vo.getResult();
	        	}
   
   } catch(err) {
   		throw new Exception(err);
   }
    
		
    return buildDataset(dados);

}



function buildDataset2(content) {	
    var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("access_token");
	dataset.addColumn("refresh_token");

    var json = JSON.parse(content);    

    
    dataset.addRow([json.access_token,json.refresh_token]);

    return dataset
}


function buildDataset(content) {
    var dataset = DatasetBuilder.newDataset();

    var json = JSON.parse(content);
    var columns = new Array();
    

        var keys = Object.keys(json);
        for (var k = 0; k < keys.length; k++) {
            if (columns.indexOf(keys[k]) == -1) {
                columns.push(keys[k]);
                dataset.addColumn(keys[k]);
            }
        }
  

        var row = new Array();
        for (var i = 0; i < columns.length; i++) {
            var value = json[columns[i]];
            if (typeof value == 'object') {
                row.push(JSON.stringify(value));
            } else {
                row.push(value);
            }
        }
        dataset.addRow(row);
   

    return dataset
}