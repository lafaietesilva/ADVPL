function createDataset(fields, constraints, sortFields) { 
	var dataset = DatasetBuilder.newDataset(); 
	dataset.addColumn("RETORNO");
	
	//DEFINICAO DAS VARIAVEIS PARA A CHAMADA DA FUNCAO createData() 
	var company = parseInt(getValue("WKCompany"));
	var user = "vmb_sistemas@wvi.org"; 
	var password = "*Itsup0rt%";

	/*
	  var colleagueServiceProvider = ServiceManager.getServiceInstance("ColleagueService");
      // Instancia o serviço
      var colleagueServiceLocator = colleagueServiceProvider.instantiate("com.totvs.technology.ecm.foundation.ws.ECMColleagueServiceService");
      var colleagueService = colleagueServiceLocator.getColleagueServicePort();
      // Obtém os dados do usuário pelo email do Identity
      var colleaguesList = colleagueService.getColleaguesMail("wasley_santos",password,company,user).getItem();
      var userId = null;
      if(colleaguesList != null && colleaguesList.size() > 0) {
          //Obtém o coleague retornado
          userId = colleaguesList.get(0).getColleagueId()
          log.info("userId: " + userId);
      }
	
      */
	
	var dsvalores = DatasetFactory.getDataset("VM_Aeroportos", null, null, null);

	
	//CHAMADA DA FUNCAO PARA A CRIACAO DOS REGISTROS DE FORMULARIO
	var retorno = createData(company, user, password, dsvalores);
	dataset.addRow([retorno]);
	
	return dataset;


}
//https://tdn.totvs.com/download/attachments/73084007/CardServiceClient.java?version=1&modificationDate=1378474773000&api=v2
//https://forum.fluig.com/3648-ecmcardservice---create-alguem-pode-me-ajudar-a-usar-este-servico-para-criar-um-formulario-apartir-de-um-widget
//https://tdn.totvs.com/pages/releaseview.action?pageId=73084007
//https://tdn.totvs.com/pages/releaseview.action?pageId=73082260
//https://git.fluig.com/projects/SAMPLES/repos/datasets/browse/dataset-cardservice-create/project-fluig/datasets/ds_CreateWSCardService.js


function createData(company, user, password,dsvalores) { 
	try {

		var properties = {}; 
		properties["disable.chunking"] = "true"; 
		properties["log.soap.messages"] = "true";

		//CHAMADA DO SERVICO E INSTANCIAÇAO DAS CLASSES PARA A CHAMADA DO METODO 
		var serviceManager = ServiceManager.getService("WSCardService"); 
		var serviceInstance = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.ECMCardServiceService"); 
		var service = serviceInstance.getCardServicePort();
		var customClient = serviceManager.getCustomClient(service, "com.totvs.technology.ecm.dm.ws.CardService", properties);
		
		var attachment = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.Attachment"); 
		var relatedDocument = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.RelatedDocumentDto"); 
		var documentSecurity = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.DocumentSecurityConfigDto"); 
		var approver = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.ApproverDto");

		
		for (var i = 0; i < dsvalores.rowsCount; i++){
			var result = null;
			
			var AEROPORTO = dsvalores.getValue(i, "AEROPORTO"); 
			var CIDADE = dsvalores.getValue(i, "CIDADE"); 
			var ESTADO = dsvalores.getValue(i, "ESTADO"); 
			//var idPasta = 3075; //achar pasta para remover formularios
			var idPasta = 19900;
			
			//A CADA ITERACAO, SE O USUARIO NAO FOI SINCRONIZADO É PRECISO INSTANCIAR AS VARIÁVEIS ABAIXO,
			//PARA QUE NAO HAJA DUPLICIDADE DOS REGISTROS DO FORMULARIO (CAUSANDO A CRIACAO DE MAIS DE UM REGISTRO DE FORMULARIO PARA O MESMO REGISTRO DO FOR) 
			
			var cardDtoArray = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardDtoArray");
			var cardDto = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardDto");		
			
			var cardFieldDto1 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
			var cardFieldDto2 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
			var cardFieldDto3 = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
			
			cardDto.getAttachs().add(attachment);
			cardDto.getReldocs().add(relatedDocument);
			cardDto.getDocsecurity().add(documentSecurity);
			cardDto.getDocapprovers().add(approver);
			
			//ADICIONA NO ARRAY OS METADADOS DO REGISTRO DE FORMULARIO 
			cardDto.setDocumentDescription(AEROPORTO);
			cardDto.setAdditionalComments("");
			cardDto.setParentDocumentId(idPasta);
			cardDto.setColleagueId("001649");
			cardDto.setExpires(false);
			cardDto.setUserNotify(false);
			cardDto.setInheritSecurity(true);
			cardDto.setTopicId(1);
			cardDto.setVersionDescription("Criação automatica");
			cardDto.setDocumentKeyWord("");
			
			//ADICIONA NO ARRAY OS DADOS DOS CAMPOS DO FORMULARIO: NOME E O VALOR	
			cardFieldDto1.setField("aeroporto");
			cardFieldDto1.setValue(AEROPORTO);
			cardDto.getCardData().add(cardFieldDto1);
			
			cardFieldDto2.setField("cidade");
			cardFieldDto2.setValue(CIDADE);
			cardDto.getCardData().add(cardFieldDto2);
			
			cardFieldDto3.setField("estado");
			cardFieldDto3.setValue(ESTADO);
			cardDto.getCardData().add(cardFieldDto3);
			
			// ADICIONA O REGISTRO NO ARRAY DO REGISTRO DE FORMULARIO
			cardDtoArray.getItem().add(cardDto);
			
			//CHAMADA METODO PARA CRIACAO DOS REGISTROS DE FORMULARIO
			result = customClient.create(company, user, password, cardDtoArray);
			log.info("###### AEROPORTO SINCRONIZADO!");
			
		}		
		if (result.getItem().get(0).getWebServiceMessage().equals("ok")) {
			return "Sincronização completada com sucesso!" ;
		} else {
			return result.getItem().get(0).getWebServiceMessage();
		}
	
	}
	

catch(e)
{
	log.error('###### Erro ao sincronizar lista de aeroportos. '+e.message);
	return e.message;
}	
			
		
		
}

