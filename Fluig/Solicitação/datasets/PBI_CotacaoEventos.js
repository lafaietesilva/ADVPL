function createDataset(fields, constraints, sortFields) {
	//ITENS DA SOLICITAÇÃO DE COMPRA DE PRODUTOS     
	//Cria as colunas
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("SOLICITACAO");
	dataset.addColumn("ID_APROVACAO");
	dataset.addColumn("DT_SOLICITACAO");
	dataset.addColumn("SOLICITANTE");
	dataset.addColumn("STATUS_SOLICITACAO");
	dataset.addColumn("CODIGO_FORNECEDOR");
	dataset.addColumn("FORNECEDOR");
	dataset.addColumn("FILIAL");
	dataset.addColumn("CONTRATO");
	dataset.addColumn("REVISAO");
	dataset.addColumn("CONDICAO_PGTO");
	dataset.addColumn("VALOR_TOTAL");
	dataset.addColumn("ID_FORMULARIO");
	dataset.addColumn("ID_PASTA");
	dataset.addColumn("VERSAO");
	dataset.addColumn("DT_APROVACAO_1");
	dataset.addColumn("APROVADOR_1");
	dataset.addColumn("ACAO_APROVADOR_1");
	dataset.addColumn("DT_APROVACAO_2");
	dataset.addColumn("APROVADOR_2");
	dataset.addColumn("ACAO_APROVADOR_2");
	dataset.addColumn("DT_APROVACAO_3");
	dataset.addColumn("APROVADOR_3");
	dataset.addColumn("ACAO_APROVADOR_3");	
	dataset.addColumn("DT_APROVACAO_4");
	dataset.addColumn("APROVADOR_4");
	dataset.addColumn("ACAO_APROVADOR_4");	
	dataset.addColumn("DT_APROVACAO_5");
	dataset.addColumn("APROVADOR_5");
	dataset.addColumn("ACAO_APROVADOR_5");
	dataset.addColumn("DT_APROVACAO_6");
	dataset.addColumn("APROVADOR_6");
	dataset.addColumn("ACAO_APROVADOR_6");
	dataset.addColumn("DT_APROVACAO_7");
	dataset.addColumn("APROVADOR_7");
	dataset.addColumn("ACAO_APROVADOR_7");
	dataset.addColumn("CONTRATO_PREVIO");
	
	dataset.addColumn("PRODUTO");
	dataset.addColumn("QUANTIDADE");
	dataset.addColumn("VALOR_UNITARIO");
	dataset.addColumn("ULTIMA_APROVACAO");

	//Busca todos os formulários de solicitação de compra
	var constraintsFormulario = new Array();
	constraintsFormulario.push(DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST));
	//constraintsFormulario.push(DatasetFactory.createConstraint("solicitacao", "8536", "8536", ConstraintType.MUST)); 
	var formularioSolicitacao = DatasetFactory.getDataset("VM_SolicitacoesEventos", null, constraintsFormulario, null);

	
	for (var a = 0; a < formularioSolicitacao.rowsCount; a++) {
		log.info("dados formulario eventos PBI 1");
		log.dir(formularioSolicitacao);
		var documentId = formularioSolicitacao.getValue(a, "metadata#id");
		var documentVersion = formularioSolicitacao.getValue(a, "metadata#version");
		var empresa = formularioSolicitacao.getValue(a, "companyid");
		var cardindexdocumentid = formularioSolicitacao.getValue(a, "metadata#card_index_id");
		var ultima_acao_comprador;
		var valorCotacao = 0;
		
		if(formularioSolicitacao.getValue(a, "CotacaovalorAnual") != undefined && formularioSolicitacao.getValue(a, "CotacaovalorAnual") != null && formularioSolicitacao.getValue(a, "CotacaovalorAnual") != ""){
			valorCotacao = formularioSolicitacao.getValue(a, "CotacaovalorAnual");
			//valorCotacao = ;
		}
		
		if (formularioSolicitacao.getValue(a,"condicaoPgto") != "" && formularioSolicitacao.getValue(a,"condicaoPgto") != null && formularioSolicitacao.getValue(a,"condicaoPgto") != undefined){
			var condPagamento = formularioSolicitacao.getValue(a,"condicaoPgto").split('-');  
			codPagamento = condPagamento[0];
		}
		
		
		var codServicoContratado;
		var servicoContratado;
		var documentIdPrincipal;
		var formularioServico;
		var possuiContrato;
		var codPagamento;
		
		var retornaAprovadorNivel1;
		var dtAprovacaoNivel1 = null;
		var usuarioAprovadorNivel1 = "";
		var ultima_acao_nivel1;
		var acao_aprovador1="";
		var retornaAprovadorNivel2;
		var dtAprovacaoNivel2 = null;
		var usuarioAprovadorNivel2 = "";
		var ultima_acao_nivel2;
		var acao_aprovador2 ="";
		var retornaAprovadorNivel3;
		var dtAprovacaoNivel3 = null;
		var usuarioAprovadorNivel3 = "";
		var ultima_acao_nivel3;
		var acao_aprovador3="";
		var retornaAprovadorNivel4;
		var dtAprovacaoNivel4 = null;
		var usuarioAprovadorNivel4 = "";
		var ultima_acao_nivel4;
		var acao_aprovador4="";
		var retornaAprovadorNivel5;
		var dtAprovacaoNivel5 = null;
		var usuarioAprovadorNivel5 = "";
		var ultima_acao_nivel5;
		var acao_aprovador5="";
		var retornaAprovadorNivel6;
		var dtAprovacaoNivel6 = null;
		var usuarioAprovadorNivel6 = "";
		var ultima_acao_nivel6;
		var acao_aprovador6="";
		var retornaAprovadorNivel7;
		var dtAprovacaoNivel7 = null;
		var usuarioAprovadorNivel7 = "";
		var ultima_acao_nivel7;
		var acao_aprovador7="";
		var formularioAprovacao;
		var ultimaDtAprovacao;
		var codigoSolicitacaoAprovacaoServico;
		//FILIAL DO CONTRATO SELECIONADO
		var filialContrato = formularioSolicitacao.getValue(a, "filial");
		//FILIAL ONDE O CONTRATO SERA FEITO
		//var filialContrato= formularioSolicitacao.getValue(a, "filialSC");
		
		var numContrato = formularioSolicitacao.getValue(a, "Numerocontrato");
		var revisaoContrato = formularioSolicitacao.getValue(a, "revisao");
		var contratoPrevio;
	
		     
		//solicitações sem fornecedor não entram
		if (formularioSolicitacao.getValue(a, "codigoFornecedor") == "" || formularioSolicitacao.getValue(a, "codigoFornecedor") == null || formularioSolicitacao.getValue(a, "codigoFornecedor") == undefined){
			continue;
		}

		var processo = retornaSolicitacao(cardindexdocumentid, documentId, empresa);		
		if (processo.rowsCount > 0) {	
				var versaoProcesso = processo.getValue(0, "version");
				//processos que não aceitavam fornecedor não entram
				if (versaoProcesso <=2){
					continue;
				}
	    		var solicitacao = processo.getValue(0, "workflowProcessPK.processInstanceId");
				var dtSolicitacao = processo.getValue(0, "startDateProcess");
				
				var usuarioSolicitante = processo.getValue(0, "requesterId");
				var statusProcessoServico = processo.getValue(0, "status");

				switch (parseInt(statusProcessoServico)) {
					case 0:
						statusProcessoServico = "Aberta";
						break;
					case 1:
						statusProcessoServico = "Cancelada";
						break;
					case 2:
						statusProcessoServico = "Finalizada";
						break;
					default:
						"Entrar em contato com TI";
				}
				/*
				if (formularioSolicitacao.getValue(a, "NumeroContrato") != "" && formularioSolicitacao.getValue(a, "NumeroContrato") != null && formularioSolicitacao.getValue(a, "NumeroContrato") != undefined){
					possuiContrato = "SIM";
				}
				else {
					possuiContrato = "NÃO";
				}
					
				*/
				var aprovacoes = retornaSubProcessos(solicitacao,"SolicitacaoAprovacaoServico");
				var aprovacaoServico;
				var ultimaAprovacao = new Array();
					
				for (var b=0;  b < aprovacoes.rowsCount; b++){
					if (parseInt(aprovacoes.getValue(b, "status")) != 2){
						continue;
					}
					else {
						ultimaAprovacao.push(aprovacoes.getValue(b,"workflowProcessPK.processInstanceId"));
					}
						
						
				}
				
					if (ultimaAprovacao.length >0){
						var max = ultimaAprovacao.reduce(function(a, b) {
						  return Math.max(a, b);
						});
					
						aprovacaoServico = retornaSolicitacaoPorId(max,1);
					
					
						codigoSolicitacaoAprovacaoServico = aprovacaoServico.getValue(0,"workflowProcessPK.processInstanceId");
						var codigoFormularioAprovacao = aprovacaoServico.getValue(0,"cardDocumentId");
						var constraintsAprovacao = new Array();
						constraintsAprovacao.push(DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST));
						constraintsAprovacao.push(DatasetFactory.createConstraint("documentId", codigoFormularioAprovacao, codigoFormularioAprovacao, ConstraintType.MUST)); 
						formularioAprovacao = DatasetFactory.getDataset("VM_SolicitacaoAprovacaoServico", null, constraintsAprovacao, null);
												
						
							
	
							//CONSULTA TAREFA APROVAÇÃO NIVEL 1
							retornaAprovadorNivel1 = consultaTarefa(codigoSolicitacaoAprovacaoServico, 5);
							if (retornaAprovadorNivel1.rowsCount > 0) {
								var acao_atual_nivel1 =0;
								for (var i=0; i < retornaAprovadorNivel1.rowsCount; i++){
									 ultima_acao_nivel1 = retornaAprovadorNivel1.getValue(i, "processTaskPK.movementSequence");
									 
									 if (parseInt(ultima_acao_nivel1) > acao_atual_nivel1){
										 dtAprovacaoNivel1 = retornaAprovadorNivel1.getValue(i, "endDate");
										 usuarioAprovadorNivel1 = retornaAprovadorNivel1.getValue(i, "choosedColleagueId");
									 }
									 else {
										 acao_atual_nivel1 = parseInt(ultima_acao_nivel1);
									 }
								
								}
								
								acao_aprovador1 = formularioAprovacao.getValue(0, "aprNivel1");
									
								if (dtAprovacaoNivel1 != null && dtAprovacaoNivel1 != "" && dtAprovacaoNivel1 != undefined){
									dtAprovacaoNivel1 = dtAprovacaoNivel1.toString();
									
									ultimaDtAprovacao = dtAprovacaoNivel1;
								}
							}
							
							//CONSULTA TAREFA APROVAÇÃO NIVEL 2
								
							retornaAprovadorNivel2 = consultaTarefa(codigoSolicitacaoAprovacaoServico, 11);
							if (retornaAprovadorNivel2.rowsCount > 0) {
								var acao_atual_nivel2 =0;
								for (var i=0; i < retornaAprovadorNivel2.rowsCount; i++){
									ultima_acao_nivel2 = retornaAprovadorNivel2.getValue(i, "processTaskPK.movementSequence");
									 
									 if (parseInt(ultima_acao_nivel2) > acao_atual_nivel2){
										 dtAprovacaoNivel2 = retornaAprovadorNivel2.getValue(i, "endDate");
										 usuarioAprovadorNivel2 = retornaAprovadorNivel2.getValue(i, "choosedColleagueId");
									 }
									 else {
										 acao_atual_nivel2 = parseInt(ultima_acao_nivel2);
									 }
								
								}
								
								acao_aprovador2 = formularioAprovacao.getValue(0, "aprNivel2");
									
								if (dtAprovacaoNivel2 != null && dtAprovacaoNivel2 != "" && dtAprovacaoNivel2 != undefined){
									dtAprovacaoNivel2 = dtAprovacaoNivel2.toString();
									
									ultimaDtAprovacao = dtAprovacaoNivel2;
									
								}
							}
							
							//APROVADOR 3
							
							retornaAprovadorNivel3 = consultaTarefa(codigoSolicitacaoAprovacaoServico, 13);
							if (retornaAprovadorNivel3.rowsCount > 0) {
								var acao_atual_nivel3 =0;
								for (var i=0; i < retornaAprovadorNivel3.rowsCount; i++){
									ultima_acao_nivel3 = retornaAprovadorNivel3.getValue(i, "processTaskPK.movementSequence");
									 
									 if (parseInt(ultima_acao_nivel3) > acao_atual_nivel3){
										 dtAprovacaoNivel3 = retornaAprovadorNivel3.getValue(i, "endDate");
										 usuarioAprovadorNivel3 = retornaAprovadorNivel3.getValue(i, "choosedColleagueId");
									 }
									 else {
										 acao_atual_nivel3 = parseInt(ultima_acao_nivel3);
									 }
								
								}
								
								acao_aprovador3 = formularioAprovacao.getValue(0, "aprNivel3");
									
								if (dtAprovacaoNivel3 != null && dtAprovacaoNivel3 != "" && dtAprovacaoNivel3 != undefined){
									dtAprovacaoNivel3 = dtAprovacaoNivel3.toString();
									
									if (dtAprovacaoNivel3 > ultimaDtAprovacao ){
										ultimaDtAprovacao = dtAprovacaoNivel3;
									}
									
								}
							}
							
							
							retornaAprovadorNivel4 = consultaTarefa(codigoSolicitacaoAprovacaoServico, 15);
							if (retornaAprovadorNivel4.rowsCount > 0) {
								var acao_atual_nivel4 =0;
								for (var i=0; i < retornaAprovadorNivel4.rowsCount; i++){
									ultima_acao_nivel4 = retornaAprovadorNivel4.getValue(i, "processTaskPK.movementSequence");
									 
									 if (parseInt(ultima_acao_nivel4) > acao_atual_nivel4){
										 dtAprovacaoNivel4 = retornaAprovadorNivel4.getValue(i, "endDate");
										 usuarioAprovadorNivel4 = retornaAprovadorNivel4.getValue(i, "choosedColleagueId");
									 }
									 else {
										 acao_atual_nivel4 = parseInt(ultima_acao_nivel4);
									 }
								
								}
								
								acao_aprovador4 = formularioAprovacao.getValue(0, "aprNivel4");
									
								if (dtAprovacaoNivel4 != null && dtAprovacaoNivel4 != "" && dtAprovacaoNivel4 != undefined){
									dtAprovacaoNivel4 = dtAprovacaoNivel4.toString();
									
									if (dtAprovacaoNivel4 > ultimaDtAprovacao ){
										ultimaDtAprovacao = dtAprovacaoNivel4;
									}
									
								}
							}
							
								
							retornaAprovadorNivel5 = consultaTarefa(codigoSolicitacaoAprovacaoServico, 18);
							if (retornaAprovadorNivel5.rowsCount > 0) {
								var acao_atual_nivel5 =0;
								for (var i=0; i < retornaAprovadorNivel5.rowsCount; i++){
									ultima_acao_nivel5 = retornaAprovadorNivel5.getValue(i, "processTaskPK.movementSequence");
									 
									 if (parseInt(ultima_acao_nivel5) > acao_atual_nivel5){
										 dtAprovacaoNivel5 = retornaAprovadorNivel5.getValue(i, "endDate");
										 usuarioAprovadorNivel5 = retornaAprovadorNivel5.getValue(i, "choosedColleagueId");
									 }
									 else {
										 acao_atual_nivel5 = parseInt(ultima_acao_nivel5);
									 }
								
								}
								
								acao_aprovador5 = formularioAprovacao.getValue(0, "aprNivel5");
									
								if (dtAprovacaoNivel5 != null && dtAprovacaoNivel5 != "" && dtAprovacaoNivel5 != undefined){
									dtAprovacaoNivel5 = dtAprovacaoNivel5.toString();
									
									if (dtAprovacaoNivel5 > ultimaDtAprovacao ){
										ultimaDtAprovacao = dtAprovacaoNivel5;
									}
									
								}
							}
							
							
							if (parseInt(versaoProcesso) <=2){
								retornaAprovadorNivel6 = consultaTarefa(codigoSolicitacaoAprovacaoServico, 35);
							}
							else {
								retornaAprovadorNivel6 = consultaTarefa(codigoSolicitacaoAprovacaoServico, 105);
							}
							
							if (retornaAprovadorNivel6.rowsCount > 0) {
								var acao_atual_nivel6 =0;
								for (var i=0; i < retornaAprovadorNivel6.rowsCount; i++){
									ultima_acao_nivel6 = retornaAprovadorNivel6.getValue(i, "processTaskPK.movementSequence");
									 
									 if (parseInt(ultima_acao_nivel6) > acao_atual_nivel6){
										 dtAprovacaoNivel6 = retornaAprovadorNivel6.getValue(i, "endDate");
										 usuarioAprovadorNivel6 = retornaAprovadorNivel6.getValue(i, "choosedColleagueId");
									 }
									 else {
										 acao_atual_nivel6 = parseInt(ultima_acao_nivel6);
									 }
								
								}
								
								acao_aprovador6 = formularioAprovacao.getValue(0, "aprNivel6");
									
								if (dtAprovacaoNivel6 != null && dtAprovacaoNivel6 != "" && dtAprovacaoNivel6 != undefined){
									dtAprovacaoNivel6 = dtAprovacaoNivel6.toString();
									
									if (dtAprovacaoNivel6 > ultimaDtAprovacao ){
										ultimaDtAprovacao = dtAprovacaoNivel6;
									}
									
								}
							}
							
							
							retornaAprovadorNivel7 = consultaTarefa(codigoSolicitacaoAprovacaoServico, 27);
							if (retornaAprovadorNivel7.rowsCount > 0) {
								var acao_atual_nivel7 =0;
								for (var i=0; i < retornaAprovadorNivel7.rowsCount; i++){
									ultima_acao_nivel7 = retornaAprovadorNivel7.getValue(i, "processTaskPK.movementSequence");
									 
									 if (parseInt(ultima_acao_nivel7) > acao_atual_nivel7){
										 dtAprovacaoNivel7 = retornaAprovadorNivel7.getValue(i, "endDate");
										 usuarioAprovadorNivel7 = retornaAprovadorNivel7.getValue(i, "choosedColleagueId");
									 }
									 else {
										 acao_atual_nivel7 = parseInt(ultima_acao_nivel7);
									 }
								
								}
								
								acao_aprovador7 = formularioAprovacao.getValue(0, "aprNivel7");
									
								if (dtAprovacaoNivel7 != null && dtAprovacaoNivel7 != "" && dtAprovacaoNivel7 != undefined){
									dtAprovacaoNivel7 = dtAprovacaoNivel7.toString();
									
									ultimaDtAprovacao = dtAprovacaoNivel7;
								}
							}
							
	
					
					
					}
				
				
					
					
					if (numContrato == "" || numContrato == null || numContrato == undefined){
						//Não tinha contrato. Foi necessário criar
						contratoPrevio = "NÃO";
						//consulta contrato
						var contratos = retornaSubProcessos(solicitacao,"SolicitacaoContrato");
						var contrato;
						var ultimoContrato = new Array();
							
						for (var b=0;  b < contratos.rowsCount; b++){
							if (parseInt(contratos.getValue(b, "status")) != 2){
								continue;
							}
							else {
								ultimoContrato.push(contratos.getValue(b,"workflowProcessPK.processInstanceId"));
							}
								
								
						}
						
						if (ultimoContrato.length >0){
							//log.info("Entrou aqui 2");
							var max = ultimoContrato.reduce(function(a, b) {
							  return Math.max(a, b);
							});
						
							contrato = retornaSolicitacaoPorId(max,1);
							
							//log.info("---dados do contrato---");
							//log.dir(contrato);
							var codigoSolicitacaoContrato = contrato.getValue(0,"workflowProcessPK.processInstanceId");
							var codigoFormularioContrato = contrato.getValue(0,"cardDocumentId");
							var constraintsContrato = new Array();
							constraintsContrato.push(DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST));
							constraintsContrato.push(DatasetFactory.createConstraint("documentId", codigoFormularioContrato, codigoFormularioContrato, ConstraintType.MUST)); 
							var formularioContrato = DatasetFactory.getDataset("VM_SolicitacaoContrato", null, constraintsContrato, null);
							
							//log.info("Entrou aqui 10");
							//log.dir(formularioContrato);
							
							if (formularioContrato.getValue(0, "Numerocontrato") != null &&
									formularioContrato.getValue(0, "Numerocontrato") != "" &&
									formularioContrato.getValue(0, "Numerocontrato") != undefined){
								
								filialContrato = formularioContrato.getValue(0, "filial");
								numContrato = formularioContrato.getValue(0, "Numerocontrato");
								revisaoContrato = formularioContrato.getValue(0, "revisao");
							}
							//não tem numero do contrato por causa da versão
							else {
								continue;
							}
							
							
						}
					}
					else {
						contratoPrevio = "SIM";
					}
					
				//VERIFICA SE POSSUI PRODUTO DEFINIDO
				
					if (formularioSolicitacao.getValue(a, "definicaoValor") == "fixo"){
						//Cria as constraints para buscar os campos filhos, passando o tablename, número da formulário e versão
						var constraintsItensFormulario = new Array();
						constraintsItensFormulario.push(DatasetFactory.createConstraint("tablename", "tableServico", "tableServico", ConstraintType.MUST));
						constraintsItensFormulario.push(DatasetFactory.createConstraint("metadata#id", documentId, documentId, ConstraintType.MUST));
						constraintsItensFormulario.push(DatasetFactory.createConstraint("metadata#version", documentVersion, documentVersion, ConstraintType.MUST));
						//Busca o dataset
						var itensFormulario = DatasetFactory.getDataset("VM_SolicitacoesEventos", null, constraintsItensFormulario, null);
						
						if (itensFormulario.rowsCount >0){
							for (var j = 0; j < itensFormulario.rowsCount; j++) {
								dataset.addRow(new Array(
										solicitacao,
										codigoSolicitacaoAprovacaoServico,
										dtSolicitacao.toString(),
										usuarioSolicitante,
										statusProcessoServico,
										formularioSolicitacao.getValue(a, "codigoFornecedor"),
										formularioSolicitacao.getValue(a, "razaosocial"),
										filialContrato,
										numContrato,
										revisaoContrato,
										codPagamento,
										itensFormulario.getValue(j, "vrTotUnit"),
										documentId,
										cardindexdocumentid,
										versaoProcesso,
										dtAprovacaoNivel1,
										usuarioAprovadorNivel1,
										acao_aprovador1,
										dtAprovacaoNivel2,
										usuarioAprovadorNivel2,
										acao_aprovador2,
										dtAprovacaoNivel3,
										usuarioAprovadorNivel3,
										acao_aprovador3,
										dtAprovacaoNivel4,
										usuarioAprovadorNivel4,
										acao_aprovador4,
										dtAprovacaoNivel5,
										usuarioAprovadorNivel5,
										acao_aprovador5,
										dtAprovacaoNivel6,
										usuarioAprovadorNivel6,
										acao_aprovador6,
										dtAprovacaoNivel7,
										usuarioAprovadorNivel7,
										acao_aprovador7,
										contratoPrevio,			
										itensFormulario.getValue(j, "codigoProduto"),
										itensFormulario.getValue(j, "idquantidade"),
										itensFormulario.getValue(j, "vrUnitario"),
										ultimaDtAprovacao
										
									));
							}
						}
					
					}
					else {
						//adiciona item ao dataset
						dataset.addRow(new Array(
								solicitacao,
								codigoSolicitacaoAprovacaoServico,
								dtSolicitacao.toString(),
								usuarioSolicitante,
								statusProcessoServico,
								formularioSolicitacao.getValue(a, "codigoFornecedor"),
								formularioSolicitacao.getValue(a, "razaosocial"),
								filialContrato,
								numContrato,
								revisaoContrato,
								codPagamento,
								parseFloat(valorCotacao).toFixed(2),
								documentId,
								cardindexdocumentid,
								versaoProcesso,
								dtAprovacaoNivel1,
								usuarioAprovadorNivel1,
								acao_aprovador1,
								dtAprovacaoNivel2,
								usuarioAprovadorNivel2,
								acao_aprovador2,
								dtAprovacaoNivel3,
								usuarioAprovadorNivel3,
								acao_aprovador3,
								dtAprovacaoNivel4,
								usuarioAprovadorNivel4,
								acao_aprovador4,
								dtAprovacaoNivel5,
								usuarioAprovadorNivel5,
								acao_aprovador5,
								dtAprovacaoNivel6,
								usuarioAprovadorNivel6,
								acao_aprovador6,
								dtAprovacaoNivel7,
								usuarioAprovadorNivel7,
								acao_aprovador7,
								contratoPrevio,
								"",
								1,
								0,
								ultimaDtAprovacao
							));
					}
				
					
					

				
				
				
				
			//fim do subprocesso
			
		}
	}
	return dataset;
}

//recebe como parametro:codigo da solicitacao e empresa
function retornaSolicitacaoPorId(idprocesso,empresa){
	  var constraintsHistorico  = new Array();	    	 
		 constraintsHistorico.push(DatasetFactory.createConstraint("workflowProcessPK.processInstanceId", idprocesso , idprocesso, ConstraintType.MUST));	    	
		 constraintsHistorico.push(DatasetFactory.createConstraint("workflowProcessPK.companyId", empresa , empresa, ConstraintType.MUST));	    	
		 
   return DatasetFactory.getDataset("workflowProcess", null, constraintsHistorico, null);
}

//recebe como parametro:metadata#card_index_id, metadate#id, companyid
function retornaSolicitacao(cardindexdocumentid, carddocumentid, empresa) {
	var constraintsHistorico = new Array();
	constraintsHistorico.push(DatasetFactory.createConstraint("cardIndexDocumentId", cardindexdocumentid, cardindexdocumentid, ConstraintType.MUST));
	constraintsHistorico.push(DatasetFactory.createConstraint("cardDocumentId", carddocumentid, carddocumentid, ConstraintType.MUST));
	constraintsHistorico.push(DatasetFactory.createConstraint("workflowProcessPK.companyId", empresa, empresa, ConstraintType.MUST));

	return DatasetFactory.getDataset("workflowProcess", null, constraintsHistorico, null);


}

function UsuarioLogado(solicitante) {
	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint("colleaguePK.colleagueId", solicitante, solicitante, ConstraintType.MUST));

	return DatasetFactory.getDataset("colleague", null, constraints, null);


}


function consultaTarefa(solicitacao, tarefa) {
	//Busca todos os formulários de solicitação de compra
	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint("processTaskPK.processInstanceId", solicitacao, solicitacao, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("choosedSequence", tarefa, tarefa, ConstraintType.MUST));
	//constraints.push(DatasetFactory.createConstraint("status", 2, 2, ConstraintType.MUST));


	return DatasetFactory.getDataset("processTask", null, constraints, null);

}



function retornaSubProcessos(idprocesso, processoId){
	  var constraintsHistorico  = new Array();	    	 
		  constraintsHistorico.push(DatasetFactory.createConstraint("sourceProcess", idprocesso , idprocesso, ConstraintType.MUST));	    	
		  constraintsHistorico.push(DatasetFactory.createConstraint("processId", processoId , processoId, ConstraintType.MUST));
		  
 return DatasetFactory.getDataset("workflowProcess", null, constraintsHistorico, null);
}