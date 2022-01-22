function createDataset(fields, constraints, sortFields) {
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("RETORNO");

	var valorTotal;
	var dataVencimento;
	var aRateio;
	var aBeneficiarios = new Array();

	if (constraints !== null && constraints.length) {
		//INTEGRAÇÃO PARA SER REALIZADA PRECISA RECEBER UMA CONSTRAINT COM O CAMPO documentId NA POSIÇÃO 0 e do tipo MUST
		if (constraints[0].constraintType == ConstraintType.MUST && constraints[0].fieldName == "documentid") {

			var documentId = constraints[0].initialValue;

			var c0 = DatasetFactory.createConstraint("documentid", documentId, documentId, ConstraintType.MUST);
			var c1 = DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST);
			var solicitacao = DatasetFactory.getDataset("VM_SolicitacaoPagamentoCashTransfer", null, new Array(c0, c1), null);
			var documentVersion = solicitacao.getValue(0, "metadata#version");
			
		    var c1 = DatasetFactory.createConstraint("metadata#id", constraints[0].initialValue, constraints[0].initialValue, ConstraintType.MUST);    
 		    var retornaBeneficiarios = DatasetFactory.getDataset("VM_SolicitacaoPagamentoCashTransferBeneficiarios", null, new Array(c1), null);
			  
			  for (var a=0; a<retornaBeneficiarios.rowsCount;a++){
				  aBeneficiarios.push(addBeneficiario(
						 retornaBeneficiarios.getValue(a,"CPF"),
						 retornaBeneficiarios.getValue(a,"NOME"),
						 retornaBeneficiarios.getValue(a,"VALOR"),
						 retornaBeneficiarios.getValue(a,"CODIGO_FORNECEDOR")
						 ));       						        							

			  
			  }
			
			//Recupera os dados financeiros
			var c2 = DatasetFactory.createConstraint("metadata#id", documentId, documentId, ConstraintType.MUST);
			var c1 = DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST);
			var itensSolicitacao = DatasetFactory.getDataset("VM_SolicitacaoPagamentoCashTransferDadosPagamento", null, new Array(c2, c1), null);

			
			try {
				//chama função que monta array de objetos dos itens do rateio					 
				aRateio = preencheRateio(itensSolicitacao);
			} catch (erro) {
				dataset.addRow(["ERRO AO RECUPERAR RATEIO"]);
				return dataset;
			}


			if (aRateio === null || aRateio == "") {
				dataset.addRow(new Array("NÃO FOI POSSÍVEL MONTAR AS INFORMAÇÕES DE PAGAMENTO"));
				return dataset;

			}


			try {
				var clientService = fluigAPI.getAuthorizeClientService();
				var data = {
					companyId: 1 + '',
					serviceCode: 'REST FLUIG',
					endpoint: '/F_CASHTRANSFER',
					method: 'POST', // 'delete', 'patch', 'put', 'get'     
					timeoutService: '480', // segundos
					params: {
						PROCESSO: '' + 15 + '',
						SOLICITACAO: '' + solicitacao.getValue(0, "solicitacao") + '',
						SOLICITANTE: '' + solicitacao.getValue(0, "solicitante") + '',
						DATASOLICITACAO: '' + solicitacao.getValue(0, "dtSolicitacao") + '',
						EMAILSOLICITANTE: '' + solicitacao.getValue(0, "emailSolicitante") + '',
						EMAILAPROVADOR: '' + solicitacao.getValue(0, "emailLider") + '',
						DATASOLICITACAO: '' + solicitacao.getValue(0, "dtSolicitacao") + '',
						DATAVENCIMENTO: '' + solicitacao.getValue(0, "dtvencimento") + '',
						PAGADOR: '' + solicitacao.getValue(0, "fornecedorpgto") + '',
						//PAGADOR: '' +"S05864"+ '',
						RATEIO: aRateio,
						BENEFICIARIO:  aBeneficiarios,
						IDDOCUMENTO: '' + solicitacao.getValue(0, "documentid") + ''
					},
					options: {
						encoding: 'UTF-8',
						mediaType: 'application/json'
					}
				}

				log.info("WEBSERVICE PICPAY 2");
				 log.dir(data);
				var vo = clientService.invoke(JSON.stringify(data));
				var obj = JSON.parse(vo.getResult());

				if (vo.getResult() == null || vo.getResult().isEmpty()) {
					dataset.addRow(new Array("RETORNO VAZIO"));
				} else if ((JSON.parse(vo.getResult()).errorMessage != null && JSON.parse(vo.getResult()).errorMessage != "")) {
					dataset.addRow(new Array(JSON.parse(vo.getResult()).errorMessage));
				} else if (obj.CODIGO != "201") {
					dataset.addRow(new Array(obj.MSG));
				} else if (obj.CODIGO == "201") {
					dataset.addRow(new Array("SUCESSO"));

				}

			} catch (err) {
				dataset.addRow([err.message]);

			}

		} else {
			//log.info("NÃO ESTA RETORNANDO DATASET");
			dataset.addRow(["DATASET VAZIO"]);
		}

	}


	//dataset.addRow(new Array("RETORNO VAZIO"));

	return dataset;


}

function preencheRateio(solicitacao) {
	var rateio = new Array();

	for (var i = 0; i < solicitacao.rowsCount; i++) {
		var obj = {
			ccusto: '',
			projeto: '',
			atividade: '',
			categoria: '',
			fonte: '',
			area: '',
			alocacao: '',
			conta: '',
			localizacao: ''

		};

		obj.ccusto = '' + solicitacao.getValue(i, "CENTRO_CUSTO") + '';
		obj.atividade = '' + solicitacao.getValue(i, "ATIVIDADE") + '';
		obj.alocacao = '' + solicitacao.getValue(i, "ALOCACAO") + '';
		obj.localizacao = '' + solicitacao.getValue(i, "LOCALIZACAO") + '';
		obj.percentual = 1 * parseFloat(solicitacao.getValue(i, "PERCENTUAL"));

		if (solicitacao.getValue(i, "PROJETO") != null) {
			obj.projeto = '' + solicitacao.getValue(i, "PROJETO") + '';
		}
		if (solicitacao.getValue(i, "CATEGORIA") != null) {
			obj.categoria = '' + solicitacao.getValue(i, "CATEGORIA") + '';
		}
		if (solicitacao.getValue(i, "FONTE") != null) {
			obj.fonte = '' + solicitacao.getValue(i, "FONTE") + '';
		}
		if (solicitacao.getValue(i, "AREA") != null) {
			obj.area = '' + solicitacao.getValue(i, "AREA") + '';
		}
		if (solicitacao.getValue(i, "CONTA_CONTABIL") != null) {
			obj.conta = '' + solicitacao.getValue(i, "CONTA_CONTABIL") + '';
		}

		rateio[i] = obj;

		//		log.info("--retorno rateio--");
		//		log.dir(rateio[i]);
	}

	return rateio;
}

//FUNÇÃO QUE MONTA OBJETO E ADD ITEM NA SOLICITAÇÃO DE COMPRA
function addBeneficiario(cCPF,cNome,nvalor,cfornecedor){
	   var beneficiario = { 
			   nome:''+ cNome +'', 
			   fornecedor: ''+ cfornecedor +'', 
			   valor: '' + nvalor +'',
			   cpf: '' + cCPF +'',
					};	
		
		return beneficiario;
}
