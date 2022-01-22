//NO PROTHEUS CORRESPONDE A CLASSE DE VALOR
function defineStructure() {
	addColumn("GRUPO");
	addColumn("DESC_GRUPO");
	addColumn("COD_COMPETENCIA");
	addColumn("DESC_COMPETENCIA");
	addColumn("CODIGO");
	
	
	setKey(["CODIGO"]);

	
	//addIndex(["COD_COMPETENCIA"]);
	
}


function createDataset(fields, constraints, sortFields) {
	
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("GRUPO");
    dataset.addColumn("DESC_GRUPO");
    dataset.addColumn("COD_COMPETENCIA");
    dataset.addColumn("DESC_COMPETENCIA");
    dataset.addColumn("CODIGO");
    
    
    var dados;
    
   var webservice = '/VM_COMPETENCIA';
	
	try {
   	 var clientService = fluigAPI.getAuthorizeClientService();
   	 //realiza tentativa de conexão com link primario
	        var data = {
	            companyId : getValue("WKCompany") + '',
	            serviceCode : 'REST FLUIG',
	            endpoint : webservice,
	            method : 'get',   
	            timeoutService: '360'        	  
	        }
   
   var vo = clientService.invoke(JSON.stringify(data));
   
	        if(vo.getResult()== null || vo.getResult().isEmpty()){
	        	//realiza tentativa de conexão com link secundario
	            var data = {
	    	            companyId : getValue("WKCompany") + '',
	    	            serviceCode : 'REST FLUIG 2',
	    	            endpoint :  webservice,
	    	            method : 'get',    
	    	            timeoutService: '360'       	  
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
   	objdata = objdata2.COMPETENCIAS;
		for(var i in objdata){
			dataset.addRow([objdata[i].CGRUPO, objdata[i].CDESCG,objdata[i].CCOMP,objdata[i].CDESCCOMP, objdata[i].CCODIGO]);
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