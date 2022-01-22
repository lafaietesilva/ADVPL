function createDataset(fields, constraints, sortFields) {	
	try {
		return processResult(callService(fields, constraints, sortFields));
	} catch(e) {
		return processErrorResult(e, constraints);
	}
}

function callService(fields, constraints, sortFields) {
	var serviceData = data();
	var params = serviceData.inputValues;
	var assigns = serviceData.inputAssignments;
	
	
		for (var a in constraints){
			if (constraints[a].fieldName == "colleagueId"){
				params.colleagues(0).colleagueId = constraints[a].finalValue;
	   		}
			if (constraints[a].fieldName == "colleagueName"){
				params.colleagues(0).colleagueName = constraints[a].finalValue;
	   		}
			if (constraints[a].fieldName == "login"){
				params.colleagues(0).login = constraints[a].finalValue;
	   		}
			if (constraints[a].fieldName == "email"){
				params.colleagues(0).email = constraints[a].finalValue;
	   		}
			if (constraints[a].fieldName == "password"){
				params.colleagues(0).password = constraints[a].finalValue;
	   		}
			
		}
		

	verifyConstraints(serviceData.inputValues, constraints);

	var serviceHelper = ServiceManager.getService(serviceData.fluigService);
	var serviceLocator = serviceHelper.instantiate(serviceData.locatorClass);
	var service = serviceLocator.getColleagueServicePort();
	var response = service.createColleague(getParamValue(params.username, assigns.username), getParamValue(params.password, assigns.password), 
		getParamValue(params.companyId, assigns.companyId), fillColleagueDtoArray(serviceHelper, params.colleagues, assigns.colleagues)
		);

	return response;
}

function defineStructure() {
		addColumn('response');
}

function onSync(lastSyncDate) {
	var serviceData = data();
	var synchronizedDataset = DatasetBuilder.newDataset();

	try {
		var resultDataset = processResult(callService());
		if (resultDataset != null) {
			var values = resultDataset.getValues();
			for (var i = 0; i < values.length; i++) {
				synchronizedDataset.addRow(values[i]);
			}
		}

	} catch(e) {
		log.info('Dataset synchronization error : ' + e.message);

	}
	return synchronizedDataset;
}

function verifyConstraints(params, constraints) {
	if (constraints != null) {
		for (var i = 0; i < constraints.length; i++) {
			try {
				params[constraints[i].fieldName] = JSON.parse(constraints[i].initialValue);
			} catch(e) {
				params[constraints[i].fieldName] = constraints[i].initialValue;
			}
		}
	}
}

function processResult(result) {
	var dataset = DatasetBuilder.newDataset();

	dataset.addColumn("response");
	dataset.addRow([result]);

	return dataset;
}

function processErrorResult(error, constraints) {
	var dataset = DatasetBuilder.newDataset();

	var params = data().inputValues;
verifyConstraints(params, constraints);

dataset.addColumn('error');
	dataset.addColumn('password');
	dataset.addColumn('companyId');
	dataset.addColumn('colleagues');
	dataset.addColumn('username');

	var password = isPrimitive(params.password) ? params.password : JSONUtil.toJSON(params.password);
	var companyId = isPrimitive(params.companyId) ? params.companyId : JSONUtil.toJSON(params.companyId);
	var colleagues = isPrimitive(params.colleagues) ? params.colleagues : JSONUtil.toJSON(params.colleagues);
	var username = isPrimitive(params.username) ? params.username : JSONUtil.toJSON(params.username);

	dataset.addRow([error.message, password, companyId, colleagues, username]);

	return dataset;
}

function getParamValue(param, assignment) {
	if (assignment == 'VARIABLE') {
		return getValue(param);
	} else if (assignment == 'NULL') {
		return null;
	}
	return param;
}

function hasValue(value) {
	return value !== null && value !== undefined;
}

function isPrimitive(value) {
	return ((typeof value === 'string') || value.substring !== undefined) || typeof value === 'number' || typeof value === 'boolean' || typeof value === 'undefined';
}


function fillColleagueDto(serviceHelper, params, assigns) {
	if (params == null) {
		return null;
	}

	var result = serviceHelper.instantiate("com.totvs.technology.ecm.foundation.ws.ColleagueDto");

	var active = getParamValue(params.active, assigns.active);
	if (hasValue(active)) { result.setActive(active); }
	var adminUser = getParamValue(params.adminUser, assigns.adminUser);
	if (hasValue(adminUser)) { result.setAdminUser(adminUser); }
	var area1Id = getParamValue(params.area1Id, assigns.area1Id);
	if (hasValue(area1Id)) { result.setArea1Id(area1Id); }
	var area2Id = getParamValue(params.area2Id, assigns.area2Id);
	if (hasValue(area2Id)) { result.setArea2Id(area2Id); }
	var area3Id = getParamValue(params.area3Id, assigns.area3Id);
	if (hasValue(area3Id)) { result.setArea3Id(area3Id); }
	var area4Id = getParamValue(params.area4Id, assigns.area4Id);
	if (hasValue(area4Id)) { result.setArea4Id(area4Id); }
	var area5Id = getParamValue(params.area5Id, assigns.area5Id);
	if (hasValue(area5Id)) { result.setArea5Id(area5Id); }
	var colleagueId = getParamValue(params.colleagueId, assigns.colleagueId);
	if (hasValue(colleagueId)) { result.setColleagueId(colleagueId); }
	var colleagueName = getParamValue(params.colleagueName, assigns.colleagueName);
	if (hasValue(colleagueName)) { result.setColleagueName(colleagueName); }
	var colleaguebackground = getParamValue(params.colleaguebackground, assigns.colleaguebackground);
	if (hasValue(colleaguebackground)) { result.setColleaguebackground(colleaguebackground); }
	var companyId = getParamValue(params.companyId, assigns.companyId);
	if (hasValue(companyId)) { result.setCompanyId(companyId); }
	var currentProject = getParamValue(params.currentProject, assigns.currentProject);
	if (hasValue(currentProject)) { result.setCurrentProject(currentProject); }
	var defaultLanguage = getParamValue(params.defaultLanguage, assigns.defaultLanguage);
	if (hasValue(defaultLanguage)) { result.setDefaultLanguage(defaultLanguage); }
	var dialectId = getParamValue(params.dialectId, assigns.dialectId);
	if (hasValue(dialectId)) { result.setDialectId(dialectId); }
	var ecmVersion = getParamValue(params.ecmVersion, assigns.ecmVersion);
	if (hasValue(ecmVersion)) { result.setEcmVersion(ecmVersion); }
	var emailHtml = getParamValue(params.emailHtml, assigns.emailHtml);
	if (hasValue(emailHtml)) { result.setEmailHtml(emailHtml); }
	var especializationArea = getParamValue(params.especializationArea, assigns.especializationArea);
	if (hasValue(especializationArea)) { result.setEspecializationArea(especializationArea); }
	var extensionNr = getParamValue(params.extensionNr, assigns.extensionNr);
	if (hasValue(extensionNr)) { result.setExtensionNr(extensionNr); }
	var gedUser = getParamValue(params.gedUser, assigns.gedUser);
	if (hasValue(gedUser)) { result.setGedUser(gedUser); }
	var groupId = getParamValue(params.groupId, assigns.groupId);
	if (hasValue(groupId)) { result.setGroupId(groupId); }
	var guestUser = getParamValue(params.guestUser, assigns.guestUser);
	if (hasValue(guestUser)) { result.setGuestUser(guestUser); }
	var homePage = getParamValue(params.homePage, assigns.homePage);
	if (hasValue(homePage)) { result.setHomePage(homePage); }
	var login = getParamValue(params.login, assigns.login);
	if (hasValue(login)) { result.setLogin(login); }
	var mail = getParamValue(params.mail, assigns.mail);
	if (hasValue(mail)) { result.setMail(mail); }
	var maxPrivateSize = getParamValue(params.maxPrivateSize, assigns.maxPrivateSize);
	if (hasValue(maxPrivateSize)) { result.setMaxPrivateSize(maxPrivateSize); }
	var menuConfig = getParamValue(params.menuConfig, assigns.menuConfig);
	if (hasValue(menuConfig)) { result.setMenuConfig(menuConfig); }
	var nominalUser = getParamValue(params.nominalUser, assigns.nominalUser);
	if (hasValue(nominalUser)) { result.setNominalUser(nominalUser); }
	var passwd = getParamValue(params.passwd, assigns.passwd);
	if (hasValue(passwd)) { result.setPasswd(passwd); }
	var photoPath = getParamValue(params.photoPath, assigns.photoPath);
	if (hasValue(photoPath)) { result.setPhotoPath(photoPath); }
	var rowId = getParamValue(params.rowId, assigns.rowId);
	if (hasValue(rowId)) { result.setRowId(rowId); }
	var sessionId = getParamValue(params.sessionId, assigns.sessionId);
	if (hasValue(sessionId)) { result.setSessionId(sessionId); }
	var usedSpace = getParamValue(params.usedSpace, assigns.usedSpace);
	if (hasValue(usedSpace)) { result.setUsedSpace(usedSpace); }
	var volumeId = getParamValue(params.volumeId, assigns.volumeId);
	if (hasValue(volumeId)) { result.setVolumeId(volumeId); }
	
	return result;
}

function fillColleagueDtoArray(serviceHelper, params, assigns) {
	if (params == null) {
		return null;
	}

	var result = serviceHelper.instantiate("com.totvs.technology.ecm.foundation.ws.ColleagueDtoArray");

	for (var i = 0; i < params.length; i++) {
		result.getItem().add(fillColleagueDto(serviceHelper, params[i], assigns[i]));
	}

	return result;
}

function getObjectFactory(serviceHelper) {
	var objectFactory = serviceHelper.instantiate("com.totvs.technology.ecm.foundation.ws.ObjectFactory");

	return objectFactory;
}



function data() {
	return {
  "fluigService" : "ECMColleagueService",
  "operation" : "createColleague",
  "soapService" : "ECMColleagueServiceService",
  "portType" : "ColleagueService",
  "locatorClass" : "com.totvs.technology.ecm.foundation.ws.ECMColleagueServiceService",
  "portTypeMethod" : "getColleagueServicePort",
  "parameters" : [ ],
  "inputValues" : {
    "password" : "",
    "companyId" : 0,
    "colleagues" : [ {
      "active" : true,
      "adminUser" : false,
      "colleagueId" : "usuario",
      "colleagueName" : "nome",
      "companyId" : 1,
      "emailHtml" : true,
      "login" : "login",
      "mail" : "emailusuario"
    } ],
    "username" : ""
  },
  "inputAssignments" : {
    "password" : "VALUE",
    "companyId" : "VALUE",
    "colleagues" : [ {
      "active" : "VALUE",
      "adminUser" : "VALUE",
      "colleagueId" : "VALUE",
      "colleagueName" : "VALUE",
      "companyId" : "VALUE",
      "emailHtml" : "VALUE",
      "login" : "VALUE",
      "mail" : "VALUE"
    } ],
    "username" : "VALUE"
  },
  "outputValues" : { },
  "outputAssignments" : { },
  "extraParams" : {
    "enabled" : false
  }
}
}

 function stringToBoolean(param) {
	 if(typeof(param) === 'boolean') { 
		 return param; 
	 } 
	 if (param == null || param === 'null') { 
		 return false; 
	 } 
	 switch(param.toLowerCase().trim()) { 
		 case 'true': case 'yes': case '1': return true; 
		 case 'false': case 'no': case '0': case null: return false; 
		 default: return Boolean(param); 
	 } 
} 