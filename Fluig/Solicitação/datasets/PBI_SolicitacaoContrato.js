function defineStructure() {
	addColumn("SOLICITACAO");
    addColumn("NUMERO_CONTRATO");
    addColumn("CODIGO_FORNECEDOR");
    addColumn("DEFINICAO_VALOR");
    addColumn("INICIO_CTR");
    addColumn("FIM_CTR");
    addColumn("EMAIL_SOLICITANTE");
    addColumn("ORIGEM");
    addColumn("RAZAO_SOCIAL");
    addColumn("RESPONSAVEL");
    addColumn("STATUS_CONTRATO");
    addColumn("TIPO_PESSOA");
    addColumn("VALOR_TOTAL");
    addColumn("DATA_SOLICITACAO");
    addColumn("DOCUMENT_ID");
    addColumn("STATUS_SOLICITACAO");
	
	setKey(["SOLICITACAO"]);
	addIndex(["CODIGO_FORNECEDOR"]);
	
}


function createDataset(fields, constraints, sortFields) {
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("SOLICITACAO");
    dataset.addColumn("NUMERO_CONTRATO");
    dataset.addColumn("CODIGO_FORNECEDOR");
    dataset.addColumn("DEFINICAO_VALOR");
    dataset.addColumn("INICIO_CTR");
    dataset.addColumn("FIM_CTR");
    dataset.addColumn("EMAIL_SOLICITANTE");
    dataset.addColumn("ORIGEM");
    dataset.addColumn("RAZAO_SOCIAL");
    dataset.addColumn("RESPONSAVEL");
    dataset.addColumn("STATUS_CONTRATO");
    dataset.addColumn("TIPO_PESSOA");
    dataset.addColumn("VALOR_TOTAL");
    dataset.addColumn("DATA_SOLICITACAO");
    dataset.addColumn("DOCUMENT_ID");
    dataset.addColumn("STATUS_SOLICITACAO");
		
	var c0 = DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST);        		
	var solicitacao = DatasetFactory.getDataset("VM_SolicitacaoContrato", null, new Array(c0), null);

	
	for(var i= 0; i < solicitacao.rowsCount; i++){
		var retornaProcessoSolicitacao = retornaSolicitacao(solicitacao.getValue(i,"metadata#card_index_id"),solicitacao.getValue(i,"documentid"),solicitacao.getValue(i,"companyid"));
		var codSolicitacao = retornaProcessoSolicitacao.getValue(0,"workflowProcessPK.processInstanceId");
		var statusSolicitacao = retornaProcessoSolicitacao.getValue(0,"status");
		var codSolicitacaoPai = retornaProcessoSolicitacao.getValue(0,"sourceProcess");
		var statusContrato = solicitacao.getValue(i,"statusContrato");
		var documentIdPai;
		var solicitacaoPai;
		var nomeProcesso;
		var responsavel ="";
		
		//IDENTIFICAR PROCESSO
		var retornaProcessoPAI = retornaSolicitacaoPai(codSolicitacaoPai,solicitacao.getValue(0,"companyid"));

		if (codSolicitacaoPai != 0 ) {
			nomeProcesso = retornaProcessoPAI.getValue(0,"processId");
			documentIdPai = retornaProcessoPAI.getValue(0,"cardDocumentId");
			
			if (nomeProcesso == "SolicitacaoContratacaoServico"){
				var constraint2  = new Array(); 
				constraint2.push(DatasetFactory.createConstraint("documentid", documentIdPai , documentIdPai, ConstraintType.MUST));
				constraint2.push(DatasetFactory.createConstraint("metadata#active", true , true, ConstraintType.MUST));      			
				solicitacaoPai = DatasetFactory.getDataset("VM_SolicitacaoContratacoesServico", null, constraint2, null)        		           
				
				
			}
			
			else if (nomeProcesso == "SolicitacaoLocacaoVeiculo"){
				var constraint2  = new Array(); 
				constraint2.push(DatasetFactory.createConstraint("documentid", documentIdPai , documentIdPai, ConstraintType.MUST));
				constraint2.push(DatasetFactory.createConstraint("metadata#active", true , true, ConstraintType.MUST));      			
				solicitacaoPai = DatasetFactory.getDataset("VM_SolicitacoesLocacaoVeiculo", null, constraint2, null)        		           
				
				
			}
			
			else if (nomeProcesso == "SolicitacaoTransfer"){
				var constraint2  = new Array(); 
				constraint2.push(DatasetFactory.createConstraint("documentid", documentIdPai , documentIdPai, ConstraintType.MUST));
				constraint2.push(DatasetFactory.createConstraint("metadata#active", true , true, ConstraintType.MUST));      			
				solicitacaoPai = DatasetFactory.getDataset("VM_SolicitacoesTransfer", null, constraint2, null)        		           
				
				
			}
			
			else if (nomeProcesso == "SolicitacaoEvento"){
				var constraint2  = new Array(); 
				constraint2.push(DatasetFactory.createConstraint("documentid", documentIdPai , documentIdPai, ConstraintType.MUST));
				constraint2.push(DatasetFactory.createConstraint("metadata#active", true , true, ConstraintType.MUST));      			
				solicitacaoPai = DatasetFactory.getDataset("VM_SolicitacoesEventos", null, constraint2, null)        		           
				
				
			}
			
			responsavel = solicitacaoPai.getValue(0,"emailsolicitante");
		}
			
		switch (parseInt(statusSolicitacao)) {
		case 0:
			statusSolicitacao = "Pendente";
			 break;
		case 1:
			statusSolicitacao = "Cancelada";	
			 break;
		case 2:
			statusSolicitacao = "Finalizada";
			 break;
		default:
			statusSolicitacao;
		}
		
		if (statusContrato != "assinado" && statusContrato != "recusado"){
			statusContrato ="sem contrato";
		}
		var dtSolicitacao = retornaProcessoSolicitacao.getValue(0,"startDateProcess");
		var dtFimSolicitacao = retornaProcessoSolicitacao.getValue(0,"endDateProcess");
		//var tempoTotal = retornaProcessoSolicitacao.getValue(0,"totalRuntime");
			//if (statusSolicitacao != 1){
				dataset.addRow([
					codSolicitacao,
					solicitacao.getValue(i,"Numerocontrato"),
					solicitacao.getValue(i,"codigoFornecedor"),
					solicitacao.getValue(i,"definicaoValor").toUpperCase(),
					solicitacao.getValue(i,"dtInicio"),
					solicitacao.getValue(i,"dtFim"),
					solicitacao.getValue(i,"emailSolicitante"),
					solicitacao.getValue(i,"origem").toUpperCase(),
					solicitacao.getValue(i,"razaosocial"),
					responsavel.toUpperCase(),
					statusContrato,
					solicitacao.getValue(i,"tipoPessoa"),
					parseFloat(solicitacao.getValue(i,"CotacaovalorAnual")).toFixed(2),
					dtSolicitacao.toString(),
					solicitacao.getValue(i,"documentid"),
					statusSolicitacao
			]);
			//}
	
				
	}
	
	
	return dataset;
	
	
}


function retornaSolicitacao(cardindexdocumentid,carddocumentid,empresa){
	  var constraintsHistorico  = new Array();	    	 
		 constraintsHistorico.push(DatasetFactory.createConstraint("cardIndexDocumentId", cardindexdocumentid , cardindexdocumentid, ConstraintType.MUST));
		 constraintsHistorico.push(DatasetFactory.createConstraint("cardDocumentId", carddocumentid , carddocumentid, ConstraintType.MUST));	    	
		 constraintsHistorico.push(DatasetFactory.createConstraint("workflowProcessPK.companyId", empresa , empresa, ConstraintType.MUST));	    	
		 
   var historicoFormulario = DatasetFactory.getDataset("workflowProcess", null, constraintsHistorico, null);	       		 

   return historicoFormulario;
} 


//recebe como parametro:metadata#card_index_id, metadate#id, companyid
function retornaSolicitacaoPai(idprocesso,empresa){
	  var constraintsHistorico  = new Array();	    	 
		 constraintsHistorico.push(DatasetFactory.createConstraint("workflowProcessPK.processInstanceId", idprocesso , idprocesso, ConstraintType.MUST));	    	
		 constraintsHistorico.push(DatasetFactory.createConstraint("workflowProcessPK.companyId", empresa , empresa, ConstraintType.MUST));	    	
		 
   return DatasetFactory.getDataset("workflowProcess", null, constraintsHistorico, null);
}

