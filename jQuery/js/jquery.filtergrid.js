(function($) {
	$.fn.filtergrid = function(Opts) {
		var settings = $.extend({}, $.fn.defaults, Opts);
			
		var $table = $(this);
		var $firstRow = $("tr:first", $table);
		var coluNum =  $firstRow.find("th").size();
		var startPage = 1;
		
		return this.each(function() {			
			$.extend(settings, { columnNum: coluNum, startPage: startPage });			
			$.pagerComponent.Setting.setOption(settings);
			
			//初始化新增按鈕
			$("table#newTB input#newBtn").button().click(function(event) {
				event.preventDefault();
				$.pagerComponent.EditForm.loadForm("NEW");
			});
				
			//判斷是否開啟搜尋功能
			if(settings.filterOn == true)
			$.pagerComponent.Filter.initialize($table);
			//判斷是否開啟排序功能
			if(settings.sortOn == true)
				$.pagerComponent.Sort.initialize($table);
				
			$.pagerComponent.Datas.loadData($table, "FIRST");
		});
	};
		
	$.pagerComponent = {
		options: [],
			
		Setting: {
			setOption: function(options) {
				//將$.fn.defaults設定值及其他參數儲存至options[0]變數中
				$.pagerComponent.options.push(options);
			},
			buttonNavigator: function($table, coluNum) {
				var Opts = $.pagerComponent.options[0];
				//清空所有按鈕,每次搜尋時必須重新設定所有按鈕
				$("#pageBar").empty();
				
				$table.find("tbody").after("<tr id='pageBar' class='ui-widget-header'><td id='btnList' colspan='" + coluNum + "' style='text-align:center; background-color: #000'>&nbsp;&nbsp;&nbsp;&nbsp;<input type='text' id='toPage' name='toPage' style='width:25px;' />&nbsp;</td></tr>");
				
				//在每個按鈕設一text屬性:代表按下按鈕時要顯示第幾頁內容
				$("<input type='button' id='navigateBtn' value='" + Opts.last + "' text='" + Opts.totalPages + "' />").button().prependTo($("#btnList"));
				$("<input type='button' id='navigateBtn' value='" + Opts.next + "' text='" + (Opts.startPage + 1) + "' />").button().prependTo($("#btnList"));
				
				$("<span id='pageList'></span>").prependTo($("#btnList"));
				
				$("<input type='button' id='navigateBtn' value='" + Opts.prev + "' text='' />").button().prependTo($("#btnList"));
				$("<input type='button' id='navigateBtn' value='" + Opts.first + "' text='" + Opts.startPage + "'  />").button().prependTo($("#btnList"));
				
				//初始化Go 按鈕
				$("<input type='button' id='go' value='" + Opts.go + "' />").button().appendTo($("#btnList"));
			
				
				//設定First, Prev, Next, Last四個按鈕的Click事件
				$("input#navigateBtn").bind("click",  function() { $.pagerComponent.lib.buttonNavigatorClick($(this), $table); });
				//初始化First, Prev, Next, Last四個按鈕的disabled狀態(必須先執行buttonNavigator()和pageNavigator())
				$.pagerComponent.lib.buttonControls();
				
				//設定Go按鈕的Click事件
				$("#go").bind("click", function() { $.pagerComponent.lib.goToPage($("#toPage").val(), $table); });
			},
			pageNavigator: function(startPage, totalPages, currentPage, $table) {
				var Opts = $.pagerComponent.options[0];
				var lastNum = ((startPage + Opts.pageNavigator - 1) > totalPages) ? totalPages : (startPage + Opts.pageNavigator - 1);
				
				for(var i=1; i <= lastNum; i++)
				{
					//設定頁數,從1開始
					if(currentPage != "")
					{
						if(i == currentPage)
							$("<a href='#' class='pageItems active'>" + i + "</a>").bind("click", function() { $.pagerComponent.lib.pageNavigatorClick($(this), $table); }).appendTo("#pageList");
						else
							$("<a href='#' class='pageItems'>" + i + "</a>").bind("click", function() { $.pagerComponent.lib.pageNavigatorClick($(this), $table); }).appendTo("#pageList");
					}
				}
			},
			pageLabel: function(totalPages) {
				var currentPage = $("#pageList").find("a.active").text();
				
				$("#btnList").append("&nbsp;&nbsp;");
				$("<span id='pageLabel'>頁數:" + currentPage + " / " + totalPages + "</span>").appendTo("#btnList");
			}
		},
		lib: {
			checkNumber: function(pageNumber, totalPages) {
				var regx = /[0-9]/g;
				//輸入的字元必須是數字
				if(!regx.test(pageNumber))
					return false;
				else
				{
					//數字必須在總頁數的範圍之內才有效
					if(pageNumber > 0 && pageNumber <= totalPages)
						return true;
					else
						return false;
				}
			},
			goToPage: function(page, $table) {     //按下Go按鈕時,顯示輸入的頁數的內容
				if(page != "" && page != null)
				{
					var Opts = $.pagerComponent.options[0];
					//檢查輸入的字是否為數字以及為有效數字(必須在總頁數的範圍之內)
					if($.pagerComponent.lib.checkNumber(page, Opts.totalPages))
					{
						//重新排列代表頁數的按鈕
						this.pageButtonControls($("a.pageItems:eq(" + (page - 1) + ")"), $table, page);
						this.showContent(page, $table);
					}
				}
			},
			showContent: function(page, $table) {      //顯示輸入頁次的內容
				var Opts = $.pagerComponent.options[0];
				var datas = $.pagerComponent.Datas.datas;   //取得所有記錄內容
				var datasLen = datas.length;						
				var startRec = (page - 1) * Opts.pageSize;   //計算要顯示頁的開始記錄
				var endRec = (startRec + Opts.pageSize) >= datasLen ? datasLen : (startRec + Opts.pageSize);       //計算要顯示頁的結束記錄
				var content = "";
		
				$("tbody", $table).empty();
				
				for(var i = startRec; i < endRec; i++)
				{
					content += "<tr><td nowrap><a href='#' class='editLink'>" + Opts.edittext + "</a> <a href='#' class='detailLink'>" + Opts.detailstxt + "</a></td>";
					for(var j in datas[i])
					{
						content += "<td>" + datas[i][j] + "</td>";							
					}
					content += "</tr>";
				}
					
				$("tbody", $table).append(content);
				
				//為每個Edit 連結設定編輯事件
				$("a.editLink", $table).each(function() {
					$(this).click(function() {
						var dataId = $(this).closest("td").next("td").text();
						$.pagerComponent.EditForm.loadForm(dataId);
						
						this.blur();
						return false;
					});
				});
				
				//為每個Detail 連結設定編輯事件
				$("a.detailLink", $table).each(function() {
					$(this).click(function() {
						var dataId = $(this).closest("td").next("td").text();
						$.pagerComponent.Details.showInfo($(this), dataId);
						
						this.blur();
						return false;
					});
				});
							
				this.resetPageLabel(page, Opts.totalPages);     //設定頁數標籤
				this.pageButtonControls($table, page);     //重新調整代表頁數的按鈕
				this.buttonControls();    //調整First, Prev, Next, Last 四個按鈕的disabled 狀態
			},
			resetPageLabel: function(page, totalPages) {      //每次換頁時,重新更新頁數顯示標籤的內容
				var labelTxt = "頁數:" + page + " / " + totalPages;
				$("span#pageLabel").text(labelTxt);
			},
			buttonNavigatorClick: function($obj, $table) {     //按下First, Prev, Next, Last 按鈕時,顯示內容
				var Opts = $.pagerComponent.options[0];
				var page = $obj.attr("text") * 1;
				
				//重新排列代表頁數的按鈕
				this.pageButtonControls($("a.pageItems:eq(" + (page - 1) + ")"), $table, page);
					
				if($obj.attr("value") === Opts.first)
				{						
					this.showContent(1, $table);    //顯示輸入頁次的內容
				}
				
				if($obj.attr("value") === Opts.last)
				{
					this.showContent(Opts.totalPages, $table);    //顯示輸入頁次的內容
				}
				
				if($obj.attr("value") === Opts.prev)
				{
					this.showContent(page, $table);    //顯示輸入頁次的內容
				}
				
				if($obj.attr("value") === Opts.next)
				{
					this.showContent(page, $table);    //顯示輸入頁次的內容
				}
			},
			buttonControls: function() {
				var Opts = $.pagerComponent.options[0];
				var currentPage = $("#pageList").find("a.active").text() * 1;
				
				//先將所有按鈕的disabled 狀態解除
				$("input[value='" + Opts.first + "']").prop("disabled", false);
				$("input[value='" + Opts.prev + "']").prop("disabled", false);
				$("input[value='" + Opts.next + "']").prop("disabled", false);
				$("input[value='" + Opts.last + "']").prop("disabled", false);
				
				if(currentPage == Opts.startPage)    //如果在第一頁,則disabled First, Prev 按鈕
				{
					$("input[value='" + Opts.first + "']").prop("disabled", true);
					$("input[value='" + Opts.prev + "']").prop("disabled", true);
				}
				
				if(currentPage == Opts.totalPages)    //如果在最後一頁,則disabled Next, Last 按鈕
				{
					$("input[value='" + Opts.next + "']").prop("disabled", true);
					$("input[value='" + Opts.last + "']").prop("disabled", true);
				}
				
				//設定Prev, Next 按鈕代表的頁數
				var nextPage = ((currentPage + 1) <= Opts.totalPages) ? (currentPage + 1) : Opts.totalPages;
				var prevPage = ((currentPage - 1) < Opts.startPage) ? Opts.startPage : (currentPage - 1);
				
				$("input[value='" + Opts.prev + "']").attr("text", prevPage);    //設定Prev 按鈕的頁數
				$("input[value='" + Opts.next + "']").attr("text", nextPage);    //設定Next 按鈕的頁數
			},
			pageNavigatorClick: function($obj, $table) {
				var Opts = $.pagerComponent.options[0];
				var currentPage = $obj.text() * 1;
				
				this.showContent(currentPage, $table);    //顯示輸入頁次的內容										
			},
			pageButtonControls: function($table, currentPage) {
				//根據使用者設定:每一次只顯示5個頁次
				//當使用者按下任一個頁次,重新安排顯示的所有頁次:將按下的頁次擺放在中間
				//eg. 顯示3,4,5,6,7 頁; 5為中間頁, startPage = 3, endPage = 7, prevPagesNum = 2 (中間頁往前加2頁), nextPagesNum = 2 (中間頁往後加2頁)
				var Opts = $.pagerComponent.options[0];
				var startPage = 0, endPage = 0, prevPagesNum = 0, nextPagesNum = 0;
				var judge = currentPage / parseInt(Opts.pageNavigator, 10);     
				
				if(judge >= 1)   //若顯示頁等於或大於pageSize,則重新排列頁數按鈕,將顯示頁設為所列示之所有頁數之中間值
				{
					prevPagesNum = Math.floor((Opts.pageNavigator - 1) / 2);
					startPage = (parseInt(currentPage, 10) - prevPagesNum) < 1 ? 1 : (parseInt(currentPage, 10) - prevPagesNum);
					
					nextPagesNum = parseInt(Opts.pageNavigator, 10) - 1 - prevPagesNum;
					endPage = (parseInt(currentPage, 10) + nextPagesNum) > Opts.totalPages ?  Opts.totalPages :  (parseInt(currentPage, 10) + nextPagesNum);
					
					$("#pageList").empty();
				
					for(var i = startPage; i <= endPage; i++)
					{
						if(i == currentPage)
							$("<a href='#' class='pageItems active'>" + i + "</a>").bind("click", function() { $.pagerComponent.lib.pageNavigatorClick($(this), $table); }).appendTo("#pageList");
						else
							$("<a href='#' class='pageItems'>" + i + "</a>").bind("click", function() { $.pagerComponent.lib.pageNavigatorClick($(this), $table); }).appendTo("#pageList");
					}
				}
				else   //如果顯示頁小於pageSize(每頁列出 n 個頁次顯示),則按照原本頁數按鈕初始值之設定排列頁數按鈕 [ 原則上只適用於1-pageSize的頁數 ]
				{
					$("#pageList").empty();
					//若是按下頁數數字小於pageSize的按鈕,則從第一頁開始顯示:再次呼叫初次設定函式
					$.pagerComponent.Setting.pageNavigator(Opts.startPage, Opts.totalPages, currentPage, $table);
				}
			}
		},
		Details: {
			showInfo: function($link, dataId) {
				var ColuNum = $.pagerComponent.options[0].columnNum;
				var $thisTR = $link.closest("tr");
				
				$.ajax({
					type: "GET",
					url: "vender_info.php",
					data: "type=DETAIL&id=" + dataId,
					dataType: "json",
					cache: false,
					success: function(data) {
						if(data)
						{
							$("tr#detailsTR").empty();
							
							var $details = $("<tr id='detailsTR'><td colspan='" + ColuNum + "' align='left' style='background-color:#ebf5fa;'><div id='details' style='color:#666666; width:96%; height:55px; padding:10px; border:1px solid #CCCCCC; text-align:left;'></div></td></tr>");
							var detailContent = "廠商類別：" + data[0].provd_name + "　　實收折數：" + data[0].vend_discount + "　　結帳日期：" + data[0].vend_date + "　　傳真號碼：" + data[0].vend_fax + "<br />" + "電子郵件：" + data[0].vend_email + "<br />" + "廠商地址：" + data[0].vend_address + "<br /><a href='#' id='hideDetails' style='margin-left:90%; margin-right:0; padding:0; color:#0099CC;'>隱藏</a><span class='detailClose'></span><br />";							
							$details.hide().insertAfter($thisTR);
							$("div#details").html(detailContent);
							$details.show();
							
							$("a#hideDetails").click(function() { $("tr#detailsTR").empty(); });
						}
					},
					error: function(data, textStatus) {
						alert("存取錯誤:" + textStatus + " - " + data);
					}
				});
			}
		},
		EditForm: {
			loadForm: function(op) {
				var $company = $("input#company"), $leader = $("input#leader"), $invoice = $("input#invoice"),
					  $contact = $("input#contact"), $phone = $("input#phone"), $provdNo = $("select#provd_code"),
					  $fax = $("input#fax"), $email = $("input#email"), $address = $("input#address"),
					  $discount = $("input#discount"), $edate = $("input#edate");

				var inputFields = $([]).add($company).add($leader).add($invoice).add($contact).add($phone).add($fax).add($email).add($address).add($discount).add($edate);
				var $tips = $("p.validateTips", "div#dialog");
				var loaddataPage = $.pagerComponent.options[0].loaddata_page;
				
				$.ajax({
					url: "provider_set.php",
					data: "type=LIST",
					dataType: "json",
					cache: false,
					success: function(data) {
						if(data)
						{
							var options;
							
							$provdNo.empty();
							for(var i in data)
							{
								options += "<option value=" + data[i].Id + ">" + data[i].Name + "</option>";
							}
							$provdNo.append(options);
						}
					},
					error: function(data, textStatus) {
						alert("存取錯誤:" + textStatus + " - " + data);
					}
				});
				
				if(op !== "NEW")   //修改時,先載入原來資料
				{
					$.ajax({
						type: "GET",
						url: loaddataPage,
						data: "type=ONE&id=" + op,
						dataType: "json",
						cache: false,
						success: function(data) {
							if(data)
							{
								$company.val(data[0].vend_name);
								$leader.val(data[0].vend_leader);
								$invoice.val(data[0].vend_invoice);
								$edate.val((data[0].vend_date === "0000-00-00") ? "" : data[0].vend_date);
								$discount.val(data[0].vend_discount);
								$provdNo.val(data[0].provd_code);
								$contact.val(data[0].vend_contact);
								$phone.val(data[0].vend_phone);
								$fax.val(data[0].vend_fax);
								$email.val(data[0].vend_email);
								$address.val(data[0].vend_address);
							}
						},
						error: function(data, textStatus) {
							alert("存取錯誤:" + textStatus + " - " + data);
						}
					});
				}
				
				var $dialog = $("#dialog").dialog({
					autoOpen: true,
					width: 500,
					height: 500,
					modal: true,
					show: "blind",
					buttons: {
						"確定": function() {
							inputFields.removeClass("ui-state-error");
						
							var isValid = true;
							
							isValid = isValid && checkEmpty($company, "[ 廠商名稱 ]");
							isValid = isValid && checkEmpty($leader, "[ 負責人 ]");
							isValid = isValid && checkEmpty($invoice, "[ 統一編號 ]");
							isValid = isValid && checkEmpty($phone, "[ 聯絡電話 ]");
							isValid = isValid && checkEmpty($address, "[ 廠商地址 ]");
							
							if($email.val() != "")
								isValid = isValid && checkRegexp($email, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, "電子郵件格式不正確，請重新輸入!");
							
							if(isValid == true)
							{
								if(op === "NEW")
									var inputData = { type: "NEW", company: $company.val(), leader: $leader.val(), invoice: $invoice.val(), contact: $contact.val(), phone: $phone.val(), provd_code: $provdNo.val(), fax: $fax.val(), email: $email.val(), address: $address.val(), discount: $discount.val(), edate: $edate.val() };
								else
									var inputData = { type: "SAVE", id: op, company: $company.val(), leader: $leader.val(), invoice: $invoice.val(), contact: $contact.val(), phone: $phone.val(), provd_code: $provdNo.val(), fax: $fax.val(), email: $email.val(), address: $address.val(), discount: $discount.val(), edate: $edate.val() };

								var dataStr = $.param(inputData);
								var pageChange = ((op === "NEW") ? "INSERT" : $("#pageList").find("a.active").text());
								
								$.ajax({
									type: "POST",
									url: loaddataPage,
									data: dataStr,
									cache: false,
									success: function(data) {
										if(data)
										{
											alert("資料已送出!");
											$.pagerComponent.Datas.loadData($("table#list"), pageChange);
										}
									},
									error: function(data, textStatus) {
										alert("存取錯誤:" + textStatus + " - " + data);
									}
								});

								$(this).dialog("close");
							}
						},
						"取消": function() {
							$(this).dialog("close");
						}
					},
					close: function() {
						$tips.removeClass("ui-state-highlight").text("欄位後方有(*)者必須輸入資料");
						inputFields.val("").removeClass("ui-state-error");
					}
				});
				
				//------Datapicker---------------------------------------------
				var $date = $("#date").datepicker({
					dateFormat: "yy-mm-dd",
					changeMonth: true,
					beforeShowDay: function(date) {
						var dayOfWeek = date.getDay();
						if(dayOfWeek == 0 || dayOfWeek == 6)
							return [false, "", "Lay off"];
						else
							return [true];
					},
					onSelect: function(dateText) {
						$("input#edate").val(dateText);
						$(this).toggle();
					}
				});
				
				$date.hide();
				
				$("#calendar").button({
					text: false,
					icons: {
						primary: "ui-icon-calendar"
					}
				}).click(function(event) {
					event.preventDefault();
				
					var pos = $("#calendar").position();
					
					$date.css({
						position: "absolute",
						top: (pos.top + 20),
						left: pos.left
					});
					$date.toggle();
				});
				
			}
		},
		Filter: {
			lists: [],
			
			initialize: function($table) {
				var Opts = $.pagerComponent.options[0];
				var width = $table.css("width");
				var $typeColumns = $table.find("thead > tr > th");
				var colNum = $typeColumns.size();
				//在資料表上方創建一列搜尋列
				$("<table id='searchTb' width='" + width + "' style='border:1px solid #DDD;'><tr id='filterBar'><td id='filterList' style='text-align:left;'><span id='filterTitle'>請先選擇欄位: </span><input type='button' id='submit' value='搜尋' /><input type='button' id='reset' value='清除' /></td></tr>").insertBefore($table).after("<br />");
				$("#filterList").find("input[type='button']").button();
				//將每個欄位(Column)設為搜尋條件之一:以<select>方式呈現
				var $selector = $("<select id='filterType'></select>").bind("change", function() { $.pagerComponent.Filter.getDatasByType($(this)); });
				for(var i = 0; i < colNum; i++)
				{
					$("<option value='" + $typeColumns.eq(i).attr("name") + "'>" + $typeColumns.eq(i).text() + "</option>").appendTo($selector);
				}
				
				$("#filterTitle").append($selector);
				
				//初次執行select的change事件:因為<select>預設值為第一個欄位值,先將欄位一的資料搜集起來備用
				$selector.trigger("change", function() { $.pagerComponent.Filter.getDatasByType($(this)); });    
				
				var $filterInput = $("<input type='text' id='filterInput' />").insertAfter("#filterType");
				
				$("#filterType").after("&nbsp;&nbsp;&nbsp;&nbsp;");
				$("#filterInput").after("&nbsp;&nbsp;&nbsp;&nbsp;");
				
				//設定 [ 確定 ] 按鈕
				$("#searchTb input#submit").click(function(event) {
					event.preventDefault();
					
					if($("input#filterInput").val() != "")
					{
						//先清空陣列內容,以避免上一次搜尋內容殘留
						$.pagerComponent.Datas.matchDatas = [];
						$.pagerComponent.Filter.tableSearch($table);
					}
				});
				
				$("#searchTb input#reset").click(function(event) {
					event.preventDefault();
					$("input#filterInput").val("");
					//先清空陣列內容,以避免上一次搜尋內容殘留
					$.pagerComponent.Datas.matchDatas = [];
					//還原原本未搜尋前的資料
					$.pagerComponent.Datas.restoreData();
					$.pagerComponent.Filter.refreshTable($table);
					//判斷是否開啟排序功能,並啟動第一欄位的排序功能
					if(Opts.sortOn == true)
						$("thead th:first", $table).trigger("click", function() { $.pagerComponent.Sort.dataSort($(this), $table); });
				});
				
				//搜尋字串輸入橍:使用jQuery UI 的autocomplete 方法
				$filterInput.autocomplete({
					source: this.lists,
					open: function() {
						var $ul = $(this).autocomplete("widget");
						$ul.css("width", "250px");
					}
				});					
			},
			tableSearch: function($table) {
				var Opts = $.pagerComponent.options[0];
					
				var searchType = $("select#filterType").val();
				var searchTxt = $("input#filterInput").val();   //取得搜尋字串
				var allDatas = $.pagerComponent.Datas.dataStore;
				var j = 0;
				//將符合字串的資料存入另一變數:matchDatas[]
				for(var i = 0; i < allDatas.length; i++)
				{
					if(allDatas[i][searchType].toLowerCase().match(searchTxt.toLowerCase()) != null )
					{
						$.pagerComponent.Datas.matchDatas[j] = allDatas[i];
						j++;								
					}
				}
				//再將matchDatas[]的資料倒回原datas[]陣列裡
				$.pagerComponent.Datas.matchDatasToDatas();
					
				if($.pagerComponent.Datas.matchDatas.length > 0)
				{
					//重新計算頁數
					var pages = Math.ceil($.pagerComponent.Datas.matchDatas.length / Opts.pageSize);
					Opts.totalPages = pages;

					//重新顯示內容
					$.pagerComponent.lib.showContent(1, $table);							   
				}
			},
			refreshTable: function($table) {
				var Opts = $.pagerComponent.options[0];
				$.pagerComponent.lib.showContent(1, $table);
			},
			getDatasByType: function($obj) {
				$("#filterInput").val("");
			
				var type = $obj.val();
				var allDatas = $.pagerComponent.Datas.dataStore;
				//取得欄位值(eg. pID為欄位值)為key的值:一舨取值的用法為allDatas[i].pID,但是現在key值(即pID)為變數,所以以 [key值] 來取代 .pID 的用法
				for(var i = 0; i < allDatas.length; i++)
				{
					this.lists[i] = allDatas[i][type];
				}
			}
		},
		Sort: {
			sortDatas: [],
			
			initialize: function($table) {
				var $thElement = $table.find("thead th");					
				//設定每個欄位的Click事件
				$thElement.each(function(index) {
					if(index > 0)
						$(this).append("<span class='grid-icon arrowNone'></span>");
					
					$(this).click(function(event) {
						event.preventDefault();
						$.pagerComponent.Sort.dataSort($(this), $table);
						this.blur();
						return false;
					});					
				});
				//預設第一個欄位為首次排序欄位
				$thElement.eq(0).trigger("click", function() { $.pagerComponent.Sort.dataSort($(this), $table); });
			},
			dataSort: function($column, $table) {		
				var sortDirection = "ASC";
				if(!$column.hasClass("ASC") && !$column.hasClass("DESC"))
				{
					$column.addClass("ASC").removeClass("DESC").siblings().removeClass("ASC DESC");
					$column.find("span.grid-icon").removeClass("arrowDown arrowUp arrowNone").addClass("arrowUp").end().siblings("th").find("span.grid-icon").removeClass("arrowDown arrowUp arrowNone").addClass("arrowNone");
				}
				else if($column.hasClass("ASC") && !$column.hasClass("DESC"))
				{
					$column.addClass("DESC").removeClass("ASC").siblings().removeClass("ASC DESC");
					$column.find("span.grid-icon").removeClass("arrowDown arrowUp arrowNone").addClass("arrowDown").end().siblings("th").find("span.grid-icon").removeClass("arrowDown arrowUp arrowNone").addClass("arrowNone");
					sortDirection = "DESC";
				}
				else if(!$column.hasClass("ASC") && $column.hasClass("DESC"))
				{
					$column.addClass("ASC").removeClass("DESC").siblings().removeClass("ASC DESC");
					$column.find("span.grid-icon").removeClass("arrowDown arrowUp arrowNone").addClass("arrowUp").end().siblings("th").find("span.grid-icon").removeClass("arrowDown arrowUp arrowNone").addClass("arrowNone");
					sortDirection = "ASC";
				}
				
				if(sortDirection === "ASC")    //升冪排列
					this.sortASC($column, $table);
				
				if(sortDirection === "DESC")   //降冪排列
					this.sortDESC($column, $table);
			},
			sortASC: function($column, $table) {
				var Opts = $.pagerComponent.options[0];
				var dataKey = $column.attr("name");    //取得排序的欄位(key)值
				var arrayLen = $.pagerComponent.Datas.datas.length; 
				//氣泡排序法:升冪排列
				for(var i=0; i<arrayLen-1; i++)
				{
					for(var j=0; j<arrayLen-1; j++)
					{
						var a = ($column.hasClass("number")) ? parseInt($.pagerComponent.Datas.datas[j][dataKey], 10) : $.pagerComponent.Datas.datas[j][dataKey];
						var b = ($column.hasClass("number")) ? parseInt($.pagerComponent.Datas.datas[j+1][dataKey], 10) : $.pagerComponent.Datas.datas[j+1][dataKey];
						if(a > b)
							$.pagerComponent.Sort.dataSwap(j, j+1);
					}
				}
				//重新設定頁數列(<tr id='pageBar'>),將顯示頁設回第一頁
				$.pagerComponent.Filter.refreshTable($table);
			},
			sortDESC: function($column, $table) {
				var Opts = $.pagerComponent.options[0];
				var dataKey = $column.attr("name");    //取得排序的欄位(key)值
				var arrayLen = $.pagerComponent.Datas.datas.length;
				//氣泡排序法:降冪排列
				for(var i=0; i<arrayLen-1; i++)
				{
					for(var j=0; j<arrayLen-1; j++)
					{
						var a = ($column.hasClass("number")) ? parseInt($.pagerComponent.Datas.datas[j][dataKey], 10) : $.pagerComponent.Datas.datas[j][dataKey];
						var b = ($column.hasClass("number")) ? parseInt($.pagerComponent.Datas.datas[j+1][dataKey], 10) : $.pagerComponent.Datas.datas[j+1][dataKey];
						if(a < b)
							$.pagerComponent.Sort.dataSwap(j, j+1);
					}
				}
				//重新設定頁數列(<tr id='pageBar'>),將顯示頁設回第一頁
				$.pagerComponent.Filter.refreshTable($table);
			},
			dataSwap: function(m, n) {
				var temp = $.pagerComponent.Datas.datas[m];
				$.pagerComponent.Datas.datas[m] = $.pagerComponent.Datas.datas[n];
				$.pagerComponent.Datas.datas[n] = temp;
			}
		},
		Datas: {
			datas: [],             //顯示於表格中的作用資料
			dataStore: [],       //將原本資料作一備份,待清除搜尋條件後,還原為原本資料使用
			matchDatas: [],    //儲存符合搜尋字串的資料,此為暫存變數(因為符合條件的資料必須再複製至datas[],以供使用者使用)
			
			loadData: function($table, action) {
				var Opts = $.pagerComponent.options[0];

				$.ajax({
					url: Opts.loaddata_page,
					data: "type=LIST",
					dataType: "json",
					cache: false,
					success: function(data, textStatus) {
						if(data)
						{
							$.pagerComponent.Datas.datas = {};
							$.pagerComponent.Datas.datas = data;
							
							var totalRecords = $.pagerComponent.Datas.getTotalRecords();   //取得所有記錄總數
							var totalPages = Math.ceil(totalRecords / Opts.pageSize);      //計算共有幾個頁次
							
							$.extend(Opts, { totalRecords: totalRecords, totalPages: totalPages });											
							
							//Create四個導覽按鈕: First, Prev, Next, Last
							$.pagerComponent.Setting.buttonNavigator($table, Opts.columnNum);
							//Create頁數按鈕,並設定其Click 事件,設定第一頁為目前顯示頁
							$.pagerComponent.Setting.pageNavigator(Opts.startPage, totalPages, 1, $table);
							//初始化頁數標籤
							$.pagerComponent.Setting.pageLabel(totalPages);

							if(action === "FIRST")
								$.pagerComponent.lib.showContent(1, $table);  //第一次載入資料
							else if(action === "INSERT")
								$.pagerComponent.lib.showContent(totalPages, $table);  //新增資料後,移置最後一頁顯示最新資料
							else
								$.pagerComponent.lib.showContent(action, $table);   //修改資料後,重新顯示同一頁資料
							
							$.pagerComponent.Datas.saveData();
						}
					},
					error: function(textStatus, errorThrown) {
						//$.myEditTable.Datas.showInfo(data, tid);
					}
				});
			},
			setDatas: function() {
			/*
				this.datas = [ { "pID": "A0001", "pName": "濾掛式咖啡", "pQunt": "9" }, { "pID": "A0005", "pName": "英國皇家奶茶", "pQunt": "3" }, 
								   { "pID": "A0006", "pName": "抹茶拿鐵", "pQunt": "8" }, { "pID": "A0009", "pName": "南非國寶紅茶", "pQunt": "20" }, 
								   { "pID": "A00011", "pName": "三合一拿鐵咖啡", "pQunt": "6" }, { "pID": "A00012", "pName": "三合一摩卡咖啡", "pQunt": "7" }, 
								   { "pID": "A00013", "pName": "英國伯爵紅茶", "pQunt": "12" }, { "pID": "A00014", "pName": "印度紅茶", "pQunt": "10" }, 
								   { "pID": "A00015", "pName": "藍山單品咖啡", "pQunt": "1" }, { "pID": "A00017", "pName": "三合一卡布奇諾咖啡", "pQunt": "13" }, 
								   { "pID": "A00019", "pName": "焦糖瑪奇朵咖啡", "pQunt": "5" }, { "pID": "A00020", "pName": "紅茶拿鐵咖啡", "pQunt": "4" }, 
								   { "pID": "A00021", "pName": "昂列奶茶", "pQunt": "11" }, { "pID": "A00022", "pName": "濃厚系Double摩卡", "pQunt": "17" }, 
								   { "pID": "A00023", "pName": "黑麥高山茶", "pQunt": "6" }, { "pID": "A00024", "pName": "二合一無糖拿鐵", "pQunt": "13" },  
								   { "pID": "A00025", "pName": "蘇綠抹茶冰咖啡", "pQunt": "1" }, { "pID": "A00027", "pName": "曼特寧單品咖啡", "pQunt": "11" }, 
								   { "pID": "A00028", "pName": "極品蒂瑪紅茶", "pQunt": "19" }, { "pID": "A00029", "pName": "二合一濾掛式摩卡", "pQunt": "8" },
								   { "pID": "A00030", "pName": "極品重烘培拿鐵", "pQunt": "15" }, { "pID": "A00031", "pName": "沁涼冰紅茶拿鐵", "pQunt": "7" },
								   { "pID": "A00032", "pName": "凍頂烏龍茶", "pQunt": "7" }, { "pID": "A00033", "pName": "拿鐵冰咖啡", "pQunt": "14" },
								   { "pID": "A00034", "pName": "冰焦糖瑪琪朵咖啡", "pQunt": "10" }, { "pID": "A00035", "pName": "招牌冰咖啡", "pQunt": "9" },
								   { "pID": "A00037", "pName": "冰綠茶", "pQunt": "11" }, { "pID": "A00038", "pName": "皇家極品伯爵茶", "pQunt": "22" },
								   { "pID": "A00039", "pName": "凍頂美人茶", "pQunt": "2" }, { "pID": "A00040", "pName": "印度皇家奶茶", "pQunt": "7" },
								   { "pID": "A00041", "pName": "榛果拿鐵咖啡", "pQunt": "15" }, { "pID": "A00042", "pName": "英國皇家重培紅茶", "pQunt": "10" },
								   { "pID": "A00043", "pName": "咖啡密斯朵", "pQunt": "17" }, { "pID": "A00044", "pName": "重藍山極品咖啡", "pQunt": "21" },
								   { "pID": "A00045", "pName": "冰香草咖啡", "pQunt": "1" }, { "pID": "A00046", "pName": "古早味紅茶", "pQunt": "9" },
								   { "pID": "A00047", "pName": "濃厚舖青草茶", "pQunt": "13" }, { "pID": "A00049", "pName": "品客招牌咖啡", "pQunt": "4" },
								   { "pID": "A00050", "pName": "桂圓紅棗茶", "pQunt": "5" }, { "pID": "A00051", "pName": "高山系純色綠茶", "pQunt": "8" },
								   { "pID": "A00052", "pName": "純喫茶", "pQunt": "1" }, { "pID": "A00053", "pName": "高山凍頂烏龍", "pQunt": "18" } ];
				
				this.saveData();
				*/
			},
			getTotalRecords: function() {
				//$.pagerComponent.Datas.setDatas();
				return this.datas.length;
			},
			saveData: function() {
				for(var i=0; i<this.datas.length; i++)
				{
					this.dataStore[i] = this.datas[i];
				}
			},
			matchDatasToDatas: function() {
				this.datas = [];
				for(var i=0; i<this.matchDatas.length; i++)
				{
					this.datas[i] = this.matchDatas[i];
				}
			},
			restoreData: function() {
				this.datas = [];
				for(var i=0; i<this.dataStore.length; i++)
				{
					this.datas[i] = this.dataStore[i];
				}
				
				var Opts = $.pagerComponent.options[0];
				var totalRecords = $.pagerComponent.Datas.getTotalRecords();   //取得所有記錄總數
				var totalPages = Math.ceil(totalRecords / Opts.pageSize);      //計算共有幾個頁次
				Opts.totalPages = totalPages;
			}
		}
	};
		
	$.fn.defaults = {
			pageNavigator: 5,    //只顯示3個頁次的導覽按鈕
			pageSize: 10,     //每一頁要列出幾筆記錄
			
			first: "First",       //第一頁按鈕表示文字
			prev: "Prev",    //上一頁按鈕表示文字
			next: "Next",      //下一頁按鈕表示文字
			last: "Last",     //最後一頁按鈕表示文字
			go: "Go",         //跳到第n頁之按鈕表示文字
			
			edittext: "修改",
			deletetext: "刪除",
			detailstxt: "明細",
			
			filterOn: true,   //開啟搜尋功能(false:關閉)
			sortOn: true,     //開啟排序功能(false:關閉)
			
			loaddata_page: ""
	};
	
	function tips(msg)
	{
		var $tips = $("p.validateTips", "div#dialog");
		$tips.text(msg).addClass("ui-state-highlight");
		setTimeout(function() {
			$tips.removeClass("ui-state-highlight");
		}, 1000);
	}
	
	function checkEmpty($obj, objName)
	{
		if($obj.val().length <= 0)
		{
			$obj.addClass("ui-state-error");
			tips(objName + "欄位不可空白，請輸入資料!");
			return false;
		}
		else
			return true;
	}
	
	function checkRegexp($obj, regexp, msg)
	{
		if(!regexp.test($obj.val()))
		{
			$obj.addClass("ui-state-error");
			tips(msg);
			return false;
		}
		else
			return true;
	}
})(jQuery);