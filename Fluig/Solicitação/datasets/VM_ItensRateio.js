function defineStructure() {
	addColumn("SEQUENCIAL");
	addColumn("LOCALIZACAO");
	addColumn("CENTROCUSTO");
	addColumn("CATEGORIA");
	addColumn("FONTE");
	addColumn("ATIVIDADE");
	addColumn("AREA");
	addColumn("PROJETO");
	addColumn("ALOCACAO");
	addColumn("CONTA");
	addColumn("RATEIO");
	addColumn("PERCENTUAL",DatasetFieldType.NUMBER );
	
	
	setKey(["RATEIO"]);
	addIndex(["RATEIO"]);
}

function onSync(lastSyncDate) {
	//VERIFICAR COMO IMPLEMENTAR JORNALIZAÇÃO POIS A TABELA DE RATEIO É GRANDE
}

function createDataset(fields, constraints, sortFields) {
	
	
	
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("SEQUENCIAL");
	dataset.addColumn("LOCALIZACAO");
	dataset.addColumn("CENTROCUSTO");
	dataset.addColumn("CATEGORIA");
	dataset.addColumn("FONTE");
	dataset.addColumn("ATIVIDADE");	
    dataset.addColumn("AREA");
    dataset.addColumn("PROJETO");
    dataset.addColumn("ALOCACAO");
    dataset.addColumn("CONTA");
    dataset.addColumn("RATEIO");
    dataset.addColumn("PERCENTUAL",DatasetFieldType.NUMBER );

    
       	
    	try {
       	 var clientService = fluigAPI.getAuthorizeClientService();
   	        var data = {
   	            companyId : getValue("WKCompany") + '',
   	            serviceCode : 'REST FLUIG',
   	            endpoint : '/ITENSRATEIO',
   	            method : 'get',// 'delete', 'patch', 'put', 'get'     
   	            timeoutService: '100' // segundos	            	  
   	        }
       
       var vo = clientService.invoke(JSON.stringify(data));
       
   	        if(vo.getResult()=== null || vo.getResult().isEmpty()){
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
       	objdata = objdata2.ITENSRATEIO;
           		for(var i in objdata){
          
           			dataset.addRow([objdata[i].CSEQ, objdata[i].CT0, objdata[i].CT1, objdata[i].CT2, objdata[i].CT4, objdata[i].CT6, objdata[i].CT7, objdata[i].CT8, objdata[i].CT9, objdata[i].CCONTA, objdata[i].CRATEIO, objdata[i].CPERCENT]);
           			
        		}
          
           	
    	
    	}
    		
   
    
      
    return dataset;

}

function getConstraints(constraints, field){
	if(constraints === null)
		return null;
	
	for(var i=0;i<constraints.length;i++){
		if(constraints[i].fieldName == field){
			return constraints[i].initialValue;
		}
	}
	
	return null;
}