function createDataset(fields, constraints, sortFields) {
	//ITENS DA SOLICITAÇÃO DE COMPRA DE PRODUTOS     
	//Cria as colunas
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("DESC_PRODUTO");
	dataset.addColumn("QUANTIDADE");
	dataset.addColumn("VL_PREVISTO");
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
	dataset.addColumn("COD_PRODUTO");

	//Busca todos os formulários de solicitação de compra
	var constraintsFormulario = new Array();
	constraintsFormulario.push(DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST));
	//constraintsFormulario.push(DatasetFactory.createConstraint("solicitacao", "3547", "3547", ConstraintType.MUST)); 
	var formulario = DatasetFactory.getDataset("VM_SolicitacaoContratacoesServico", null, constraintsFormulario, null);


	for (var a = 0; a < formulario.rowsCount; a++) {
		var documentId = formulario.getValue(a, "metadata#id");
		var documentVersion = formulario.getValue(a, "metadata#version");
		var empresa = formulario.getValue(a, "companyid");
		var cardindexdocumentid = formulario.getValue(a, "metadata#card_index_id");
		var acao_aprovador1 ="";// = formulario.getValue(a, "aprovacao");
		var acao_aprovador2 ="";// = formulario.getValue(a, "aprNivel2");
		var acao_aprovador3 ="";// = formulario.getValue(a, "aprNivel3");
		var ultima_acao_nivel1;
		var ultima_acao_nivel2;
		var ultima_acao_nivel3;
		var valorPrevisto = formulario.getValue(a, "valorAnual");
		var codServicoContratado = formulario.getValue(a, "codigoProduto");
		var servicoContratado = formulario.getValue(a, "txtproduto");

		var processo = retornaSolicitacao(cardindexdocumentid, documentId, empresa);


		if (processo.rowsCount > 0) {
			var retornaAprovadorNivel1;
			var dtAprovacaoNivel1 = null;
			var usuarioAprovadorNivel1 = "";

			var retornaAprovadorNivel2;
			var dtAprovacaoNivel2 = null;
			var usuarioAprovadorNivel2 = "";

			var retornaAprovadorNivel3;
			var dtAprovacaoNivel3 = null;
			var usuarioAprovadorNivel3 = "";


			var solicitacao = processo.getValue(0, "workflowProcessPK.processInstanceId");
			var dtSolicitacao = processo.getValue(0, "startDateProcess");
			var versaoProcesso = processo.getValue(0, "version");
			var usuarioSolicitante = processo.getValue(0, "requesterId");
			var statusProcesso = processo.getValue(0, "status");
			var statusSolicitacao;

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

			
			if (parseInt(versaoProcesso) <=9) {
				if (valorPrevisto == 0 || valorPrevisto == undefined || valorPrevisto == null){
					//valorPrevisto = formulario.getValue(a, "valor");
				}
				
				if (servicoContratado == "" || servicoContratado == null || servicoContratado == undefined){
					
				}
				
			}
				//CONSULTA TAREFA APROVAÇÃO NIVEL 1
				retornaAprovadorNivel1 = consultaAprovacao(solicitacao, 5);
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
					
					acao_aprovador1 = formulario.getValue(a, "aprovacao");
					
					if (acao_aprovador1 == "" || acao_aprovador1 == undefined && acao_aprovador1 == null){
						continue;
					}
					
					if (dtAprovacaoNivel1 != null && dtAprovacaoNivel1 != "" && dtAprovacaoNivel1 != undefined){
						dtAprovacaoNivel1 = dtAprovacaoNivel1.toString();
					}
				}
			
				

				if (parseInt(versaoProcesso) >=10) {
					//CONSULTA TAREFA APROVAÇÃO NIVEL 2
					retornaAprovadorNivel2 = consultaAprovacao(solicitacao, 292);
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

						if (dtAprovacaoNivel2 != null && dtAprovacaoNivel2 != "" && dtAprovacaoNivel2 != undefined){
							dtAprovacaoNivel2 = dtAprovacaoNivel2.toString();
						}
					    acao_aprovador2 = formulario.getValue(a, "aprNivel2");

					}

					//CONSULTA TAREFA APROVAÇÃO NIVEL 3
					retornaAprovadorNivel3 = consultaAprovacao(solicitacao, 301);
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
						if (dtAprovacaoNivel3 != null && dtAprovacaoNivel3 != "" && dtAprovacaoNivel3 != undefined){
							dtAprovacaoNivel3 = dtAprovacaoNivel3.toString();
						}
						acao_aprovador3 = formulario.getValue(a, "aprNivel3");
					}

					//Cria as constraints para buscar os campos filhos, passando o tablename, número da formulário e versão
					var constraintsItensFormulario = new Array();
					constraintsItensFormulario.push(DatasetFactory.createConstraint("tablename", "tableServico", "tableServico", ConstraintType.MUST));
					constraintsItensFormulario.push(DatasetFactory.createConstraint("metadata#id", documentId, documentId, ConstraintType.MUST));
					constraintsItensFormulario.push(DatasetFactory.createConstraint("metadata#version", documentVersion, documentVersion, ConstraintType.MUST));
					//Busca o dataset
					var itensFormulario = DatasetFactory.getDataset("VM_SolicitacaoContratacoesServico", null, constraintsItensFormulario, null);
				
					if (itensFormulario.rowsCount >0){
						for (var j = 0; j < itensFormulario.rowsCount; j++) {
							dataset.addRow(new Array(
									itensFormulario.getValue(j, "txtproduto"),
									itensFormulario.getValue(j, "idquantidade"),
									itensFormulario.getValue(j, "vrTotUnit"),
									solicitacao,
									usuarioSolicitante,
									dtSolicitacao.toString(),
									versaoProcesso,
									dtAprovacaoNivel1,
									usuarioAprovadorNivel1,
									acao_aprovador1,
									statusSolicitacao,
									dtAprovacaoNivel2,
									usuarioAprovadorNivel2,
									acao_aprovador2,
									dtAprovacaoNivel3,
									usuarioAprovadorNivel3,
									acao_aprovador3,
									itensFormulario.getValue(j, "codigoProduto")
								));
						}
					}
					else {
						dataset.addRow(new Array(
								servicoContratado,
								1,
								valorPrevisto,
								solicitacao,
								usuarioSolicitante,
								dtSolicitacao.toString(),
								versaoProcesso,
								dtAprovacaoNivel1,
								usuarioAprovadorNivel1,
								acao_aprovador1,
								statusSolicitacao,
								dtAprovacaoNivel2,
								usuarioAprovadorNivel2,
								acao_aprovador2,
								dtAprovacaoNivel3,
								usuarioAprovadorNivel3,
								acao_aprovador3,
								codServicoContratado
							));
					}
				
				
		
				
				}
				else {
					dataset.addRow(new Array(
							servicoContratado,
							1,
							valorPrevisto,
							solicitacao,
							usuarioSolicitante,
							dtSolicitacao.toString(),
							versaoProcesso,
							dtAprovacaoNivel1,
							usuarioAprovadorNivel1,
							acao_aprovador1,
							statusSolicitacao,
							dtAprovacaoNivel2,
							usuarioAprovadorNivel2,
							acao_aprovador2,
							dtAprovacaoNivel3,
							usuarioAprovadorNivel3,
							acao_aprovador3,
							codServicoContratado
						));
				}
				
	
			
			
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