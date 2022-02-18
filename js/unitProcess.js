document.addEventListener('DOMContentLoaded', async function () {
    createGrid();
    selectProcessStepList();
    setCCC001();
});

let container, provider, gridView;

let fields = [
    {fieldName:"PROC_ID", dataType:"text"},
    {fieldName:"PROC_NM", dataType:"text"},
    {fieldName:"PROC_CTN", dataType:"text"},
    {fieldName:"DETL_PROC_CTN", dataType:"text"},
    {fieldName:"PROC_DVCN_CD", dataType:"text"},
    {fieldName:"PROC_LRCL_CD", dataType:"text"},
    {fieldName:"PROC_MDCL_CD", dataType:"text"},
    {fieldName:"PROC_SMCL_CD", dataType:"text"},
    {fieldName:"USE_YN", dataType:"text"},
    {fieldName:"INQR_SQNC", dataType:"text"},
    {fieldName:"HGRN_PROC_ID", dataType:"text"},
    {fieldName:"CSUT_GRP_CD", dataType:"text"},
    {fieldName:"FRST_RGSR_ID", dataType:"text"},
    {fieldName:"FRST_RGST_IP", dataType:"text"},
    {fieldName:"FRST_RGST_DT", dataType:"text"},
    {fieldName:"LAST_UPDR_ID", dataType:"text"},
    {fieldName:"LAST_UPDT_IP", dataType:"text"},
    {fieldName:"LAST_UPDT_DT", dataType:"text"},
]

let columns = [
	{fieldName:"PROC_ID", name:"PROC_ID", width:65, header:{text:"프로세스ID" }, footer: {expression: "count"},styleName: "textLeft"},
	{fieldName:"PROC_NM", name:"PROC_NM", width:210, header:{text:"프로세스명" }, styleName: "textLeft", popupMenu: "menu1",button: "popup"},
    //{fieldName:"PROC_NM", name:"PROC_NM", width:210, header:{text:"프로세스명" }, styleName: "textLeft"},
	{fieldName:"PROC_CTN", name:"PROC_CTN", width:300, header:{text:"프로세스 내용" }, styleName: "textLeft",
		renderer:{
			type:"html",
			showTooltip:true,
			callback: function(grid, cell, w, h) {
				let str = cell.value;
				if(str == null) str = "";
				str = str.replace(/(<([^>]+)>)/gi, "");
				str = str.replace(/\s\s+/g, ' ');
				return str;
			}
		  },
	},
	
	/* 하위 컬럼 display false */ 
	{fieldName:"DETL_PROC_CTN", name:"DETL_PROC_CTN", header:{text: "프로세스 내용(개발자)"}},
	{fieldName:"PROC_DVCN_CD", name:"PROC_DVCN_CD", width:60, header:{text: "구분코드"}},
	{fieldName:"PROC_LRCL_CD", name:"PROC_LRCL_CD", width:60, header:{text: "대분류"}},
	{fieldName:"PROC_MDCL_CD", name:"PROC_MDCL_CD", width:60, header:{text: "중분류"}},
	{fieldName:"PROC_SMCL_CD", name:"PROC_SMCL_CD", header:{text: "소분류"}},
	{fieldName:"USE_YN", name:"USE_YN", header:{text: "사용여부"}},
	{fieldName:"INQR_SQNC", name:"INQR_SQNC", header:{text: "조회순서"}},
	{fieldName:"HGRN_PROC_ID", name:"HGRN_PROC_ID", header:{text: "상위프로세스ID"}},
	{fieldName:"CSUT_GRP_CD", name:"CSUT_GRP_CD", header:{text: "컨설팅그룹코드"}},
	{fieldName:"FRST_RGSR_ID", name:"FRST_RGSR_ID", header:{text: "최초등록자ID"}},
	{fieldName:"FRST_RGST_IP", name:"FRST_RGST_IP", header:{text: "최초등록IP"}},
	{fieldName:"FRST_RGST_DT", name:"FRST_RGST_DT", header:{text: "최초등록일시"}},
	{fieldName:"LAST_UPDR_ID", name:"LAST_UPDR_ID", header:{text: "최종수정자ID"}},
	{fieldName:"LAST_UPDT_IP", name:"LAST_UPDT_IP", header:{text: "최종수정IP"}},
	{fieldName:"LAST_UPDT_DT", name:"LAST_UPDT_DT", header:{text: "LAST_UPDT_DT"}},
];

function createGrid() {
    container = document.getElementById('realgrid');
    provider = new RealGrid.LocalDataProvider(false);
    gridView = new RealGrid.GridView(container);
    gridView.setDataSource(provider);

    provider.setFields(fields);
    gridView.setColumns(columns);

    gridView.setDisplayOptions({showEmptyMessage: true});
    gridView.displayOptions.emptyMessage = "표시할 Process가 없습니다.";

    gridView.displayOptions.rowHeight = 30;
    gridView.header.height = 30;
    gridView.footer.height = 10;
    gridView.stateBar.width = 16;

    gridView.setCheckBar({visible: false}); // 그리드 체크 박스 표시
    gridView.setRowIndicator({visible: false}); // 그리드 행수 표시
    gridView.setStateBar({visible: false}); // 그리드에서 입력,수정,삭제 표시
    gridView.setDisplayOptions({focusVisible:false}); // 포커스 표시 여부
    gridView.displayOptions.rowFocusType = "row"; // 그리드 한줄 선택

    gridView.setColumnProperty("PROC_NM", "autoFilter", true);

    // ReadOnly
	// 그리드 컬럼들의 editable 상태를 편히 관리하기 위해 컬럼 마다 관리
	columns.forEach((element) => {
		gridView.columnByName(element.name).editable = false;
	});

    gridView.displayOptions.fitStyle = "evenFill"; // 그리드 꽉 채우기
    // 컬럼 표시 여부
    const colVisible = false;
    gridView.columnByName("PROC_DVCN_CD").visible =  colVisible; // 구분코드
    gridView.columnByName("PROC_LRCL_CD").visible =  colVisible; // 대분류
    gridView.columnByName("PROC_MDCL_CD").visible =  colVisible; // 중분류
    gridView.columnByName("PROC_SMCL_CD").visible =  colVisible; // 소분류
    gridView.columnByName("USE_YN").visible =  colVisible; // 사용여부
    gridView.columnByName("INQR_SQNC").visible =  colVisible; // 조회순서
    gridView.columnByName("HGRN_PROC_ID").visible =  colVisible; // 상위프로세스ID
    gridView.columnByName("CSUT_GRP_CD").visible =  colVisible;  // 컨설팅그룹코드
    gridView.columnByName("DETL_PROC_CTN").visible = colVisible; // 프로세스 내용(개발자)
    gridView.columnByName("FRST_RGSR_ID").visible =  colVisible; // 최초등록자ID
    gridView.columnByName("FRST_RGST_IP").visible =  colVisible; // 최초등록IP
    gridView.columnByName("FRST_RGST_DT").visible =  colVisible; // 최초등록일시
    gridView.columnByName("LAST_UPDR_ID").visible =  colVisible; // 최종수정자ID
    gridView.columnByName("LAST_UPDT_IP").visible =  colVisible; // 최종수정IP
    gridView.columnByName("LAST_UPDT_DT").visible =  colVisible; // LAST_UPDT_DT

	setProPopUpMenu();

    // ProcGrid 클릭 이벤트
    gridView.onCellClicked = function (grid, clickData) {
        const current = gridView.getCurrent();
        const values = provider.getJsonRow(current.dataRow)
        const procId = values.PROC_ID;
        const procNm = values.PROC_NM;
        document.getElementById('procId').value = procId;
        document.getElementById('procName').value = procNm;

        selectProcImgList();          // Image탭에 저장된 이미지 View
        // selectProcessStepList();      // Step 그리드
        selectStepList();
        selectProcTotalFileList();    // 저장된 Image, 첨부파일 목록 표시
    }

    /*
    // return false 시 컬럼 포커스 방지 
    gridView.onCurrentChanging =  function (grid, oldIndex, newIndex) {
        // console.log(oldIndex);
        // console.log(newIndex);
        console.log(grid);
        return false;
   };
   */
}

function setProPopUpMenu() {
    let menu = [
      {
          label: "프로세스 관리",
          tag: "proc",
          enabled: true,
          children: []
      },
      {
          label: "스텝 관리",
          tag: "step",
          enabled: true,
          children: []
      },
      {
          label: "스텝 조회",
          tag: "step2",
          enabled: true,
          children: []
      }
    ];
    gridView.addPopupMenu("menu1", menu);
    gridView.onMenuItemClicked = function(grid, data, index) {
        const current = gridView.getCurrent();
        const values = provider.getJsonRow(current.dataRow)
        const PROC_LRCL_CD = values.PROC_LRCL_CD;
        const PROC_MDCL_CD = values.PROC_MDCL_CD;
        const PROC_SMCL_CD = values.PROC_SMCL_CD;
        const PROC_ID = values.PROC_ID;
        const PROC_NM = values.PROC_NM;

        if(data.tag == 'proc') {
            //openProcPop('update');
            location.href = contextPath + "/ProcessManagement-temp/?PROC_LRCL_CD="+PROC_LRCL_CD+"&PROC_MDCL_CD="+PROC_MDCL_CD+"&PROC_SMCL_CD="+PROC_SMCL_CD+"&PROC_ID="+PROC_ID+"&PROC_NM="+PROC_NM;
            
        }else if(data.tag == 'step') {
            location.href = contextPath + "/StepManagement/?PROC_LRCL_CD="+PROC_LRCL_CD+"&PROC_MDCL_CD="+PROC_MDCL_CD+"&PROC_SMCL_CD="+PROC_SMCL_CD+"&PROC_ID="+PROC_ID+"&PROC_NM="+PROC_NM;
                
        }else if(data.tag == 'step2') {
            location.href = contextPath + "/unitp-StepView/?PROC_LRCL_CD="+PROC_LRCL_CD+"&PROC_MDCL_CD="+PROC_MDCL_CD+"&PROC_SMCL_CD="+PROC_SMCL_CD+"&PROC_ID="+PROC_ID+"&PROC_NM="+PROC_NM;
        }
    };  
}

// Image탭에 저장된 이미지 View
function selectProcImgList() {
	const current = gridView.getCurrent();
  	const values = provider.getJsonRow(current.dataRow)
  	const procId = values.PROC_ID;

  	axios.get(contextPath + '/selectProcAtrbList',{
    	params: {
              	PROC_ID : procId,
				ATRB_DVSN_CD : '05'
    	}
  	})
  	.then(function(response) {
    	let list = response.data;
    	dataList = [...list];

		$("img").remove(".imgList");
		
		if(Object.keys(dataList).length === 0){
			let imgArea = document.getElementById('processImgList');
			let img = document.createElement('img');
			img.id = 'imgList';
			img.className = 'd-block w-100 imgList';
			img.src = contextPath + "/resources/img/common/null.svg";
			imgArea.appendChild(img);
		}else {
			dataList.forEach(element => {
				let imgArea = document.getElementById('processImgList');
				let img = document.createElement('img');
				img.id = 'imgList';
				img.className = 'd-block w-100 imgList';
				img.src = contextPath + "/resources/upload/img/MD/" + element.RENAME_FILENAME;
				imgArea.appendChild(img);
			});	
		}
  	})
  	.catch(function(error) {
    	console.log(error);
  	});
}

// 저장된 Image, 첨부파일 목록 표시
function selectProcTotalFileList() {
    $("div").remove(".newImgList"); 
    // $("div").remove(".newFileList");
    $("a").remove(".newFileList");
    const current = gridView.getCurrent();
    const values = provider.getJsonRow(current.dataRow)
    const PROC_ID = values.PROC_ID;
    axios.get(contextPath + '/selectProcImgFileList',{
        params: {
            PROC_ID
        }
    })
    .then(function(response) {
        const list = response.data;
        let txtImg = '';
        let txtFile = '';
        for(let i=0; i<list.length; i++) {
            if(list[i].ATRB_DVSN_CD == '05'){
                txtImg += "<div id='procImgList_" +i+ "' class='newImgList' value='" + list[i].ATRB_RGST_SNO + "'>" + list[i].ATRB_ATFL_NM 
                txtImg += "<img src='"+contextPath+"/resources/img/common/x.svg' id='deleteProcFile' >"
                txtImg += "<input type='hidden' value='" + list[i].PROC_ID + "'>"
                txtImg += "<input type='hidden' value='" + list[i].ATRB_RGST_SNO + "'>"
                txtImg += "<input type='hidden' value='" + list[i].RENAME_FILENAME + "'>"
                txtImg += "<input type='hidden' value='" + list[i].ATRB_DVSN_CD + "'>"
                txtImg += "<input type='hidden' value='" + list[i].FRST_RGSR_ID + "'>"
                txtImg += "</div>"	
            } else {
				txtFile += "<div><a download='"+list[i].ATRB_ATFL_NM+"' class='newFileList' href='" + contextPath +'/resources/upload/img/MD/'+list[i].RENAME_FILENAME +"'>" + list[i].ATRB_ATFL_NM
				//img.src = contextPath + "/resources/upload/img/MD/" + element.RENAME_FILENAME;
                //txtFile += "<div><a download class='newFileList' href='" + list[i].PATH +'/'+list[i].RENAME_FILENAME +"'>" + list[i].ATRB_ATFL_NM 
                // txtFile += "<div id='procFileList_" +i+ "' class='newFileList' value='" + list[i].ATRB_RGST_SNO + "'>" + list[i].ATRB_ATFL_NM 
                txtFile += "<img src='"+contextPath+"/resources/img/common/x.svg' id='deleteProcFile' >"
                txtFile += "<input type='hidden' value='" + list[i].PROC_ID + "'>"
                txtFile += "<input type='hidden' value='" + list[i].ATRB_RGST_SNO + "'>"
                txtFile += "<input type='hidden' value='" + list[i].RENAME_FILENAME + "'>"
                txtFile += "<input type='hidden' value='" + list[i].ATRB_DVSN_CD + "'>"
                txtFile += "<input type='hidden' value='" + list[i].FRST_RGSR_ID + "'>"
                // txtFile += "</div>"	
                txtFile += "</div></a>"	
                // <a href="원하는_주소" download>download 속성 예제</a>
                // <a href="${pageContext.request.contextPath}/resources/upload/img/DataBoard/${datafile.RENAME_FILENAME}" download="${datafile.ORIGIN_FILENAME}">${datafile.ORIGIN_FILENAME}</a>
            }
        }
        $('#imageList').append(txtImg);
        $('#fileList').append(txtFile);
    })
    .catch(function(error) {
        console.log(error);
    });
}

// 이미지, 첨부파일 저장
$(document).ready(function() {
    $("#imageUpload").on("change", addFiles_i);
	$("#fileupload").on("change", addFiles_f);
});

// 이미지 추가
let filesTempArr = [];
function addFiles_i(e) {
    let files = e.target.files;
    let filesArr = Array.prototype.slice.call(files);
    let filesArrLen = filesArr.length;
    let ilesTempArrLen = filesTempArr.length;
    for( let i=0; i<filesArrLen; i++ ) {
        filesTempArr.push(filesArr[i]);
		// $("#fileListImg").append("<div class='newImgList'>" + filesArr[i].name + "<img src='"+contextPath+"/resources/img/common/x.svg' onclick='deleteFile(event, " + (filesTempArrLen+i)+ ");'></div>");
		// $("#fileList").append("<div>" + filesArr[i].name + "<img src=\"/images/deleteImage.png\" onclick=\"deleteFile(event, " + (filesTempArrLen+i)+ ");\"></div>");
    }
    $(this).val('');
	saveImg();
}

function saveImg() {
	if(filesTempArr.length != 0){
        const current = gridView.getCurrent();
        const values = provider.getJsonRow(current.dataRow)
        const PROC_ID = values.PROC_ID;
		
		let formData = new FormData();
		// 파일 데이터
		for(let i=0, filesTempArrLen = filesTempArr.length; i<filesTempArrLen; i++) {
		   formData.append("files", filesTempArr[i]);
		}
		
		formData.append("PROC_ID", PROC_ID);     
        formData.append('STEP_ID', 'PROCONLY'); // 프로세스 이미지 등록
		formData.append('ATRB_DVSN_CD', '05');  // 속성구분코드 (05 이미지)
		formData.append('ATRB_NM', '이미지');
		
		$.ajax({
			type: "POST",
            url : contextPath + '/uploadProcessImg',
		    data: formData, 
			processData: false,
			contentType: false,
		})
		.done(function(data) {
            //console.log(data);
		})
		.fail(function(jqXHR, status, errorThrown) {
			alert("실패!");
		})
		.always(function() { 
			formData.delete("files");
			filesTempArr = [];
            gridView.onCellClicked();
		}); 
	}else {
		alert('신규파일이 없습니다');
	}
}

// 첨부파일 추가
let filesTempArr_f = [];
function addFiles_f(e) {
    let files_f = e.target.files;
    let filesArr_f = Array.prototype.slice.call(files_f);
    let filesArrLen_f = filesArr_f.length;
    let filesTempArrLen_f = filesTempArr_f.length;
    for( let i=0; i<filesArrLen_f; i++ ) {
        filesTempArr_f.push(filesArr_f[i]);
		// $("#fileListFile").append("<div class='newFileList'>" + filesArr_f[i].name + "<img src='"+contextPath+"/resources/img/common/x.svg' onclick='deleteFile(event, " + (filesTempArrLen_f+i)+ ");'></div>");
		// $("#fileList").append("<div>" + filesArr[i].name + "<img src=\"/images/deleteImage.png\" onclick=\"deleteFile(event, " + (filesTempArrLen+i)+ ");\"></div>");
    }
    $(this).val('');
	saveFile();
}

function saveFile() {
    const current = gridView.getCurrent();
    const values = provider.getJsonRow(current.dataRow)
    const PROC_ID = values.PROC_ID;
    
    let formData = new FormData();
    // 파일 데이터
    for(let i=0, filesTempArrLen_f = filesTempArr_f.length; i<filesTempArrLen_f; i++) {
        formData.append("files", filesTempArr_f[i]);
    }
    formData.append("PROC_ID", PROC_ID);     // 그리드 포커스 값
    formData.append('STEP_ID', 'PROCONLY'); 
    formData.append('ATRB_DVSN_CD', '06');   // 속성구분코드(06 첨부파일)
    formData.append('ATRB_NM', '첨부파일');   

    $.ajax({
            type: "POST",
            url : contextPath + '/uploadProcessImg',
            data: formData, 
            processData: false,
            contentType: false,
    })
    .done(function(data) {
        console.log(data);
    })
    .fail(function(jqXHR, status, errorThrown) {
            alert("실패!");
    })
    .always(function() { 
        formData.delete("files");
        filesTempArr_f = [];
        gridView.onCellClicked();
    });
  
}



// 이미지, 첨부파일 리스트에서 파일 X 버튼 클릭 시
$(document).on("click","#deleteProcFile",function(e) {
    if(confirm('삭제 하시겠습니까?')) {
        const PROC_ID = $(this).parent().children().eq(1).val();
        const ATRB_RGST_SNO = $(this).parent().children().eq(2).val();
        const RENAME_FILENAME = $(this).parent().children().eq(3).val();
        const ATRB_DVSN_CD = $(this).parent().children().eq(4).val();
        
        const FRST_RGSR_ID = $(this).parent().children().eq(5).val();
        const userId = document.getElementById('userInfoID').innerText;
        console.log(FRST_RGSR_ID);
        console.log(userId);
        if(FRST_RGSR_ID == userId) {
            axios.post(contextPath + '/deleteProcImgList', null, {
                    params: {
                        PROC_ID : PROC_ID,
                        ATRB_RGST_SNO   : ATRB_RGST_SNO,
                        RENAME_FILENAME : RENAME_FILENAME ,
                        ATRB_DVSN_CD : ATRB_DVSN_CD
                    }
            })
            .then(function (response) {
                console.log(response.data + "," + response.status);
                // toastr.success("삭제 되었습니다");
                gridView.onCellClicked();
            })
            .catch(function(error) {
                console.log(error);
            });
        }else {
            //toastr.error("등록자만 삭제할 수 있습니다");
            alert('등록자만 삭제할 수 있습니다');
        }
    }
});

//분류 콤보 가져오기
function getCodeList(url,value){
	let result = [];
	$.ajax({
		url : url,
		method : "GET",
	    dataType: "json",
	    data : {
	    	comn_item_chrc_vl : value
	    },
	    async: false,
	}).done((data)=>{
		result = data;
	}).fail((error)=>{
		console.log(error)
	})
	return result;
};

// 대분류 가져오기
function setCCC001() {
	const list = getCodeList(contextPath + '/comcd/ccc001','');
	let txt = '';
	list.forEach(item =>{
		txt += "<option class='dropdown-item' value='" + item.COMN_DTLS_CD + "'>" + item.DETL_CD_NM + "</option>"
 	 })
	$('#proc_lrcl_cd').append(txt);
}

// 중분류 가져오기
function setCCC002() {
	const value = $('#proc_lrcl_cd').val();
	if(value == 'all'){
		$('#proc_mdcl_cd').children('option').remove();
		$('#proc_smcl_cd').children('option').remove();		
	}else {
		let txt = '';
		const list = getCodeList(contextPath + '/comcd/ccc002', value);
		txt += "<option class='dropdown-item' value='" + "all" + "'>" + "전체" + "</option>"
		list.forEach(item =>{
			txt += "<option class='dropdown-item' value='" + item.COMN_DTLS_CD + "'>" + item.DETL_CD_NM + "</option>"
  		});
		$('#proc_mdcl_cd').html(txt);
		$('#proc_smcl_cd').children('option').remove();	
	}
	findProcList();
}
// 소분류 가져오기
function setCCC003(){
	const value = $('#proc_mdcl_cd').val();
	if(value == 'all'){
		$('#proc_smcl_cd').children('option').remove();
	}else {
		let txt = '';
		const list = getCodeList(contextPath + '/comcd/ccc003', value);
		txt += "<option class='dropdown-item' value='" + "all" + "'>" + "전체" + "</option>"
		list.forEach(item =>{
			txt += "<option id='smcl' class='dropdown-item' value='" + item.COMN_DTLS_CD + "'>" + item.DETL_CD_NM + "</option>"
  		})
		$('#proc_smcl_cd').html(txt);	
	}
	findProcList();
}

// 소분류 선택 시 재조회
document.getElementById("proc_smcl_cd").addEventListener("change", function() {
    findProcList();
});
// 분류 콤보값에 따른 조회
function findProcList() {
  const lrcl = $('#proc_lrcl_cd').val();
  const mdcl = $('#proc_mdcl_cd').val();
  const smcl = $('#proc_smcl_cd').val();
  
  axios.get(contextPath + '/Process/findProcList',{
      params: {
                PROC_LRCL_CD : lrcl,
                PROC_MDCL_CD : mdcl,
                PROC_SMCL_CD : smcl,
      }
    })
    .then(function(response) {
      const data = response.data;
      provider.setRows(data);
      if(data.length != 0) {
          gridView.setFocus();
          gridView.onCellClicked();		
      }
    })
    .catch(function(error) {
        console.log(error);
    });
}


/*********************************************************************************************************************/
// Step Grid
let treeProviderStep, containerStep, treeViewStep;

let fieldsStep = [
    {fieldName:"PROC_ID", dataType:"text"},
    {fieldName:"STEP_ID", dataType:"text"},
    {fieldName:"HGRN_STEP_ID", dataType:"text"},
    {fieldName:"STEP_NM", dataType:"text"},
    {fieldName:"DETL_STEP_CTN", dataType:"text"},   
    {fieldName:"USE_YN", dataType:"text"},
    {fieldName:"INQR_SQNC", dataType:"number"},
    {fieldName:"LNKN_PROC_ID", dataType:"text"},
    {fieldName:"LNKN_STEP_ID", dataType:"text"},
    {fieldName:"COMN_STEP_YN", dataType:"text"},
    {fieldName:"QTR_YN", dataType:"text"},
    {fieldName:"REPT_YN", dataType:"text"},
    {fieldName:"PRFM_PRSN_CD", dataType:"text"},
    {fieldName:"PRFM_PRSN_CTN", dataType:"text"},
    {fieldName:"STEP_RMRK_CTN", dataType:"text"},
    {fieldName:"STEP_CTN", dataType:"text"},
    {fieldName:"FRST_RGSR_ID", dataType:"text"},
    {fieldName:"FRST_RGST_IP", dataType:"text"},
    {fieldName:"FRST_RGST_DT", dataType:"date"},
    {fieldName:"LAST_UPDR_ID", dataType:"text"},
    {fieldName:"LAST_UPDT_IP", dataType:"text"},
    {fieldName:"LAST_UPDT_DT", dataType:"date"},
    {fieldName:"level", dataType:"text"},
    {fieldName:"treeid", dataType:"text"},
]

let columnsStep = [
	// 그리드 컬럼 순서 세팅
    /*{fieldName:"STEP_NM", name:"STEP_NM", header:{text:"단계명"}, width:350, popupMenu: "menu1", button: "popup"},*/
	{fieldName:"STEP_NM", name:"STEP_NM", header:{text:"단계명"}, width:350, footer: {expression: "count"}},
    {fieldName:"STEP_CTN", name:"STEP_CTN", header:{text:"단계내용"}, width:500, styleName:'textLeft',
    	renderer:{
            type:"html",
            showTooltip:true,
            callback: function(grid, cell, w, h) {
				let str = cell.value;
				if(str == null) str = "";
				str = str.replace(/(<([^>]+)>)/gi, "");
				str = str.replace(/\s\s+/g, ' ');
                return str;
            }
         },
	},
    {fieldName:"DETL_STEP_CTN", name:"DETL_STEP_CTN", header:{text:"단계내용(개발)"}, width:300, styleName:'textLeft',
    	renderer:{
            type:"html",
            showTooltip:true,
            callback: function(grid, cell, w, h) {
				let str = cell.value;
				if(str == null) str = "";
				str = str.replace(/(<([^>]+)>)/gi, "");
				str = str.replace(/\s\s+/g, ' ');
                return str;
            }
         },
	},
    {fieldName:"LNKN_PROC_ID", name:"LNKN_PROC_ID", header:{text:"연결프로세스ID"}},
    {fieldName:"LNKN_STEP_ID", name:"LNKN_STEP_ID", header:{text:"연결단계ID"}},
    {fieldName:"COMN_STEP_YN", name:"COMN_STEP_YN", header:{text:"공통여부"}},
    {fieldName:"QTR_YN", name:"QTR_YN", header:{text:"분기여부"}},
    {fieldName:"REPT_YN", name:"REPT_YN", header:{text:"반복여부"}},
    {fieldName:"PRFM_PRSN_CD", name:"PRFM_PRSN_CD", header:{text:"수행인원코드"}},
    {fieldName:"PRFM_PRSN_CTN", name:"PRFM_PRSN_CTN", header:{text:"수행인원내용"}},
    {fieldName:"STEP_RMRK_CTN", name:"STEP_RMRK_CTN", header:{text:"비고"}},

	/* 하위 컬럼 그리드 display == false  */
    {fieldName:"PROC_ID", name:"PROC_ID", header:{text:"프로세스ID"}},
    {fieldName:"STEP_ID", name:"STEP_ID", width: 180, header:{text:"단계ID"}},
    {fieldName:"HGRN_STEP_ID", name:"HGRN_STEP_ID", header:{text:"상위단계ID"}},
    {fieldName:"USE_YN", name:"USE_YN", header:{text:"사용여부(Y/N)"}},
    {fieldName:"INQR_SQNC", name:"INQR_SQNC", header:{text:"조회순서"}},
    {fieldName:"FRST_RGSR_ID", name:"FRST_RGSR_ID", header:{text:"최초등록자ID"}},
    {fieldName:"FRST_RGST_IP", name:"FRST_RGST_IP", header:{text:"최초등록IP"}},
    {fieldName:"FRST_RGST_DT", name:"FRST_RGST_DT", header:{text:"최초등록일시"}},
    {fieldName:"LAST_UPDR_ID", name:"LAST_UPDR_ID", header:{text:"최종수정자ID"}},
    {fieldName:"LAST_UPDT_IP", name:"LAST_UPDT_IP", header:{text:"최종수정IP"}},
    {fieldName:"LAST_UPDT_DT", name:"LAST_UPDT_DT", header:{text:"최종수정일시"}},
    {fieldName:"level", name:"level", header:{text:"level"}},
    {fieldName:"treeid", name:"treeid", header:{text:"treeid"}},
];

function selectProcessStepList() {
    containerStep = document.getElementById('stepGrid');
    treeProviderStep = new RealGrid.LocalTreeDataProvider();
    treeViewStep = new RealGrid.TreeView(containerStep);
    treeViewStep.setDataSource(treeProviderStep);

    treeProviderStep.setFields(fieldsStep);
    treeViewStep.setColumns(columnsStep);

    treeViewStep.setCheckBar({visible: false}); // 그리드 체크 박스 표시
    treeViewStep.setRowIndicator({visible: false}); // 그리드 행수 표시
    treeViewStep.formatOptions.numberFormat = null;  // 숫자 소수점 없애
    treeViewStep.displayOptions.rowFocusType = "row"; // 그리드 한줄 선택
    treeViewStep.sortingOptions.enabled = false; // 모든 칼럼 정렬 불가
    treeViewStep.setDisplayOptions({focusVisible:false}); // 포커스 표시 여부
    treeViewStep.setStateBar({visible: false}); // 그리드에서 입력,수정,삭제 표시

	treeViewStep.displayOptions.rowHeight = 30;
	treeViewStep.header.height = 30;
	treeViewStep.footer.height = 10;
	treeViewStep.stateBar.width = 16;

    treeViewStep.setDisplayOptions({showEmptyMessage: true});
    treeViewStep.displayOptions.emptyMessage = "표시할 STEP이 없습니다.";

    // ReadOnly
	// 그리드 컬럼들의 editable 상태를 편히 관리하기 위해 컬럼 마다 관리
	columnsStep.forEach((element) => {
		treeViewStep.columnByName(element.name).editable = false;
	});

    // 컬럼 표시 여부 	
	treeViewStep.columnByName("PROC_ID").visible =  false;
    treeViewStep.columnByName("STEP_ID").visible =  false;
	treeViewStep.columnByName("HGRN_STEP_ID").visible =  false;
	treeViewStep.columnByName("USE_YN").visible =  false;
	treeViewStep.columnByName("INQR_SQNC").visible =  false;
	treeViewStep.columnByName("FRST_RGSR_ID").visible =  false;
	treeViewStep.columnByName("FRST_RGST_IP").visible =  false;
	treeViewStep.columnByName("FRST_RGST_DT").visible =  false;
	treeViewStep.columnByName("LAST_UPDR_ID").visible =  false;
	treeViewStep.columnByName("LAST_UPDT_IP").visible =  false;
	treeViewStep.columnByName("LAST_UPDT_DT").visible =  false;
	treeViewStep.columnByName("level").visible =  false;
	treeViewStep.columnByName("treeid").visible =  false;

    treeViewStep.setRowStyleCallback(function(grid, item, fixed) {
        let ret = {};
        let hgrnStepId = grid.getValue(item.index, "HGRN_STEP_ID");
        let qtrYn = grid.getValue(item.index, "QTR_YN");
        if (hgrnStepId == 0) {
            ret.styleName = 'parentsRowColor';
        }
        if(qtrYn == 'Y') {
            if(qtrYn == 'Y' && hgrnStepId == 0 ) {
                ret.styleName = 'parentsRowColor-qtrYnFontColor';
            }else {
                ret.styleName = 'qtrYnFontColor';
            }
        }
        return ret;
    });
	
    treeViewStep.onCellDblClicked = function (grid, clickData) {
	    const current = treeViewStep.getCurrent();
		const dataRow = current.dataRow;
	    const values = treeProviderStep.getJsonRow(current.dataRow);
		const procName = document.getElementById('procName').value;
		
		/*
		if(clickData.column == "LNKN_PROC_ID") {
			const LNKN_PROC_ID = values.LNKN_PROC_ID;
			let value = LNKN_PROC_ID.substr(0, 2);
	  		axios.get(contextPath + '/Process/findProcList',{
		      params: {
		                PROC_LRCL_CD : value,
		                PROC_MDCL_CD : 'all',
		                //PROC_SMCL_CD : '',
		      }
		    })
		    .then(function(response) {
		      	const data = response.data;
		      	provider.setRows(data);

		      	if(data.length != 0) {
		            let fields = provider.getOrgFieldNames();
		            let startFieldIndex = fields.indexOf(gridView.getCurrent().fieldName) + 1;
		            let options = {
		                fields : fields,
		                value : LNKN_PROC_ID,
		                startIndex : gridView.getCurrent().itemIndex,
		                startFieldIndex : startFieldIndex,
		                wrap : true,
		                caseSensitive : false,
		                partialMatch : true
		            };
		            	let index = gridView.searchCell(options);
		            	gridView.setCurrent(index);
						gridView.onCellClicked();
						
						let seletArea = document.getElementById("seletArea");
						let beforeProcId = document.createElement('button');
	    				beforeProcId.id = "beforeProcId";
						beforeProcId.className = "btn btn-warning";
						beforeProcId.innerText = procName;
						seletArea.appendChild(beforeProcId);
						
						$("#proc_lrcl_cd").val(value).prop("selected", true);
						setCCC002();
		      	}
		    })
		    .catch(function(error) {
		        console.log(error);
		    });
		}
		*/
  	}
}

function selectStepList() {
    const current = gridView.getCurrent();
    const values = provider.getJsonRow(current.dataRow)
    const procId = values.PROC_ID;
    axios.get(contextPath + '/Step/SelectStepNew',{
    	params: {
              	PROC_ID : procId,
              	USE_YN  : 'Y',
    	}
  	})
  	.then(function(response) {
    	let list = response.data;
  		treeProviderStep.setRows(list, 'treeid', false, null, "iconField");
        treeViewStep.expandAll(); // 트리 그리드 펼치기
  	})
  	.catch(function(error) {
    	console.log(error);
  	});
}