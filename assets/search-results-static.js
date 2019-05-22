function init(){var e=$("#refine-search-popup").kendoPopup({anchor:$("#refine-search-container"),origin:"bottom right",position:"top right"}).data("kendoPopup");$("#refine-search-button").on("click",function(){e.toggle()}),searchViewModel.init(),kendo.bind($(".search-input-container"),searchViewModel),kendo.bind($("#refine-search-popup"),searchViewModel),$(".custom-checkbox input[type='checkbox']").change(function(){searchViewModel.update()}),attachToEvents(),updateSearchLayout()}function attachToEvents(){}function search(e){searchTerms=e.val(),trackSearchQuery(searchTerms)}function trackSearchQuery(e){trackItem(getSearchCategory(),prd,e)}function getSearchCategory(){}function searchInternal(e){closePopup(),search(e)}function closePopup(){var e=$("#refine-search-popup").data("kendoPopup");e.close()}function updateSearchLayout(){$("#local-search").css("padding-right",$("#refine-search-button").outerWidth())}function getDataSource(){}function attachToEvents(){$('form input[name="q"]').keydown(function(e){if(13==e.keyCode){var t=$(this);return searchInternal(t),t.parents("form").submit(),!1}}),$("div#results").on("click","a",function(){trackSearchResult($(this).attr("href"))})}function getSearchCategory(){return"docs-search-terms"}function trackSearchResult(e){trackItem("docs-search-results",searchTerms,e)}function toKV(e){return e=e.split("="),this[e[0]]=e[1],this}function getDataSource(){var e=location.search.replace(/(^\?)/,"").split("&").map(toKV.bind({}))[0];return searchTerms=decodeURIComponent(e.q?e.q.replace(/\+/g," "):""),$("[name=q]").val(searchTerms),new kendo.data.DataSource({transport:{parameterMap:function(t){return{start:1+t.skip,num:t.pageSize,cx:gcsInstance,key:gcsKey,q:e.q+searchViewModel.getFilterExpression()}},read:{url:GCSE_API_URL}},change:function(){var e=this.data().length>0;$("#search-container").toggle(e),$("#no-results").toggle(!e),setSideNavPosition()},serverPaging:!0,pageSize:10,schema:{type:"json",data:function(e){return 0===parseInt(e.searchInformation.totalResults)?[]:e.items.map(function(e){return{title:e.htmlTitle,url:e.link,excerpt:e.htmlSnippet}})},total:function(e){return e.searchInformation.totalResults}}})}var PAGE_FILTER=" more:pagemap:metatags-restype:",GCSE_ELEMENT_NAME="google-search",GCSE_API_URL="https://www.googleapis.com/customsearch/v1",searchTerms="",searchItemsStorageKey="searchItemsStorageKey",siteHasKbPortal,isKbPage,isKbPortalRoot,hasApiReference,searchViewModel=kendo.observable({kb:!1,documentation:!1,api:!1,label:"",filterValues:[],getFilter:function(){for(var e="",t=0;t<this.filterValues.length;t++)""!==e&&(e+=","),e+=this.filterValues[t];return e},getFilterExpression:function(){var e=this.getFilter();return""!==e?PAGE_FILTER+e:""},updateLabel:function(){var e="";this.filterValues=[],this.kb&&this.documentation&&this.api||!this.kb&&!this.documentation&&!this.api?e="Search all":(this.documentation&&(e+="DOCS",this.filterValues.push("documentation")),this.kb&&(e+=(e?" / ":"")+"KB",this.filterValues.push("kb")),this.api&&hasApiReference&&(e+=(e?" / ":"")+"API",this.filterValues.push("api")),e="Search in "+e),this.set("label",e)},getLocalStorageKey:function(){return searchItemsStorageKey+gcsInstance},update:function(){this.updateLabel(),localStorage.setItem(this.getLocalStorageKey(),JSON.stringify(this.filterValues)),updateSearchLayout()},init:function(){var e=JSON.parse(localStorage.getItem(this.getLocalStorageKey()));e&&!isKbPortalRoot||(e=[],isKbPage||isKbPortalRoot?e.push("kb"):(e.push("documentation"),hasApiReference&&e.push("api"),siteHasKbPortal&&e.push("kb")),isKbPortalRoot||localStorage.setItem(this.getLocalStorageKey(),JSON.stringify(e)));for(var t=0;t<e.length;t++)searchViewModel.set(e[t],!0);searchViewModel.updateLabel()}});$(function(){init();var e=getDataSource();$("#results").kendoListView({dataSource:e,template:$("#results-template").html(),dataBound:function(){window.scrollTo(0,0),setSideNavPosition()}}),$(".site-pager").kendoPager({dataSource:e,buttonCount:5,messages:{previous:"Previous",next:"Next",display:"",empty:""}}),$(".results-message").kendoPager({dataSource:e,numeric:!1,previousNext:!1,messages:{display:"{0}-{1} of {2} results",empty:"Sorry, there were no results found. Maybe try a broader search."}}),setSideNavPosition()});