function createDataset(fields, constraints, sortFields) {
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("solicitacao");	
	dataset.addColumn("dataSolicitacao");
	dataset.addColumn("origem1");
	dataset.addColumn("datapartida1");
	dataset.addColumn("destino1");
	dataset.addColumn("dataretorno1");
	dataset.addColumn("origem2");
	dataset.addColumn("destino2");
	dataset.addColumn("datapartida2");
	dataset.addColumn("origem3");
	dataset.addColumn("destino3");
	dataset.addColumn("datapartida3");
	dataset.addColumn("nomepassageiro");	
	dataset.addColumn("remarcacao");
	dataset.addColumn("viagemCancelada");

	
	var constraints = new Array();
	
	//filtros para contraints principal
	constraints.push(DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("aprovacao", "aprovado" , "aprovado", ConstraintType.MUST));		
	constraints.push(DatasetFactory.createConstraint("passageirofuncionario", "sim" , "sim", ConstraintType.MUST));	
	constraints.push(DatasetFactory.createConstraint("tipoviagem", "nacional" , "nacional", ConstraintType.MUST));
//	constraints.push(DatasetFactory.createConstraint("tipovoo", "" , "", ConstraintType.MUST_NOT));	
//	constraints.push(DatasetFactory.createConstraint("tipovoo", null , null, ConstraintType.MUST_NOT));	
	constraints.push(DatasetFactory.createConstraint("solicitacao", "" , "", ConstraintType.MUST_NOT));
	
	 var retornoDataset = DatasetFactory.getDataset("VM_SolicitacoesViagens", null, constraints, null);
	 
	    for(var x = 0 ; x < retornoDataset.rowsCount; x++){   
	    	 var solicitacaoId = retornoDataset.getValue(x, "solicitacao");	    	 
	    	 var empresa = retornoDataset.getValue(x, "companyid");
	    	 
	    	 var atendida = retornoDataset.getValue(x,"atendida");
	    	 var vooCompra = retornoDataset.getValue(x,"vooComprado");
	    	 var tipovoo =  retornoDataset.getValue(x,"tipovoo");
	    	 
	    	 //VERIFICAR SE O CAMPO DE ATENDIDA, VOO COMPRADO FOI MARCADO
	    	 var statusCompra = false;	    	 
	    	 if (atendida =='atendida' || vooCompra == 'sim') {	    		 
	    		 statusCompra = true;	   
	    	 }
	    	 
	         	if (statusCompra == true){
	         		if (tipovoo != null && tipovoo != ""){
		           		dataset.addRow([solicitacaoId,
			    		                retornoDataset.getValue(x,"dataSolicitacao"),
			    		                retornoDataset.getValue(x,"origem1"),
			    		                retornoDataset.getValue(x,"datapartida1"),
			    		                retornoDataset.getValue(x,"destino1"),
			    		                retornoDataset.getValue(x,"dataretorno1"),
			    		                retornoDataset.getValue(x,"origem2"),
			    		                retornoDataset.getValue(x,"destino2"),
			    		                retornoDataset.getValue(x,"datapartida2"),
			    		                retornoDataset.getValue(x,"origem3"),
			    		                retornoDataset.getValue(x,"destino3"),
			    		                retornoDataset.getValue(x,"datapartida3"),	    		               	    		          	    		            
			    		                retornoDataset.getValue(x,"nomepassageiro"),
			    		                retornoDataset.getValue(x,"remarcacao"),
			    		                retornoDataset.getValue(x,"cancelarpassagem")
			    		                ]); 	         			
	         		}		
	         	}
	        }
	    	
		return dataset;

}