// const { Editor } = toastui;
// const { colorSyntax } = Editor.plugin;

document.addEventListener('DOMContentLoaded', function () {
    createGrid();
    creratPropGrid();
});

let treeProvider, container, treeView;

let fields = [
    {fieldName:"STEP_NM", dataType:"text"},
    {fieldName:"PROC_ID", dataType:"text"},
    {fieldName:"STEP_ID", dataType:"text"},
    {fieldName:"HGRN_STEP_ID", dataType:"text"},
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
    {fieldName:"DETL_STEP_CTN", dataType:"text"},
    {fieldName:"FRST_RGSR_ID", dataType:"text"},
    {fieldName:"FRST_RGST_IP", dataType:"text"},
    {fieldName:"FRST_RGST_DT", dataType:"date"},
    {fieldName:"LAST_UPDR_ID", dataType:"text"},
    {fieldName:"LAST_UPDT_IP", dataType:"text"},
    {fieldName:"LAST_UPDT_DT", dataType:"date"},
    {fieldName:"level", dataType:"text"},
    {fieldName:"treeid", dataType:"text"},
    {fieldName:"INPUT_IO", dataType:"text"},
    {fieldName:"OUT_IO", dataType:"text"},
]

let columns = [
	// 그리드 컬럼 순서 세팅
	//{fieldName:"STEP_NM", name:"STEP_NM", header:{text:"단계명"}, width:300, popupMenu: "menu1", button: "popup"},
	{fieldName:"STEP_NM", name:"STEP_NM", header:{text:"단계명"}, footer: {expression: "count"}, popupMenu: "menu1", button: "popup"},
    {fieldName:"STEP_CTN", name:"STEP_CTN", header:{text:"단계내용"}, styleName:'textLeft',
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
    {fieldName:"DETL_STEP_CTN", name:"DETL_STEP_CTN", header:{text:"단계내용(개발)"}, styleName:'textLeft',
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
    {fieldName:"PRFM_PRSN_CD", name:"PRFM_PRSN_CD", header:{text:"수행인원코드"}, styleName:'textLeft'},
    {fieldName:"PRFM_PRSN_CTN", name:"PRFM_PRSN_CTN", header:{text:"수행인원내용", styleName:'textLeft'}},
    {fieldName:"STEP_RMRK_CTN", name:"STEP_RMRK_CTN", header:{text:"비고"}, styleName:'textLeft'},
    {fieldName:"INPUT_IO", name:"INPUT_IO", header:{text:"InputVO"}},
    {fieldName:"OUT_IO", name:"OUT_IO", header:{text:"OutputVO"}},
    
    /* 하위 컬럼 그리드 display == false */
	{fieldName:"treeid", name:"treeid", header:{text:"treeid"}, styleName:'textLeft', width:500},
	{fieldName:"STEP_ID", name:"STEP_ID", header:{text:"단계ID"}},
    {fieldName:"HGRN_STEP_ID", name:"HGRN_STEP_ID", header:{text:"상위단계ID"}},
    {fieldName:"PROC_ID", name:"PROC_ID", header:{text:"프로세스ID"}},
    {fieldName:"USE_YN", name:"USE_YN", header:{text:"사용여부(Y/N)"}, 
    	styleCallback : function(grid, dataCell) {
    						let ret = {};
    						ret.editor = {
    				                type: "dropdown",
    				                labels: ['Y', 'N'],
    				                values: ['Y', 'N']
    				            }
    						return ret;
    					}
    },
    {fieldName:"INQR_SQNC", name:"INQR_SQNC", header:{text:"조회순서"}},
    {fieldName:"FRST_RGSR_ID", name:"FRST_RGSR_ID", header:{text:"최초등록자ID"}},
    {fieldName:"FRST_RGST_IP", name:"FRST_RGST_IP", header:{text:"최초등록IP"}},
    {fieldName:"FRST_RGST_DT", name:"FRST_RGST_DT", header:{text:"최초등록일시"}},
    {fieldName:"LAST_UPDR_ID", name:"LAST_UPDR_ID", header:{text:"최종수정자ID"}},
    {fieldName:"LAST_UPDT_IP", name:"LAST_UPDT_IP", header:{text:"최종수정IP"}},
    {fieldName:"LAST_UPDT_DT", name:"LAST_UPDT_DT", header:{text:"최종수정일시"}},
    {fieldName:"level", name:"level", header:{text:"level"}},
];

function createGrid() {
    container = document.getElementById('stepTreeGrid');
    treeProvider = new RealGrid.LocalTreeDataProvider();
    treeView = new RealGrid.TreeView(container);
    treeView.setDataSource(treeProvider);

    treeProvider.setFields(fields);
    treeView.setColumns(columns);

    treeView.setDisplayOptions({showEmptyMessage: true});
	treeView.displayOptions.emptyMessage = "표시할 STEP이 없습니다.";
    treeView.displayOptions.rowHeight = 30;
    treeView.header.height = 35;
    treeView.footer.height = 20;
    treeView.stateBar.width = 16;

    treeView.setCheckBar({visible: false}); // 그리드 체크 박스 표시
    treeView.setRowIndicator({visible: false}); // 그리드 행수 표시
    treeView.formatOptions.numberFormat = null;  // 숫자 소수점 없애
    treeView.displayOptions.rowFocusType = "row"; // 그리드 한줄 선택
    treeView.sortingOptions.enabled = false; // 모든 칼럼 정렬 불가
    treeView.setStateBar({visible: false}); // 그리드에서 입력,수정,삭제 표시

    //ReadOnly
    columns.forEach(element => {
        treeView.columnByName(element.name).editable = false;
    });

    //treeView.displayOptions.fitStyle = "evenFill";
 	treeView.setColumnProperty("STEP_NM","width",425);
 	treeView.setColumnProperty("STEP_CTN","width",500);
	treeView.setColumnProperty("DETL_STEP_CTN","width",500);
 	treeView.setColumnProperty("LNKN_PROC_ID","width",80);

    treeView.columnByName("PROC_ID").visible =  false;
    treeView.columnByName("STEP_ID").visible =  false;
    treeView.columnByName("HGRN_STEP_ID").visible =  false;
    treeView.columnByName("USE_YN").visible =  false;
    treeView.columnByName("INQR_SQNC").visible =  false;
    treeView.columnByName("FRST_RGSR_ID").visible =  false;
    treeView.columnByName("FRST_RGST_IP").visible =  false;
    treeView.columnByName("FRST_RGST_DT").visible =  false;
    treeView.columnByName("LAST_UPDR_ID").visible =  false;
    treeView.columnByName("LAST_UPDT_IP").visible =  false;
    treeView.columnByName("LAST_UPDT_DT").visible =  false;
    treeView.columnByName("level").visible =  false;
    treeView.columnByName("treeid").visible =  false;

    treeView.setRowStyleCallback(function(grid, item, fixed) {
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

    treeView.onCellClicked = function (grid, clickData) {
		const current = treeView.getCurrent();
		const itemIndex = current.itemIndex;
		const jsonData = treeProvider.getJsonRow(current.dataRow);
		const cIndexes = treeView.getChildren(itemIndex);
        console.log(jsonData);
        document.getElementById('LNKN_PROC_ID').value = jsonData.LNKN_PROC_ID;
        document.getElementById('LNKN_STEP_ID').value = jsonData.LNKN_STEP_ID;
        document.getElementById('COMN_STEP_YN').value = jsonData.COMN_STEP_YN;
        document.getElementById('QTR_YN').value = jsonData.QTR_YN;
        document.getElementById('REPT_YN').value = jsonData.REPT_YN;
        document.getElementById('PRFM_PRSN_CD').value = jsonData.PRFM_PRSN_CD;
        document.getElementById('PRFM_PRSN_CTN').value = jsonData.PRFM_PRSN_CTN;
        document.getElementById('INPUT_IO').value = jsonData.INPUT_IO;
        document.getElementById('OUT_IO').value = jsonData.OUT_IO;
        stepCtnViewer.setMarkdown(jsonData.STEP_CTN);

        setPropGrid();
	}

    // const PROC_ID = document.getElementById('procIdPK').value;
    const PROC_ID = "MNW601P1";
    // const PROC_ID = "MDI206P1";
	if(PROC_ID) {
		//SelectStepTree - 마리아디비 구버전
	    //SelectStepNew - 마리아디비 신버전
	    axios.get(contextPath + '/Step/SelectStepNew',{
	        params: {
	        	       PROC_ID : PROC_ID,
	                   USE_YN  : 'Y',
	        }
	    })
	    .then(function(response) {
	        const list = response.data;
	        treeProvider.setRows(list, 'treeid', false, null, "iconField");
            treeView.expandAll(); // 트리 그리드 펼치기
            treeView.setFocus();
            treeView.onCellClicked();
	    })
	    .catch(function(error) {
	        console.log(error);
	    });	
	}

    const stepCtnViewer = toastui.Editor.factory({
        el: document.querySelector("#c-stepCtn"),
        viewer: true,
        height: '100%',
    });
    
}


/* ***************************************************************** */
// 스텝 속성리그트 그리드
let fieldsProp = [
    {fieldName:"PROC_ID", dataType:"text"},
    {fieldName:"STEP_ID", dataType:"text"},
    {fieldName:"ATRB_DVSN_CD", dataType:"text"},
    {fieldName:"ATRB_RGST_SNO", dataType:"text"},
    {fieldName:"ATRB_NM", dataType:"text"},
    {fieldName:"ATRB_CTN", dataType:"text"},
    {fieldName:"RENAME_FILENAME", dataType:"text"},
    {fieldName:"PATH", dataType:"text"},
    {fieldName:"FRST_RGSR_ID", dataType:"text"},
    {fieldName:"FRST_RGST_IP", dataType:"text"},
    {fieldName:"FRST_RGST_DT", dataType:"date"},
    {fieldName:"LAST_UPDR_ID", dataType:"text"},
    {fieldName:"LAST_UPDT_IP", dataType:"text"},
    {fieldName:"LAST_UPDT_DT", dataType:"date"},
]

let columnsProp = [
    {fieldName:"ATRB_NM", name:"ATRB_NM", header:{text:"속성명"},
        mergeRule:{
            criteria: "value"
        }
    },
    {fieldName:"ATRB_CTN", name:"ATRB_CTN", header:{text:"속성내용"}, width: 180, styleName:'textLeft',
		renderer:{
      				// showTooltip:true
    	}
	},
    // 아래 컬럼 들은 visible == false
    {fieldName:"PROC_ID", name:"PROC_ID", header:{text:"프로세스ID"}},
    {fieldName:"STEP_ID", name:"STEP_ID", width: 180, header:{text:"단계ID"}},
    {fieldName:"ATRB_DVSN_CD", name:"ATRB_DVSN_CD", header:{text:"속성구분코드"}},
    {fieldName:"ATRB_RGST_SNO", name:"ATRB_RGST_SNO", header:{text:"속성등록일련번호"}},
    {fieldName:"RENAME_FILENAME", name:"RENAME_FILENAME", header:{text:"파일리네임"}},
    {fieldName:"PATH", name:"PATH", header:{text:"파일경로"}},
    {fieldName:"FRST_RGSR_ID", name:"FRST_RGSR_ID", header:{text:"최초등록자ID"}},
    {fieldName:"FRST_RGST_IP", name:"FRST_RGST_IP", header:{text:"최초등록IP"}},
    {fieldName:"FRST_RGST_DT", name:"FRST_RGST_DT", header:{text:"최초등록일시"}},
    {fieldName:"LAST_UPDR_ID", name:"LAST_UPDR_ID", header:{text:"최종수정자ID"}},
    {fieldName:"LAST_UPDT_IP", name:"LAST_UPDT_IP", header:{text:"최종수정IP"}},
    {fieldName:"LAST_UPDT_DT", name:"LAST_UPDT_DT", header:{text:"최종수정일시"}},
];
    
let providerProp, containerProp, gridViewProp;

function creratPropGrid() {
    containerProp = document.getElementById('stepPropGrid');
    providerProp = new RealGrid.LocalDataProvider(false);
    gridViewProp = new RealGrid.GridView(containerProp);
    gridViewProp.setDataSource(providerProp);
	
	providerProp.setFields(fieldsProp);
	gridViewProp.setColumns(columnsProp);

    gridViewProp.setCheckBar({visible: false}); // 그리드 체크 박스 표시
    gridViewProp.setRowIndicator({visible: false}); // 그리드 행수 표시
    gridViewProp.setStateBar({visible: false}); // 그리드에서 입력,수정,삭제 표시
    gridViewProp.displayOptions.rowFocusType = "row";
    // gridViewProp.setDisplayOptions({focusVisible:false}); // 포커스 표시 여부
    
    // 컬럼 표시 여부
    gridViewProp.columnByName("PROC_ID").visible =  false; 
    gridViewProp.columnByName("STEP_ID").visible =  false;
    gridViewProp.columnByName("ATRB_RGST_SNO").visible =  false;
    gridViewProp.columnByName("RENAME_FILENAME").visible =  false;
    gridViewProp.columnByName("PATH").visible =  false;
    gridViewProp.columnByName("ATRB_DVSN_CD").visible =  false;
    gridViewProp.columnByName("FRST_RGSR_ID").visible =  false; 
    gridViewProp.columnByName("FRST_RGST_IP").visible =  false; 
    gridViewProp.columnByName("FRST_RGST_DT").visible =  false; 
    gridViewProp.columnByName("LAST_UPDR_ID").visible =  false; 
    gridViewProp.columnByName("LAST_UPDT_IP").visible =  false; 
    gridViewProp.columnByName("LAST_UPDT_DT").visible =  false;

    // ReadOnly
    columnsProp.forEach(element => {
        gridViewProp.columnByName(element.name).editable = false;
    });
	
    // 컬럼 그룹 헤더
    // gridViewProp.setGroupPanel({ visible: true });
    // gridViewProp.groupBy(["ATRB_NM"]);

    gridViewProp.setColumnProperty("ATRB_NM","width",100);
    gridViewProp.setColumnProperty("ATRB_CTN","fillWidth",1);
    gridViewProp.displayOptions.fitStyle = "fill";

    gridViewProp.setDisplayOptions({showEmptyMessage: true});
	gridViewProp.displayOptions.emptyMessage = "표시할 속성정보가 없습니다.";
    gridViewProp.displayOptions.rowHeight = 30;
    gridViewProp.header.height = 40;
    gridViewProp.footer.height = 40;
    gridViewProp.stateBar.width = 16;


}

function setPropGrid() {
    const current = treeView.getCurrent();
	if(current.dataRow != -1) {
		const itemIndex = current.itemIndex;
		const jsonData = treeProvider.getJsonRow(current.dataRow);
		const cIndexes = treeView.getChildren(itemIndex);
		const PROC_ID = jsonData.PROC_ID;
		const STEP_ID = jsonData.STEP_ID;
		
	    axios.get(contextPath + '/Step/SelectStepPropList',{
	        params: {
	        	       PROC_ID : PROC_ID,
	        	       STEP_ID : STEP_ID,
	        }
	    })
	    .then(function(response) {
	    	const list = response.data;
	        providerProp.setRows(list);

            $("img").remove(".img-thumbnail");
            list.forEach(element => {
                if(element.ATRB_DVSN_CD == 05) {
                    console.log(element);
                    let imgArea = document.getElementById('thumbnail');
                    let img = document.createElement('img');
                    img.className = 'img-thumbnail';
                    img.src = contextPath + "/resources/upload/img/MD/" + element.RENAME_FILENAME;
                    imgArea.appendChild(img);
                }
            });

	    })
	    .catch(function(error) {
	        console.log(error);
	    });
	}
}

function reFreshPropList(PROC_ID,STEP_ID) {
    axios.get(contextPath + '/Step/SelectStepPropList',{
        params: {
        	       PROC_ID : PROC_ID,
        	       STEP_ID : STEP_ID,
        }
    })
	.then(function(response) {
		const list = response.data;
		propImgListSettion(list);
	})
	.catch(function(error) {
		console.log(error);
		SnackMessage("스텝 속성 조회 실패!", "danger");
	});
}

document.getElementById("thumbnail").addEventListener("click", openImgViewer);
function openImgViewer() {
    
}


