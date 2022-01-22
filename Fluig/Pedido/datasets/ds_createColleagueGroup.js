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

	verifyConstraints(serviceData.inputValues, constraints);

	var serviceHelper = ServiceManager.getService(serviceData.fluigService);
	var serviceLocator = serviceHelper.instantiate(serviceData.locatorClass);
	var service = serviceLocator.getColleagueGroupServicePort();
	var response = service.createColleagueGroup(getParamValue(params.username, assigns.username), getParamValue(params.password, assigns.password), 
		getParamValue(params.companyId, assigns.companyId), fillColleagueGroupDtoArray(serviceHelper, params.colleagueGroups, assigns.colleagueGroups)
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
	dataset.addColumn('colleagueGroups');
	dataset.addColumn('username');

	var password = isPrimitive(params.password) ? params.password : JSONUtil.toJSON(params.password);
	var companyId = isPrimitive(params.companyId) ? params.companyId : JSONUtil.toJSON(params.companyId);
	var colleagueGroups = isPrimitive(params.colleagueGroups) ? params.colleagueGroups : JSONUtil.toJSON(params.colleagueGroups);
	var username = isPrimitive(params.username) ? params.username : JSONUtil.toJSON(params.username);

	dataset.addRow([error.message, password, companyId, colleagueGroups, username]);

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


function fillColleagueGroupDto(serviceHelper, params, assigns) {
	if (params == null) {
		return null;
	}

	var result = serviceHelper.instantiate("com.totvs.technology.ecm.foundation.ws.ColleagueGroupDto");

	var colleagueId = getParamValue(params.colleagueId, assigns.colleagueId);
	if (hasValue(colleagueId)) { result.setColleagueId(colleagueId); }
	var companyId = getParamValue(params.companyId, assigns.companyId);
	if (hasValue(companyId)) { result.setCompanyId(companyId); }
	var groupId = getParamValue(params.groupId, assigns.groupId);
	if (hasValue(groupId)) { result.setGroupId(groupId); }
	var writeAllowed = getParamValue(params.writeAllowed, assigns.writeAllowed);
	if (hasValue(writeAllowed)) { result.setWriteAllowed(writeAllowed); }
	
	return result;
}

function fillColleagueGroupDtoArray(serviceHelper, params, assigns) {
	if (params == null) {
		return null;
	}

	var result = serviceHelper.instantiate("com.totvs.technology.ecm.foundation.ws.ColleagueGroupDtoArray");

	for (var i = 0; i < params.length; i++) {
		result.getItem().add(fillColleagueGroupDto(serviceHelper, params[i], assigns[i]));
	}

	return result;
}

function getObjectFactory(serviceHelper) {
	var objectFactory = serviceHelper.instantiate("com.totvs.technology.ecm.foundation.ws.ObjectFactory");

	return objectFactory;
}



function data() {
	return {
  "fluigService" : "ECMColleagueGroupService",
  "operation" : "createColleagueGroup",
  "soapService" : "ECMColleagueGroupServiceService",
  "portType" : "ColleagueGroupService",
  "locatorClass" : "com.totvs.technology.ecm.foundation.ws.ECMColleagueGroupServiceService",
  "portTypeMethod" : "getColleagueGroupServicePort",
  "parameters" : [ ],
  "inputValues" : {
    "password" : "2ac77cd415ef",
    "companyId" : 1,
    "colleagueGroups" : [ {
      "colleagueId" : "idusuario",
      "companyId" : 1,
      "groupId" : "id grupo"
    } ],
    "username" : "admin"
  },
  "inputAssignments" : {
    "password" : "VALUE",
    "companyId" : "VALUE",
    "colleagueGroups" : [ {
      "colleagueId" : "VALUE",
      "companyId" : "VALUE",
      "groupId" : "VALUE"
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