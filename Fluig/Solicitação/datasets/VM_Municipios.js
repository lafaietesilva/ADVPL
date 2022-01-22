//NO PROTHEUS CORRESPONDE A CLASSE DE VALOR
function defineStructure() {
	addColumn("CODIGO");
	addColumn("ESTADO");
	addColumn("MUNICIPIO");
	
	setKey(["CODIGO"]);

	
}


function createDataset(fields, constraints, sortFields) {
	
	var dataset = DatasetBuilder.newDataset();
    dataset.addColumn("CODIGO");
    dataset.addColumn("ESTADO");
	dataset.addColumn("MUNICIPIO");
   
    var dados;
    
   var webservice = '/VM_MUNICIPIOS';
	
	try {
   	 var clientService = fluigAPI.getAuthorizeClientService();
   	 //realiza tentativa de conexão com link primario
	        var data = {
	            companyId : getValue("WKCompany") + '',
	            serviceCode : 'REST FLUIG',
	            endpoint : webservice,
	            method : 'GET',// 'delete', 'patch', 'put', 'get'     
	            timeoutService: '100' // segundos	            	  
	        }
   
	        var vo = clientService.invoke(JSON.stringify(data));
   
	        if (vo.getResult()== null || vo.getResult().isEmpty()){
		        
	        	throw new Exception("Retorno está vazio");
	        }
   
	        else{
	        	//log.info("DATASET MUNICIPIOS");
	        	//log.info(vo.getResult());        
	        	dados = vo.getResult();
	        	}
   
   } catch(err) {
   	throw new Exception(err);
   }
    
    
   var objdata;  
   var objdata2;
         
    if(dados != null){
    	objdata2 = JSON.parse(dados);
    	objdata = objdata2.MUNICIPIOS;
    	//log.info("RESULTADO objdata");
    	//log.dir(objdata);
		for(var i in objdata){
			dataset.addRow([objdata[i].CCOD, objdata[i].CUF, objdata[i].CMUN]);
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