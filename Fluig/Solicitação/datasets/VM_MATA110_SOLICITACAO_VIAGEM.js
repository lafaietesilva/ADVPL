function createDataset(fields, constraints, sortFields) {
	
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("RETORNO");
	dataset.addColumn("NUMERO");
	
	var aItemServico = new Array();
	var aRateio;
	var itens = new Array();
	var emailcomprador;
	var tipoViagem;
	var documentId;
	var acao = 3;
	var filial ='02';
	
	//INTEGRAÇÃO PARA SER REALIZADA PRECISA RECEBER UMA CONSTRAINT COM O CAMPO solicitacao NA POSIÇÃO 0 e do tipo MUST
    if(constraints !== null && constraints.length){
    	if(constraints[0].constraintType==ConstraintType.MUST && constraints[0].fieldName == "documentid") {
    		
    			var c0 = DatasetFactory.createConstraint("documentid", constraints[0].initialValue, constraints[0].initialValue, ConstraintType.MUST);	
    			var c1 = DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST);        		
        		var solicitacao = DatasetFactory.getDataset("VM_SolicitacoesViagens", null, new Array(c0,c1), null);
        		
        		tipoViagem = solicitacao.getValue(0,"tipoviagem");
        		documentId = solicitacao.getValue(0,"documentid");
        		
        		var retornaProcessoSolicitacao = retornaSolicitacao(solicitacao.getValue(0,"metadata#card_index_id"),solicitacao.getValue(0,"documentid"),solicitacao.getValue(0,"companyid"));
        		var codSolicitacao = retornaProcessoSolicitacao.getValue(0,"workflowProcessPK.processInstanceId");
        		
        		for (var a=0; a<constraints.length; a++){
        			if (constraints[a].fieldName == "comprador"){
            			emailcomprador = constraints[a].initialValue;            			
            			//break;
            		}        			
        		}
        		
        		if (solicitacao.getValue(0,"filialSC") != "" && solicitacao.getValue(0,"filialSC") !=null){
         		//	 filial = solicitacao.getValue(0,"filialSC");
         		}
       	 
        	     		
        		var c2 = DatasetFactory.createConstraint("metadata#id", constraints[0].initialValue, constraints[0].initialValue, ConstraintType.MUST);    
        		var itensSolicitacao = DatasetFactory.getDataset("VM_SolicitacoesViagemDadosPagamento", null, new Array(c2), null);    				  

       					 try {
        						//chama função que monta array de objetos dos itens do rateio
        						 aRateio = preencheRateio(itensSolicitacao);
        					 }
        					 catch (erro){
        						 dataset.addRow(["ERRO AO RECUPERAR RATEIO"]);
        						 return dataset;
        					 }
        				  				 
        					 
        					 try {
        						 
        						 
        						 for (var a=0; a<constraints.length;a++){
        							 var codproduto;
        							 var vpassagem;
        							 var qtde;
        							 var dataviagem;        							 
        								 
        							 if (constraints[a].fieldName == "produto" ){
        								 codproduto = constraints[a].initialValue;
        								 
        							 }
        							 else if (constraints[a].fieldName == "quantidade" ){
        								 qtde = constraints[a].initialValue;
        							 }
        							 else if (constraints[a].fieldName == "valor" ){
        								 vpassagem = constraints[a].initialValue;        								    						 
        							 }
        							 else if (constraints[a].fieldName == "dataViagem" ){
        								 dataviagem = constraints[a].initialValue;       
        								//chama função que monta array de objetos dos itens da viagem   
        								 aItemServico.push(addItemViagem(codproduto,codSolicitacao,qtde,vpassagem,dataviagem));       
        								
        								 
        							 }       						
         						 }            					 
        					 }
        					 catch (erro){
        						 dataset.addRow(["ERRO AO MONTAR ITENS"]);
        						 return dataset;
        					 }
        					 
        					 
        					if (solicitacao.getValue(0,"pedirPassagem") == "sim"){
        			
        						 try{
             						
            						 var dataAtual = new Date();
            						 var dataFIR = convertDataToString(dataAtual)
            						 // criação do item taxa de serviço
    	            				 aItemServico.push(addItemViagem("GGTXS001",codSolicitacao,1,0,dataFIR));    
            					 }
            					 catch (erro){
            						 dataset.addRow(["ERRO AO CRIAR TAXA FIR"]);
            						 return dataset;
            					 }
           					      
            					 
        					}
        			
        					
        					 try{
        					        var clientService = fluigAPI.getAuthorizeClientService();
        					        var data = {
        					            companyId : 1 + '',
        					            serviceCode : 'REST FLUIG',
        					            endpoint : '/F_MATA110',
        					            method : 'POST',// 'delete', 'patch', 'put', 'get'     
        					            timeoutService: '420', // segundos
        					            params : {
        					            	PROCESSO : '' + 1 + '' ,
        					            	ACAO: '' + acao + '',
        					            	FILIAL: '' + filial + '',
        					            	SOLICITACAO : '' + codSolicitacao + '' ,
        					            	SOLICITANTE : '' + solicitacao.getValue(0,"solicitante") +'',
        					            	EMAILSOLICITANTE : '' + solicitacao.getValue(0,"emailsolicitante") +'', 
        					                DATASOLICITACAO :'' + solicitacao.getValue(0,"datasolicitacao") +'',	
        					                PASSAGEIRO : '' + solicitacao.getValue(0,"nomepassageiro") +'',
        					                ITENS: aItemServico ,
        					        		RATEIODIGITADO: aRateio,
        					        		COMPRADOR: '' + emailcomprador +'',
        					        		TIPOVIAGEM: '' + tipoViagem +'',
        					        		DOCUMENTID: '' + documentId +'' ,
        					        		OBSERVACAO:'' + solicitacao.getValue(0,"finalidade") + '',
        					        		EVENTO: '' + solicitacao.getValue(0,"dataset_solicitacaoevento") + ''
        					            },
        					          options : {
        					             encoding : 'UTF-8',
        					             mediaType: 'application/json'
        					          }
        					        }
        					             
        					      
        					       
        					        
        					        var vo = clientService.invoke(JSON.stringify(data));  					        
        					        var obj = JSON.parse(vo.getResult());
        					         					        
        					        if(vo.getResult()== null || vo.getResult().isEmpty()){
         					        	dataset.addRow(new Array("RETORNO VAZIO"));
        					        }        					                					       
        					        else if((JSON.parse(vo.getResult()).errorMessage != null && JSON.parse(vo.getResult()).errorMessage != "")){
        					        	dataset.addRow(new Array(JSON.parse(vo.getResult()).errorMessage));
        					        }
        					        else if (JSON.parse(vo.getResult()).CODIGO != "201"){
        					        	dataset.addRow(new Array(obj.MSG));
        					        }
        					        else if (JSON.parse(vo.getResult()).CODIGO == "201"){	                    
        					            //dataset.addRow(new Array("SUCESSO"));					           
        					        	dataset.addRow(new Array("SUCESSO",JSON.parse(vo.getResult()).NUMERO));	
        					        }
        					      
        					    
        					
        					 } 
        						catch(err) {
        							dataset.addRow([err.message]);     
        							 return dataset;
        					    }

    		}
    		
    		
    }
    	 	
	return dataset;
}


//FUNÇÃO QUE MONTA OBJETO E ADD ITEM NA SOLICITAÇÃO DE COMPRA
function addItemViagem(produto,codigo,qtde, nValor,dataviagem){
	   var itemServico = { 
				produto: ''+produto +'', 
				quantidade: ''+ qtde +'',
				codSolicitacao: '' + codigo +'',					
				valor: '' + nValor + '',
				dtViagem :''+ dataviagem +''
					};	
		
		return itemServico;
}


function preencheRateio(solicitacao){
	   var rateio = new Array();
	   
	   for (var i=0; i < solicitacao.rowsCount ; i++){
			var obj = {
					ccusto : '' ,
					projeto :'' ,
					atividade :'' ,
					categoria :'' ,
					fonte :'' ,
					area :'' ,
					alocacao :'' ,
					conta : '' ,
					localizacao :''
					
			};		    				 
			obj.ccusto =  '' + solicitacao.getValue(i, "CENTRO_CUSTO") +'';	
			obj.atividade = '' + solicitacao.getValue(i, "ATIVIDADE") +'';	
			obj.alocacao = '' + solicitacao.getValue(i, "ALOCACAO") +'';
			obj.localizacao = '' + solicitacao.getValue(i, "LOCALIZACAO") +'';		    					
			obj.percentual = 1 * parseFloat(solicitacao.getValue(i, "PERCENTUAL")) ;
			
			if (solicitacao.getValue(i, "PROJETO") != null){
				obj.projeto = '' + solicitacao.getValue(i, "PROJETO") +'';	
			}						    				
			if (solicitacao.getValue(i, "CATEGORIA") != null){
				obj.categoria = '' + solicitacao.getValue(i, "CATEGORIA") +'';
			}		    					
			if (solicitacao.getValue(i, "FONTE") != null){
				obj.fonte = '' + solicitacao.getValue(i, "FONTE") +'';
			}	    					
			if (solicitacao.getValue(i, "AREA")  != null){
				obj.area = '' + solicitacao.getValue(i, "AREA") +'';
			}									
			if (solicitacao.getValue(i, "CONTA_CONTABIL") != null){
				obj.conta = '' + solicitacao.getValue(i, "CONTA_CONTABIL") +'';	
			}
			
			rateio[i] = obj;	
				
	   }
	 			   
	   return rateio;
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

//recebe como parametro:metadata#card_index_id, metadate#id, companyid
function retornaSolicitacao(cardindexdocumentid,carddocumentid,empresa){
	  var constraintsHistorico  = new Array();	    	 
		 constraintsHistorico.push(DatasetFactory.createConstraint("cardIndexDocumentId", cardindexdocumentid , cardindexdocumentid, ConstraintType.MUST));
		 constraintsHistorico.push(DatasetFactory.createConstraint("cardDocumentId", carddocumentid , carddocumentid, ConstraintType.MUST));	    	
		 constraintsHistorico.push(DatasetFactory.createConstraint("workflowProcessPK.companyId", empresa , empresa, ConstraintType.MUST));	    	
		 
   var historicoFormulario = DatasetFactory.getDataset("workflowProcess", null, constraintsHistorico, null);	       		 

   return historicoFormulario;
}

//recebe data JS e convert para data FLuig
function convertDataToString(dataToString) {
    var dia;

    //MES INICIA DO ZERO POR ISSO SOMA 1 PARA ACHAR O MES CORRETO
    var mes = dataToString.getMonth() + 1;

   // console.log("MES: " + mes);

    if (dataToString.getDate().toString().length == 1) {
        dia = dataToString.getDate();
        dia = "0" + dia.toString();

    } else {
        dia = dataToString.getDate();

    }

   // console.log("TAMANHO MES: " + mes.toString().length);
    //converte mes
    if (mes.toString().length == 1) {
        mes = "0" + mes.toString();

    }
    //else {mes = dataToString.getMonth() + 1;}


    //novo formato de data: para salvar em campos data do Fluig
    return dia + "/" + mes + "/" + dataToString.getFullYear();


}