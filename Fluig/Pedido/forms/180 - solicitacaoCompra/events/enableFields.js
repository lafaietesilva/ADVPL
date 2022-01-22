function enableFields(form){ 
	var activity = getValue('WKNumState');
	var nextAtv  = getValue("WKNextState");	
	
	if (activity == 17){
		var habilitar = false; // Informe True para Habilitar ou False para Desabilitar os campos
	    var mapaForm = new java.util.HashMap();
	    mapaForm = form.getCardData();
	    var it = mapaForm.keySet().iterator();
	     
	    while (it.hasNext()) { // Laço de repetição para habilitar/desabilitar os campos
	        var key = it.next();
	        form.setEnabled(key, habilitar);
	    }
	    
	 	 var indexes = form.getChildrenIndexes("tbprodutos");	    	    	    	   
	 	    for (var i = 0; i < indexes.length; i++) {
	 	    	var novoProduto = form.getValue("produtocadastrado___"+ indexes[i]);
	 	    	if (novoProduto == "nao"){
	 	    		form.setEnabled("produto___"+ indexes[i], true);	
	 	    		form.setEnabled("codproduto___"+ indexes[i], true);
	 	    		form.setEnabled("centrocusto___"+ indexes[i], true);
	 	    	}
		        
	 	    } 
		 
	}
		
}