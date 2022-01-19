sap.ui.define([
    "test/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("test.controller.Main", {
            
            onInit: function () {
                this.getOwnerComponent().getRouter().getRoute("Main").attachPatternMatched(this.onPatternMatched, this);
                this.setContentDensity();
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
                    fBExpanded: false
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
            }
        });
    });
