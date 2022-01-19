sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageBox"
], function (Controller, History, MessageBox) {
	"use strict";

	return Controller.extend("test.controller.controller.BaseController", {

		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},

		getModel: function (sName) {
			/*
			if (sName === undefined)
				sName = "offlineModel";
				*/
			return this.getView().getModel(sName);
		},

		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("Main", {}, true);
            }
        },

		onChangeLang: function (sId) {
			sap.ui.getCore().getConfiguration().setLanguage(sId.getParameter("id"));
		},

		showBusyIndicator: function (iDuration, iDelay) {
			sap.ui.core.BusyIndicator.show(iDelay);

			if (iDuration && iDuration > 0) {
				if (this._sTimeoutId) {
					jQuery.sap.clearDelayedCall(this._sTimeoutId);
					this._sTimeoutId = null;
				}

				this._sTimeoutId = jQuery.sap.delayedCall(iDuration, this, function () {
					this.hideBusyIndicator();
				});
			}
		},

		hideBusyIndicator: function () {
			sap.ui.core.BusyIndicator.hide();
		},

		getContentDensityClass: function () {
				if (sap.ui.Device.system.desktop) {
					return  "sapUiSizeCompact";
				} else {
					return "sapUiSizeCozy";
				}
		},

		setContentDensity: function () {
			this.getView().addStyleClass(this.getContentDensityClass());
		}
	});

});