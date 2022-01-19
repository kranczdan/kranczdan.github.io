sap.ui.define([
    "test/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, History) {
        "use strict";

        return Controller.extend("test.controller.Compare", {
            onInit: function () {
                this.getOwnerComponent().getRouter().getRoute("Compare").attachPatternMatched(this.onPatternMatched, this);
                this.setContentDensity();
            },

            onPatternMatched: function(oEvent){
                let sIds = oEvent.getParameters().arguments.ids;
                let aIds = sIds.split(";");
                let aObjects = [];
                aIds.forEach((sId) => {
                    aObjects.push(this.getModel().getProperty("/insurances/" + sId));
                });
                let oTable = this.getView().byId("idTable");
                oTable.removeAllColumns();
                oTable.removeAllItems();
                oTable.addColumn(new sap.m.Column());
                aObjects.forEach((oObject) => {
                    oTable.addColumn(new sap.m.Column({
                        hAlign: "Center",
                        header: new sap.m.Label({
                            text: oObject.title,
                            design: "Bold"
                        })
                    }));
                });

                //Eigenschaften:

                let aCells = [
                    new sap.m.Label({
                        text: "Eigenschaften",
                        design: "Bold"
                    })
                ];
                aObjects.forEach((oObject) => {
                    let aItems = [];
                    oObject.features.forEach((oFeature) => {
                        aItems.push(new sap.m.Text({text: "⦁ " + oFeature.text}));
                    });
                    aCells.push(new sap.m.VBox({
                        items: aItems
                    }));
                });
                oTable.addItem(new sap.m.ColumnListItem({
                    cells: aCells
                }));

                //Eigenschaften:

                aCells = [
                    new sap.m.Label({
                        text: "Typ",
                        design: "Bold"
                    })
                ];
                aObjects.forEach((oObject) => {
                    aCells.push(new sap.m.Text({text: "" + oObject.type}));
                });
                oTable.addItem(new sap.m.ColumnListItem({
                    cells: aCells
                }));

                //Preis:

                aCells = [
                    new sap.m.Label({
                        text: "Preis",
                        design: "Bold"
                    })
                ];
                aObjects.forEach((oObject) => {
                    aCells.push(new sap.m.ObjectNumber({number: "" + oObject.pricePerMonth + ",00", unit: "€ / Monat"}));
                });
                oTable.addItem(new sap.m.ColumnListItem({
                    cells: aCells
                }));

                //Buttons:

                aCells = [
                    new sap.m.Label({
                        text: ""
                    })
                ];
                aObjects.forEach((oObject) => {
                    let oButton = new sap.m.Button({text: "Weiter zu " + oObject.title, icon: "sap-icon://navigation-right-arrow", iconFirst: false});
                    oButton.addCustomData(new sap.ui.core.CustomData({key: "id", value: oObject.id}));
                    oButton.attachPress(this.onNavToDetail.bind(this));
                    aCells.push(oButton);
                });
                oTable.addItem(new sap.m.ColumnListItem({
                    cells: aCells
                }));
            },
            onNavToDetail: function(oEvent){
                this.getOwnerComponent().getRouter().navTo("Detail", {
                    id: oEvent.getSource().getCustomData()[0].getValue()
                });
            },
        });
    });
