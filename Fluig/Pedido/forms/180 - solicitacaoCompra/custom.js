//preenche data da solicitação no momento que abre a solicitação
$(document).ready(function () {
	if (ATIVIDADE_FLUIG == 5) {
		recarregaCalendarioDataNecessidade();
		
	}

});


function adicionaProduto() {
	if (ATIVIDADE_FLUIG != (0 && 4)){
		FLUIGC.toast({
            title: 'Atenção',
            message: 'Você não pode adicionar nenhum item.',
            type: 'warning',
            timeout: 3000
        });	
	}
	else {
		var row = wdkAddChild('tbprodutos');
		
		$("#novoproduto___"+row).prop("readonly", true);
		window["produto___"+row].disable(true);
		window["codproduto___"+row].disable(true);
		window["centrocusto___"+row].disable(true);
		
		//linhas = linhas + row;	
		FLUIGC.calendar("#dtnecessidade___" + row, {
			pickDate : true,
			pickTime : false,
			minDate : new Date().toLocaleString()

		});

		var qtde = document.getElementById("quantidade___" + row);
		qtde.addEventListener("blur", function(event) {
			var vl_ultimaCompra = $('#precounitario___' + row).val();
			var qtde = $('#quantidade___' + row).val();
			$('#vltotalproduto___' + row).val(vl_ultimaCompra * qtde);

		}, true);

		var vlunitario = document.getElementById("precounitario___" + row);
		vlunitario.addEventListener("blur", function(event) {
			var vl_ultimaCompra = $('#precounitario___' + row).val();
			var qtde = $('#quantidade___' + row).val();
			$('#vltotalproduto___' + row).val(vl_ultimaCompra * qtde);

		}, true);

		$("input[id^='quantidade___']:last").blur(doFormTotal);
		$("input[id^='precounitario___']:last").blur(doFormTotal);
	}
	
}

function doFormTotal() {
	var total = 0;
	var qtde_total = 0;

	$("input[id^='vltotalproduto___']").each(function() {
		if ($(this).val()) {
			total += parseFloat($(this).val());
			qtde_total += 1;
		}
	});

	$("#vltotal").val(total);
	$("#totalitens").val(qtde_total);

}

function removedZoomItem(removedItem) {
	var PRODUTO = "produto";
	var CENTRO_CUSTO = "centrocusto";
	var EMPRESA = "empresa";
	var FILIAL = "filial";
	var COD_PRODUTO = "codproduto";

	//Recebe o nome do campo zoom
	var campoZOOM = removedItem.inputId;

	//separa string
	var separaCampo = campoZOOM.split('___');
	var campo = separaCampo[0];
	var linha = separaCampo[1];

	if (campo == PRODUTO) {
		//limpa todos os campos do pagamento          
		window[CENTRO_CUSTO + "___" + linha].clear();
		//limpa campo de codigo do produto
		window[COD_PRODUTO + "___" + linha].clear();
		$('#codcentrocusto___' + linha).val("");
		$('#unidademedida___' + linha).val("");
		$('#precounitario___' + linha).val(0);
		$('#vltotalproduto___' + linha).val(0);

	} else if (campo == COD_PRODUTO) {
		//limpa todos os campos do pagamento          
		window[PRODUTO + "___" + linha].clear();
		//limpa campo de descrição do produto
		window[PRODUTO + "___" + linha].clear();
		//limpa campo de centro de custo
		window[CENTRO_CUSTO + "___" + linha].clear();
		$('#codcentrocusto___' + linha).val("");
		$('#unidademedida___' + linha).val("");
		$('#precounitario___' + linha).val(0);
		$('#vltotalproduto___' + linha).val(0);

	} else if (campo == CENTRO_CUSTO) {
		$('#codcentrocusto___' + linha).val("");
	} else if (campo == EMPRESA) {
		window[FILIAL].clear();
		$('#codempresa').val("");

	} else if (campo == FILIAL) {
		$('#codfilial').val("");
		$('#cnpj').val("");

	}

}

//preenche campos ZOOM
function setSelectedZoomItem(selectedItem) {
	var PRODUTO = "produto";
	var CENTRO_CUSTO = "centrocusto";
	var EMPRESA = "empresa";
	var FILIAL = "filial";
	var COD_PRODUTO = "codproduto";
	var PRODUTO_CADASTRADO = "produtocadastrado";

	//Recebe o nome do campo zoom
	var campoZOOM = selectedItem.inputId;

	//separa string
	var separaCampo = campoZOOM.split('___');
	var campo = separaCampo[0];
	var linha = separaCampo[1];

	//compara para verificar se o zoom é o campo centro de custo
	if (campo == PRODUTO) {
		if (selectedItem["CostCenterCode"] != ""
				&& selectedItem["CostCenterCode"] != null
				&& selectedItem["CostCenterCode"] != undefined
				&& selectedItem["CostCenterCode"].trim() > 0) {

			//Preenche campo centro de custo
			window[CENTRO_CUSTO + "___" + linha]
					.setValue(selectedItem["CostCenterCode"].trim());
			//$('#codcentrocusto___' + linha).val(selectedItem["CostCenterCode"].trim());

		}

		$('#unidademedida___' + linha).val(
				selectedItem["UnitOfMeasureCode"].trim());
		$('#precounitario___' + linha).val(selectedItem["LastPurchasePrice"]);
		//preenche campo de código do produto
		window[COD_PRODUTO + "___" + linha].setValue(selectedItem["Code"]);

	} else if (campo == COD_PRODUTO) {
		if (selectedItem["CostCenterCode"] != ""
				&& selectedItem["CostCenterCode"] != null
				&& selectedItem["CostCenterCode"] != undefined
				&& selectedItem["CostCenterCode"].trim() > 0) {
			//Preenche campo centro de custo
			window[CENTRO_CUSTO + "___" + linha]
					.setValue(selectedItem["CostCenterCode"].trim());
			//$('#codcentrocusto___' + linha).val(selectedItem["CostCenterCode"].trim());
		}

		$('#unidademedida___' + linha).val(
				selectedItem["UnitOfMeasureCode"].trim());
		$('#precounitario___' + linha).val(selectedItem["LastPurchasePrice"]);
		//preenche campo de código do produto
		window[PRODUTO + "___" + linha].setValue(selectedItem["Description"]);

	} else if (campo == CENTRO_CUSTO) {
		$('#codcentrocusto___' + linha).val(selectedItem["Code"].trim());
	} else if (campo == EMPRESA) {
		$('#codempresa').val(selectedItem["Code"].trim());
		//Envia filtro para filiais
		//reloadZoomFilterValues(FILIAL, "EnterpriseGroup," + selectedItem["Code"]);
	} else if (campo == FILIAL) {
		$('#codfilial').val(selectedItem["Code"].trim());
		$('#cnpj').val(selectedItem["Cgc"].trim());

	}

}

//função responsavel por identificar linha que está sendo informado se o produto esta cadastrado ou não
function produtoCadastrado(combo){
	var linha = combo.id.substring(combo.id.indexOf('___') + 3);
	if (combo.value == "sim"){
		$("#novoproduto___"+linha).prop("readonly", true);
		window["produto___"+linha].disable(false);
		window["codproduto___"+linha].disable(false);
		window["centrocusto___"+linha].disable(false);
		
	}
	else if (combo.value == "nao"){
		$("#novoproduto___"+linha).prop("readonly", false);
		window["produto___"+linha].disable(true);
		window["codproduto___"+linha].disable(true);
		window["centrocusto___"+linha].disable(false);
		
	}
}

function fnCustomDeleteProduto(oElement) {	 
	console.log(ATIVIDADE_FLUIG);
	if (ATIVIDADE_FLUIG == (0 && 4) ){								
		fnWdkRemoveChild(oElement);	
		

	}
	else {
		FLUIGC.toast({
            title: 'Atenção',
            message: 'Você não pode remover nenhuma linha .',
            type: 'warning',
            timeout: 3000
        });		
	}		
}
function recarregaCalendarioDataNecessidade(){
	$("input[name^='codproduto___']").each(function () {
		var campo = $(this).attr("name");

		//separa campo do indice
		var linha = campo.split('___');	
		FLUIGC.calendar("#dtnecessidade___" + linha[1], {
			pickDate : true,
			pickTime : false,
			minDate : new Date().toLocaleString()

		});
	});
}