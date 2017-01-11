const {dialog} = require('electron').remote;

var bibUtil = require(`${__dirname}/../util/usfm_to_json`),
    db = require(`${__dirname}/../util/data-provider`).targetDb(),
    refDb = require(`${__dirname}/../util/data-provider`).referenceDb(),
    fs = require("fs"),
    path = require("path"),
    codeClicked = false;

document.getElementById('export-path').addEventListener('click', function (e) {
    dialog.showOpenDialog({properties: ['openDirectory'],
			   filters: [{name: 'All Files', extensions: ['*']}],
			   title: "Select export destination folder"
			  }, function (selectedDir) {
			      if(selectedDir != null) {
				  e.target.value = selectedDir;
			      }
			  });
});

document.getElementById('target-import-path').addEventListener('click', function (e) {
    dialog.showOpenDialog({properties: ['openDirectory'],
			   filters: [{name: 'All Files', extensions: ['*']}],
			   title: "Select import folder for target"
			  }, function (selectedDir) {
			      if(selectedDir != null) {
				  e.target.value = selectedDir;
			      }
			  });
});

document.getElementById('save-btn').addEventListener('click', function (e) {
    if (target_setting() == false)
	return;
    db.get('targetBible').then(function (doc) {
	db.put({
	    _id: 'targetBible',
	    _rev: doc._rev,
	    targetLang: document.getElementById('target-lang').value,
	    targetVersion: document.getElementById('target-version').value,
	    targetPath: document.getElementById('export-path').value
	}).then(function (e) {
	    alertModal("Language Setting", "Language setting saved successfully!!");
	});
    }).catch(function (err) {
	db.put({
	    _id: 'targetBible',
	    targetLang: document.getElementById('target-lang').value,
	    targetVersion: document.getElementById('target-version').value,
	    targetPath: document.getElementById('export-path').value
	}).then(function (e) {
	    alertModal("Language Setting", "Language setting saved successfully!!");
	}).catch(function (err) {
	    alert_message(".alert-danger", "Something went wrong!! Please try again");
	});
    });
});

document.getElementById('ref-import-btn').addEventListener('click', function (e) {
    if (reference_setting() == false )
	return;
    var ref_id_value = document.getElementById('langCode').value.toLowerCase() + '_' + document.getElementById('ref-version').value.toLowerCase(),
	ref_entry = {},
    	files = fs.readdirSync(document.getElementById('ref-path').value);
    ref_entry.ref_id = ref_id_value;
    ref_entry.ref_name =  document.getElementById('ref-name').value;
    ref_entry.isDefault = false;
    refDb.get('refs').then(function (doc) {
	var refExistsFlag = false;
	var updatedDoc = doc.ref_ids.forEach(function (ref_doc) {
	    if(ref_doc.ref_id === ref_id_value) {
		refExistsFlag = true;
	    }
	});
	if(!refExistsFlag) {
	    doc.ref_ids.push(ref_entry);
	    refDb.put(doc).then(function (res) {
		saveJsonToDB(files);
		alertModal("Reference Usfm Setting", "Reference Usfm Setting saved successfully!!");
	    });
	} else {
	    saveJsonToDB(files);
	    alertModal("Reference Usfm Setting", "Reference Usfm Setting saved successfully!!");
	}
    }).catch(function (err) {
	if(err.message === 'missing') {
	    var refs = {
		_id: 'refs',
		ref_ids: []
	    };
	    ref_entry.isDefault = true;
	    refs.ref_ids.push(ref_entry);
	    refDb.put(refs).then(function (res) {
		saveJsonToDB(files);
		alertModal("Reference Usfm Setting", "Reference Usfm Setting saved successfully!!");
	    }).catch(function (internalErr) {
		alertModal("Reference USFM Setting", "There was an error while importing USFM.");
	    });
	} else if(err.message === 'usfm parser error') {
	    alertModal("Reference USFM Setting", "There was an error while parsing the USFM.");
	} else {
	    alertModal("Reference USFM Setting", "There was an error while importing USFM.");
	}
    });
});

document.getElementById('target-import-btn').addEventListener('click', function (e) {
    if (import_sync_setting() == false)
	return;

    var inputPath = document.getElementById('target-import-path').value;
    var files = fs.readdirSync(inputPath);
    files.forEach(function (file) {
	var filePath = path.join(inputPath, file);
	if(fs.statSync(filePath).isFile() && !file.startsWith('.')) {
	    //console.log(filePath);
	    var options = {
		lang: 'hi',
		version: 'ulb',
		usfmFile: filePath,
		targetDb: 'target'
	    }
	    bibUtil.toJson(options);
	}
    });
    alertModal("Import and Sync", "Import and Sync Setting saved successfully!!");
});


function saveJsonToDB(files) {
    files.forEach(function (file) {
	if(!file.startsWith('.')) {
	    var filePath = path.join(document.getElementById('ref-path').value, file);
	    //console.log(filePath + ' ' + fs.statSync(filePath).isFile());
	    if(fs.statSync(filePath).isFile()) {
		var options = {
		    lang: document.getElementById('langCode').value.toLowerCase(),
		    version: document.getElementById('ref-version').value.toLowerCase(),
		    usfmFile: filePath,
		    targetDb: 'refs'
		}
		bibUtil.toJson(options);
	    }
	}
    });
}

document.getElementById('ref-path').addEventListener('click', function (e) {
    dialog.showOpenDialog({properties: ['openDirectory'],
			   filters: [{name: 'All Files', extensions: ['*']}],
			   title: "Select reference version folder"
			  }, function (selectedDir) {
			      if(selectedDir != null) {
				  e.target.value = selectedDir;
			      }
			  });
});



// Validation check for reference settings
function reference_setting(){
    var name     = $("#ref-name").val(),
  	langCode = $("#langCode").val(),
  	version  = $("#ref-version").val(),
  	path     = $("#ref-path").val(),
  	isValid = true;
    if(name == ""){
	alert_message(".alert-danger", "Reference Bible name must not be blank");
	isValid = false;
    }else if(langCode === null || langCode === "") {
	alert_message(".alert-danger", "Reference Bible language code must not be blank");
	isValid = false;
    }else if(version === null || version === ""){
	alert_message(".alert-danger", "Reference Bible version must not be blank");
	isValid = false;
    }else if(path === null || path === ""){
	alert_message(".alert-danger", "Reference Bible path must not be blank");
	isValid = false;
    }else{
	isValid = true;
	
    }
    return isValid;
} //validation reference settings

// Validation check for target language settings
function target_setting(){
    var langCode  = $("#target-lang").val(),
  	version   = $("#target-version").val(),
  	path     = $("#export-path").val(),
	isValid = true;

    if(langCode === null || langCode === ""){
	alert_message(".alert-danger", "Target Bible language code must not be blank");
	isValid = false;
    }else if(version === null || version === ""){
	alert_message(".alert-danger", "Target Bible version must not be blank");
	isValid = false;
    }else if(path === null || path === ""){
	alert_message(".alert-danger", "Target Bible path must not be blank");
	isValid = false;
    }else{
	isValid = true;
    }
    return isValid;
} //validation target setting

function import_sync_setting(){
    var targetImportPath = $("#target-import-path").val();
    isValid = true;
    if ( targetImportPath === null || targetImportPath === "") {
	alert_message(".alert-danger", "Import and Sync target must not be blank.");
    	isValid = false;
    }
    return isValid;
}

function alert_message(type,message){
    $(type).css("display", "block");
    $(type).fadeTo(2000, 1000).slideUp(1000, function(){
	$(type).css("display", "none");
    });
    $(type+" "+"span").html(message);
}

function setReferenceSetting(){
    db.get('targetBible').then(function (doc) {
	$("#target-lang").val(doc.targetLang);
  	$("#target-version").val(doc.targetVersion);
  	$("#export-path").val(doc.targetPath);
    }).catch(function (err) {
	$("#target-lang").val("");
  	$("#target-version").val("");
  	$("#export-path").val("");
    });	
}
//get reference setting
$(function(){
    setReferenceSetting();
    buildIndex();
    buildReferenceList();
});
function buildIndex(){
    refDb.search({
	fields: ['_id', 'names'],
		build: true
    })
}
function alertModal(heading, formContent) {
    $("#heading").html(heading);
    $("#content").html(formContent);
    $("#dynamicModal").modal();
    $("#dynamicModal").toggle();
}

function matchCode(input) {
    var matches = []
    return refDb.search({
	query: input,
	limit:10,
	fields: ['_id', 'names'],
	include_docs: true,
	stale: 'ok'
    }).then(function(response){
	var data = ""
	if(response!=undefined && response.rows.length > 0){
	    $.each(response.rows, function(index, value){
		doc = value.doc
		if(doc){
		    matches.push({name: doc.names+" "+"("+(doc._id)+")", id: doc._id});
		}
	    })
		return matches;
	}
	else{
	    return [];
	}
    }).catch(function(err){
	console.log(err);
    })
	}
function changeInput(val) {
    codeClicked = false; // flag to check language code clicked on list or not
    var autoCompleteResult = matchCode(val)
    autoCompleteResult.then(function(res){
	var parent_ul = "<ul>";
	if(res){
	    $.each(res, function (index, value) {
		// CREATE AND ADD SUB LIST ITEMS.
		parent_ul += "<li><span class='code-name'>"+value['name']+"</span><input type='hidden' value="+"'"+value['id']+"'"+"class='code-id'/> </li>"
	    });
	    parent_ul+="</ul>"
	    $("#divResult").html(parent_ul).show();
	    $("#divResult li").on("click",function(e){
		var $clicked = $(this);
		codeName = $clicked.children().select(".code-name").text();
		codeId = 	$clicked.find(".code-id");
		$('#ref-lang-code').val(codeName);
		$("#langCode").val(codeId.val());
		codeClicked = true;
	    });
	}
    });
    $(document).on("click", function(e) {
	var $clicked = $(e.target);
	if (! $clicked.hasClass("search")){
	    $("#divResult").fadeOut();
	}
    });
    $('#inputSearch').click(function(){
	$("#divResult").fadeIn();
    });
}
$("#ref-lang-code").keyup(function(){
    changeInput($(this).val())
});

$('#ref-lang-code').on('blur', function () {	
    if(!codeClicked){
	$(this).val('')// clear language code textbox
    }
    if ($("#divResult").text()==="") {
	$("#ref-lang-code").val("");
    }
});
function buildReferenceList(){
	refDb.get('refs').then(function (doc) {
		tr = '';
	    doc.ref_ids.forEach(function (ref_doc) {
				tr += "<tr><td>";
				tr += ref_doc.ref_name;
				tr += "</td>";
				tr += "<td><a data-id="+ref_doc.ref_id+" href=javaScript:void(0); class='edit-ref'>Rename</a> | <a data-id="+ref_doc.ref_id+" href=javaScript:void(0) class='remove-ref'>Remove</a></td>";
				tr += "</tr>"
		})
		$("#reference-list").html(tr);
	})
}
$(document).on('click', '.edit-ref', function(){
	var tdElement = $(this).parent().prev();
	var temp_text = tdElement.text();
	var docId = $(this).data('id');
	tdElement.html('<input type="text"  class="ref-text" value="' + tdElement.text() + '" />&nbsp;<a data-docid=' +docId+ ' class="save-ref-text" href="javaScript:void(0)">Save</a> | <a data-temp = '+temp_text+' class="cancel-ref" href="javaScript:void(0)">Cancel</a>');
});
$(document).on('click', '.cancel-ref', function(){
	var tdElement = $(this).parent();
	tdElement.html($(this).data('temp'));
});
$(document).on('click', '.remove-ref', function(){
	if (!confirm("Are you sure to delete reference?")) {
         return false;
    }
	var element = $(this)
	var ref_ids = [];
	var check_default = false;
	refDb.get('refs').then(function(doc){
		doc.ref_ids.forEach(function (ref_doc) {
			if(ref_doc.ref_id != element.data('id')){
				ref_ids.push({ref_id: ref_doc.ref_id, ref_name: ref_doc.ref_name, isDefault: ref_doc.isDefault});
			}else{
				if(ref_doc.isDefault == true){
					check_default = true;
				}
			}
		})
		if(check_default == true){
			objRef = ref_ids[0]
			if(objRef){
				ref_ids[0]= {ref_id: objRef.ref_id, ref_name: objRef.ref_name, isDefault: true};
			}
		}
		doc.ref_ids = ref_ids;
		return refDb.put(doc);
	}).then(function(res){
		element.closest( 'tr').remove();
	}).catch(function(err){
		console.log(err)
		alertModal("Remove Info", "Unable to delete.please try later!!");
	})
});
$(document).on('click', '.save-ref-text', function(){
	var textElement = $(this).prev();
	var docId = $(this).data('docid');
	var tdElement = $(this).parent();
	if(textElement.val() === ''){
		alertModal("Alert", "Please enter reference name!!");
		return;
	}
	var ref_ids = [];
	refDb.get('refs').then(function(doc){
		doc.ref_ids.forEach(function (ref_doc) {
			if(ref_doc.ref_id != docId){
				ref_ids.push({ref_id: ref_doc.ref_id, ref_name: ref_doc.ref_name, isDefault: ref_doc.isDefault});
			}else{
				ref_ids.push({ref_id: ref_doc.ref_id, ref_name: textElement.val() , isDefault: ref_doc.isDefault})
			}
		})
		doc.ref_ids = ref_ids;
		return refDb.put(doc);
	}).then(function(res){
		tdElement.html(textElement.val());
	}).catch(function(err){
		alertModal("Update Info", "Unable to rename.please try later!!");
	})
});
