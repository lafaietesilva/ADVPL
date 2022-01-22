function createDataset(fields, constraints, sortFields) {
	//dataset usado para solicitações do tipo REMARCAÇÃO
		
		var dataset = DatasetBuilder.newDataset();
		dataset.addColumn("EVENTO");
		dataset.addColumn("SOLICITACAO");
		dataset.addColumn("PROCESSO");
		
		
		
		var c0 = DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST);        		
		var eventos = DatasetFactory.getDataset("VM_SolicitacoesEventos", null, new Array(c0), null);
		
		
		for (var x = 0 ; x < eventos.rowsCount; x++){
			var retornaProcessoEvento = retornaSolicitacao(eventos.getValue(x,"metadata#card_index_id"),eventos.getValue(x,"documentid"),eventos.getValue(x,"companyid"));
			var codSolicitacaoEvento = retornaProcessoEvento.getValue(0,"workflowProcessPK.processInstanceId");
			
			
			var c1 = DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST);
			var c2 = DatasetFactory.createConstraint("dataset_solicitacaoevento", codSolicitacaoEvento, codSolicitacaoEvento, ConstraintType.MUST);  
			var servico = DatasetFactory.getDataset("VM_SolicitacaoContratacoesServico", null, new Array(c1,c2), null);
			
			
		    for(var y = 0 ; y < servico.rowsCount; y++){
				 dataset.addRow([codSolicitacaoEvento,
					                servico.getValue(y,"solicitacao"),
					                'SolicitacaoContratacaoServico'
			   		                ]);
		    }
		}
			
		return dataset;
}


//recebe como parametro:metadata#card_index_id, metadate#id, companyid
function retornaSolicitacao(cardindexdocumentid,carddocumentid,empresa){
	  var constraintsHistorico  = new Array();	    	 
		 constraintsHistorico.push(DatasetFactory.createConstraint("cardIndexDocumentId", cardindexdocumentid , cardindexdocumentid, ConstraintType.MUST));
		 constraintsHistorico.push(DatasetFactory.createConstraint("cardDocumentId", carddocumentid , carddocumentid, ConstraintType.MUST));	    	
		 constraintsHistorico.push(DatasetFactory.createConstraint("workflowProcessPK.companyId", empresa , empresa, ConstraintType.MUST));	    	
		 
   var historicoFormulario = DatasetFactory.getDataset("workflowProcess", null, constraintsHistorico, null);	       		 

   return historicoFormulario;
} 
