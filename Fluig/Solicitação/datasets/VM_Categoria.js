//POSSUI API PADRAO
//https://api.totvs.com.br/apidetails/ClassValue_v1_000.json
function defineStructure() {
	addColumn("CODIGO");
	addColumn("DESCRICAO");
	addColumn("COD_DESC");
	
	setKey(["CODIGO"]);
	addIndex(["DESCRICAO"]);
	
}


function createDataset(fields, constraints, sortFields) {
	
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("CODIGO");
    dataset.addColumn("DESCRICAO");
    dataset.addColumn("COD_DESC");
   
    var dados;
    
   var webservice = '/CLASSE_DE_VALOR';
	
	try {
   	 var clientService = fluigAPI.getAuthorizeClientService();
   	 //realiza tentativa de conexão com link primario
	        var data = {
	            companyId : getValue("WKCompany") + '',
	            serviceCode : 'REST FLUIG',
	            endpoint : webservice,
	            method : 'get',// 'delete', 'patch', 'put', 'get'     
	            timeoutService: '100', // segundos	            	  
	            params : {
	            	
	            },
		        options : {
		             encoding : 'UTF-8',
		             mediaType: 'application/json'
		          }
	            //,headers:{}
	            
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
	        	//log.info(vo.getResult());        
	        	dados = vo.getResult();
	        	}
   
   } catch(err) {
   	throw new Exception(err);
   }
    
    

   // var filtro = getConstraints(constraints, "Descricao","Codigo");
    
    var objdata;  
    var objdata2;
      
    if(dados != null){
    	objdata2 = JSON.parse(dados);
    	objdata = objdata2.CATEGORIAS;
		for(var i in objdata){
			dataset.addRow([objdata[i].CCODIGO, objdata[i].CDESCRICAO, objdata[i].CCODIGO +"-"+objdata[i].CDESCRICAO]);
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