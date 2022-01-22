#Include "PROTHEUS.ch"
#Include "AP5MAIL.ch"
#Include "TBICONN.ch"
#Include "totvs.ch"
#INCLUDE "rwmake.ch"

User Function APROVAWF(cNumPed,nOpc)

	Local aAprova := {}
	Local cCnpj
	Local cRet

	Default nOpc := 0

	//PREPARE ENVIRONMENT EMPRESA cEmpAnt FILIAL cFilAnt

	DbSelectArea("SC7")
	SC7->(DbSetOrder(1))
	SC7->(MsSeek(xFilial("SC7") + cNumPed))

	If nOpc == 0
		Return
	EndIf

	//cNumPed := SC7->C7_NUM
	cCnpj 	:= U_WSSeekFil()

	If nOpc == 5
		U_CancPed(cNumPed,cCnpj)
	Else
		dbSelectArea("SY1")
		SY1->(dbSetOrder(1))
		SY1->(dbSeek(xFilial("SY1") + SC7->C7_COMPRA))

		cNmCom    := SY1->Y1_NOME
		cEmailCom := SY1->Y1_EMAIL

		//Envia o cancelamento só na alteração
		IF nOpc == 4
			//Envia os cancelamentos
			cRet := U_CancPed(cNumPed,cCnpj)
			IF !Empty(cRet)
				IF ValType(cRet) == "C"
					IF !"SUCCESS" $ Upper(cRet)
						Return
					Endif
				Else
				ConOut("Nao conseguiu enviar o cancelamento - provavelmente fora do ar o fluig")
				EndIf
			Endif
			
			
		Endif

		aAprova := fnAprovPC(cNumPed)

		IF Len(aAprova) > 0
			MailAprov(aAprova,cNumPed,cCnpj)
		Else
			ConOut("Não foi gerada aprovação para o pedido.")
		Endif
	EndIf

	//RESET ENVIRONMENT

Return


/*---------------------------------------------------------------------------
--  Função: Constroi vetor com dados dos aprovadores do Ped. de compra.    --
--          Passado como parametros.                                       --
--           Parametros:                                                   --
--             Recebe cPedido - Codigo do Pedido para Liberação.           --
--                          f                                               --
--             Devolve aAprovador - Vetor com os dados dos Aprovedores     --
--                                  do Pedido de Liberacao Descritos em    --
--                                  SCR - Doc's por alcada, sendo:         --
--                        aAprovador[01] - Codigo do Grupo de Aprovadores  --
--                        aAprovador[02] - Codigo do Aprovador             --
--                        aAprovador[03] - Codigo do usuario correspondete --
--                        aAprovador[04] - Nome                            --
--                        aAprovador[05] - Endereco de e-mail              --
--                        aAprovador[06] - Tipo de Aprovacao (Liberacao    --
--                                         ou Visto)                       --
--                        aAprovador[07] - "S" ou "N" Considera Limites    --
--                        aAprovador[08] - Tipo de Liberacao:              --
--                                         "U" - Usuario - Libera apenas   --
--                                               seu usuario               --
--                                         "N" - Pode Liberar todo o nivel --
--                                               a que este pertence       --
--                                         "P" - Libera todo o documento,  --
--                                               independente de outras    --
--                                               aprovacoes (autonomia     --
--                                               total.                    --
--                        aAprovador[09] - Tipo 			               --
-----------------------------------------------------------------------------*/
Static Function fnAprovPc(cPedido)
	Local aInfo		:= {}
	Local aAprovador:= {}
	Local lApvPC	:= .F.
	Local lApvIt	:= .F.
	Local cAprov	:= ""
	Local nNivel    := 1
	Local nCount    := 1

	dbSelectArea("SCR")
	SCR->(dbSetorder(1))
	IF SCR->(dbSeek(xFilial("SCR") + "PC" + cPedido))

		/*
		{ 'CR_STATUS== "01"', 'BR_AZUL' },;//Bloqueado p/ sistema(aguardando outros niveis)
		{ 'CR_STATUS== "02"', 'DISABLE' },;//Aguardando Liberacao do usuario
		{ 'CR_STATUS== "03"', 'ENABLE'  },;//Pedido Liberado pelo usuario
		{ 'CR_STATUS== "04"', 'BR_PRETO'},;//Pedido Bloqueado pelo usuario
		{ 'CR_STATUS== "05"', 'BR_CINZA'} }//Pedido Liberado por outro usuario
		*/

		// ---- Loop em documentacao p/alcada para verificar quem deve aprovar a liberacao
		While !(SCR->(Eof())) .and. SCR->CR_FILIAL == xFilial("SCR") .and. SCR->CR_TIPO == "PC" .and. Alltrim(SCR->CR_NUM) == cPedido
			lApvPC := .T.

			//-- Localiza O Aprovador e o Grupo de Aprovacao
			dbSelectArea("SAL")
			SAL->(dbSetorder(3))
			SAL->(dbSeek(xFilial("SAL") + SCR->CR_GRUPO + SCR->CR_APROV))

			//Verifica se o aprovador está ausente
			dbSelectArea("SAK")
			SAK->(dbSetOrder(1))
			SAK->(MsSeek(xFilial("SAK")+SCR->CR_APROV))

			//Informa que irá procurar o usuário pelo ID
			/*
			1 - ID do usuário/grupo
			2 - Nome do usuário/grupo;
			3 - Senha do usuário
			4 - E-mail do usuário
			*/
			PswOrder(1)
			IF PswSeek(SCR->CR_USER,.t.)
				__cUserID := SCR->CR_USER
			Endif

			//-- Verifica se esta aguardando liberacao e monta o ventor com os aprovadores do Grupo
			If Val(SCR->CR_STATUS) == 2 .and. PswSeek(SCR->CR_USER,.t.) .and. cAprov <> SCR->CR_APROV
				//Controle para saber qual nível de aprovação será enviado para o fluig
				IF nCount == 1
					nNivel :=  VAL(SCR->CR_NIVEL)
					nCount++
				Endif

				IF VAL(SCR->CR_NIVEL) == nNivel
					nNivel := VAL(SCR->CR_NIVEL) 
					cAprov := SCR->CR_APROV
					//aInfo := PswRet(1) //http://tdn.totvs.com/pages/releaseview.action?pageId=267792734

					//-- Monta vetor dos aprovadores {[Grupo de Apr.],[Aprovador],[USuario],[Nome],[e-mail],[Tipo de Aprovacao],[Considera Limites],[Tipo Lib.]}
					aAdd(aAprovador, {SCR->CR_GRUPO,;
						SCR->CR_APROV,;
						SCR->CR_USER,;
						FwGetUserName(SCR->CR_USER),;
						AllTrim(UsrRetMail(SCR->CR_USER)),;
						SAL->AL_LIBAPR,;
						SAL->AL_AUTOLIM,;
						SAL->AL_TPLIBER,;
						"PC"})
				Endif
			Endif

			SCR->(dbSkip())
		Enddo
	Endif

	IF !lApvPC
		dbSelectArea("SCR")
		SCR->(dbSetorder(1))
		SCR->(dbSeek(xFilial("SCR") + "IP" + cPedido))

		// ---- Loop em documentacao p/alcada para verificar quem deve aprovar a liberacao
		While !(SCR->(Eof())) .and. SCR->CR_FILIAL == xFilial("SCR") .and. SCR->CR_TIPO == "IP" .and. Alltrim(SCR->CR_NUM) == cPedido
			lApvIT := .T.

			//-- Localiza O Aprovador e o Grupo de Aprovacao
			dbSelectArea("SAL")
			SAL->(dbSetorder(3))
			SAL->(dbSeek(xFilial("SAL") + SCR->CR_GRUPO + SCR->CR_APROV))

			//Verifica se o aprovador está ausente
			dbSelectArea("SAK")
			SAK->(dbSetOrder(1))
			SAK->(MsSeek(xFilial("SAK")+SCR->CR_APROV))

			//Informa que irá procurar o usuário pelo ID
			/*
			1 - ID do usuário/grupo
			2 - Nome do usuário/grupo;
			3 - Senha do usuário
			4 - E-mail do usuário
			*/
			PswOrder(1)
			IF PswSeek(SCR->CR_USER,.t.)
				__cUserID := SCR->CR_USER
			Endif

			//-- Verifica se esta aguardando liberacao e monta o ventor com os aprovadores do Grupo
			If Val(SCR->CR_STATUS) == 2 .and. PswSeek(SCR->CR_USER,.t.) .and. cAprov <> SCR->CR_APROV
				//Controle para saber qual nível de aprovação será enviado para o fluig
				IF nCount == 1
					nNivel :=  VAL(SCR->CR_NIVEL)
					nCount++
				Endif
				
				IF VAL(SCR->CR_NIVEL) == nNivel 
					cAprov := SCR->CR_APROV
					aInfo := PswRet(1) //http://tdn.totvs.com/pages/releaseview.action?pageId=267792734

					//-- Monta vetor dos aprovadores {[Grupo de Apr.],[Aprovador],[USuario],[Nome],[e-mail],[Tipo de Aprovacao],[Considera Limites],[Tipo Lib.]}
					aAdd(aAprovador, {SCR->CR_GRUPO,;
						SCR->CR_APROV,;
						SCR->CR_USER,;
						FwGetUserName(SCR->CR_USER),;
						AllTrim(UsrRetMail(SCR->CR_USER)),;
						SAL->AL_LIBAPR,;
						SAL->AL_AUTOLIM,;
						SAL->AL_TPLIBER,;
						"IP"})
				Endif
			Endif

			SCR->(dbSkip())
		Enddo
	Endif

Return aAprovador


/*--------------------------------------------------
--  Função: Envia e-mail para os aprovadores.     --
--                                                --
----------------------------------------------------*/
Static Function MailAprov(aAprovPc,cNumPed,cCnpj)

	Local oJson
	Local oPedido
	//Local oItens
	Local oForms
	Local nX //,nZ,nY
	Local aJson
	Local nRet
	Local aItens := {}

	For nX := 1 to Len(aAprovPc)

		//Verifica se o pedido já foi enviado para o Fluig

		aItens := {}
		aAprovacao := {}
		aAdd(aAprovacao,aAprovPc[nX])
		oPedido := JsonObject():New()
		oPedido['targetState' ] := 35
		oPedido['targetAssignee' ] := "admin"
		oPedido['subProcessTargetState' ] := 0
		oPedido['comment' ] := "Solicitação iniciada automaticamente"
		oForms := JsonObject():new()

		AddForms(aAprovacao,@oForms,cNumPed,@aItens,cCnpj)

		oPedido['formFields'] := oForms

		cRet := U_ConFluig(oPedido:ToJson(),'/process-management/api/v2/processes/liberacaoDocumento/start')

		IF !Empty(cRet)
			IF ValType(cRet) == "C"
				oJson := Nil
				oJson := TJsonParser():New()
				aJson := {}
				nRet  := 0
				lRet := oJson:Json_Parser(cRet,Len(cRet),@aJson,@nRet)
	
				FreeObj(oJson)
			Endif
		Endif
		FreeObj(oForms)
		FreeObj(oPedido)
	Next nX

Return

Static Function AddForms(aAprovPc,oForms,cNumPed,aItens,cCnpj)

	Local i
	Local cNmUlAprv := ""
	Local cDtUlAprv := ""


	DbSelectArea("SC7")
	SC7->(DbSetOrder(1))
	SC7->(MsSeek(xFilial("SC7") + cNumPed))

	// ---- Verificar último aprovador
	cQuery := "Select SCR.CR_USER, SCR.CR_DATALIB from " + RetSqlName("SCR") + " SCR"
	cQuery += "   where SCR.D_E_L_E_T_ <> '*'"
	cQuery += "     and SCR.CR_FILIAL = '" + xFilial("SCR") + "'"
	cQuery += "     and SCR.CR_STATUS = '03'"
	cQuery += "     and SCR.CR_NUM    = '" + cNumPed + "'"
	cQuery += "     and SCR.CR_TIPO   IN ('PC','IP')"
	cQuery += "  Order by SCR.CR_FILIAL, SCR.CR_DATALIB desc"
	cQuery := ChangeQuery(cQuery)
	dbUseArea(.T.,"TOPCONN",TcGenQry(,,cQuery),"QAPV",.F.,.T.)

	If ! QAPV->(Eof())
		cNmUlAprv := UsrFullName(QAPV->CR_USER)
		cDtUlAprv := DToC(SToD(QAPV->CR_DATALIB))
	EndIf

	QAPV->(dbCloseArea())
	// -------------------------------

	//Enviar um e-mail para cada aprocador do mesmo nível
	For i := 1 to Len(aAprovPc)

		DbSelectArea("DBM")
		DBM->(DbSetOrder(1))
		IF DBM->(MsSeek(xFilial("DBM") + aAprovPc[i][9] + cNumPed))
			cQuery    := " SELECT DISTINCT SCR.CR_NUM,DBM.DBM_ITEM,DBM.DBM_ITEMRA "
			cQuery	  += " FROM "+RetSqlName("SCR")+" SCR LEFT JOIN "
			cQuery	  += RetSqlName("DBM")+" DBM ON "
			cQuery	  += " CR_TIPO=DBM_TIPO AND "
			cQuery	  += " CR_NUM=DBM_NUM AND "
			cQuery	  += " CR_GRUPO=DBM_GRUPO AND "
			cQuery	  += " CR_ITGRP=DBM_ITGRP AND "
			cQuery	  += " CR_USER=DBM_USER AND "
			cQuery	  += " CR_USERORI=DBM_USEROR AND "
			cQuery	  += " CR_APROV=DBM_USAPRO AND "
			cQuery	  += " CR_APRORI=DBM_USAPOR AND "
			cQuery    += " DBM.D_E_L_E_T_<> '*' "
			cQuery    += " WHERE SCR.CR_FILIAL='"+xFilial("SCR")+"' AND "
			cQuery    += " SCR.D_E_L_E_T_  <> '*' AND "
			cQuery    += " SCR.CR_APROV = '"+aAprovPc[i][2]+"' AND "
			cQuery    += " SCR.CR_NUM = '"+Padr(SC7->C7_NUM,Len(SCR->CR_NUM))+"' AND "
			cQuery    += " DBM.DBM_APROV = '2' AND "
			cQuery    += " (SCR.CR_TIPO = 'IP' OR SCR.CR_TIPO = 'PC' )"


			IF Select("QTMP") > 0
				QTMP->(DbCloseArea())
			EndIf

			dbUseArea(.T.,"TOPCONN",TcGenQry(,,cQuery),"QTMP",.F.,.T.)

			nCount := 1

			While ! QTMP->(Eof())
				DbSelectArea("SC7")
				SC7->(DbSetOrder(1))
				SC7->(DbSeek(xFilial("SC7") + SubStr(QTMP->CR_NUM,1,TamSx3("C7_NUM")[1]) + QTMP->DBM_ITEM))

				IF nCount == 1

					cCdFilial  := FwCodFil()
					cCdEmpresa := FwCodEmp()
					cNmFilial  := FwFilialName()
					cNmEmpresa := FwEmpName(cCdEmpresa)

					IF Alltrim(SC7->C7_TPFRETE) == "C"
						cFrete := "CIF"
					ElseIF  Alltrim(SC7->C7_TPFRETE) == "F"
						cFrete := "FOB"
					Else
						cFrete := "Nao informado"
					Endif

					DbSelectArea("SA2")
					SA2->(DbSetOrder(1))
					SA2->(MsSeek(xFilial("SA2") + SC7->C7_FORNECE + SC7->C7_LOJA))


					oForms["cnpj"] := cCnpj
					oForms["empresa"] := cCdEmpresa
					oForms["nomeempresa"] := cNmEmpresa
					oForms["filial"] := cCdFilial
					oForms["nomefilial"] := cNmFilial
					oForms["ultaprova"] := AllTrim(cNmUlAprv)
					oForms["dtaprova"] := cDtUlAprv
					oForms["aprovador"] := aAprovPc[i][02]
					oForms["pedido"] := SC7->C7_NUM
					oForms["emissao"] := DtoC(SC7->C7_EMISSAO)
					oForms["tipofrete"] := cFrete
					oForms["totalpedido"] := "0"
					oForms["codpgto"] := ""
					oForms["fornecedor"] := SA2->A2_COD + SA2->A2_LOJA + " - " + SA2->A2_NOME
					oForms["endereco"]:= SA2->A2_END
					oForms["telefone"]:= SA2->A2_TEL
					oForms["tipo"]:= aAprovPc[i][9]
					oForms["mailuser"]:= aAprovPc[i][5]
					oForms["nomeaprovador"] := aAprovPc[i][04]
				Endif

				cCCDesc := Posicione("CTT",1,xFilial("CTT") + SC7->C7_CC,"CTT_DESC01")
				cCC     := SC7->C7_CC + "-" + cCCDesc

				DbSelectArea("SB1")
				SB1->(DbSetOrder(1))
				SB1->(MsSeek(xFilial("SB1") + SC7->C7_PRODUTO))

				DbSelectArea("SB2")
				SB2->(DbSetOrder(1))
				SB2->(MsSeek(xFilial("SB2") + SC7->C7_PRODUTO))


				oForms["item___"+cValTochar(nCount)]           := StrZero(nCount,TamSX3("C7_ITEM")[1])
				oForms["produto___"+cValTochar(nCount)]        := SC7->C7_PRODUTO
				oForms["descricao___"+cValTochar(nCount)]      := SC7->C7_DESCRI
				oForms["quantidade___"+cValTochar(nCount)]     := Transform(SC7->C7_QUANT,PesqPict("SC7","C7_QUANT"))
				oForms["valorunit___"+cValTochar(nCount)]      := Transform(SC7->C7_PRECO,PesqPict("SC7","C7_PRECO"))
				oForms["valortotal___"+cValTochar(nCount)]     := Transform(SC7->C7_TOTAL,PesqPict("SC7","C7_TOTAL"))
				oForms["ccusto___"+cValTochar(nCount)]         := cCC
				oForms["ultcompra___"+cValTochar(nCount)]      := DtoC(SB1->B1_UCOM)
				oForms["vlultimacompra___"+cValTochar(nCount)] := Transform(SB1->B1_UPRC,PesqPict("SB1","B1_UPRC"))
				oForms["observacao___"+cValTochar(nCount)]     := SC7->C7_OBS

				nCount++
				QTMP->(DbSkip())
			EndDo
		Else

			nCount := 1
			While !SC7->(Eof()) .and. cNumPed == SC7->C7_NUM
				IF nCount == 1

					cCdFilial  := FwCodFil()
					cCdEmpresa := FwCodEmp()
					cNmFilial  := FwFilialName()
					cNmEmpresa := FwEmpName(cCdEmpresa)

					IF Alltrim(SC7->C7_TPFRETE) == "C"
						cFrete := "CIF"
					ElseIF  Alltrim(SC7->C7_TPFRETE) == "F"
						cFrete := "FOB"
					Else
						cFrete := "Nao informado"
					Endif

					DbSelectArea("SA2")
					SA2->(DbSetOrder(1))
					SA2->(MsSeek(xFilial("SA2") + SC7->C7_FORNECE + SC7->C7_LOJA))

					oForms["cnpj"] := cCnpj
					oForms["empresa"] := cCdEmpresa
					oForms["nomeempresa"] := cNmEmpresa
					oForms["filial"] := cCdFilial
					oForms["nomefilial"] := cNmFilial
					oForms["ultaprova"] := AllTrim(cNmUlAprv)
					oForms["dtaprova"] := cDtUlAprv
					oForms["aprovador"] := aAprovPc[i][02]
					oForms["pedido"] := SC7->C7_NUM
					oForms["emissao"] := DtoC(SC7->C7_EMISSAO)
					oForms["tipofrete"] := cFrete
					oForms["totalpedido"] := "0"
					oForms["codpgto"] := ""
					oForms["fornecedor"] := alltrim(SA2->A2_COD + SA2->A2_LOJA + " - " + SA2->A2_NOME)
					oForms["endereco"]:= alltrim(SA2->A2_END)
					oForms["telefone"]:= alltrim(SA2->A2_TEL)
					oForms["tipo"]:= aAprovPc[i][9]
					oForms["mailuser"]:= alltrim(aAprovPc[i][5])
					oForms["nomeaprovador"] := aAprovPc[i][04]
				Endif

				cCCDesc := Posicione("CTT",1,xFilial("CTT") + SC7->C7_CC,"CTT_DESC01")
				cCC     := SC7->C7_CC + "-" + cCCDesc

				DbSelectArea("SB1")
				SB1->(DbSetOrder(1))
				SB1->(MsSeek(xFilial("SB1") + SC7->C7_PRODUTO))

				DbSelectArea("SB2")
				SB2->(DbSetOrder(1))
				SB2->(MsSeek(xFilial("SB2") + SC7->C7_PRODUTO))

				oForms["item___"+cValTochar(nCount)]           := StrZero(nCount,TamSX3("C7_ITEM")[1])
				oForms["produto___"+cValTochar(nCount)]        := SC7->C7_PRODUTO
				oForms["descricao___"+cValTochar(nCount)]      := SC7->C7_DESCRI
				oForms["quantidade___"+cValTochar(nCount)]     := Transform(SC7->C7_QUANT,PesqPict("SC7","C7_QUANT"))
				oForms["valorunit___"+cValTochar(nCount)]      := Transform(SC7->C7_PRECO,PesqPict("SC7","C7_PRECO"))
				oForms["valortotal___"+cValTochar(nCount)]     := Transform(SC7->C7_TOTAL,PesqPict("SC7","C7_TOTAL"))
				oForms["ccusto___"+cValTochar(nCount)]         := alltrim(cCC)
				oForms["ultcompra___"+cValTochar(nCount)]      := DtoC(SB1->B1_UCOM)
				oForms["vlultimacompra___"+cValTochar(nCount)] := Transform(SB1->B1_UPRC,PesqPict("SB1","B1_UPRC"))
				oForms["observacao___"+cValTochar(nCount)]     := SC7->C7_OBS

				nCount++
				SC7->(DbSkip())
			EndDo

		Endif
	Next i

Return

User Function CancPed(cNumPed,cCnpj,cCodfluig)

	Local oCanc
	Local nX
	Local aConstraints := {}
	Local oConstraints
	Local cRet := ""

	Default cCodfluig := ""


	oCanc := JsonObject():New()
	oCanc['name' ] := "ds_cancelapedido"
	oCanc['fields' ] := {"pedido","cnpj"}
	oCanc['order'] := {"pedido","cnpj"}
	aConstraints := {}
	aAdd(aConstraints,JsonObject():new())
	aAdd(aConstraints,JsonObject():new())
	IF !Empty(cCodFluig)
		aAdd(aConstraints,JsonObject():new())
	Endif

	For nX := 1 to Len(aConstraints)
		If nX == 1
			aConstraints[nX]['_field']        := "pedido"
			aConstraints[nX]['_initialValue'] := cNumPed
			aConstraints[nX]['_finalValue']   := cNumPed
			aConstraints[nX]['_type']         := 1
			aConstraints[nX]['_likeSearch']   := .F.
		Elseif nX == 2
			aConstraints[nX]['_field']        := "cnpj"
			aConstraints[nX]['_initialValue'] := cCnpj
			aConstraints[nX]['_finalValue']   := cCnpj
			aConstraints[nX]['_type']         := 1
			aConstraints[nX]['_likeSearch']   := .F.
		Else
			aConstraints[nX]['_field']        := "codfluig"
			aConstraints[nX]['_initialValue'] := cCodfluig
			aConstraints[nX]['_finalValue']   := cCodfluig
			aConstraints[nX]['_type']         := 1
			aConstraints[nX]['_likeSearch']   := .F.
		EndIf
	Next nX
	oConstraints := aConstraints
	oCanc['constraints'] := oConstraints

	cRet := U_ConFluig(oCanc:ToJson(),"/api/public/ecm/dataset/datasets")

Return cRet


User Function ConFluig(cBody,cPath)
	Local cRet            := ""
	local oBody           := NIL
	Local cAccessToken    := SuperGetMV("MV_FTOKENA",.F.,"") //
	Local cTokenSecret    := SuperGetMV("MV_FTOKENS",.F.,"") //
	Local cURL            := SuperGetMV("MV_JFLGURL",.T.,"") //
	Local cConsumerKey    := SuperGetMV("MV_FCKEY",.F.,"")
	Local cConsumerSecret := SuperGetMV("MV_FCSECRE",.F.,"")
	local cx_url	      := cURL + cPath

	cAccess    := cURL+'/portal/api/rest/oauth/access_token"
	cRequest   := cURL+'/portal/api/rest/oauth/request_token"
	cAuthorize := cURL+'/portal/api/rest/oauth/authorize"

	oUrl    := FWoAuthURL():New( cRequest , cAuthorize , cAccess )

	oClient := fwOAuthClient():new(cConsumerKey, cConsumerSecret, oUrl, cx_url)

	oClient:cOAuthVersion   := "1.0"
	oClient:SetContentType("application/json")
	oClient:setMethodSignature("HMAC-SHA1")
	oClient:setToken(cAccessToken)
	oClient:setSecretToken(cTokenSecret)
	oClient:makeSignBaseString("POST", cx_url)
	oClient:MakeSignature()

	fwJsonDeserialize(cBody, @oBody)

	cRet := oClient:Post(cx_url, "", cBody )

Return cRet
