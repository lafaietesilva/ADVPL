function createDataset(fields, constraints, sortFields) {

	//dataset usado para solicitações do tipo REMARCAÇÃO
	
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("SOLICITACAO");
	dataset.addColumn("DT_SOLICITACAO");
	dataset.addColumn("BENEFICIARIO");
	dataset.addColumn("CPF_BENEFICIARIO");
	dataset.addColumn("DT_VIAGEM");
	dataset.addColumn("DT_RETORNO");
	dataset.addColumn("ITINERARIO");
	dataset.addColumn("FINALIDADE");
	dataset.addColumn("CENTRO_CUSTO");
	dataset.addColumn("PROJETO");
	dataset.addColumn("FONTE_FINANCIAMENTO");

	
	var user = getValue("WKUser");
	var dtRetorno;
	var dtPartida;
	
	
	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("tipoviagem", "internacional", "internacional", ConstraintType.MUST));
	
	//workflowProcess fazer join com esse dataset para trazer apenas solicitações ativas
	
	
    var retornoDataset = DatasetFactory.getDataset("VM_SolicitacoesViagens", null, constraints, null);
    
    for(var x = 0 ; x < retornoDataset.rowsCount; x++){
    	 var passageiro = retornoDataset.getValue(x, "emailPassageiro");
    	 var matricula = retornoDataset.getValue(x, "matriculasolicitante");
    	 var passagem = retornoDataset.getValue(x,"pedirPassagem"); 
    	 
    	 var empresa = retornoDataset.getValue(x, "companyid");
    	 var carddocumentid =  retornoDataset.getValue(x, "metadata#id");
    	 var documentVersion = retornoDataset.getValue(x, "metadata#version");    
    	 var cardindexdocumentid = retornoDataset.getValue(x, "metadata#card_index_id")
	    	
    	     		
    		 var historicoFormulario = retornaSolicitacao(cardindexdocumentid,carddocumentid,empresa);
    		 
    		 var numSolicitacao;
	         var dataSolicitacao;
	         if (historicoFormulario.rowsCount > 0){
	        	 numSolicitacao = historicoFormulario.getValue(0,"workflowProcessPK.processInstanceId");
	   	         dataSolicitacao = historicoFormulario.getValue(0,"startDateProcess");
	   	         
	   	         var emailPass = emailPassageiro(user);
	    		 var emailpassageiro = emailPass.toUpperCase();
	    			
	    		 if (passageiro == emailpassageiro || matricula == user){  				    			 
	    			 if (passagem == 'sim'){
	    				 dtPartida = retornoDataset.getValue(x,"datapartida1");
	    				 
	    				 if (retornoDataset.getValue(x,"datapartida3") != "" && retornoDataset.getValue(x,"datapartida3") != null){
	    					 dtRetorno = retornoDataset.getValue(x,"datapartida3");
		    			 }
		    			 else if (retornoDataset.getValue(x,"datapartida2") != "" && retornoDataset.getValue(x,"datapartida2") != null){
		    				 dtRetorno = retornoDataset.getValue(x,"datapartida2");
		    			 }
		    			 else if (retornoDataset.getValue(x,"dataretorno1") != "" && retornoDataset.getValue(x,"dataretorno1") != null){
		    				 dtRetorno = retornoDataset.getValue(x,"dataretorno1");
		    			 }
	    				 
	    				 
	    				 
	    			 }
	    			 else {
	    				
	    				 dtPartida = retornoDataset.getValue(x,"datacheckin");
	    				 if (retornoDataset.getValue(x,"datacheckout3") != "" && retornoDataset.getValue(x,"datacheckout3") != null){
	    					 dtRetorno = retornoDataset.getValue(x,"datacheckout3");
		    			 }
		    			 else if (retornoDataset.getValue(x,"datacheckout2") != "" && retornoDataset.getValue(x,"datacheckout2") != null){
		    				 dtRetorno = retornoDataset.getValue(x,"datacheckout2");
		    			 }
		    			 else if (retornoDataset.getValue(x,"datacheckout") != "" && retornoDataset.getValue(x,"datacheckout") != null){
		    				 dtRetorno = retornoDataset.getValue(x,"datacheckout");
		    			 }
	    				 
	    				
	    			 }
	        		
	    		
	    			  	var c1 = DatasetFactory.createConstraint("tablename", "tableItens" , "tableItens", ConstraintType.MUST);
	                    var c2 = DatasetFactory.createConstraint("metadata#id", carddocumentid, carddocumentid, ConstraintType.MUST);
	                    var c3 = DatasetFactory.createConstraint("metadata#version", documentVersion, documentVersion, ConstraintType.MUST);
	                    var constraintsFilhos = new Array(c1, c2, c3);

	                    //Busca o dataset
	                    var datasetFilhos = DatasetFactory.getDataset("VM_SolicitacoesViagens", null, constraintsFilhos, null);
	    			   
	                    
	              
	                    if (datasetFilhos.rowsCount == 1){
	                    	 dataset.addRow([numSolicitacao,
	           	     		                retornoDataset.getValue(x,"dataSolicitacao"),
	          	     		                retornoDataset.getValue(x,"nomepassageiro"),
	          	     		                retornoDataset.getValue(x,"cpfpassageiro"),   	     		              
	          	     		              	dtPartida,
	          	     		              	dtRetorno,	     		              	
	          	     		              	retornoDataset.getValue(x,"itinerario"),      	     		              
	          	     		                retornoDataset.getValue(x,"finalidade"),
	          	     		                datasetFilhos.getValue(0, "txtcentrocusto"),
	          	     		                datasetFilhos.getValue(0, "txtprojeto"),
	          	     		              	datasetFilhos.getValue(0, "txtfontefinanciamento")
	          	     		                ]);
	         				
	                    }
	                    else {
	                    	 dataset.addRow([numSolicitacao,
	           	     		                retornoDataset.getValue(x,"dataSolicitacao"),
	          	     		                retornoDataset.getValue(x,"nomepassageiro"),
	          	     		                retornoDataset.getValue(x,"cpfpassageiro"),   	     		              
	          	     		                dtPartida,
	          	     		              	dtRetorno,	     		              	
	          	     		              	retornoDataset.getValue(x,"itinerario"),     	     		              
	          	     		                retornoDataset.getValue(x,"finalidade"),
	          	     		                '',
	          	     		                '',
	          	     		              	''
	          	     		                ]);
	         				
	                    }
	    			

    				
	    		 }
	    		 
	    		
	         }	         
    }
    	
    return dataset;
	
}

function getConstraints(constraints, field){
	if(constraints == null)
		return null;
	
	for(var i=0;i<constraints.length;i++){
		if(constraints[i].fieldName == field){
			return constraints[i].initialValue;
		}
	}
	
	return null;
}

function existeGrupo(usuario){
	var constraint = new Array();
	constraint.push(DatasetFactory.createConstraint("colleagueGroupPK.colleagueId", usuario, usuario, ConstraintType.MUST));
	constraint.push(DatasetFactory.createConstraint("colleagueGroupPK.groupId", "Hospitalidade", "Hospitalidade", ConstraintType.MUST));
	var dataset = DatasetFactory.getDataset("colleagueGroup", null, constraint, null);
	return dataset.rowsCount > 0;
}

function emailPassageiro(user){
	  var constraintUser = new Array();
	 constraintUser.push(DatasetFactory.createConstraint("colleaguePK.colleagueId", user, user, ConstraintType.MUST));
	 var datasetFuncionario = DatasetFactory.getDataset("colleague", null, constraintUser, null);
	 			 			 			 	 
	 return datasetFuncionario.getValue(0, "mail"); 
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