#include "totvs.ch"
#Include "protheus.ch"
#Include "Topconn.ch"

#Define CRLF (CHR(10)+CHR(13))

/*/{Protheus.doc} SODE991
Função SODE991
@param pAutoErro = Array com o erro do execauto
@return Não retorna nada
@author Totvs Nordeste
@owner Totvs S/A
@version Protheus 10, Protheus 11 ou V12
@since 27/08/2017
@sample
// SODE991 - User Function para recuperar o erro do execauto
U_SODE991()
Return
@obs Rotina para recuperar o erro do execauto
@project
@history
27/08/2017 - Desenvolvimento da Rotina.
/*/
User Function SODE991(pAutoErro)
	//Trata retorno para pegar apenas linha de Erro
	Local nCont
	Local aLog
	Local _nPos
	Local cErro := ""

	aLog     := intLogerr(pAutoErro, .F.)

	For nCont:=1 To Len(aLog)
		ConOut(aLog[nCont])
		cErro += " "
		For _nPos := 1 To Len(aLog[nCont])
			If SubsTr(aLog[nCont],_nPos,1) <> CHR(13) .and.  ;
					SubsTr(aLog[nCont],_nPos,1) <> CHR(10)
				cErro += SubsTr(aLog[nCont],_nPos,1)
			Endif
		Next _nPos
	Next nCont

	cErro := FwNoAccent(cErro)

	cErro := CaracEsp(cErro)

Return(cErro)

static Function intLogerr( aErroLog, lLog1Lin )
	Local lHelp      := .T.
	Local lTabela    := .F.
	Local lThread    := .F.
	Local lItem      := .F.
	Local cLinha     := ''
	Local aRet       := {}
	Local aAux       := {}
	Local nI         := 0
	Local cCampo     := ''
	Local cVariav    := ''
	Local lGravou    := .F.

	Default lLog1Lin := .F.

	For nI := 1 to LEN( aErroLog)
		lGravou := .F.
		aErroLog[nI]       += IIF( At( CRLF, aErroLog[nI] ) == 0 .AND. lLog1Lin, CRLF, '' )
		cLinha             := Upper( aErroLog[nI] )
		cCampo             := SubStr( cLinha, 23, 10 )
		cVariav            := SubStr( cLinha, 23, 10 )

		If SubStr( cLinha, 1, 4 ) == 'HELP' .or. SubStr( cLinha, 1, 5 ) == 'AJUDA'
			lHelp := .T.
		EndIf

		If SubStr( cLinha, 1, 11 ) == 'ERRO THREAD'
			lHelp   := .F.
			lThread := .T.
		EndIf

		If SubStr( cLinha, 1, 6 ) == 'TABELA'
			lHelp   := .F.
			lTabela := .T.
		EndIf

		If SubStr( cLinha, 1, 6 ) == 'TOTVS'
			lThread := .F.
			aEval( aRet, { |x| IIf( !Empty( x ), aAdd( aAux, x ), ) } )
			aRet := aClone( aAux )
			Exit
		EndIf

		If SubStr( cLinha, 1, 12 ) == 'ERRO NO ITEM'
			lItem := .T.
		EndIf

		If !lGravou
			If  lHelp .OR. lThread .OR. lItem .OR.;
					( lTabela .AND. '< -- INVALIDO' $  cLinha )
				aAdd( aRet, aErroLog[nI] )
				lItem := .F.
			EndIf
		EndIf
	Next nI

	//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
	//³Caso nao tenha gravado nada para o log, grava log inteiro. ³
	//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
	If Len(aRet) == 0
		For nI:=1 To Len(aErroLog)
			Aadd( aRet, aErroLog[nI] )
		Next nI
	Else
		//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
		//³Caso tenha apenas uma linha provavelmente eh erro no ponto de entrada que nao apresentou a mensagem com a funcao Help(). ³
		//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
		If Len(aRet) == 1
			If "Erro no Item" $ aRet[1]
				Aadd( aRet, "Verifique os Pontos de Entrada.")
			EndIf
		EndIf
	EndIf

Return(aRet)


User Function WSSeekFil(cCNPJ)

	Local aEmpresas := {}
	Local nPosFil := 0
	Local SM0CGC := ""
	Local cUSRFLG := SuperGetMv("MV_USRFLG",,"")
	Local cPSWFLG := SuperGetMv("MV_PSWFLG",,"")

	If cCNPJ <> Nil
		RpcClearEnv()
		RpcSetType( 3 )
		RpcSetEnv( "01", "01" )
	Endif

	aEmpresas :=  FWLoadSM0()

	If cCNPJ <> Nil
		nPosFil := aScan(aEmpresas,{|x| alltrim(x[18]) == Alltrim(cCNPJ)})
	Else
		nPosFil := aScan(aEmpresas,{|x| alltrim(x[1]) + alltrim(x[2]) == cEmpAnt + cFilAnt})
	Endif

	IF nPosFil > 0
		cEmp := aEmpresas[nPosFil][1]
		cFil := aEmpresas[nPosFil][2]
		SM0CGC := aEmpresas[nPosFil][18]
		If cCNPJ <> Nil
			RpcClearEnv()
			RpcSetType( 3 )
			RpcSetEnv( cEmp, cFil, cUSRFLG, cPSWFLG, ,ProcName() )
		EndIf
	Endif

Return SM0CGC

Static Function CARACESP(cDado)

	//Variavel Local de Controle
	Local aCarcEsp := {}
	Local num

	//Imputa os Caracteres Especiais no Array de Controle
	AADD(aCarcEsp,{"!", "Exclamacao"})
	AADD(aCarcEsp,{"@", "Arroba"})
	AADD(aCarcEsp,{"#", "Sustenido"})
	AADD(aCarcEsp,{"$", "Cifrao"})
	AADD(aCarcEsp,{"%", "Porcentagem"})
	AADD(aCarcEsp,{"*", "Asterisco"})
	AADD(aCarcEsp,{"/", "Barra"})
	AADD(aCarcEsp,{"\", "ContraBarra"})
	AADD(aCarcEsp,{"&", "Comercial"})
	AADD(aCarcEsp,{"(", "Parentese"})
	AADD(aCarcEsp,{")", "Parentese"})
	AADD(aCarcEsp,{"+", "Mais"})
	AADD(aCarcEsp,{"¨", "Trema"})
	AADD(aCarcEsp,{"=", "Igual"})
	AADD(aCarcEsp,{"~", "Til"})
	AADD(aCarcEsp,{"^", "Circunflexo"})
	AADD(aCarcEsp,{"´", "Agudo"})
	AADD(aCarcEsp,{"`", "Crase"})
	AADD(aCarcEsp,{"]", "Chave"})
	AADD(aCarcEsp,{"[", "Chave"})
	AADD(aCarcEsp,{"{", "Colchete"})
	AADD(aCarcEsp,{"}", "Colchete"})
	AADD(aCarcEsp,{";", "Ponto e Virgula"})
	AADD(aCarcEsp,{":", "Dois Pontos"})
	AADD(aCarcEsp,{">", "Maior que"})
	AADD(aCarcEsp,{"<", "Menor que"})
	AADD(aCarcEsp,{"?", "Interrogacao"})
	//AADD(aCarcEsp,{"_", "Underline"})
	//AADD(aCarcEsp,{",", "Virgula"})
	AADD(aCarcEsp,{"-", "Hifen"})
	AADD(aCarcEsp,{"°", "Grau"})
	AADD(aCarcEsp,{"º", "Grau"})
	AADD(aCarcEsp,{"ª", " "})
	AADD(aCarcEsp,{"á", " "})
	AADD(aCarcEsp,{"à", " "})
	AADD(aCarcEsp,{"Á", " "})
	AADD(aCarcEsp,{"À", " "})
	AADD(aCarcEsp,{"É", " "})
	AADD(aCarcEsp,{"È", " "})
	AADD(aCarcEsp,{"Ê", " "})
	AADD(aCarcEsp,{"ê", " "})
	AADD(aCarcEsp,{"ã", " "})
	AADD(aCarcEsp,{"Ã", " "})
	AADD(aCarcEsp,{"ô", " "})
	AADD(aCarcEsp,{"Ô", " "})
	AADD(aCarcEsp,{"õ", " "})
	AADD(aCarcEsp,{"Õ", " "})
	AADD(aCarcEsp,{"í", " "})
	AADD(aCarcEsp,{"Í", " "})
	AADD(aCarcEsp,{"|", "Pipe"})
	AADD(aCarcEsp,{"²", " "})
	AADD(aCarcEsp,{"³", " "})
	AADD(aCarcEsp,{"£", " "})
	AADD(aCarcEsp,{"¢", " "})
	AADD(aCarcEsp,{"¬", " "})
	AADD(aCarcEsp,{"§", " "})
	AADD(aCarcEsp,{"'", "Aspa simples"})
	AADD(aCarcEsp,{'"', "Aspa dupla"})

	For num:= 1 to Len(aCarcEsp)
		//Verifica se Algum dos Caracteres Especiais foi Digitado
		If At(aCarcEsp[num,1], AllTrim(cDado)) <> 0
			//Se Sim Emite uma Mensagem
			cDado := StrTran(cDado,aCarcEsp[num,1],"")
		EndIf
	Next num


Return cDado
