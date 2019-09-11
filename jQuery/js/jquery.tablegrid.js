(function($) {
	$.fn.tablegrid = function(Opts) {
			var settings = $.extend({}, $.fn.defaults, Opts);
			
			return this.each(function() {
				var $tableObj = $(this);
				
				var $titleRow = $("tr:first", $tableObj);
				var $columns = $titleRow.find("th");
				var colCount = $columns.size();
				
				$.extend(settings, { columnNum: colCount });
				$columns.each(function(index) {
					var name = $(this).attr("name");
					
					//儲存欄位名稱,若使用者沒有設定,則以column+欄位index為代表
					settings.COLUMN_NAMES.push((name) ? name : "column" + index);
					//判斷欄位是否允許編輯
					if($(this).hasClass(settings.COL_NOEDIT_SELECTOR))
						settings.COLUMN_NOEDIT[index] = true;   //不允許編輯
					else
						settings.COLUMN_NOEDIT[index] = false;  //允許編輯
				});
				//儲存使用者設定的參數值,並增加Table 的屬性tbID
				var tbID = $.myEditTable.TableOperation.setting(settings, $tableObj);

				//在表格最下方設置新增輸入框
				$.myEditTable.lib.makeNewRow($tableObj);
	
				//載入資料
				if(settings.LOADDATA_PAGE != "")
				{
					$.myEditTable.Datas.loadData($tableObj);
				}
			});
	};
	
	$.editRow = function(link, tid) {
		var $table = $("table[tbID=" + tid + "]");
		var action = $(link).text();
		var $linkOfTd = $(link).closest("td");
		var $thisParent = $(link).closest("tr");		
		var tbOpts = $.myEditTable.TableOperation.getOptions(tid);
		var key = $thisParent.find("#" + tbOpts.ROW_KEY_SELECTOR).text();

		
		//新增資料後,若有設定訊息框,則送出訊息框
		if(action === tbOpts.NEW_HTML)
		{
			var isError = true;
			var $editColumns = $table.find("thead th");
			//檢核表單欄位是否為空白
			$editColumns.each(function(index) {
				if(index > 0)
				{
					if($(this).hasClass(tbOpts.COL_INSERT_SELECTOR))
					{
						var ColuIndex = $(this).index();
						if($.myEditTable.CheckValue.isValid($("input#" + tbOpts.COLUMN_NAMES[index])) == false)
							isError = false;
					}
				}
			});
			
			if(isError == false)
			{
				var info = "表單欄位不可空白,請輸入資料!";
				if(tbOpts.FUNC_PRE_NEW) eval(tbOpts.FUNC_PRE_NEW + "('" + info + "')");
				return;
			}
			
			$editColumns.each(function(index) {
				if(index > 0)
				{
					if($(this).hasClass(tbOpts.COL_INSERT_SELECTOR))
					{
						var ColuIndex = $(this).index();
						$.myEditTable.lib.saveNew($(this), tbOpts.COLUMN_NAMES[index], ColuIndex);
					}
				}
			});
			
			if(tbOpts.FUNC_POST_NEW) eval(tbOpts.FUNC_POST_NEW + "()");
			
			$.myEditTable.Datas.updateData($(link), tid, "NEW");
			
			return;
		}
		
		
		//取得可以編輯的欄位
		var editColumns = $.myEditTable.lib.filterColu($thisParent, tbOpts.COLUMN_NOEDIT, tid);
		
		if(action === tbOpts.EDIT_HTML)
		{
			$(tbOpts.EVENT_LINK_SELECTOR, $linkOfTd).css("display", "none");
			$("a.deleteLink", $linkOfTd).css("display", "none");
			$("a.saveLink", $linkOfTd).css("display", "inline-block");
			$("a.cancelEdit", $linkOfTd).css("display", "inline-block");
			$("a#insertData", $table).css("display", "none");	
				
			if(tbOpts.FUNC_PRE_EDIT) eval(tbOpts.FUNC_PRE_EDIT + "()");
			//在新增之前,先儲存原本的值,若取消新增時,可以復原原值
			$.myEditTable.Datas.store($thisParent, key);
			$(editColumns).each(function() {
				var ColuIndex = $(editColumns).closest("tr").find("td").index(this);
				$.myEditTable.lib.makeEdit($(this), ColuIndex);
			});
			
			if(tbOpts.FUNC_POST_EDIT) eval(tbOpts.FUNC_POST_EDIT + "()");
		}
		
		if(action === tbOpts.SAVE_HTML)
		{
			var isError = true;
			//檢核表單欄位是否為空白
			$(editColumns).each(function(index) {
				var ColuIndex = $(editColumns).closest("tr").find("td").index(this);
				if($.myEditTable.CheckValue.isValid($("input#" + $(editColumns).attr("name"), $(editColumns))) == false)
					isError = false;
			});
			
			if(isError == false)
			{
				var info = "表單欄位不可空白,請輸入資料!";
				if(tbOpts.FUNC_PRE_NEW) eval(tbOpts.FUNC_PRE_SAVE + "('" + info + "')");
				return;
			}
			
			$(tbOpts.EVENT_LINK_SELECTOR, $linkOfTd).css("display", "inline-block");
			$("a.deleteLink", $linkOfTd).css("display", "inline-block");
			$("a.saveLink", $linkOfTd).css("display", "none");
			$("a.cancelEdit", $linkOfTd).css("display", "none");
			$("a#insertData", $table).css("display", "inline-block");

			$(editColumns).each(function(index) {
				var ColuIndex = $(editColumns).closest("tr").find("td").index(this);
				$.myEditTable.lib.saveEdit($(this), ColuIndex);
			});
			
			$.myEditTable.Datas.updateData($(link), tid, "SAVE");
			
			if(tbOpts.FUNC_POST_SAVE) eval(tbOpts.FUNC_POST_SAVE + "()");
		}
		
		if(action === tbOpts.CANCEL_HTML)
		{					
			$(tbOpts.EVENT_LINK_SELECTOR, $linkOfTd).css("display", "inline-block");
			$("a.deleteLink", $linkOfTd).css("display", "inline-block");
			$("a.saveLink", $linkOfTd).css("display", "none");
			$("a.cancelEdit", $linkOfTd).css("display", "none");
			$("a#insertData", $table).css("display", "inline-block");
			
			$.myEditTable.lib.cancelEdit($thisParent);			
		}
	};
	
	$.myEditTable = {
		TableOperation:  {
			tableList: [],

			setting: function(options, table) {
				var id = 0;
				//var id = this.tableList.length;
				//在參數(options)中設置Table 的id,此id 值與儲存使用者參數值的陣列key 值相同;即tableList[0], 其Table id = 0;
				$.extend(options, { tid: id });
				this.tableList.push(options);
				//增加Table 的屬性tbID, 作為辨識作用中Table 之用
				$(table).attr("tbID", "0");
				return id;
			},
			getOptions: function(id) {
				return this.tableList[id];
			},
			pageButtonNavigator: function($table, coluNum) {
				var tid = $table.attr("tbID");
				var tbOpts = $.myEditTable.TableOperation.getOptions(tid);
				//清空所有按鈕,每次搜尋時必須重新設定所有按鈕

				$("#pageBar", $table).empty();
				
				$table.find("#addRow", $table).after("<tr id='pageBar'  class='ui-widget-header'><td id='btnList' colspan='" + coluNum + "' align='left' style='background-color: #000'>&nbsp;&nbsp;&nbsp;&nbsp;<select id='toPage' name='toPage'></select> 頁&nbsp;</td></tr>");
					
				//在每個按鈕設一text屬性:代表按下按鈕時要顯示第幾頁內容
				$("<input type='button' id='navigateBtn' value='" + tbOpts.LAST + "' text='" + tbOpts.totalPages + "' />").button().prependTo($("#btnList"), $table);
				$("<input type='button' id='navigateBtn' value='" + tbOpts.NEXT + "' text='" + (tbOpts.startPage + 1) + "' />").button().prependTo($("#btnList"), $table);
					
				$("<span id='pageLabel'>&nbsp;&nbsp;&nbsp;第<span id='currentPage'></span> / <span id='totalPages'></span>頁&nbsp;&nbsp;&nbsp;</span>").prependTo($("#btnList"), $table);
					
				$("<input type='button' id='navigateBtn' value='" + tbOpts.PREV + "' text='' />").button().prependTo($("#btnList"), $table);
				$("<input type='button' id='navigateBtn' value='" + tbOpts.FIRST + "' text='" + tbOpts.startPage + "'  />").button().prependTo($("#btnList"), $table);
				
				$("input#navigateBtn", $table).bind("click",  function() { 
					var $obj = $(this);
					var page = $obj.attr("text") * 1;
					
					if($obj.attr("value") === tbOpts.FIRST)
					{						
						$.myEditTable.lib.showContent(1, $table);    //顯示輸入頁次的內容
					}
						
					if($obj.attr("value") === tbOpts.LAST)
					{
						$.myEditTable.lib.showContent(tbOpts.totalPages, $table);    //顯示輸入頁次的內容
					}
						
					if($obj.attr("value") === tbOpts.PREV)
					{
						$.myEditTable.lib.showContent(page, $table);    //顯示輸入頁次的內容
					}
						
					if($obj.attr("value") === tbOpts.NEXT)
					{
						$.myEditTable.lib.showContent(page, $table);    //顯示輸入頁次的內容
					}
				});
			},
			comboPageSetting: function(tid) {
				var $table = $("table[tbID=" + tid + "]");
				var totalPages = $.myEditTable.TableOperation.getOptions(tid).totalPages;
				var pageList = "";

				$("select#toPage").empty();
				for(var i=1; i<=totalPages; i++)
				{
					if(($("span#currentPage").text() * 1) == i)
						pageList += "<option value=" + i + " selected>" + i + "</option>";
					else
						pageList += "<option value=" + i + ">" + i + "</option>";
				}				
				$("select#toPage", $table)
					.bind("change", function() {
						$.myEditTable.lib.changePage($(this), $table);
					})
					.append(pageList);
			}
		},
		lib: {
			filterColu: function(parentItem, noeditLinks, tid) {
				var ColuNames = $.myEditTable.TableOperation.getOptions(tid).COLUMN_NAMES;
				var $allColumns = $(parentItem).find("td");
				var $editColumns = $([]);
				//過濾可以編輯的欄位
				$allColumns.each(function(index) {
					if(index > 0)   //第1個欄位(index = 0)為編輯按鈕欄位
					{
						if(noeditLinks[index] === false)
						{
							$(this).attr("name", ColuNames[index]);
							$editColumns = $editColumns.add($(this));
						}
					}
				});

				return $editColumns;
			},
			showContent: function(page, $table) {
				var tid = $table.attr("tbID");
				var tbOpts = $.myEditTable.TableOperation.getOptions(tid);
				var datas = $.myEditTable.Datas.datas;
				
				var startRec = (page - 1) * tbOpts.pageSize;
				var endRec = (startRec + tbOpts.pageSize) >= tbOpts.totalRecords ? tbOpts.totalRecords : (startRec + tbOpts.pageSize);
				var content = "";
				
				if(datas.length == 0)
					page = 0;
				
				$("tbody", $table).empty();
				
				for(var i = startRec; i < endRec; i++)
				{
					content += "<tr><td><a href='#' class='editLink'>" + tbOpts.EDIT_HTML + "</a>  <a href='#' class='deleteLink'>" + tbOpts.DELETE_HTML + "</a>  <a href='#' class='saveLink'>" + tbOpts.SAVE_HTML + "</a>  <a href='#' class='cancelEdit'>" + tbOpts.CANCEL_HTML + "</a></td>";
					for(var j in datas[i])
					{
						if(j == "Id")
							content += "<td><span id='key'>" + datas[i][j] + "</span></td>";
						else
							content +=  "<td>" + datas[i][j] + "</td>"
					}
					content += "</tr>";
				}
				
				$("tbody", $table).append(content);
				
				
				//為每個Edit 連結設定編輯事件
				$(tbOpts.EVENT_LINK_SELECTOR, $table).each(function() {
					$(this).click(function() {
						$.editRow($(this), tid);
						
						$(this).blur();
						return false;
					});
				});
				//為每個Delete 連結設定編輯事件
				$("a.deleteLink", $table).each(function() {
					$(this).click(function() {
						$.myEditTable.lib.deleteData($(this), tid);
					});
				});
				$("a.saveLink", $table).each(function() {
					$(this).click(function() {
						$.editRow($(this), tid);
						
						$(this).blur();
						return false;
					});
				});
				$("a.cancelEdit", $table).each(function() {
					$(this).click(function() {
						$.editRow($(this), tid);
						
						$(this).blur();
						return false;
					});
				});
				
				$("a.saveLink", $table).css("display", "none");
				$("a.cancelEdit", $table).css("display", "none");
				
				//設定顯示頁數的標籤
				$.myEditTable.lib.setPageLabel(page, $table);
				//設定顯示頁數的ComboBox 值
				$.myEditTable.TableOperation.comboPageSetting(tid);
			},
			setPageLabel: function(page, $table) {
				var tid = $table.attr("tbID");
				var totalPages = $.myEditTable.TableOperation.getOptions(tid).totalPages;
				$("span#currentPage", $table).text(page);
				$("span#totalPages", $table).text(totalPages);
				
				$.myEditTable.lib.pageButtonControls(tid);
			},
			makeNewRow: function($table) {
				var tid = $table.attr("tbID");
				var tbOpts = $.myEditTable.TableOperation.getOptions(tid);

				$("#addRow", $table).empty();
				$table.find("tbody", $table).after("<tr id='addRow' style='background-color:#4E4E4E;'></tr>");
				//尋找Class=add 的欄位,表示此欄位是要新增資料的欄位
				$table.find("thead th").each(function(index) {
					if(index == 0)
					{
						$("<td align='center'><a href='#' id='insertData' style='text-decoration:none;'><font color='#FFFFFF'>" + tbOpts.NEW_HTML + "</font></a></td>").appendTo("#addRow");
					}
					else
					{
						if($(this).hasClass(tbOpts.COL_INSERT_SELECTOR))
							$("<td align='center'><input type='text' id='" + tbOpts.COLUMN_NAMES[index] + "' /></td>").appendTo("#addRow");
						else
							$("<td>&nbsp;</td>").appendTo("#addRow");
					}
				});
				//設定新增按鈕的Click 事件
				$("#insertData").click(function() { 
					$.editRow($(this), tid);
				
					$(this).blur();
					return false;
				});
			},
			makeEdit: function(editColumn, ColuIndex) {
				//將被設定為要修改的欄位(td),轉換成輸入框
				var oldValue = $.myEditTable.Datas.oldData.values[ColuIndex];
				var $input = $("<input type='text' id='" + $(editColumn).attr("name") + "' value='" + oldValue + "' />");				
				//在加入輸入框的欄位(td)作記錄,方便於取消編輯時,移除輸入框之用
				$(editColumn).addClass("cell-edit").html("").append($input);
			},
			cancelEdit: function(parentItem) {
				//取消編輯時,必須將欄位值復原回原來的值
				$(parentItem).find("td").each(function(index) {
					if(index > 0)  //第1個欄位(index = 0)為編輯按鈕欄位
					{
						var oldValue = $.myEditTable.Datas.oldData.values[index];
						
						if($(this).hasClass("cell-edit"))   //尋找有class=cell-edit 的欄位,表示在欄位有輸入框必須移除
						{
							$("input", $(this)).remove();
							$(this).removeClass("cell-edit").html(oldValue);
						}
					}
				});
			},
			saveEdit: function(editColumn, ColuIndex) {
				var $input = $("input#" + $(editColumn).attr("name"), $(editColumn));				
				var newValue = encodeURIComponent($input.val());				
				$.myEditTable.Datas.newData += "&" + $(editColumn).attr("name")+ "=" + newValue;					
			},
			saveNew: function(editColumn, ColuName) {
				var $input = $("input#" + ColuName);
				var newValue = encodeURIComponent($input.val());				
				$.myEditTable.Datas.newData += "&" + ColuName+ "=" + newValue;
				$("input#" + ColuName).val("");			
			},
			deleteData: function(link, tid) {
				var dataId = $(link).closest("tr").find("span#key").text()
				var check = confirm("您確定要刪除ID編號" + dataId + "的資料嗎?");
				if(check == true)
					$.myEditTable.Datas.updateData($(link), tid, "DELETE");
			},
			pageButtonControls: function(tid) {
				var tbOpts = $.myEditTable.TableOperation.getOptions(tid);
				var currentPage = $("span#currentPage").text() * 1;
	
				//先將所有按鈕的disabled 狀態解除
				$("input[value='" + tbOpts.FIRST + "']").prop("disabled", false);
				$("input[value='" + tbOpts.PREV + "']").prop("disabled", false);
				$("input[value='" + tbOpts.NEXT + "']").prop("disabled", false);
				$("input[value='" + tbOpts.LAST + "']").prop("disabled", false);
					
				if(currentPage == tbOpts.startPage)    //如果在第一頁,則disabled First, Prev 按鈕
				{
					$("input[value='" + tbOpts.FIRST + "']").prop("disabled", true);
					$("input[value='" + tbOpts.PREV + "']").prop("disabled", true);
				}
					
				if(currentPage == tbOpts.totalPages)    //如果在最後一頁,則disabled Next, Last 按鈕
				{
					$("input[value='" + tbOpts.NEXT + "']").prop("disabled", true);
					$("input[value='" + tbOpts.LAST + "']").prop("disabled", true);
				}
					
				//設定Prev, Next 按鈕代表的頁數
				var nextPage = ((currentPage + 1) <= tbOpts.totalPages) ? (currentPage + 1) : tbOpts.totalPages;
				var prevPage = ((currentPage - 1) < tbOpts.startPage) ? tbOpts.startPage : (currentPage - 1);
					
				$("input[value='" + tbOpts.PREV + "']").attr("text", prevPage);    //設定Prev 按鈕的頁數
				$("input[value='" + tbOpts.NEXT + "']").attr("text", nextPage);    //設定Next 按鈕的頁數
			},
			changePage: function($selector, $table) {
				var page = $selector.val();
				$.myEditTable.lib.showContent(page, $table);
			}
		},
		CheckValue: {
			isValid: function($element) {
				var isValid = true;
				var name = $element.attr("name");
				var val = $element.val();
				
				if(val == "" || val == null)
					isValid = false;
				
				return isValid;
			}
		},
		Datas: {
			oldData: {},
			datas: {},
			newData: "",
			
			getTotalRecords: function() {
				return this.datas.length;
			},
			//在修改前,先儲存舊資料;若是取消修改,可以將原有資料復原
			store: function(parentItem, key) {
				this.oldData.key = key;				
				var allValues = {};
				
				$(parentItem).find("td").each(function(index) {
					if(index > 0)
					{
						allValues[index] = $(this).text();
					}
				});
				
				$.extend(this.oldData, { values: allValues });
			},
			loadData: function($table) {
				var tid = $table.attr("tbID");
				var tbOpts = $.myEditTable.TableOperation.getOptions(tid);

				$.ajax({
					url: tbOpts.LOADDATA_PAGE,
					data: "type=LIST",
					dataType: "json",
					cache: false,
					success: function(data, textStatus) {
						if(data)
						{
							$.myEditTable.Datas.datas = {};
							$.myEditTable.Datas.datas = data;
							
							var totalRecords = $.myEditTable.Datas.getTotalRecords();   //取得所有記錄總數
							var totalPages = Math.ceil(totalRecords / tbOpts.pageSize);      //計算共有幾個頁次
							
							$.extend(tbOpts, { totalRecords: totalRecords, totalPages: totalPages });											
				
							//Create四個導覽按鈕: First, Prev, Next, Last
							$.myEditTable.TableOperation.pageButtonNavigator($table, tbOpts.columnNum);
							$.myEditTable.lib.showContent(tbOpts.startPage, $table);
						}
					},
					error: function(textStatus, errorThrown) {
						//$.myEditTable.Datas.showInfo(data, tid);
					}
				});
			},
			updateData: function(link, tid, type) {
				var tbOpts = $.myEditTable.TableOperation.getOptions(tid);
				var currentPage = $("span#currentPage").text() * 1;
				var id = $(link).closest("tr").find("span#key").text();
				var datas = "type=" + type;
				
				datas += this.newData;
				
				if(type === "SAVE")
					datas += "&id=" + id;				
				
				if(type === "DELETE")
					datas += "&id=" + $(link).closest("tr").find("span#key").text();
					
				//執行伺服器端php程式,新增資料
				$.ajax({
					type: "GET",
					url: tbOpts.LOADDATA_PAGE,
					data: datas,
					dataType: "json",
					cache: false,
					success: function(data) {
						if(data)
						{
							$.myEditTable.Datas.datas = {};
							$.myEditTable.Datas.datas = data;

							tbOpts.totalRecords = $.myEditTable.Datas.getTotalRecords();   //取得所有記錄總數
							tbOpts.totalPages = Math.ceil($.myEditTable.Datas.datas.length / tbOpts.pageSize);      //計算共有幾個頁次
							if(type === "SAVE" || type === "DELETE")
							{
								var $table = $("table[tbID=" + tid + "]");
								$.myEditTable.lib.showContent(currentPage, $table);
							}
							else
							{
								var $table = $("table[tbID=" + tid + "]");
								$.myEditTable.lib.showContent(tbOpts.totalPages, $table);
							}
						}
					},
					error: function(data) {
						//$.myEditTable.Datas.showInfo($.parseJSON(data), tid);
					}
				});
				
				this.newData = "";
			},
			showInfo: function(info, tid) {
				var tbOpts = $.myEditTable.TableOperation.getOptions(tid);
				
				//if(tbOpts.FUNC_SHOW_INFO) eval(tbOpts.FUNC_SHOW_INFO + "('" + info + "')");
			}
		}
	};
	
	$.fn.defaults = {
		startPage: 1,   //預定初次載入時顯示的頁數
		pageSize: 10,  //每頁顯示幾筆資料
		
		LOADDATA_PAGE: "",
		
		NEW_HTML: "新增",
		EDIT_HTML: "修改",
		DELETE_HTML: "刪除",
		SAVE_HTML: "儲存",
		CANCEL_HTML: "取消",		
		
		FIRST: "第一頁",       //第一頁按鈕表示文字
		PREV: "上一頁",    //上一頁按鈕表示文字
		NEXT: "下一頁",      //下一頁按鈕表示文字
		LAST: "最後一頁",     //最後一頁按鈕表示文字
		
		EVENT_LINK_SELECTOR: "a.editLink",
		ROW_KEY_SELECTOR: "key",
		COL_NOEDIT_SELECTOR: "noedit",
		COL_INSERT_SELECTOR: "add",
		
		FUNC_PRE_EDIT: false,
		FUNC_POST_EDIT: false,
		FUNC_PRE_SAVE: "beforeSave",
		FUNC_POST_SAVE: false,
		FUNC_PRE_NEW: "beforeInsertTable",
		FUNC_POST_NEW: "insertTable",
		FUNC_SHOW_INFO: "showInfo",
		
		COLUMN_NAMES: new Array(),
		COLUMN_NOEDIT: new Array()
	};
})(jQuery);