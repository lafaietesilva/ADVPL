/*
 * APONTAR WEBSERVICE DO PROTHEUS PARA TABELA CV0 QUE POSSUI OS CODIGOS DE ENTIDADES DA AREA ESTRATEGICA
 * 
 */

function defineStructure() {
	addColumn("CODIGO");
	addColumn("DESCRICAO");
	addColumn("PROJETO");
	
	setKey(["CODIGO","PROJETO"]);
	addIndex(["PROJETO"]);
}


function createDataset(fields, constraints, sortFields) {
	
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("CODIGO");
    dataset.addColumn("DESCRICAO");
    dataset.addColumn("PROJETO");
    
    var dados;
    

    	var webservice = '/AREA_ESTRATEGICA';
    	
    	consultaServicoPrimario(webservice);
        
        var objdata;  
        var objdata2;
          
        if(dados != null){
        	objdata2 = JSON.parse(dados);
        	objdata = objdata2.AREASPROJETOS;
        	
    		for(var i in objdata){
    			if (objdata[i].CCODIGO.substring(0,1) =='S' ){
    				dataset.addRow([objdata[i].CCODIGO, objdata[i].CDESCRICAO, objdata[i].CPROJETO]);	
    			}
    			    			    			
    		}
    	}
         
    return dataset;

    function consultaServicoPrimario(webservice){
    	try {
    	 var clientService = fluigAPI.getAuthorizeClientService();
         //realiza tentativa de conexão com link primario
     	        var data = {
     	            companyId : getValue("WKCompany") + '',
     	            serviceCode : 'REST FLUIG',
     	            endpoint : webservice,
     	            method : 'get',
     	            timeoutService: '100' // segundos	            	  
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
    	 	            companyId : getValue("WKCompany") + '',
    	 	            serviceCode : 'REST FLUIG 2',
    	 	            endpoint : webservice,
    	 	            method : 'get',
    	 	            timeoutService: '100' // segundos	            	  
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


