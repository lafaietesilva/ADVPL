function validateForm(form) {
	var activity = getValue('WKNumState');
	var nextAtv = getValue("WKNextState");

	if (form.getValue("empresa") == "" || form.getValue("empresa") == null) {
		throw "É necessário selecionar a empresa.";
	}

	if (form.getValue("filial") == "" || form.getValue("filial") == null) {
		throw "É necessário selecionar a filial.";
	}

	var indexes = form.getChildrenIndexes("tbprodutos");

	if (indexes.length == 0) {
		throw "É obrigatório informar pelo menos um item!";
	}

	if (activity == 0 || activity == 4) {
		for (var i = 0; i < indexes.length; i++) {
			var produtoCadastrado = form.getValue("produtocadastrado___"
					+ indexes[i]);
			var produto = form.getValue("produto___" + indexes[i]);
			var novoproduto = form.getValue("novoproduto___" + indexes[i]);
			var codigo = form.getValue("codproduto___" + indexes[i]);
			var quantidade = form.getValue("quantidade___" + indexes[i]);
			var dataNecessidade = form
					.getValue("dtnecessidade___" + indexes[i]);
			var centrocusto = form.getValue("centrocusto___" + indexes[i]);
		
			if (produtoCadastrado == "sim") {
				if (produto == "" || produto === null || codigo == ""
						|| codigo === null) {
					throw "O produto não foi informado!";
				}
			} else if (produtoCadastrado == "nao") {
				if (novoproduto == "" || novoproduto === null) {
					throw "É necessário informar a descrição para o produto desejado!";
				}
			} 
			
			if (dataNecessidade == "" || dataNecessidade === null) {
				throw "A data de necessidade  não foi informada!";
			} 
			
			if (quantidade == "" || quantidade === null
					|| quantidade == 0) {
				throw "A quantidade não foi informada!";
			}
			if (centrocusto == "" || centrocusto === null ) {
				throw "O campo centro de custo não foi informado.";
			}

		}
	} else if (activity == 17) {
		for (var i = 0; i < indexes.length; i++) {
			var produto = form.getValue("produto___" + indexes[i]);
			var codigo = form.getValue("codproduto___" + indexes[i]);
			var quantidade = form.getValue("quantidade___" + indexes[i]);
			var dataNecessidade = form
					.getValue("dtnecessidade___" + indexes[i]);
			if (produto == "" || produto === null || codigo == ""
					|| codigo === null) {
				throw "O produto não foi informado!";
			} else if (dataNecessidade == "" || dataNecessidade === null) {
				throw "A data de necessidade  não foi informada!";
			} else if (quantidade == "" || quantidade === null
					|| quantidade == 0) {
				throw "A quantidade não foi informada!";
			}

		}
	}

}