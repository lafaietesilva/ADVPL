function createDataset(fields, constraints, sortFields) {
	//ITENS DA SOLICITAÇÃO DE COMPRA DE PRODUTOS     
	//Cria as colunas
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("DESC_PRODUTO");
	
	dataset.addColumn("QUANTIDADE");
	dataset.addColumn("VL_PREVISTO");
	dataset.addColumn("COD_PRODUTO");
	dataset.addColumn("SOLICITACAO");
	dataset.addColumn("SOLICITANTE");
	dataset.addColumn("DT_SOLICITACAO");
	dataset.addColumn("VERSAO");
	dataset.addColumn("DT_APROVACAO_1");
	dataset.addColumn("APROVADOR_1");
	dataset.addColumn("ACAO_APROVADOR_1");
	dataset.addColumn("STATUS_SOLICITACAO");
	dataset.addColumn("DT_APROVACAO_2");
	dataset.addColumn("APROVADOR_2");
	dataset.addColumn("ACAO_APROVADOR_2");

	dataset.addColumn("DT_APROVACAO_3");
	dataset.addColumn("APROVADOR_3");
	dataset.addColumn("ACAO_APROVADOR_3");
	dataset.addColumn("STATUS_TAREFA");
	dataset.addColumn("REMARCACAO");
	


	//Busca todos os formulários de solicitação de compra
	var constraintsFormulario = new Array();
	constraintsFormulario.push(DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST));
	//constraintsFormulario.push(DatasetFactory.createConstraint("solicitacao", "121", "121", ConstraintType.MUST)); 
	var formulario = DatasetFactory.getDataset("VM_SolicitacoesViagens", null, constraintsFormulario, null);


	for (var a = 0; a < formulario.rowsCount; a++) {
		var documentId = formulario.getValue(a, "metadata#id");
		var documentVersion = formulario.getValue(a, "metadata#version");
		var empresa = formulario.getValue(a, "companyid");
		var cardindexdocumentid = formulario.getValue(a, "metadata#card_index_id");
		var acao_aprovador1 ="";
		var quantidade = 1;// formulario.getValue(a, "quantidade");
		var passagem = formulario.getValue(a, "tipovoo");
		var hospedagem = formulario.getValue(a, "tipoquarto");
		var tipoViagem = formulario.getValue(a, "tipoviagem");
		var produto;
		var valorPassagem = 0;
		var valorHospedagem = 0;
		var remarcacao = formulario.getValue(a, "remarcacao");

		
	
		var processo = retornaSolicitacao(cardindexdocumentid, documentId, empresa);


		if (processo.rowsCount > 0) {
			var retornaAprovadorNivel1;
			var dtAprovacaoNivel1 = null;
			var usuarioAprovadorNivel1 = "";
			var ultima_acao_nivel1;

			var solicitacao = processo.getValue(0, "workflowProcessPK.processInstanceId");
			var dtSolicitacao = processo.getValue(0, "startDateProcess");
			var versaoProcesso = processo.getValue(0, "version");
			var usuarioSolicitante = processo.getValue(0, "requesterId");
			var statusProcesso = processo.getValue(0, "status");
			var statusSolicitacao;
			var status_tarefa;
			switch (parseInt(statusProcesso)) {
				case 0:
					statusSolicitacao = "Aberta";
					break;
				case 1:
					statusSolicitacao = "Cancelada";
					break;
				case 2:
					statusSolicitacao = "Finalizada";
					break;
				default:
					"Entrar em contato com TI";
			}

			if (parseInt(versaoProcesso) <=13) {
				retornaAprovadorNivel1 = consultaAprovacao(solicitacao, 5);

			}
			else {
				retornaAprovadorNivel1 = consultaAprovacao(solicitacao, 97);
				valorPassagem = formulario.getValue(a, "cotacaoVoo");
				valorHospedagem = formulario.getValue(a, "cotacaoHotel");
		
			}
			if (retornaAprovadorNivel1.rowsCount > 0) {
				//og.info("---CONSULTA SOLICITACAO DE VIAGEM 2---");
				//log.dir(retornaAprovadorNivel1);
				
				var acao_atual_nivel1 =0;
				for (var i=0; i < retornaAprovadorNivel1.rowsCount; i++){
					
					 ultima_acao_nivel1 = retornaAprovadorNivel1.getValue(i, "processTaskPK.movementSequence");
					 status_tarefa = retornaAprovadorNivel1.getValue(i, "status");
					 
					 if (parseInt(ultima_acao_nivel1) > acao_atual_nivel1){
							 dtAprovacaoNivel1 = retornaAprovadorNivel1.getValue(i, "endDate");
							 usuarioAprovadorNivel1 = retornaAprovadorNivel1.getValue(i, "choosedColleagueId");
							
						 
					 }
					 else {
						 acao_atual_nivel1 = parseInt(ultima_acao_nivel1);
					 }
				
				}
				
				if (dtAprovacaoNivel1 != null && dtAprovacaoNivel1 != "" && dtAprovacaoNivel1 != undefined){
					dtAprovacaoNivel1 = dtAprovacaoNivel1.toString();
				}
				
				
				acao_aprovador1 = formulario.getValue(a, "aprovacao");
				if (acao_aprovador1 == "" || acao_aprovador1 == undefined && acao_aprovador1 == null){
					continue;
				}
				
			}
		
			if (passagem != "" && passagem != null && passagem != undefined){
				if (tipoViagem == "nacional"){
					produto = "DVPSG001";
				}
				else if (tipoViagem == "internacional") {
					produto = "DVPSG002";
				}
				
				//Adiciona os valores nas colunas respectivamente.
				dataset.addRow(new Array(
					"PASSAGEM AEREA",
					1,
					valorPassagem,
					produto,
					solicitacao,
					usuarioSolicitante,
					dtSolicitacao.toString(),
					versaoProcesso,
					null,
					"",
					"",
					statusSolicitacao,
					dtAprovacaoNivel1,
					usuarioAprovadorNivel1,
					acao_aprovador1,
					null,
					"",
					"",
					status_tarefa,
					remarcacao
				));
				
			}
			
			if (hospedagem != "" && hospedagem != null && hospedagem != undefined){
				if (tipoViagem == "nacional"){
					produto = "DVHOS001";
				}
				else if (tipoViagem == "internacional") {
					produto = "DVHOS002";
				}
				
				//Adiciona os valores nas colunas respectivamente.
				dataset.addRow(new Array(
					"HOSPEDAGEM",
					1,
					valorHospedagem,
					produto,
					solicitacao,
					usuarioSolicitante,
					dtSolicitacao.toString(),
					versaoProcesso,
					null,
					"",
					"",
					statusSolicitacao,
					dtAprovacaoNivel1,
					usuarioAprovadorNivel1,
					acao_aprovador1,
					null,
					"",
					"",
					status_tarefa,
					remarcacao
				));
				
			}
				
							
			//}
		}

	}
	



	return dataset;
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


function consultaAprovacao(solicitacao, tarefa) {
	//Busca todos os formulários de solicitação de compra
	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint("processTaskPK.processInstanceId", solicitacao, solicitacao, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("choosedSequence", tarefa, tarefa, ConstraintType.MUST));
	//constraints.push(DatasetFactory.createConstraint("status", 2, 2, ConstraintType.MUST));

	return DatasetFactory.getDataset("processTask", null, constraints, null);

}