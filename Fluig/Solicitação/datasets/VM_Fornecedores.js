function defineStructure() {
	addColumn("CODIGO");
	addColumn("CNPJ");
	addColumn("RAZAO_SOCIAL");
	addColumn("TIPO");
	addColumn("QTDE");
	
	addColumn("FANTASIA");
	addColumn("FORM_PGTO");
	addColumn("BANCO");
	addColumn("AGENCIA");
	addColumn("CONTA_F");
	addColumn("TIPO_CONTA");
	addColumn("TIPO_PJ");
	
	setKey(["CODIGO"]);
	//addIndex(["CNPJ"]);
	
}


function createDataset(fields, constraints, sortFields) {
	var dataset = DatasetBuilder.newDataset();
    dataset.addColumn("CODIGO");
	dataset.addColumn("CNPJ");
	dataset.addColumn("RAZAO_SOCIAL");
	dataset.addColumn("TIPO");
	dataset.addColumn("QTDE");
	dataset.addColumn("FANTASIA");
	dataset.addColumn("FORM_PGTO");
	dataset.addColumn("BANCO");
	dataset.addColumn("AGENCIA");
	dataset.addColumn("CONTA_F");
	dataset.addColumn("TIPO_CONTA");
	dataset.addColumn("TIPO_PJ");
	

	    var dados;
	    var webservice = '/VM_FORNECEDOR';
	    var token;
	    
	    //é preciso gerar um novo token - para isso é preciso atualizar o dataset de autorizacao
		//var autorizacao = DatasetFactory.getDataset("VM_AutorizacaoProtheus", null, null, null);   
		
		//token = autorizacao.getValue(0,"access_token");
		
	  //  log.info("ATUALIZACAO DE FORNECEDOR");
	   // log.dir(constraints);
	    
	    
		 if(constraints != null && constraints != undefined ){
			 if(constraints[0].constraintType==ConstraintType.MUST && constraints[0].fieldName == "CNPJ") {
			
				 //log.info(constraints[0].initialValue);
				 webservice = webservice + '/' + constraints[0].initialValue;
			 }
		 }
		
		
	    try {
	    	 var clientService = fluigAPI.getAuthorizeClientService();
		     //BUSCA SERVIÇO CADASTRADO PARA PROVEDOR PRINCIPAL 
	    	/*
	    	 var data = {
		            companyId : 1 + '',
		            serviceCode : 'REST FLUIG',
		            endpoint : webservice ,
		            method : 'GET',
		            timeoutService: '360',
		            headers : {		 
			             Authorization: 'Bearer ' + token + '' 	 	
			          }
		           
	    	 	}
	    	 */
	    	 
	    	 var data = {
			            companyId : 1 + '',
			            serviceCode : 'REST FLUIG',
			            endpoint : webservice ,
			            method : 'GET',
			            timeoutService: '360'
			           
		    	 	}
	    
	    var vo = clientService.invoke(JSON.stringify(data));
	    
	    if(vo.getResult()== null || vo.getResult().isEmpty()){
	    	//BUSCA SERVIÇO CADASTRADO PARA PROVEDOR SECUNDARIO EM CASO DE FALHA NO PRIMEIRO
	        var data = {
		            companyId : getValue("WKCompany") + '',
		            serviceCode : 'REST FLUIG 2',
		            endpoint : webservice ,
		            method : 'get',   
		            timeoutService: '360'
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
	    
	    var filtro = getConstraints(constraints, "RAZAO_SOCIAL","CODIGO");
	    
	    var objdata;  
	    var objdata2;
	      
	    if(dados != null){
	    	objdata2 = JSON.parse(dados);
	    	objdata = objdata2.FORNECEDORES;
			for(var i in objdata){
				if(filtro != null && (objdata[i].CNOME.toUpperCase().indexOf(filtro.toUpperCase())  > -1 || objdata[i].CCODIGO.indexOf(filtro)  > -1)){
					dataset.addRow([objdata[i].CCODIGO, objdata[i].CCGC, objdata[i].CNOME, objdata[i].CTIPO,objdata[i].NQTDE_ADF,objdata[i].CREDUZ,objdata[i].CFPGTO,objdata[i].CBANCO,objdata[i].CAGENCIA,objdata[i].CCONTAF,objdata[i].CTIPOC,objdata[i].CTIPOPJ]);	
				
				}
				if(filtro == null){
					dataset.addRow([objdata[i].CCODIGO, objdata[i].CCGC, objdata[i].CNOME, objdata[i].CTIPO,objdata[i].NQTDE_ADF,objdata[i].CREDUZ,objdata[i].CFPGTO,objdata[i].CBANCO,objdata[i].CAGENCIA,objdata[i].CCONTAF,objdata[i].CTIPOC,objdata[i].CTIPOPJ]);			
				}		
			}
		}
	    	
	    return dataset;

	
}


function getConstraints(constraints, field, field2){
	
	if(constraints == null)
		return null;
	
	for(var i=0;i<constraints.length;i++){
		if(constraints[i].fieldName == field || constraints[i].fieldName == field2 ){		
							
			return constraints[i].initialValue;
		}
	}
	
	return null;
}

