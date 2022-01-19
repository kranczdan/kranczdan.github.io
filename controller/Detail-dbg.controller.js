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

        return Controller.extend("test.controller.Detail", {
            onInit: function () {
                this.getOwnerComponent().getRouter().getRoute("Detail").attachPatternMatched(this.onPatternMatched, this);
                this.setContentDensity();
            },

            onPatternMatched: function(oEvent){
                let sId = oEvent.getParameters().arguments.id;
                this.getView().bindElement("/insurances/" + sId);

                this.getView().setModel(new JSONModel({
                    firstName: null,
                    lastName: null,
                    phone: null,
                    email: null,
                    title: null,
                    comment: null
                }), "contact");
            },

            onPressed: function(){
                let oInput = this.getView().getModel("contact").getData();
                let bOk = true;

                if(!oInput.firstName){
                    this.getView().byId("inpFirstname").setValueState("Error");
                    this.getView().byId("inpFirstname").setValueStateText("Vorname bitte befüllen!");
                    bOk = false;
                }else{
                    this.getView().byId("inpFirstname").setValueState("None");
                }

                if(!oInput.lastName){
                    this.getView().byId("inpLastname").setValueState("Error");
                    this.getView().byId("inpLastname").setValueStateText("Nachname bitte befüllen!");
                    bOk = false;
                }else{
                    this.getView().byId("inpLastname").setValueState("None");
                }

                if(!oInput.email){
                    this.getView().byId("inpEmail").setValueState("Error");
                    this.getView().byId("inpEmail").setValueStateText("Mailadresse bitte befüllen!");
                    bOk = false;
                }else{
                    this.getView().byId("inpEmail").setValueState("None");
                }

                if(!oInput.title){
                    this.getView().byId("inpTitle").setValueState("Error");
                    this.getView().byId("inpTitle").setValueStateText("Titel bitte befüllen!");
                    bOk = false;
                }else{
                    this.getView().byId("inpTitle").setValueState("None");
                }

                if(!oInput.comment){
                    this.getView().byId("inpComment").setValueState("Error");
                    this.getView().byId("inpComment").setValueStateText("Nachricht bitte befüllen!");
                    bOk = false;
                }else{
                    this.getView().byId("inpComment").setValueState("None");
                }

                if(bOk){
                    sap.m.MessageBox.success("Vielen Dank für Ihre Anfrage! Wir werden uns in Kürze bei Ihnen melden!", {
                        title: "Kontaktformular erfolgreich abgesendet!"
                    });
                    this.getView().setModel(new JSONModel({
                        firstName: null,
                        lastName: null,
                        phone: null,
                        email: null,
                        title: null,
                        comment: null
                    }), "contact");
                }else{
                    sap.m.MessageToast.show("Bitte alle Pflichtfelder befüllen!");
                }
            }
        });
    });
