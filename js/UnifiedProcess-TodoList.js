document.addEventListener('DOMContentLoaded', async function () {
    createGrid();
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