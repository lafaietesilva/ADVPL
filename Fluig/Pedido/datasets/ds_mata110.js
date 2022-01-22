function createDataset(fields, constraints, sortFields) {

	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("RETORNO");
	dataset.addColumn("NUMERO");
	

	var aProdutos = new Array();
	var itens = new Array();
	var documentId;

	for (var a = 0; a < constraints.length; a++) {
		if (constraints[a].fieldName == "documentid") {
			documentId = constraints[a].initialValue;

		}

	}
	
	if (documentId != "" && documentId != null){
		var constraints = new Array();
		constraints.push(DatasetFactory.createConstraint("documentid", documentId, documentId, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST));
		//constraints.push(DatasetFactory.createConstraint("checkSecurity", "false", "false", ConstraintType.MUST));
		//constraints.push(DatasetFactory.createConstraint("userSecurityId", "admin", "admin", ConstraintType.MUST));
		
		var solicitacao = DatasetFactory.getDataset("DSsolicitacaoCompra", null, constraints, null);
		var versao = solicitacao.getValue(0, "metadata#version")
		
		//Cria as constraints para buscar os campos filhos, passando o tablename, número da formulário e versão
	    var constraintsFilhos = new Array();
	    constraintsFilhos.push(DatasetFactory.createConstraint("tablename", "tbprodutos", "tbprodutos", ConstraintType.MUST));
	    constraintsFilhos.push(DatasetFactory.createConstraint("metadata#id", documentId, documentId, ConstraintType.MUST));
	    constraintsFilhos.push(DatasetFactory.createConstraint("metadata#version", versao, versao, ConstraintType.MUST));
	   
	    //Busca o dataset
	    var datasetFilhos = DatasetFactory.getDataset("DSsolicitacaoCompra", null, constraintsFilhos, null);
	    
	    for (var j = 0; j < datasetFilhos.rowsCount; j++) {                   	 
	    	aProdutos.push(
	    			addItem(
	    					datasetFilhos.getValue(j,"codproduto"), 
	    					datasetFilhos.getValue(j,"quantidade"),
	    					datasetFilhos.getValue(j,"unidademedida"), 
	    					datasetFilhos.getValue(j,"precounitario"), 
	    					datasetFilhos.getValue(j,"dtnecessidade"),
	    					datasetFilhos.getValue(j,"codcentrocusto"),
	    					datasetFilhos.getValue(j,"vltotalproduto"))
							);
	    	
	    }

	    
		try {
			var clientService = fluigAPI.getAuthorizeClientService();
			var data = {
				companyId : getValue("WKCompany") + '',
				serviceCode : 'REST_PROTHEUS',
				endpoint : '/FLUIG_MATA110',
				method : 'POST',// 'delete', 'patch', 'put', 'get'     
				timeoutService : '300', // segundos
				params : {
					cnpj : '' + solicitacao.getValue(0, "cnpj") + '',
					solicitacao : '' + solicitacao.getValue(0, "solicitacao") + '',
					solicitante : '' + solicitacao.getValue(0, "solicitante") + '',
					dtsolicitacao : '' + solicitacao.getValue(0, "dtsolicitacao") + '',
					itens : aProdutos
				},
				options : {
					encoding : 'UTF-8',
					mediaType : 'application/json'
				}
			}

		
			 var vo = clientService.invoke(JSON.stringify(data));
	        var obj = JSON.parse(vo.getResult());
         
	        if(vo.getResult()== null || vo.getResult().isEmpty()){
		        	dataset.addRow(new Array("RETORNO VAZIO"));
	        }        					                					       
	        else if((JSON.parse(vo.getResult()).errorMessage != null && JSON.parse(vo.getResult()).errorMessage != "")){
	        	dataset.addRow(new Array(JSON.parse(vo.getResult()).errorMessage));
	        }
	        else if (obj.status == "success"){	                    
	            dataset.addRow(new Array("SUCESSO",obj.code));					           
	            
	        }
		} catch (err) {
			dataset.addRow([ err.message ]);
		}
		
		
	    
	}
	
	log.info("retorno dataset integracao");
	log.dir(dataset);
	return dataset;
}

//FUNÇÃO QUE MONTA OBJETO E ADD ITEM NA SOLICITAÇÃO DE COMPRA
function addItem(produto, quantidade, unidade, preco, dtnecessidade, centrocusto, valortotal) {
	var item = {
		produto : '' + produto + '',
		quantidade : '' + quantidade + '',
		unidade : '' + unidade + '',
		preco : '' + unidade + '',
		dtnecessidade : '' + dtnecessidade + '',
		centrocusto : '' + centrocusto + '',
		valor : '' + valortotal + ''
	};

	return item;
}


/*
 * {
    "cnpj" : "40120343000104",
    "solicitacao" : "1",
    "solicitante" : "wasley da cruz santos",
    "dtsolicitacao" : "05/06/2021",
    "itens" : [ {
      "produto" : "500003",
      "quantidade" : "1",
      "unidade" : "UN",
      "preco" : "1",
      "dtnecessidade" : "05/06/2021",
      "centrocusto" : "",
      "valor" : "100"
    }, {
      "produto" : "500004",
      "quantidade" : "2",
      "unidade" : "UN",
      "preco" : "2",
      "dtnecessidade" : "07/06/2021",
      "centrocusto" : "",
      "valor" : "200"
    } ]
  }
 * 
 */