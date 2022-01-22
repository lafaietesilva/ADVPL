#Include 'Protheus.ch'

User Function MATA094()
	Local aParam     := PARAMIXB
	Local xRet       := .T. //O retorno � l�gico, Nil ou array no caso do bot�o
	Local oObj       := ''
	Local cIdPonto   := ''
	Local cIdModel   := ''
	Local lIsGrid    := .F.

	Local nLinha     := 0
	Local nQtdLinhas := 0
	//Local cMsg       := ''
	Local cCnpj
	Local cRet

	/**************************************|
	|Doscumenta��o da vari�vel cIdModel:   |
	|--------------------------------------|
	|Objetivo:                             |
	|--------------------------------------|
	| Tem como objetivo informar a camada  |
	| de dados posicionada.                |
	|--------------------------------------|
	|Quando:                               |
	|--------------------------------------|
	|    - cIdModel == FieldSAK            |
	| Est� posicionado na SAK e fazendo as |
	| devidas movimenta��es                |
	|--------------------------------------|
	|    - cIdModel == FieldSCR            |
	| Est� posicionado na SCR e fazendo as |
	| devidas movimenta��es                |
	|--------------------------------------|
	|    - cIdModel == MATA094             |
	| Est� no final do processo e j� des-  |
	| posicionou as tabelas.               |
	***************************************/


	If aParam <> NIL

		oObj		:= aParam[1]
		cIdPonto	:= aParam[2]
		cIdModel	:= aParam[3]
		lIsGrid		:= ( Len( aParam ) > 3 )
		/*
		If lIsGrid
			IF cIdPonto == 'FORMLINEPRE'
				nQtdLinhas	:= Len(OOBJ:ADATAMODEL[2])
				nLinha		:= aParam[4]
				cAcao		:= aParam[5]
				cCampo		:= aParam[6]
			ElseIF cIdPonto == 'FORMPRE'
				//TODO: Entender este processo
			Else //Serve para FORMCOMMITTTSPRE e FORMCOMMITTTSPOS
				lInclusao 	:= aParam[4] //Se for inclus�o, recebe .T.
				lAlteraca 	:= !aParam[4]//Se for altera��o ou exclus�o, recebe .F.
			Endif

		EndIf
		*/
		If cIdPonto == 'MODELPRE'
		ElseIf cIdPonto == 'MODELPOS'
		ElseIf cIdPonto == 'FORMPRE'
		ElseIf cIdPonto == 'FORMPOS'
		ElseIf cIdPonto == 'FORMLINEPRE'
		ElseIf cIdPonto == 'FORMLINEPOS'
		ElseIf cIdPonto == 'MODELCOMMITTTS'
		ElseIf cIdPonto == 'MODELCOMMITNTTS'

		/*
			cCnpj 	:= U_WSSeekFil()
			cRet    := U_CancPed(SC7->C7_NUM,cCnpj)

			IF !Empty(cRet)
				IF ValType(cRet) == "C"
					IF !"SUCCESS" $ Upper(cRet)
						Return
					Endif
				Else
					ConOut("Nao conseguiu enviar o cancelamento - Fluig fora do ar")
				EndIf
			Endif
		*/
		ElseIf cIdPonto == 'FORMCOMMITTTSPRE'
		ElseIf cIdPonto == 'FORMCOMMITTTSPOS'
		ElseIf cIdPonto == 'MODELCANCEL'
		ElseIf cIdPonto == 'FORMCANCEL'
		ElseIf cIdPonto == 'BUTTONBAR'
			//Retorna Array
		ElseIf cIdPonto == 'MODELVLDACTIVE'
		EndIf

	EndIf

Return xRet
