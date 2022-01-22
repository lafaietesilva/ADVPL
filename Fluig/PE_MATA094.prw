#Include 'Protheus.ch'

User Function MATA094()
	Local aParam     := PARAMIXB
	Local xRet       := .T. //O retorno é lógico, Nil ou array no caso do botão
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
	|Doscumentação da variável cIdModel:   |
	|--------------------------------------|
	|Objetivo:                             |
	|--------------------------------------|
	| Tem como objetivo informar a camada  |
	| de dados posicionada.                |
	|--------------------------------------|
	|Quando:                               |
	|--------------------------------------|
	|    - cIdModel == FieldSAK            |
	| Está posicionado na SAK e fazendo as |
	| devidas movimentações                |
	|--------------------------------------|
	|    - cIdModel == FieldSCR            |
	| Está posicionado na SCR e fazendo as |
	| devidas movimentações                |
	|--------------------------------------|
	|    - cIdModel == MATA094             |
	| Está no final do processo e já des-  |
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
				lInclusao 	:= aParam[4] //Se for inclusão, recebe .T.
				lAlteraca 	:= !aParam[4]//Se for alteração ou exclusão, recebe .F.
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
