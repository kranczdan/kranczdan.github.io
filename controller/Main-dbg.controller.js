sap.ui.define([
    "test/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Filter, FilterOperator, Sorter, Fragment) {
        "use strict";

        return Controller.extend("test.controller.Main", {
            
            onInit: function () {
                this.getOwnerComponent().getRouter().getRoute("Main").attachPatternMatched(this.onPatternMatched, this);
                this.setContentDensity();

                this.bSorted = true;
                this.sSortText = "Nach Name aufsteigend sortiert";
            },

            onAfterRendering: function(){
                this.getView().setModel(new JSONModel({
                    keys: ["Vollkasko","Teilkasko"],
                    range: [0,500]
                }), "filter");
            },

            onPatternMatched: function(){

                let bCompare = false;

                if(this.getView().byId("idTable").getSelectedContexts().length > 1){
                    bCompare = true;
                }

                this.getView().setModel(new JSONModel({
                    itemsLength: this.getView().byId("idTable").getItems().length,
                    compareEnabled: bCompare,
                    fBExpanded: false,
                    sorted: this.bSorted,
                    sortText: this.sSortText
                }), "detail");
            },

            onTableSelectionChanged: function(oEvent){
                if(this.getView().byId("idTable").getSelectedContexts().length > 1){
                    this.getView().getModel("detail").setProperty("/compareEnabled", true);
                }else{
                    this.getView().getModel("detail").setProperty("/compareEnabled", false);
                }
            },

            onNavToDetail: function(oEvent){
                this.getOwnerComponent().getRouter().navTo("Detail", {
                    id: oEvent.getSource().getBindingContext().getPath().split("/")[2]
                });
            },

            onSearch: function(){
                let aFilter = [];
                let oFilterData = this.getView().getModel("filter").getData();

                if(oFilterData.keys.length !== 0){
                    oFilterData.keys.forEach((sKey) => {
                        aFilter.push(new Filter("type", FilterOperator.EQ, sKey));
                    });
                }

                if(oFilterData.range.length !== 0){
                    let aRangeFilter = [];
                    aRangeFilter.push(new Filter("pricePerMonth", FilterOperator.GE, oFilterData.range[0]));
                    aRangeFilter.push(new Filter("pricePerMonth", FilterOperator.LE, oFilterData.range[1]));
                    aFilter.push(new Filter(aRangeFilter, true));
                }

                this.getView().byId("idTable").getBinding("items").filter(aFilter);
            },

            onReset: function(){
                this.getView().setModel(new JSONModel({
                    keys: ["Vollkasko","Teilkasko"],
                    range: [0,500]
                }), "filter");
                this.onSearch();
            },

            onCompare: function(oEvent){
                let aContexts = this.getView().byId("idTable").getSelectedContexts();
                let sIds = "";
                aContexts.forEach((oContext) => {
                    sIds += oContext.getPath().split("/")[2] + ";";
                });
                this.getOwnerComponent().getRouter().navTo("Compare", {
                    ids: sIds.slice(0,-1)
                });
            },

            onOpenSort: function(){
                var oView = this.getView();
			if (!this._oSortDialog) {
				Fragment.load({
					id: oView.getId(),
					name: "test.view.Sort",
					controller: this
				}).then(function (oDialog) {
					this._oSortDialog = oDialog;
					jQuery.sap.syncStyleClass(oView.getController().getContentDensityClass(), oView, oDialog);
					this.getView().addDependent(this._oSortDialog);
					this._oSortDialog.open();
				}.bind(this));
			} else {
				this._oSortDialog.open();
			}
            },

            handleSort: function (oEvent) {
                var sPath = oEvent.getParameters().sortItem.getKey();
                var sText = oEvent.getParameters().sortItem.getText();
                var bDescending = oEvent.getParameters().sortDescending;
                
                var oSorter = new Sorter({
                    path: sPath,
                    descending: bDescending
                });

                this.sSortText = "Nach " + sText + " " + (bDescending ? "absteigend" : "aufsteigend") + " sortiert";

                this.getView().getModel("detail").setProperty("/sortText", this.sSortText);

                this.getView().byId("idTable").getBinding("items").sort(oSorter);
            },
        });
    });
