#include 'PROTHEUS.CH'
#include 'TOTVS.CH'
#include 'RESTFUL.CH'
#include 'RWMAKE.CH'
#include 'TOPCONN.CH'
#include 'TBICONN.CH'
#Include "FWMVCDEF.CH"


WSRESTFUL FLUIG_MATA110 DESCRIPTION "API INTEGRACAO FLUIG COM SOLICITACAO DE COMPRAS PROTHEUS"
	WSMETHOD POST DESCRIPTION "Verifica Dados do POST" WSSYNTAX "/fluig"
END WSRESTFUL

WSMETHOD POST WSSERVICE FLUIG_MATA110
	Local lPost := .T.
	Local aCabec := {}
	Local aItens := {}
	Local aLinha := {}
	Local nX     := 0
	Local cQuery := ""
	Local Json := Nil
	Local cBody := ::GetContent()
	Local ctaProduto :=""
	Local nSolic := ""
	Local nQtde := 0
	Local nPreco := 0
	Local oResponse

	Private aAutoErro      := {}
	Private lMsErroAuto    := .F.
	Private lMsHelpAuto    := .T.
	Private lAutoErrNoFile := .T.
	Private cMensag        := ""

	::SetContentType("application/json")

	FWJsonDeserialize(cBody, @Json)

	/*
	cQuery := "SELECT ISNULL((Max(C1_NUM) + 1),1) as SEQ from " + RetSqlName("SC1")
	cQuery += "  WHERE D_E_L_E_T_ <> '*'"
	cQuery := ChangeQuery(cQuery)

	If Select("QSC1") > 0
		QSC1->(dbCloseArea())
	EndIf

	dbUseArea(.T.,"TOPCONN",TcGenQry(,,cQuery),"QSC1",.F.,.T.)

	QSC1->(dbGoTop())

	nSolic := STRZERO(QSC1->SEQ,6,0)

	QSC1->(dbCloseArea())
	*/
	//Procura Filial para conectar
	U_WSSeekFil(Json:cnpj)

	//aadd(aCabec,{"C1_FILIAL" , Json:FILIAL})
	//aadd(aCabec,{"C1_NUM"    , nSolic})
	aadd(aCabec,{"C1_SOLICIT", FwNoAccent(DecodeUTF8(Json:solicitante, "cp1252")) })
	aadd(aCabec,{"C1_EMISSAO", CTOD(Json:dtsolicitacao)})

	For nX := 1 To LEN(Json:itens)
		aLinha  := {}

		If ValType(Json:itens[nX]:quantidade) == "C"
			nQtde := val(Json:itens[nX]:quantidade)
		Else
			nQtde := Json:itens[nX]:quantidade
		EndIf

		If ValType(Json:itens[nX]:preco) == "C"
			nPreco := val(Json:itens[nX]:preco)
		Else
			nPreco := Json:itens[nX]:preco
		EndIf

		aadd(aLinha,{"C1_ITEM"   , STRZERO(nX,4,0), Nil})
		aadd(aLinha,{"C1_PRODUTO", Json:itens[nX]:produto, Nil})
		aadd(aLinha,{"C1_UM"  , Json:itens[nX]:unidade, Nil})
		aadd(aLinha,{"C1_QUANT"  , nQtde, Nil})
		aadd(aLinha,{"C1_PRECO"  , nPreco, Nil})
		aadd(aLinha,{"C1_DATPRF"    , CTOD(Json:itens[nX]:dtnecessidade), Nil})
		//aadd(aLinha,{"C1_OBS"    , FwNoAccent(DecodeUTF8(Json:obs, "cp1252")) })
		aadd(aLinha,{"C1_RATEIO" , "2", Nil})


		//recuperar a conta do cadastro de produto
		ctaProduto := Posicione("SB1",1,xFilial("SB1") + Json:itens[nX]:produto,"B1_CONTA")

		If !Empty(ctaProduto)
			//aadd(aLinha,{"C1_CONTA"    , ctaProduto, Nil})
		EndIf
		aadd(aLinha,{"C1_CC"       , Json:itens[nX]:centrocusto, Nil})
		aadd(aLinha,{"C1_XORIG"    , "F", Nil})


		aadd(aItens,aLinha)

	Next


//	Begin Transaction

		MSExecAuto({|x,y,z,a,b,c| Mata110(x,y,z,a,b,c)},aCabec,aItens, 3,Nil,Nil,Nil,Nil )

		If lMsErroAuto
			aAutoErro := GETAUTOGRLOG()
			cMensag   := AllTrim(U_SODE991(aAutoErro))
			
			lPost := .F.

			SetRestFault(400, "Erro ao criar solicitacao de compra, Error:"+cMensag)

			//DisarmTransaction()


		Else
			cMensag := "Solicitacao de Compra incluida com sucesso. N: "  + xFilial("SC1") + SC1->C1_NUM

			oResponse := JsonObject():new()
			oResponse['status'] := "success"
			oResponse['code'] 	:= SC1->C1_NUM
			oResponse['message'] 	:= cMensag

			::SetResponse(EncodeUTF8(oResponse:toJson()))


		EndIf

//	End Transaction

Return lPost
