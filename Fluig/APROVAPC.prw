#Include 'Protheus.ch'
#Include 'FWMVCDEF.ch'
#Include 'RestFul.CH'
#INCLUDE "TOTVS.CH"
#INCLUDE "TopConn.ch"
#INCLUDE "TBICONN.CH"
#Include 'parmtype.ch'

//Início da declaração da estrutura do Webservice;
WSRESTFUL APROVAPC DESCRIPTION "Aprovacao"

	WSMETHOD POST DESCRIPTION "Aprovacao de pedido de compra" WSSYNTAX " enviar via body dados conforme documentacao"
END WSRESTFUL

WSRESTFUL RETAPROV DESCRIPTION "Retorna email de aprovador "

	WSMETHOD POST DESCRIPTION "Retorna email de aprovador" WSSYNTAX " enviar via body dados conforme documentacao"
END WSRESTFUL

WSRESTFUL ENVAPROV DESCRIPTION "Envia aprovação "

	WSMETHOD POST DESCRIPTION "Envia aprovação" WSSYNTAX " enviar via body dados conforme documentacao"
END WSRESTFUL

WSMETHOD POST WSSERVICE RETAPROV
	Local cJson           := Self:GetContent()
	Local oJson
	Private cMensagem := ""

	::SetContentType("application/json")

	oJson := JsonObject():New()

	oRet := oJson:FromJson(cJson)

	if ValType(oRet) == "U"
		aDados := oJson:GetNames()
		nPosCNPJ := aScan(aDados,{|x| x == "cnpj"})
		nPosApro := aScan(aDados,{|x| x == "aprovador"})

		cCnpj := oJson:GetJsonText(aDados[nPosCNPJ])
		cAprov:= oJson:GetJsonText(aDados[nPosApro])

		//Procura Filial para conectar
		U_WSSeekFil(cCnpj)

		//Verifica se o aprovador está ausente
		dbSelectArea("SAK")
		SAK->(dbSetOrder(1))
		IF SAK->(MsSeek(xFilial("SAK")+cAprov))
			__cUserID := SAK->AK_USER

			::SetResponse("{'nome':'"+Alltrim(FwGetUserName(RetCodUsr()))+"','email':'"+AllTrim(UsrRetMail(RetCodUsr()))+"'}")
		Else
			::SetResponse("{'nome':'nao_encontrado','email':''}")
		Endif
	Endif
	FreeObj(oJson)

Return .T.


WSMETHOD POST WSSERVICE APROVAPC

	Local cJson           := Self:GetContent()
	Local oJson
	Private cMensagem := ""

	::SetContentType("application/json")

	oJson := JsonObject():New()

	oRet := oJson:FromJson(cJson)

	if ValType(oRet) == "U"
		IF Aprova(oJson)
			::SetResponse("{'status':'success','message':'pedido aprovado'}")
		Else
			::SetResponse("{'status':'error','message':'"+cMensagem+"'}")
		Endif
	else
		Conout("Falha ao popular JsonObject. Erro: " + oRet)
	endif
	FreeObj(oJson)

Return .T.


WSMETHOD POST WSSERVICE ENVAPROV

	Local cJson           := Self:GetContent()
	Local oJson
	Private cMensagem := ""

	::SetContentType("application/json")

	oJson := JsonObject():New()

	oRet := oJson:FromJson(cJson)

	if ValType(oRet) == "U"
		IF Aprova(oJson,.T.)
			::SetResponse("{'status':'success','message':'pedido aprovado'}")
		Else
			::SetResponse("{'status':'error','message':'"+cMensagem+"'}")
		Endif
	else
		Conout("Falha ao popular JsonObject. Erro: " + oRet)
	endif
	FreeObj(oJson)

Return .T.

Static Function Aprova(oJson,lNovo)
	Local cNum      := ""       //-- Recebe o número do documento a ser avaliado
	Local cTipo     := ""       //-- Recebe o tipo do documento a ser avaliado
	Local cAprov    := ""       //-- Recebe o código do aprovador do documento
	Local lOk       := .T.      //-- Controle de validação e commit
	Local cCodFluig := ""
	//Local aErro     := {}       //-- Recebe msg de erro de processamento

	Default lNovo := .F.

	aDados := oJson:GetNames()
	nPosCNPJ := aScan(aDados,{|x| x == "cnpj"})
	nPosPed  := aScan(aDados,{|x| x == "pedido"})
	nPosApro := aScan(aDados,{|x| x == "aprovador"})
	nPosOk   := aScan(aDados,{|x| x == "aprovado"})
	nPosTipo := aScan(aDados,{|x| x == "tipo"})
	nPosObs  := aScan(aDados,{|x| x == "observacao"})
	nPosCod  := aScan(aDados,{|x| x == "codfluig"})

	cCnpj := oJson:GetJsonText(aDados[nPosCNPJ])
	cNum  := oJson:GetJsonText(aDados[nPosPed])
	cAprov:= oJson:GetJsonText(aDados[nPosApro])
	cOk   := oJson:GetJsonText(aDados[nPosOk])
	cTipo := oJson:GetJsonText(aDados[nPosTipo])
	cObs  := oJson:GetJsonText(aDados[nPosObs])
	If nPosCod > 0
		cCodFluig := oJson:GetJsonText(aDados[nPosCod])
	Endif

	//Procura Filial para conectar
	U_WSSeekFil(cCnpj)
	//-- Códigos de operações possíveis (vaariável cOK) :
	//--    "001" // Liberado
	//--    "002" // Estornar
	//--    "003" // Superior
	//--    "004" // Transferir Superior
	//--    "005" // Rejeitado
	//--    "006" // Bloqueio
	//--    "007" // Visualizacao

	lOk := AprovPCA(cNum, cTipo, cAprov, cOk, cObs, cCnpj, cCodFluig, lNovo)

	
Return lOk

Static Function AprovPCA(cPedido, cTp, cAprv, cCodApv, cObs, cCnpj, cCodFluig, lNovo)

	Local oModel094 := Nil     //-- Objeto que receberá o modelo da MATA094
	Local cNum      := cPedido //-- Recebe o número do documento a ser avaliado
	Local cTipo     := cTp     //-- Recebe o tipo do documento a ser avaliado
	Local cAprov    := cAprv   //-- Recebe o código do aprovador do documento
	Local nLenSCR   := 0       //-- Controle de tamanho de campo do documento
	Local lOk       := .T.     //-- Controle de validação e commit
	Local aErro     := {}      //-- Recebe msg de erro de processamento
	Private lMsErroAuto 	 := .F.
	Private lMsHelpAuto 	 := .T.
	Private lAutoErrNoFile   := .T.

	If !lNovo
		nLenSCR := TamSX3("CR_NUM")[1] //-- Obtem tamanho do campo CR_NUM
		DbSelectArea("SCR")
		SCR->(DbSetOrder(3)) //-- CR_FILIAL+CR_TIPO+CR_NUM+CR_APROV

		If SCR->(DbSeek(xFilial("SCR") + cTipo + Padr(cNum, nLenSCR) + cAprov))
			__cUserID  := SCR->CR_USER //"000199"

			//-- Códigos de operações possíveis:
			//--    "001" // Liberado
			//--    "002" // Estornar
			//--    "003" // Superior
			//--    "004" // Transferir Superior
			//--    "005" // Rejeitado
			//--    "006" // Bloqueio
			//--    "007" // Visualizacao

			//-- Seleciona a operação de aprovação de documentos
			A094SetOp(cCodApv)

			//-- Carrega o modelo de dados e seleciona a operação de aprovação (UPDATE)
			oModel094 := FWLoadModel('MATA094')
			oModel094:SetOperation( MODEL_OPERATION_UPDATE )
			oModel094:Activate()

			IF cCOdApv == "005"
				//-- Preenche justificativa
				oModel094:GetModel('FieldSCR'):SetValue('CR_OBS', cObs)
			EndIf

			//-- Valida o formulário
			lOk := oModel094:VldData()

			If lOk
				//-- Se validou, grava o formulário
				lOk := oModel094:CommitData()
			EndIf

			//-- Avalia erros
			If !lOk
				//-- Busca o Erro do Modelo de Dados
				aErro := oModel094:GetErrorMessage()
				cMensagem := AllToChar(aErro[06])
			Else

				//-- Desativa o modelo de dados
				oModel094:DeActivate()

				__cUserID := ""
				If cCodApv == "001"
					// U_APROVAWF(cPedido,3)
				ElseIf cCodApv == "005"
					U_APROVAWF(cPedido,5)
				Endif
			EndIf
		Else
			cMensagem := "Documento nao encontrado"
		EndIf
	Else
		//Envia o Cancelamento antes para enviar a aprovação 
		U_CancPed(cPedido,cCnpj,cCodfluig)

		U_APROVAWF(cPedido,3)
	EndIf

Return lOk
