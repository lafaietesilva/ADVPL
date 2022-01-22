#Include "Protheus.ch"
#INCLUDE "Ap5Mail.ch"
#Include "TbiConn.ch"
#include "TOTVS.CH"
/*
#---------------------------------------------------------------#
| Programa:| EnvMail                           Data:08/12/2021  |
|---------------------------------------------------------------|
| Autor:   | NP3 Tecnologia                                     |
|---------------------------------------------------------------|
| Objetivo:| Envia emails utilizando as classes TMailManager e  |
|            TMailMessage                                       |
|---------------------------------------------------------------|
|                        ALTERA«’ES                             |
|---------------------------------------------------------------|
|     Analista      |   Data     |  Motivo                      |
|---------------------------------------------------------------|
|                   |            |                              |
|                   |            |                              |
#---------------------------------------------------------------#
LINK TDN: 
https://tdn.totvs.com/display/tec/Classe+TMailMessage
https://tdn.totvs.com/display/tec/Classe+TMailManager
*/
User Function EnvMail(cAssunto,cCorpo,cEmailTo,cAnexo) //ok teste com anexo e body

	Local oMail, oMessage
	Local nErro
	Local cEmail := SuperGetMV("P3_EMAORC",,"voltaasaulas@livrariajaqueira.com.br")
	Local cPass  := SuperGetMV("P3_PSSORC",,"Livraria2021")
	Local cSMTP  := "smtp.office365.com"
	Local cPorta := 587

	Default cAnexo := ""

	//Configuracao dos dados do e-mail
	oMail := TMailManager():New()
	oMail:SetUseSSL( .F. )
	oMail:SetUseTLS( .T. )
	oMail:Init( '', cSMTP , cEmail, cPass, 0, cPorta )
	oMail:SetSmtpTimeOut( 120 )

	//Verifica conex√£o SMTP
	conout( 'Conectando do SMTP' )
	nErro := oMail:SmtpConnect()
	If nErro <> 0
		conout( "ERROR:" + oMail:GetErrorString( nErro ) )
		oMail:SMTPDisconnect()
		return .F.
	Endif

	//Verifica autenticacao
	nErro := oMail:SmtpAuth( cEmail ,cPass )
	If nErro <> 0
		conout( "ERROR:" + oMail:GetErrorString( nErro ) )
		oMail:SMTPDisconnect()
		return .F.
	Endif

	oMessage := TMailMessage():New()
	oMessage:Clear()
	oMessage:cFrom                  := cEmail
	oMessage:cTo                    := cEmailTo
	oMessage:cCc                    := ""
	oMessage:cSubject               := cAssunto
	oMessage:cBody                  := cCorpo

	//copia arquivo para servidor
	If oMessage:AttachFile( "\system\"+cAnexo ) < 0
		MsgAlert( "Erro ao anexar o arquivo" )
	Else
		//adiciona uma tag informando que È um attach e o nome do arq
		oMessage:AddAtthTag( 'Content-Disposition: attachment; filename='+cAnexo)
	EndIf

	//Envia e-mail
	nErro := oMessage:Send( oMail )

	//Verifica se o e-mail foi enviado
	if nErro <> 0
		conout( "ERROR:" + oMail:GetErrorString( nErro ) )
		oMail:SMTPDisconnect()
		return .F.
	Endif

	conout( 'Desconectando do SMTP' )
	oMail:SMTPDisconnect()

return .T.
