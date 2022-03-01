// gnb fixed horizontal scroll issue
$(window).scroll(function() {
    $('#sidebar-wrapper').css({left: 0 - $(this).scrollLeft()});
});

document.addEventListener('DOMContentLoaded', function () {
    createProcGrid();
    // selectProcessStepList();
    setCCC001();
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
	$('#modal_procLrclCd').append(txt); // 프로세스 관리 모달에 대분류 세팅
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
	{fieldName:"PROC_ID", name:"PROC_ID", width:70, header:{text:"프로세스ID" }, footer: {expression: "count"},styleName: "textLeft"},
	{fieldName:"PROC_NM", name:"PROC_NM", width:130, header:{text:"프로세스명" }, styleName: "textLeft", popupMenu: "menu1",button: "popup"},
	{fieldName:"PROC_CTN", name:"PROC_CTN", width:100, header:{text:"프로세스 내용"}, styleName: "textLeft",
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

function createProcGrid() {
    container = document.getElementById('unitProceeGird');
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
    // gridView.setDisplayOptions({focusVisible:false}); // 포커스 표시 여부
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

	/* 프로세스 그리드 팝업 메뉴 생성 */	
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
			$("#propsMaModal").modal('show'); // $('#propsMaModal').on('show.bs.modal', function (e)
		}else if(data.tag == 'step') {
			location.href = `${contextPath}/StepManagement/?PROC_LRCL_CD=${PROC_LRCL_CD}&PROC_MDCL_CD=${PROC_MDCL_CD}&PROC_SMCL_CD=${PROC_SMCL_CD}&PROC_ID=${PROC_ID}&PROC_NM=${PROC_NM}`;
		}
	};

	// ProcGrid 클릭 이벤트
	gridView.onCellClicked = function (grid, clickData) {
		const current = gridView.getCurrent();
		const values = provider.getJsonRow(current.dataRow)
		const procId = values.PROC_ID;
		const procNm = values.PROC_NM;
		document.getElementById('procId').value = procId;
		document.getElementById('procName').value = procNm;
	}
    
}
