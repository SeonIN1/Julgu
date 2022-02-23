document.addEventListener('DOMContentLoaded', async function () {
    createGrid();
    createTodoListGrid();
    createAnsGrid();
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
	{fieldName:"PROC_NM", name:"PROC_NM", width:210, header:{text:"프로세스명" }, styleName: "textLeft"},
    /* 하위 컬럼 display false */ 
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
    container = document.getElementById('unifiedListGrid');
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

    // ReadOnly
	// 그리드 컬럼들의 editable 상태를 편히 관리하기 위해 컬럼 마다 관리
	columns.forEach((element) => {
		gridView.columnByName(element.name).editable = false;
	});

    gridView.displayOptions.fitStyle = "evenFill"; // 그리드 꽉 채우기
    // 컬럼 표시 여부
    const colVisible = false;
    gridView.columnByName("PROC_CTN").visible =  colVisible; // 구분코드
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

    axios.get(contextPath + '/Integration/SelectIntegrationList',{
        params: {
                   USE_YN  : 'Y',
        }
    })
    .then(function(response) {
        const list = response.data;
		if(list.length != 0) {
			provider.setRows(list);
			// gridView.setFocus();
		}
    })
    .catch(function(error) {
        console.log(error);
    });
}


/* **************************************************************************************************** */
const { Editor } = toastui;
const { colorSyntax } = Editor.plugin;

// const toDoAskEditor = new toastui.Editor({
//     el: document.querySelector('#toDoAskEditor'),
//     height: '100%',
//     initialEditType : 'wysiwyg',
//     hideModeSwitch : true,
//     plugins: [colorSyntax],
// });
// toDoAskEditor.removeToolbarItem('image');

const toDoAskEditor = toastui.Editor.factory({
	el: document.querySelector("#toDoAskEditor"),
	viewer: true,
	height: '100%',
});

// ToDoList Grid
let toDoContainer, toDoProvider, toDoGridView;

let toDoFields = [
    {fieldName:"PROC_ID", dataType:"text"},      // 프로세스 ID
    {fieldName:"PROC_NM", dataType:"text"},      // 프로세스 명
    {fieldName:"STEP_ID", dataType:"text"},      // No
    {fieldName:"STEP_NM", dataType:"text"},      // 단계ID
    {fieldName:"FRST_RGST_DT", dataType:"date"}, // 등록일 
    {fieldName:"COMPL_ST", dataType:"text"},     // 완료여부
    {fieldName:"WR_UNIT", dataType:"text"},      // 업무구분
    {fieldName:"TODO_ASK", dataType:"text"},     // 의뢰내용
    {fieldName:"TODO_ASNM", dataType:"text"},    // 수행인원

    {fieldName:"FRST_RGSR_ID", dataType:"text"}, 
    {fieldName:"FRST_RGST_IP", dataType:"text"},
    {fieldName:"LAST_UPDR_ID", dataType:"text"},
    {fieldName:"LAST_UPDT_IP", dataType:"text"},
    {fieldName:"LAST_UPDT_DT", dataType:"text"},
]

let toDoColumns = [
	{fieldName:"PROC_ID", name:"PROC_ID", header:{text:"프로세스ID"}},
	{fieldName:"PROC_NM", name:"PROC_NM", header:{text:"프로세스명"}},
    {fieldName:"STEP_ID", name:"STEP_ID", header:{text:"단계ID"}},
    {fieldName:"TODO_ASK", name:"TODO_ASK", header:{text:"의뢰내용"}},
    {fieldName:"TODO_ASNM", name:"TODO_ASNM", header:{text:"수행인원"}},
    {fieldName:"FRST_RGST_DT", name:"FRST_RGST_DT", header:{text: "최초등록일시"}},
    {fieldName:"WR_UNIT", name:"WR_UNIT", header:{text:"업무구분"}},
    {fieldName:"COMPL_ST", name:"COMPL_ST", header:{text:"완료여부"}},

	{fieldName:"FRST_RGSR_ID", name:"FRST_RGSR_ID", header:{text: "최초등록자ID"}},
	{fieldName:"FRST_RGST_IP", name:"FRST_RGST_IP", header:{text: "최초등록IP"}},
	{fieldName:"LAST_UPDR_ID", name:"LAST_UPDR_ID", header:{text: "최종수정자ID"}},
	{fieldName:"LAST_UPDT_IP", name:"LAST_UPDT_IP", header:{text: "최종수정IP"}},
	{fieldName:"LAST_UPDT_DT", name:"LAST_UPDT_DT", header:{text: "LAST_UPDT_DT"}},
];

function createTodoListGrid() {
    toDoContainer = document.getElementById('toDoListGrid');
    toDoProvider = new RealGrid.LocalDataProvider(false);
    toDoGridView = new RealGrid.GridView(toDoContainer);
    toDoGridView.setDataSource(toDoProvider);

    toDoProvider.setFields(toDoFields);
    toDoGridView.setColumns(toDoColumns);

    toDoGridView.setDisplayOptions({showEmptyMessage: true});
    toDoGridView.displayOptions.emptyMessage = "표시할 ToDoList가 없습니다.";

    toDoGridView.displayOptions.rowHeight = 30;
    toDoGridView.header.height = 30;
    toDoGridView.footer.height = 10;
    toDoGridView.stateBar.width = 16;

    toDoGridView.setCheckBar({visible: false}); // 그리드 체크 박스 표시
    toDoGridView.setRowIndicator({visible: false}); // 그리드 행수 표시
    toDoGridView.setStateBar({visible: false}); // 그리드에서 입력,수정,삭제 표시
    // toDoGridView.setDisplayOptions({focusVisible:false}); // 포커스 표시 여부
    // toDoGridView.displayOptions.rowFocusType = "row"; // 그리드 한줄 선택

    // ReadOnly
	// 그리드 컬럼들의 editable 상태를 편히 관리하기 위해 컬럼 마다 관리
	toDoColumns.forEach((element) => {
		toDoGridView.columnByName(element.name).editable = false;
	});

    toDoColumns.forEach((element) => {
		toDoGridView.setColumnProperty(element, "mergeRule", { criteria: "value" });
	});
    toDoGridView.displayOptions.showInnerFocus = false;

    toDoGridView.displayOptions.fitStyle = "evenFill"; // 그리드 꽉 채우기
    // 컬럼 표시 여부
    const colVisible = false;
    toDoGridView.columnByName("FRST_RGSR_ID").visible =  colVisible; 
    toDoGridView.columnByName("FRST_RGST_IP").visible =  colVisible; 
    toDoGridView.columnByName("LAST_UPDR_ID").visible =  colVisible; 
    toDoGridView.columnByName("LAST_UPDT_IP").visible =  colVisible; 
    toDoGridView.columnByName("LAST_UPDT_DT").visible =  colVisible;

    toDoGridView.setColumnProperty("PROC_ID","width",80);
    toDoGridView.setColumnProperty("PROC_NM","width",150);
    toDoGridView.setColumnProperty("STEP_ID","width",50);
    toDoGridView.setColumnProperty("TODO_ASK","width",400);
    toDoGridView.setColumnProperty("TODO_ASNM","width",100);
    toDoGridView.setColumnProperty("FRST_RGST_DT","width",100);
    toDoGridView.setColumnProperty("WR_UNIT","width",60);
    toDoGridView.setColumnProperty("COMPL_ST","width",60); // 완료여부
    toDoGridView.setColumnProperty("FRST_RGSR_ID","width",100);

    toDoGridView.onCellClicked = function (grid, clickData) {
        const current = toDoGridView.getCurrent();
        const values = toDoProvider.getJsonRow(current.dataRow)
        const todoAsk = values.TODO_ASK;
        
        toDoAskEditor.setMarkdown(todoAsk);
    }


    axios.get(contextPath + '/Integration/SelectItgToDoList',{
        params: {
                   
        }
    })
    .then(function(response) {
        const list = response.data;
		if(list.length != 0) {
			toDoProvider.setRows(list);
			// gridView.setFocus();
		}
    })
    .catch(function(error) {
        console.log(error);
    });
}






// Answer Grid
let ansContainer, ansProvider, ansGridView;

let ansFields = [
    {fieldName:"ANS_NM", dataType:"text"},      // 프로세스 ID
    {fieldName:"CNFM_DT", dataType:"date"},      // 프로세스 명
    {fieldName:"XXXXX", dataType:"text"},      // 프로세스 명
    {fieldName:"CNFM_ST", dataType:"text"},      // No
]

let ansColumns = [
	{fieldName:"ANS_NM", name:"ANS_NM", header:{text:"확인자"}},
	{fieldName:"CNFM_DT", name:"CNFM_DT", header:{text:"확인날짜"}},
    {fieldName:"XXXXX", name:"XXXXX", header:{text:"보완프로세스"}},
    {fieldName:"CNFM_ST", name:"CNFM_ST", header:{text:"완료여부"}},
];

function createAnsGrid() {
    ansContainer = document.getElementById('answerGrid');
    ansProvider = new RealGrid.LocalDataProvider(false);
    ansGridView = new RealGrid.GridView(ansContainer);
    ansGridView.setDataSource(ansProvider);

    ansProvider.setFields(ansFields);
    ansGridView.setColumns(ansColumns);

    ansGridView.displayOptions.rowHeight = 30;
    ansGridView.header.height = 10;
    ansGridView.footer.height = 10;
    ansGridView.stateBar.width = 16;

    ansGridView.setCheckBar({visible: false}); // 그리드 체크 박스 표시
    ansGridView.setRowIndicator({visible: false}); // 그리드 행수 표시
    ansGridView.setStateBar({visible: false}); // 그리드에서 입력,수정,삭제 표시
    ansGridView.setDisplayOptions({focusVisible:false}); // 포커스 표시 여부
    ansGridView.displayOptions.rowFocusType = "row"; // 그리드 한줄 선택

    ansGridView.displayOptions.fitStyle = "evenFill"; // 그리드 꽉 채우기

    // ReadOnly
	// 그리드 컬럼들의 editable 상태를 편히 관리하기 위해 컬럼 마다 관리
	ansColumns.forEach((element) => {
		ansGridView.columnByName(element.name).editable = false;
	});

}

