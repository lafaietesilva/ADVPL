function createDataset(fields, constraints, sortFields) {
   var dados;
   var dsautorizacao = DatasetFactory.getDataset("ds_autorizacaoprotheus", null, null, null);   
   var token = dsautorizacao.getValue(0,"access_token");
   
   var webservice = '/api/framework/environment/v1/companies';
	
	try {
   	 var clientService = fluigAPI.getAuthorizeClientService();
   	 //realiza tentativa de conexão com link primario
	        var data = {
	            companyId : getValue("WKCompany") + '',
	            serviceCode : 'REST_PROTHEUS',
	            endpoint : webservice,
	            method : 'get',// 'delete', 'patch', 'put', 'get'     
	            timeoutService: '100', // segundos	            	  	            
		        headers : {		 
		             Authorization: 'Bearer ' + token + '' 	 	
		          }
	            
	        }
   
	        var vo = clientService.invoke(JSON.stringify(data));
   
	        log.info("CONSULTA API TOTVS 5");
	        log.dir(vo);
	        log.log(vo.getHttpStatusResult() );
	        
	        if (vo.getResult()== null || vo.getResult().isEmpty()){
	        
	        	throw new Exception("Retorno está vazio");
	        }
   
	        else{
	        	if (vo.getHttpStatusResult() == 401){
	        		
	        	}
	        	else {
	        		dados = vo.getResult();	
	        	}
	        	
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