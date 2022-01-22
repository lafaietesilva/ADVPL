//NO PROTHEUS CORRESPONDE A CLASSE DE VALOR
function defineStructure() {
	addColumn("CONTRATO");
	addColumn("REVISAO");
	addColumn("VALOR_TOTAL");
	addColumn("SALDO");
	addColumn("DT_INICIO");
	addColumn("DT_FIM");
	addColumn("CODIGO_FORNECE");
	addColumn("CGC");
	addColumn("FORNECEDOR");
	addColumn("OBJETO");
	addColumn("ID_FLUIG");
	addColumn("FILIAL");
	addColumn("CODIGO_PGTO");
	addColumn("EMAIL_RESPONSAVEL");

	
	
	setKey(["CONTRATO"]);
	//addIndex(["CONTRATO"]);
	//addIndex(["CGC"]);
	
}


function createDataset(fields, constraints, sortFields) {
	log.info("INICIANDO ATUALIZAÇÃO DE CONTRATOS");
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("CONTRATO");
    dataset.addColumn("REVISAO");
    dataset.addColumn("VALOR_TOTAL");
    dataset.addColumn("SALDO");
    dataset.addColumn("DT_INICIO");
    dataset.addColumn("DT_FIM");
    dataset.addColumn("CODIGO_FORNECE");
    dataset.addColumn("CGC");
    dataset.addColumn("FORNECEDOR");
    dataset.addColumn("OBJETO");
    dataset.addColumn("ID_FLUIG");
    dataset.addColumn("FILIAL");
    dataset.addColumn("CODIGO_PGTO");
    dataset.addColumn("EMAIL_RESPONSAVEL");

    
    var dados;
    
   var webservice = '/VM_CONTRATOS';
	
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
   var contrato;
   //var filtro = getConstraints(constraints, "DESC_COMPETENCIA");
   
   if(dados != null){
   	contrato = JSON.parse(dados);
   //	log.info("LISTA DE CONTRATOS");
   //	log.dir(contrato);
   	objdata = contrato.CONTRATOS
   	
		for(var i in objdata){
			dataset.addRow([objdata[i].CCONTRATO, 
			                objdata[i].CREVISAO,
			                objdata[i].NVALORT,
			                objdata[i].NSALDO, 
			                objdata[i].DDTINICIO,
			                objdata[i].DDTFIM,
			                objdata[i].CCODIGOF,
			                objdata[i].CCGC,
			                objdata[i].CFORNECE,
			                objdata[i].COBJETO,
			                objdata[i].CFLUIG,
			                objdata[i].CFILCTR,
			                objdata[i].CCODPGTO,
			                objdata[i].CEMAILR
			                ]
			);
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