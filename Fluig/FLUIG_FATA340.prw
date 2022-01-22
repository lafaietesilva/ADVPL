#Include 'Protheus.ch'
#Include 'FWMVCDEF.ch'
#Include 'RestFul.CH'
#INCLUDE "TOTVS.CH"
#INCLUDE "TopConn.ch"
#INCLUDE "TBICONN.CH"
#Include 'parmtype.ch'
#include "Fileio.ch"

//Início da declaração da estrutura do Webservice;
WSRESTFUL F_FATA340 DESCRIPTION "Save in the knowledge bank"
	WSMETHOD POST BODY64 	DESCRIPTION "Save document in base64 format in the knowledge bank"		PATH "/f_fata340/from-base64"
	WSMETHOD POST BODYURL 	DESCRIPTION "Save document from a URL, in the knowledge bank" 			PATH "/f_fata340/from-url"
	WSMETHOD POST BODYCODE 	DESCRIPTION "Save document from a fluig API, in the knowledge bank" 	PATH "/f_fata340/from-fluig-api"
	WSMETHOD POST SEARCH 	DESCRIPTION "Search documents from a fluig API, in the knowledge bank" 	PATH "/f_fata340/search"
END WSRESTFUL

WSMETHOD POST BODY64 WSSERVICE F_FATA340
	Local aRetFile  := {.F., nil, ""}
	Local aRetAc9   := {.F., nil, ""}
	Local oBody		:= JsonObject():new()
	Local oResponse	:= JsonObject():new()
	Local cMsgError	:= ""
	Local oError    := ErrorBlock({|e| anyError(e, @cMsgError) })

	Begin Sequence

		// Define type of response
		::SetContentType("application/json")
		// Parse Body from String to Json
		oBody:fromJSON(::GetContent())

		// Validation
		aRetValid := validJson(oBody, {"CNPJ","ARQUIVO", "DESCRICAO", "FILIAL", "TABELA", "BASE64", "ENTIDADE"})
		If !aRetValid[1]
			SetRestFault(400, aRetValid[2])
			return .F.
		EndIf

		//Procura Filial para conectar
		U_WSSeekFil(oBody:CNPJ)

		oMeta				:= JsonObject():new()
		oMeta['fileName'] 	:= oBody['ARQUIVO']
		oMeta['fileIn64'] 	:= oBody['BASE64']
		oMeta['branch']		:= oBody['FILIAL']

		// Saving a file in the directory!
		aRetFile := smSaveFile(oMeta)

		If aRetFile[1]
			// Updating file name!
			oBody['ARQUIVO'] := aRetFile[4]
			aRetAc9 := fgravaAC9(oBody)
		EndIf

		If !aRetFile[1] .Or. !aRetAc9[1]
			cRespError := "Errors: On Save file: "+aRetFile[3]+", On Insert ACB/AC9: "+aRetAc9[3]
			SetRestFault(400, cRespError)
		EndIf

		If aRetFile[1] .And. aRetAc9[1]
			oResponse['status']		:= "success"
			oResponse['numObj']		:= aRetAc9[2]
			oResponse['message']	:= aRetFile[2]
			::SetResponse(EncodeUTF8(oResponse:toJson()))
		EndIf

		Recover
		SetRestFault(400, cMsgError)
	End Sequence

	// Catch any errors papai!
	ErrorBlock(oError)
Return aRetFile[1] .And. aRetAc9[1]

WSMETHOD POST BODYURL WSSERVICE F_FATA340
	Local aRetFile  := {.F., nil, ""}
	Local aRetAc9   := {.F., nil, ""}
	Local oBody		:= JsonObject():new()
	Local oResponse	:= JsonObject():new()
	Local cBaseUrlFl:= SuperGetMV("MV_JFLGURL",.F.,"")
	Local cPathFluig:= SuperGetMV("SM_PTFLUIG",.F.,"/volume/stream/Rmx1aWc=")
	Local aHeader	:= {}
	Local cMsgError	:= ""
	Local oError    := ErrorBlock({|e| anyError(e, @cMsgError) })

	Begin Sequence

		// Define type of response
		::SetContentType("application/json")
		// Parse Body from String to Json
		oBody:fromJSON(::GetContent())

		// Validation
		aRetValid := validJson(oBody, {"CNPJ","ARQUIVO", "DESCRICAO", "FILIAL", "TABELA", "ENTIDADE", "URLD"})
		If !aRetValid[1]
			SetRestFault(400, aRetValid[2])
			return .F.
		EndIf

		
		//Procura Filial para conectar
		U_WSSeekFil(oBody:CNPJ)

		// Validating file extension
		aExtUrl := smExten(oBody['URLD'])
		aExtReq := smExten(oBody['ARQUIVO'])
		cFileName := StaticCall(VSMXFUN,CARACESP,FwNoAccent(DecodeUTF8(ALLTRIM(oBody['ARQUIVO']), "cp1252")))//oBody['ARQUIVO']

		If (UPPER(aExtUrl[1]) != UPPER(aExtReq[1]))
			oBody['ARQUIVO'] := UPPER(StrTran(cFileName, aExtReq[1], aExtUrl[1]))
		EndIf

		// Request file on fluig server!
		oRest := FwRest():New(cBaseUrlFl+cPathFluig)
		// INFORMA O RECURSO E O BODY
		cFile := SubStr(oBody['URLD'], (Len(cBaseUrlFl+cPathFluig)+1))
		oRest:SetPath(cFile)

		If oRest:Get(aHeader)
			oBody['BINARY'] := oRest:GetResult()
		Else
			cFileFull := cBaseUrlFl+cPathFluig+cFile
			SetRestFault(400, "Falha ao baixar o arquivo: "+cFileFull+", Error:"+oRest:GetLastError())
			return .F.
		EndIf

		oMeta := JsonObject():new()
		oMeta['fileName'] 	:= StaticCall(VSMXFUN,CARACESP,FwNoAccent(DecodeUTF8(ALLTRIM(oBody['ARQUIVO']), "cp1252")))//oBody['ARQUIVO']
		oMeta['fileInBin'] 	:= oBody['BINARY']
		oMeta['branch']		:= oBody['FILIAL']

		// Saving a file in the directory!
		aRetFile := smSaveFile(oMeta)

		If aRetFile[1]
			// Updating file name!
			oBody['ARQUIVO'] := aRetFile[4]
			aRetAc9 := fgravaAC9(oBody)
		EndIf

		If !aRetFile[1] .Or. !aRetAc9[1]
			cRespError := "Errors: On Save file: "+aRetFile[3]+", On Insert ACB/AC9: "+aRetAc9[3]
			SetRestFault(400, cRespError)
		EndIf

		If aRetFile[1] .And. aRetAc9[1]
			oResponse['status']		:= "success"
			oResponse['numObj']		:= aRetAc9[2]
			oResponse['message']	:= aRetFile[2]
			::SetResponse(EncodeUTF8(oResponse:toJson()))
		EndIf

		Recover
		SetRestFault(400, cMsgError)
	End Sequence

	// Catch any errors papai!
	ErrorBlock(oError)
Return aRetFile[1] .And. aRetAc9[1]

WSMETHOD POST BODYCODE WSSERVICE F_FATA340
	Local aRetFile  := {.F., nil, ""}
	Local aRetAc9   := {.F., nil, ""}
	Local oBody		:= JsonObject():new()
	Local oResponse	:= JsonObject():new()
	Local cBaseUrlFl:= SuperGetMV("MV_JFLGURL",.F.,"")
	Local cPathFluig:= SuperGetMV("SM_PTFLUIG",.F.,"/volume/stream/Rmx1aWc=")
	Local aHeader	:= {}
	Local cMsgError	:= ""
	Local oError    := ErrorBlock({|e| anyError(e, @cMsgError) })

	Begin Sequence

		// Define type of response
		::SetContentType("application/json")
		// Parse Body from String to Json
		oBody:fromJSON(::GetContent())

		// Validation
		aRetValid := validJson(oBody, {"NPJ","ARQUIVO", "DESCRICAO", "FILIAL", "TABELA", "ENTIDADE", "DOCUMENTO"})
		If !aRetValid[1]
			SetRestFault(400, aRetValid[2])
			return .F.
		EndIf

		
		//Procura Filial para conectar
		U_WSSeekFil(oBody:CNPJ)

		// Auth and get URL to download
		oRespFluig := ConFluig(oBody['DOCUMENTO'])

		If !oRespFluig[1]
			SetRestFault(400, oRespFluig[3])
			return oRespFluig[1]
		EndIf

		aExtFluig := smExten(oRespFluig[2]['content'])
		aExtReq := smExten(oBody['ARQUIVO'])
		cFileName := StaticCall(VSMXFUN,CARACESP,FwNoAccent(DecodeUTF8(ALLTRIM(oBody['ARQUIVO']) , "cp1252"))) //oBody['ARQUIVO']

		If (UPPER(aExtFluig[1]) != UPPER(aExtReq[1]))
			oBody['ARQUIVO'] := UPPER(StrTran(cFileName, aExtReq[1], aExtFluig[1]))
		EndIf

		// Request file on fluig server!
		oRest := FwRest():New(cBaseUrlFl+cPathFluig)
		// INFORMA O RECURSO E O BODY
		cFile := SubStr(oRespFluig[2]['content'], (Len(cBaseUrlFl+cPathFluig)+1))
		oRest:SetPath(cFile)

		If oRest:Get(aHeader)
			oBody['BINARY'] := oRest:GetResult()
		Else
			cFileFull := cBaseUrlFl+cPathFluig+cFile
			SetRestFault(400, "Falha ao baixar o arquivo: "+cFileFull+", Error:"+oRest:GetLastError())
			return .F.
		EndIf

		oMeta := JsonObject():new()
		oMeta['fileName'] 	:= oBody['ARQUIVO'] 
		oMeta['fileInBin'] 	:= oBody['BINARY']
		oMeta['branch'] 	:= oBody['FILIAL']

		// Saving a file in the directory!
		aRetFile := smSaveFile(oMeta)

		If aRetFile[1]
			// Updating file name!
			oBody['ARQUIVO'] := aRetFile[4]
			aRetAc9 := fgravaAC9(oBody)
		EndIf

		If !aRetFile[1] .Or. !aRetAc9[1]
			cRespError := "Errors: On Save file: "+aRetFile[3]+", On Insert ACB/AC9: "+aRetAc9[3]
			SetRestFault(400, cRespError)
		EndIf

		If aRetFile[1] .And. aRetAc9[1]
			oResponse['status'] := "success"
			oResponse['numObj'] := aRetAc9[2]
			oResponse['message'] := aRetFile[2]
			::SetResponse(EncodeUTF8(oResponse:toJson()))
		EndIf

		Recover
		SetRestFault(400, cMsgError)
	End Sequence

	// Catch any errors papai!
	ErrorBlock(oError)
Return aRetFile[1] .And. aRetAc9[1]

WSMETHOD POST SEARCH WSSERVICE F_FATA340
	Local aArea		:= getArea()
	Local cAliasAC9	:= "AC9"
	Local cAliasACB	:= "ACB"
	Local aItens	:= {}
	Local oBody		:= JsonObject():new()
	Local oResponse	:= JsonObject():new()
	Local cMsgError	:= ""
	Local oError    := ErrorBlock({|e| anyError(e, @cMsgError) })
	Local aFile		:= {}

	Begin Sequence

		// Define type of response
		::SetContentType("application/json")
		// Parse Body from String to Json
		oBody:fromJSON(::GetContent())

		// Validation
		aRetValid := validJson(oBody, {"CNPJ","AC9_ENTIDA", "AC9_FILENT", "AC9_CODENT"})
		If !aRetValid[1]
			SetRestFault(400, aRetValid[2])
			return .F.
		EndIf

		
		//Procura Filial para conectar
		U_WSSeekFil(oBody:CNPJ)

		cAC9ENTIDA := PadR(oBody['AC9_ENTIDA'], TamSX3("AC9_ENTIDA")[1])
		cAC9FILENT := PadR(oBody['AC9_FILENT'], TamSX3("AC9_FILENT")[1])
		cAC9CODENT := PadR(oBody['AC9_CODENT'], TamSX3("AC9_CODENT")[1])

		DbSelectArea(cAliasAC9)
		(cAliasAC9)->(DbSetOrder(2))
		If !(cAliasAC9)->(DbSeek(xFilial(cAliasAC9)+cAC9ENTIDA+cAC9FILENT+cAC9CODENT))
			SetRestFault(400, "Entidade nao localizada")
			return .F.
		EndIf

		DbSelectArea(cAliasACB)
		(cAliasACB)->(DbSetOrder(1))
		While (cAliasAC9)->(!EOF());
				.And. cAC9ENTIDA == (cAliasAC9)->AC9_ENTIDA;
				.And. cAC9FILENT == (cAliasAC9)->AC9_FILENT;
				.And. cAC9CODENT == (cAliasAC9)->AC9_CODENT
			// * A cada entidade da AC9 posiciona na ACB e montar o OBJ JSON
			If (cAliasACB)->(DbSeek((cAliasAC9)->AC9_FILENT+(cAliasAC9)->AC9_CODOBJ))
				aFile 					:= smFileTo64((cAliasACB)->ACB_OBJETO, cAC9FILENT)
				oItem 					:= JsonObject():new()
				oItem['ACB_CODOBJ'] 	:= AllTrim((cAliasACB)->ACB_CODOBJ)
				oItem['ACB_DESCRI'] 	:= AllTrim((cAliasACB)->ACB_DESCRI)
				oItem['ACB_OBJETO'] 	:= AllTrim((cAliasACB)->ACB_OBJETO)
				oItem['BASE64_OK'] 		:= aFile[1]
				oItem['BASE64_FILE']	:= aFile[2]
				aAdd(aItens, oItem)
			EndIf
			(cAliasAC9)->(DbSkip())
		EndDo

		oResponse['AC9_ENTIDA']	:= AllTrim((cAliasAC9)->AC9_ENTIDA)
		oResponse['AC9_FILENT']	:= AllTrim((cAliasAC9)->AC9_FILENT)
		oResponse['AC9_CODENT']	:= AllTrim((cAliasAC9)->AC9_CODENT)
		oResponse['ITENS'] 		:= aItens

		::SetResponse(EncodeUTF8(oResponse:toJson()))

		Recover
		SetRestFault(400, cMsgError)
	End Sequence

	// Catch any errors papai!
	ErrorBlock(oError)
	RestArea(aArea)
Return empty(cMsgError)

//Função que conecta e autentica com Fluig para pegar a URL de download
Static Function ConFluig(pNumDoc)
	Local aRet				:= {.F., nil, nil}
	Local aArea    			:= GetArea()
	Local cAccessToken    	:= SuperGetMV("VM_FTOKENA",.F.,"") //
	Local cTokenSecret    	:= SuperGetMV("VM_FTOKENS",.F.,"") //
	Local cURL            	:= SuperGetMV("MV_JFLGURL",.F.,"")
	Local cConsumerKey    	:= SuperGetMV("VM_FCKEY",.F.,"")
	Local cConsumerSecret 	:= SuperGetMV("VM_FCSECRE",.F.,"")
	Local cPath           	:= "/api/public/2.0/documents/getDownloadURL/"
	Local cx_url	      	:= cURL + cPath + pNumDoc
	Local oResponse			:= JsonObject():new()

	cAccess    := cURL+'/portal/api/rest/oauth/access_token"
	cRequest   := cURL+'/portal/api/rest/oauth/request_token"
	cAuthorize := cURL+'/portal/api/rest/oauth/authorize"

	oUrl    := FWoAuthURL():New( cRequest , cAuthorize , cAccess )

	oClient := fwOAuthClient():new(cConsumerKey, cConsumerSecret, oUrl, cx_url)

	oClient:cOAuthVersion   := "1.0"
	oClient:cContentType    := "application/json"

	oClient:setMethodSignature("HMAC-SHA1")
	oClient:setToken(cAccessToken)
	oClient:setSecretToken(cTokenSecret)
	oClient:makeSignBaseString("GET", cx_url)
	oClient:MakeSignature()

	//fwJsonDeserialize(cBody, @oBody)

	cResponse := oClient:Get(cx_url, "", "" )

	If !Empty(cResponse)
		oResponse:fromJSON(cResponse)
		aRet := {.T., oResponse, nil}
	Else
		aRet := {.F., nil, "Não foi possível realizar o downloado do documento ID: "+pNumDoc}
	EndIf

	RestArea(aArea)
Return aRet

Static function smSaveFile(oMeta)
	Local aResponse		:= {.F., "", "", ""}
	Local cFileName 	:= cValToChar(Randomize(1,1000))+"_"+DToS(Date())+StrTran(Time(), ":", "")+"_"+oMeta['fileName']
	//Local cFileName 	:= cValToChar(Randomize(1,1000))+"_"+DToS(Date())+StrTran(Time(), ":", "")+"_"+FwNoAccent(DecodeUTF8(oMeta['fileName'], "cp1252"))
	//Local cFileName 	:= cValToChar(Randomize(1,1000))+"_"+DToS(Date())+StrTran(Time(), ":", "")+"_"+StaticCall(VSMXFUN,CARACESP,FwNoAccent(DecodeUTF8(fileName, "cp1252")))
	Local cFileIn64 	:= oMeta['fileIn64']
	Local oFileInBin 	:= oMeta['fileInBin']
	Local cBasePath		:= SuperGetMv("SM_PATHSAV",,"\dirdoc\co01\")
	Local cFileFulNa	:= cBasePath

	IF Empty(oMeta['branch'])
		cFileFulNa += "shared\"
	ELSE
		cFileFulNa += "br"+oMeta['branch']+"\"
	ENDIF

	cFileFulNa += cFileName

	// Saving in Base64
	If !Empty(cFileIn64)
		Decode64(cFileIn64, cFileFulNa, .F.)
	EndIf

	// Saving in Binary
	If !Empty(oFileInBin)
		nHandle := FCreate(cFileFulNa, FC_NORMAL)
		If nHandle >= 0
			FWrite(nHandle, oFileInBin)
			FClose(nHandle)
		Else
			return {.F., "", "Error on create file: "+STR(FERROR())}
		EndIf
	EndIf

	// Check file!
	fCheck := fOpen(cFileFulNa, FO_READ, , .F.)
	If fCheck < 0
		conout("Erro ao abrir arquivo.")
		aResponse := {.F., "", "Error on create file: "+cFileFulNa, cFileName}
	Else
		aResponse := {.T., "Arquivo "+cFileFulNa+" criado com sucesso!", "", cFileName}
	EndIf
	// Closing file used for checking
	fClose(fCheck)
Return aResponse

Static function smFileTo64(fileName, branch)
	Local aResponse := {}
	Local cBasePath	:= SuperGetMv("SM_PATHSAV",,"\dirdoc\co01\")
	Local cFileFulNa:= cBasePath
	Local fCheck 	:= Nil
	Local cFileData	:= ""
	Local nFileSize	:= 0

	If Empty(fileName)
		aResponse := {.F., "Nome do arquivo invalido!"}
	EndIf

	IF Empty(branch)
		cFileFulNa += "shared\"
	ELSE
		cFileFulNa += "br"+branch+"\"
	ENDIF

	cFileFulNa += AllTrim(fileName)

	// Check file!
	fCheck := fOpen(cFileFulNa, FO_READ, , .F.)
	If fCheck < 0
		conout("Erro ao abrir arquivo.")
		aResponse := {.F., "Erro ao abrir o arquivo "+cFileFulNa}
	Else
		nFileSize := fSeek(fCheck, 0, FS_END)
		fSeek(fCheck, 0)
		FRead(fCheck, cFileData, nFileSize)
		aResponse := {.T., Encode64(cFileData)}
	EndIf
	// Closing file used for checking
	fClose(fCheck)
return aResponse

Static function smExten(pFileName)
	Local aExten	:= StrTokArr(pFileName, ".")
	Local nIdx		:= Len(aExten)
Return {aExten[nIdx], Len(aExten[nIdx])}

//Função que salva arquivo no diretorio do Protheus
Static Function fSalvaArq(oBody,cArq)
	Local nHandle := 00
	Local cPasta := ""
	Local lRet 	:= .T.

	IF EMPTY(oBody:FILIAL)
		cPasta := "shared\"
	ELSE
		cPasta := "br"+oBody:FILIAL +"\"
	ENDIF

	nHandle := FCreate("\dirdoc\co01\" + cPasta + oBody:ARQUIVO)
	//nHandle := FCreate("\dirdoc\co01\" + cPasta + StaticCall(VSMXFUN,CARACESP,FwNoAccent(DecodeUTF8(ARQUIVO, "cp1252")))
	FWrite(nHandle, cArq)
	FClose(nHandle)

	// VERIFICA SE O ARQUIVO FOI CRIADO CORRETAMENTE
	If (!File("\dirdoc\co01\" + cPasta + oBody:ARQUIVO))
	//If (!File("\dirdoc\co01\" + cPasta + StaticCall(VSMXFUN,CARACESP,FwNoAccent(DecodeUTF8(ARQUIVO, "cp1252")))
		lRet := .F.
	EndIf

RETURN lRet

// Função que grava arquivo na ACB e AC9
Static Function fgravaAC9(oBody)
	Local aArea    	:= GetArea()
	Local aRet		:= {.T., "", ""}
	Local cProxObj

	Begin Transaction
		// Pega o próximo registro da ACB
		DbSelectArea("ACB")
		cProxObj := GetSxeNum("ACB","ACB_CODOBJ",,1)
		// Inclui na ACB Sempre!
		Reclock("ACB", .T.)
		ACB->ACB_FILIAL := xFilial("ACB")
		ACB->ACB_CODOBJ := cProxObj
		//ACB->ACB_OBJETO := FwNoAccent(DecodeUTF8(oBody:ARQUIVO, "cp1252"))
		//ACB->ACB_DESCRI := CARACESP(FwNoAccent(DecodeUTF8(oBody:DESCRICAO, "cp1252"))
		ACB->ACB_OBJETO := StaticCall(VSMXFUN,CARACESP,FwNoAccent(DecodeUTF8(ALLTRIM(oBody:ARQUIVO), "cp1252")))
		ACB->ACB_DESCRI := StaticCall(VSMXFUN,CARACESP,FwNoAccent(DecodeUTF8(ALLTRIM(oBody:DESCRICAO), "cp1252")))
		ACB->(MsUnlock())
		// Se não existir na tabela de vinculos, irá criar
		DbSelectArea("AC9")
		AC9->(DbSetOrder(1))
		If !AC9->(DbSeek(xFilial("AC9")+ cProxObj))
			Reclock("AC9", .T.)
			AC9->AC9_FILIAL := xFilial("AC9")
			AC9->AC9_FILENT := oBody:FILIAL
			AC9->AC9_ENTIDA := oBody:TABELA
			AC9->AC9_CODENT := oBody:ENTIDADE
			AC9->AC9_CODOBJ := cProxObj
			AC9->(MsUnlock())
			ConfirmSX8()
			aRet := {.T., cProxObj, ""}
		Else
			aRet := {.F., Nil, "Não foi possível criar a amarração no banco de conhecimento!"}
			RollBackSX8()
			DisarmTransaction()
			BREAK
		EndIf
	End Transaction
	RestArea(aArea)
Return aRet

Static Function anyError(pError, pMsgError)
	Local cErr := pError:Description
	Local cStack := pError:ERRORSTACK
	pMsgError := cErr + chr(10) + chr(13) + cStack
	BREAK
Return

Static Function validJson(oObjJson, aPropsJson)
	Local aRet  := {.T., ""}
	Local nX	:= 1
	For nX := 1 to Len(aPropsJson)
		cPropName := aPropsJson[nX]
		If Empty(oObjJson[cPropName])
			aRet := {.F., "A propriedade "+cPropName+" esta vazia ou não foi informada!"}
			EXIT
		EndIf
	Next nX
Return aRet
