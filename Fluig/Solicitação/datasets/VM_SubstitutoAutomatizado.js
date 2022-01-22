function defineStructure() {
	addColumn("EMAIL_GERENTE");
	addColumn("DATA_INICIAL");
	addColumn("DATA_FIM");
	//addColumn("EMAIL_SUBSTITUTO");
	
	setKey(["EMAIL_GERENTE"]);
	addIndex(["EMAIL_GERENTE"]);
}


function createDataset(fields, constraints, sortFields) {
	 var dataset = DatasetBuilder.newDataset(); 
	    dataset.addColumn('EMAIL_GERENTE');    
	    dataset.addColumn('DATA_INICIAL');    
	    dataset.addColumn('DATA_FIM');    
	   // dataset.addColumn('EMAIL_SUBSTITUTO');
	    
	    var gerentes = DatasetFactory.getDataset("VM_Departamento", null, null, null);
	    
	    
	    for (var a=0;a < gerentes.rowsCount;a++){
	    	var emailGerente = gerentes.getValue(a, "EMAIL_G");
	    	var emailSuperior = gerentes.getValue(a, "EMAIL_S");
	    	var matriculaSuperior;
	    	
	    	log.info("------GERENTE-----");
	    	log.info(emailGerente);
	    	
	    	//não existe superior cadastrado na folha. Então busca diretor do gerente
	    	if (emailSuperior == "" || emailSuperior == null){
		   	   	 var diretor = usuarioAprovadorDIR(emailGerente);
		   	   	 log.info("-----NÃO POSSUI SUPERIOR - BUSCANDO DIRETOR-------");
	    		 log.dir(diretor);
	    		
		   		 if (diretor!= null && diretor != "" && diretor.values.length > 0){
		   			matriculaSuperior = diretor.getValue(0, "MATRICULA_APROVADOR");		   			 	 
		   		 }	
	    	}
	    	else {
	    		//RETORNA MATRICULA
	    		var datasetSuperior = getUsuario(emailSuperior);
	    		log.info("-------BUSCANDO MATRICULA DO SUPERIOR-----");
	    		log.dir(datasetSuperior);
	    		 if (datasetSuperior!= null && datasetSuperior != "" && datasetSuperior.values.length > 0){
	    			 matriculaSuperior = datasetSuperior.getValue(0, "colleaguePK.colleagueId");   			 	 
			   	}	
				
	    	}
	    	
	    	var constraintsActive = new Array();
	        constraintsActive.push(DatasetFactory.createConstraint("EMAIL", emailGerente, emailGerente, ConstraintType.MUST));
	        var afastado = DatasetFactory.getDataset("ds_get_afastado", null, constraintsActive, null);
	    
	        if (afastado.rowsCount > 0){
	        	log.info("-----------GESTOR AFASTADO------");
	        	
	        	//RETORNA MATRICULA DO GERENTE
	        	var datasetUsuario = getUsuario(emailGerente);	       	
				log.info("-------RETORNANDO MATRICULA GERENTE--------");
				log.dir(datasetUsuario);
				if (datasetUsuario.rowsCount >0 && datasetUsuario != null){
					log.info("------PROCURANDO SUBSTITUTO JA CADASTRADO------");
				 	//Chama webservice que verifica se existe substituto
					var substituto = getSubstituto(datasetUsuario.getValue(0, "colleaguePK.colleagueId"));
					log.info(substituto);
					if (substituto.length == 0 || substituto == null || substituto == ""){
		        		log.info("--------NÃO EXISTE SUBSTITUTO CADASTRADO-------");
		        		if (matriculaSuperior != ""){
		        			//chama webservice que cria substituto	
		        			var dataAtual = new Date();	
		        			var dataAtualString = convertDataToString(dataAtual);
			        		var status = setSubstituto(datasetUsuario.getValue(0, "colleaguePK.colleagueId"),matriculaSuperior,dataAtualString,afastado.getValue(0, "DATA_FIM").trim());
			        		if (status == false){
			        			log.info("--------FALHA NA CRIAÇÃO AUTOMATICA DE SUBSTITUTO-------");
			        		}
			        		else {
			        			log.info("-------ALIMENTANDO DATASET DE SUBSTITUTO------");
			        			dataset.addRow([gerentes.getValue(a, "EMAIL_G"),afastado.getValue(0, "DATA_INICIO").trim(),afastado.getValue(0, "DATA_FIM").trim()]);	
			        		}
		        		}		        	
		        	}
					else {
						log.info("-------ACHOU SUBSTITUICAO JA CADASTRADA----");
					}
				}
				
	       
	        
	        }
	        
	    }
	    
	    return dataset; 
	    
}

function getUsuario(emailGerente){
	//RETORNA MATRICULA DO GERENTE
	var constraints   = new Array();		    		
	constraints.push(DatasetFactory.createConstraint("mail", emailGerente, emailGerente, ConstraintType.MUST));    		
	var datasetUsuario = DatasetFactory.getDataset("colleague", null, constraints, null);    
	
	return datasetUsuario;

}

function usuarioAprovadorDIR(emailLogado){
	var email = DatasetFactory.createConstraint("EMAIL_USUARIO",emailLogado,emailLogado, ConstraintType.MUST);		
	var dataset = DatasetFactory.getDataset("ds_get_AprovadorViagem", null, new Array(email), null);
	 		  
	return dataset;
}

function getSubstituto(matriculaGestor){
	var dados;
	var objdata;  
    var objdata2;
    
   
	try{
        var clientService = fluigAPI.getAuthorizeClientService();
        var data = {                                                   
            companyId : getValue("WKCompany") + '',
            serviceCode : 'fluig',                     
            endpoint : '/api/public/bpm/substituteUser/getSubstitutesOfUser/'+getValue("WKCompany")+'/'+matriculaGestor,  
            method : 'GET', // 'delete', 'patch', 'post', 'get'                                        
            timeoutService: '100'                               
        }                                                          
        var vo = clientService.invoke(JSON.stringify(data));
 
        if(vo.getResult()== null || vo.getResult().isEmpty()){
        	log.info("------API RETORNOU VAZIO----");
            throw new Exception("Retorno está vazio");
        }else{
        	dados = vo.getResult();
            
            objdata2 = JSON.parse(dados);
	    	objdata = objdata2.content;
	    	
	    	log.info("------RETORNANDO DADOS DA API----");
	    	log.dir(objdata);
	    	return objdata;
        }
    } catch(err) {
        throw new Exception(err);
    }
  
}

//recebe data JS e convert para data FLuig
function convertDataToString(dataToString) {
    var dia;

    //MES INICIA DO ZERO POR ISSO SOMA 1 PARA ACHAR O MES CORRETO
    var mes = dataToString.getMonth() + 1;

    if (dataToString.getDate().toString().length == 1) {
        dia = dataToString.getDate();
        dia = "0" + dia.toString();

    } else {
        dia = dataToString.getDate();

    }

    //converte mes
    if (mes.toString().length == 1) {
        mes = "0" + mes.toString();

    }
    //novo formato de data: para salvar em campos data do Fluig
    return dia + "/" + mes + "/" + dataToString.getFullYear();

}

function setSubstituto(matriculaGestor,matriculaSuperior,dtInicial,dtFinal){
	var dados;
	var objdata;  
    var objdata2;
    
   
	try{
        var clientService = fluigAPI.getAuthorizeClientService();
        var data = {                                                   
            companyId : getValue("WKCompany") + '',
            serviceCode : 'fluig',                     
            endpoint : '/api/public/bpm/substituteUser/create',  
            method : 'POST', // 'delete', 'patch', 'post', 'get'                                        
            timeoutService: '100',
            params : {
            	companyId : 1 + '' ,
            	userId : '' + matriculaGestor +'',
            	substituteId : '' + matriculaSuperior + '' ,	
            	validationStartDate	: '' + dtInicial +'',					                
            	validationFinalDate	: '' + dtFinal +''                
            }
        }                                                          
        var vo = clientService.invoke(JSON.stringify(data));
 
        if(vo.getResult()== null || vo.getResult().isEmpty()){
        	log.info("------RETORNANDO VAZIO NO CADASTRO DE SUBSTITUTO NA API----");
	    	log.dir(dados);
            return false;
        }else{
        	dados = vo.getResult();
                          	
        	log.info("------RETORNANDO CADASTRO DE SUBSTITUTO NA API----");
	    	log.dir(dados);
	    	return true;
        }
    } catch(err) {
    	log.info("------FALHA NA CRIAÇÃO DE SUBSTITUTO API----");
    	log.dir(err);
        throw new Exception(err);
    }
  

	
}