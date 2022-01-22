function enableFields(form){
	var ABERTURA = 0;
	var SOLICITAR = 4;
	var ELABORAR = 10
	var ASSINAR = 18;
	var ANEXAR = 57;
	var CONFIGURAR = 51;
	var VALIDAR = 79;
	var REALIZAR_PARECER = 66;
	
	var activity = getValue('WKNumState');
	var solicitante = getValue("WKUser");  
	
	
	 var dataset = UsuarioLogado(solicitante);		 			 			 			 
	 var nomeSolicitante = dataset.getValue(0, "colleagueName");
	 var emailSolicitante = dataset.getValue(0, "mail");
	 
	 //Verifica se solicitante esta substituindo algum aprovador 
     var usuariosubstituto = getValue('WKReplacement');
	    
	 if (usuariosubstituto != null){
	   	solicitante = usuariosubstituto;
	 }
	 
	
	 
	 
	 if (activity == ABERTURA || activity  == SOLICITAR){
		 form.setValue("solicitante",nomeSolicitante);
		 form.setValue("emailSolicitante",emailSolicitante);
		 /*
		 var habilitar = false; // Informe True para Habilitar ou False para Desabilitar os campos
		    var mapaForm = new java.util.HashMap();
		    mapaForm = form.getCardData();
		    var it = mapaForm.keySet().iterator();
		     
		    while (it.hasNext()) { // Laço de repetição para habilitar/desabilitar os campos
		        var key = it.next();
		        form.setEnabled(key, habilitar);
		    }
		    */
		    
		 
	}
	 else if (activity == CONFIGURAR ){
		 form.setValue("solicitacao",getValue('WKNumProces'));
		 
		 form.setValue("solicitante",nomeSolicitante);
		 form.setValue("emailSolicitante",emailSolicitante);
		 
		 var habilitar = false; // Informe True para Habilitar ou False para Desabilitar os campos
		    var mapaForm = new java.util.HashMap();
		    mapaForm = form.getCardData();
		    var it = mapaForm.keySet().iterator();
		     
		    while (it.hasNext()) { // Laço de repetição para habilitar/desabilitar os campos
		        var key = it.next();
		        form.setEnabled(key, habilitar);
		    }
		    
		    form.setEnabled("Numerocontrato", true);
		    form.setEnabled("revisao", true);
		    //form.setEnabled("filial", true);
		    form.setEnabled("tipoContrato", true);
		    form.setEnabled("tipoRevisao", true);
		    form.setEnabled("filial", true);
		    
	 }
	 
	 else if (activity == ASSINAR   ){
		 var habilitar = false; // Informe True para Habilitar ou False para Desabilitar os campos
		    var mapaForm = new java.util.HashMap();
		    mapaForm = form.getCardData();
		    var it = mapaForm.keySet().iterator();
		     
		    while (it.hasNext()) { // Laço de repetição para habilitar/desabilitar os campos
		        var key = it.next();
		        form.setEnabled(key, habilitar);
		    }
	
		    form.setEnabled("statusContrato", true);
		   
	 }
	 
	 else if (activity == ANEXAR  || activity == ELABORAR || activity == VALIDAR || activity == REALIZAR_PARECER){
		 var habilitar = false; // Informe True para Habilitar ou False para Desabilitar os campos
		    var mapaForm = new java.util.HashMap();
		    mapaForm = form.getCardData();
		    var it = mapaForm.keySet().iterator();
		     
		    while (it.hasNext()) { // Laço de repetição para habilitar/desabilitar os campos
		        var key = it.next();
		        form.setEnabled(key, habilitar);
		    }
	
		    
		   
	 }

	 
		function UsuarioLogado(solicitante){
			 var constraints   = new Array();
			 constraints.push(DatasetFactory.createConstraint("colleaguePK.colleagueId", solicitante, solicitante, ConstraintType.MUST));
			 var dataset = DatasetFactory.getDataset("colleague", null, constraints, null);
			 
			 return dataset;
		}
		

	 
}