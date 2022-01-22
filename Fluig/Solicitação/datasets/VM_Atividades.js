function defineStructure() {
	addColumn("CODIGO");
	addColumn("DESCRICAO",DatasetFieldType.TEXT);
	addColumn("CENTRO_CUSTO");
	addColumn("ALOCACAO");
	addColumn("LOCALIZACAO");
	
	setKey(["CODIGO","CENTRO_CUSTO"]);
	addIndex(["CENTRO_CUSTO"]);
}


function createDataset(fields, constraints, sortFields) {

	var dataset = DatasetBuilder.newDataset();

	dataset.addColumn("CODIGO");
	dataset.addColumn("DESCRICAO",DatasetFieldType.TEXT);
	dataset.addColumn("CENTRO_CUSTO");
	dataset.addColumn("ALOCACAO");
	dataset.addColumn("LOCALIZACAO");

	var empresa = getValue("WKCompany");
	var webservice = '/ATIVIDADESXCCUSTO';
	
	var dados;    	
	consultaServicoPrimario(webservice);

    var objdata;  
    var objdata2;
      
    if(dados != null){
    	objdata2 = JSON.parse(dados);
    	objdata = objdata2.ATIVIDADES;
			for ( var i in objdata) {
				dataset.addRow([ objdata[i].CATV, objdata[i].CDESCATV, objdata[i].CT1, objdata[i].CT9, objdata[i].CT0 ]);

			}
		}
	
	
	return dataset;

	
	function consultaServicoPrimario(webservice){
		try {
		 var clientService = fluigAPI.getAuthorizeClientService();
	     //realiza tentativa de conexão com link primario
	 	        var data = {
	 	            companyId : empresa + '',
	 	            serviceCode : 'REST FLUIG',
	 	            endpoint : webservice,
	 	            method : 'get',
	 	            timeoutService: '360' // segundos	            	  
	 	        }
	     
	 	        var vo = clientService.invoke(JSON.stringify(data));
	     
	 	        if(vo.getResult()== null || vo.getResult().isEmpty()){
	 	        	consultaServicoSecundario(webservice);
	 	        }else {
	 	        	 dados = vo.getResult();
	 	        }
		}  catch(err) {
	       	throw new Exception(err);
	    }
		
	}

	function consultaServicoSecundario(webservice){
		try {
			 var clientService = fluigAPI.getAuthorizeClientService();
		     //realiza tentativa de conexão com link secundario
		 	        var data = {
		 	            companyId : empresa + '',
		 	            serviceCode : 'REST FLUIG 2',
		 	            endpoint : webservice,
		 	            method : 'get',
		 	            timeoutService: '360' // segundos	            	  
		 	        }
		     
		 	        var vo = clientService.invoke(JSON.stringify(data));
		     
		 	        if(vo.getResult()== null || vo.getResult().isEmpty()){
		 	        	throw new Exception("Retorno está vazio");
		 	        }else {
		 	        	 dados = vo.getResult();
		 	        }
			}  catch(err) {
		       	throw new Exception(err);
		    }
	}
	      
	    
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





