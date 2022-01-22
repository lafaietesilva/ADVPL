var ABERTURA = 0;
var SOLICITAR = 4;
var ELABORAR =10;
var ASSINAR = 18;
var ANEXAR = 57;
var CONFIGURAR = 51;


var dtSolicitacao = FLUIGC.calendar('#dataSolicitacao', {
    pickDate: true,
    pickTime: false,
    useCurrent: true,
    minDate: new Date().toLocaleString(),
    maxDate: new Date().toLocaleString()
});




//preenche data da solicitação no momento que abre a solicitação
$(document).ready(function() {	
	//console.log(ATIVIDADE);
	
	
	if (ATIVIDADE_FLUIG == ABERTURA || ATIVIDADE_FLUIG == SOLICITAR){
		dtSolicitacao.setDate(new Date().toLocaleString());
		
		var dtInicio = FLUIGC.calendar('#dtInicio', {
		    pickDate: true,
		    pickTime: false,
		    minDate: new Date().toLocaleString()
		    
		});
				
		var dtFim = FLUIGC.calendar('#dtFim', {
		    pickDate: true,
		    pickTime: false,
		    minDate: new Date().toLocaleString()
		});
		
	 	   $("#dtInicio").blur(function(){            
	 		    FLUIGC.toast({
                    title: 'Informação',
                    message: 'Serviços contratados só podem ter sua vigência programada até o final do ano fiscal.',
                    type: 'warning',
                    timeout: 6000
                });
           });
	 	   
	 	
	 	   
		   $("#dtFim").blur(function(){  
			   var dataInicio =  $("#dtInicio").val(); // 03/11/2019
               var arr = dataInicio.split("/").reverse();
               var dia = new Date(arr[0], arr[1] - 1, arr[2]);
                 
               var AnoFiscal;
                
               //MONTA AF FISCAL
               if (dia.getMonth() > 8){
            	   AnoFiscal = dia.getFullYear() + 1;
               }
               else {
            	   AnoFiscal = dia.getFullYear();
               }
               
               //DATA LIMITE
               var dtLimite = new Date (AnoFiscal,8,'30')
             
               
               var data = this.value;
               var arrF = data.split("/").reverse();
               var diaFinal = new Date(arrF[0], arrF[1] - 1, arrF[2]);
             
             
               
               if (diaFinal > dtLimite){
            	    FLUIGC.toast({
                        title: 'Informação',
                        message: 'O serviço contratado só podem ter sua vigência programada até o final do AF '+ AnoFiscal,
                        type: 'danger',
                        timeout: 6000
                    });
               }
	          });
		
	}

	
});



//preenche campos ZOOM
function setSelectedZoomItem(selectedItem) {
  var FORNECEDOR ="cnpjcpf";
  var CONDICAO_PGTO ="condicaoPgto";    
  var CONTRATO = "Numerocontrato";
  var TIPO_CONTRATO ="tipoContrato";
  var TIPO_REVISAO = "tipoRevisao";


	  //Recebe o nome do campo zoom
	  var campoZOOM = selectedItem.inputId;

	  //compara para verificar se o zoom é o campo centro de custo
	 if (campoZOOM == FORNECEDOR){
		    $("#razaosocial").val(selectedItem["RAZAO_SOCIAL"]);    		
	  		$("#nomefantasia").val(selectedItem["FANTASIA"]);  		
	  		$("#codigoFornecedor").val(selectedItem["CODIGO"]);   
	  		
	   		if (selectedItem["TIPO"] == "JURIDICA"){ 
	       		document.getElementById("juridica").click();  
	      	}
	  		else if (selectedItem["TIPO"] == "FISICA"){
	   			document.getElementById("fisica").click();  
	  		}
	  		else if (selectedItem["TIPO"] == "FUNCIONARIO"){
	   			document.getElementById("fisica").click();  
	  		}
	  		  	 		
	  		$("#meioPagamento").val(selectedItem["FORM_PGTO"]);
	  		$("#banco").val(selectedItem["BANCO"]);   
	  		$("#agencia").val(selectedItem["AGENCIA"]);   
	  		$("#contaFornecedor").val(selectedItem["CONTA_F"]);   
	  		$("#tipoConta").val(selectedItem["TIPO_CONTA"]);    
	  		
	  		reloadZoomFilterValues(CONTRATO, "CGC," + selectedItem["CNPJ"]);
	  		
	  		window[CONTRATO].disable(false);
	
	  }
	 else if (campoZOOM == CONDICAO_PGTO){
			$("#codCondPgto").val(selectedItem["CODIGO"]);
	 }
	 
	else if (campoZOOM == CONTRATO){
	    	$("#revisao").val(selectedItem["REVISAO"]);
	    	$("#dtInicioC").val(selectedItem["DT_INICIO"]);
	    	$("#dtFimC").val(selectedItem["DT_FIM"]);
	    	$("#vlcontrato").val(selectedItem["VALOR_TOTAL"]);
	    	$("#saldoAtual").val(selectedItem["SALDO"]);
	    	$("#filial").val(selectedItem["FILIAL"]);
	    	window[TIPO_CONTRATO].disable(true);
	    	window[TIPO_REVISAO].disable(false);
	    	console.log(selectedItem["FILIAL"]);
	    	
	 }
	else if (campoZOOM == TIPO_CONTRATO){			
			window[TIPO_REVISAO].disable(true);
			window[CONTRATO].disable(true);
			
	}
	else if (campoZOOM == TIPO_REVISAO){			
			window[CONTRATO].disable(false);
			window[TIPO_CONTRATO].disable(true);
			reloadZoomFilterValues(CONTRATO, "CGC," + $("#cnpjcpf").val());
	}
	  
}

function removedZoomItem(removedItem) {
	var FORNECEDOR ="cnpjcpf";
     var CONDICAO_PGTO ="condicaoPgto";    
     var CONTRATO = "Numerocontrato";
     var TIPO_CONTRATO ="tipoContrato";
     var TIPO_REVISAO = "tipoRevisao";
     
    //Recebe o nome do campo zoom
    var campoZOOM = removedItem.inputId;

    if (campoZOOM == FORNECEDOR){
	    	$("#fisica").attr('checked', false);
	    	$("#juridica").attr('checked', false);
	    	$("#razaosocial").val("");  
			$("#nomefantasia").val("");  		
			$("#codigoFornecedor").val("");   	
			$("#meioPagamento").val("");
			$("#banco").val("");   
			$("#agencia").val("");   
			$("#contaFornecedor").val("");   
			$("#tipoConta").val("");   
			
			window[CONTRATO].clear();
			$("#revisao").val("");
	    	$("#dtInicioC").val("");
	    	$("#dtFimC").val("");
	    	$("#vlcontrato").val("");
	    	$("#saldoAtual").val("");
	    	$("#filial").val("");	
	    	window[CONTRATO].disable(true);
	    	window[TIPO_REVISAO].clear();
	    	window[TIPO_CONTRATO].clear();
	    	window[TIPO_REVISAO].disable(true);
		 	window[TIPO_CONTRATO].disable(true);
    	
    }
	 else if (campoZOOM == CONDICAO_PGTO){
				$("#codCondPgto").val("");
	 }
	 else if (campoZOOM == CONTRATO){
			 	$("#revisao").val("");
			 	$("#dtInicioC").val("");
			 	$("#dtFimC").val("");
			 	$("#vlcontrato").val("");
			 	$("#saldoAtual").val("");
			 	$("#filial").val("");
			 	window[TIPO_REVISAO].clear();
			 	window[TIPO_REVISAO].disable(true);
			 	window[TIPO_CONTRATO].disable(false);
			 	
	 }
	 else if (campoZOOM == TIPO_CONTRATO){
			 	window[TIPO_REVISAO].disable(false);
			 	window[CONTRATO].disable(false);
			 	
	 }
	 else if (campoZOOM == TIPO_REVISAO){
			 	window[TIPO_CONTRATO].disable(false);
	 }
 
}