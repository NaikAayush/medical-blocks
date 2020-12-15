/**
* Send invoice to an insurance provider
* @param {orange.medicalblocks.SendInvoice} sendInvoice
* @transaction
*/
async function sendInvoice(sendInvoice) {
	sendInvoice.invoice.currentProvider = sendInvoice.newProvider
  	let assetRegistry = await getAssetRegistry('orange.medicalblocks.Invoice');
 	await assetRegistry.update(sendInvoice.invoice);
}

/**
* Grant Access to medical and insurance recrods
* @param {orange.medicalblocks.GrantAccess} grantAccess
* @transaction
*/
async function grantAccessToRecord(grantAccess) {
	if (grantAccess.mRecord != null) {
    	if (grantAccess.hospital != null) {
          	if (!grantAccess.mRecord.hospitalsWithAccess) {
            	grantAccess.mRecord.hospitalsWithAccess = [grantAccess.hospital];
            } else {
        		grantAccess.mRecord.hospitalsWithAccess.push(grantAccess.hospital);
            }
        }
    	if (grantAccess.iProvider != null) {
          	if (!grantAccess.mRecord.providersWithAccess) {
            	grantAccess.mRecord.providersWithAccess = [grantAccess.iProvider];
            } else {
        		grantAccess.mRecord.providersWithAccess.push(grantAccess.iProvider);
            }
        }
        if (grantAccess.dCenter != null) {
          	if (!grantAccess.mRecord.dCentersWithAccess) {
            	grantAccess.mRecord.dCentersWithAccess = [grantAccess.dCenter];
            } else {
        		grantAccess.mRecord.dCentersWithAccess.push(grantAccess.dCenter);
            }
        }
        let assetRegistry = await getAssetRegistry('orange.medicalblocks.MedicalRecord');
        await assetRegistry.update(grantAccess.mRecord);
    }
  	if (grantAccess.iRecord != null) {
    	if (grantAccess.hospital != null) {
          	if (!grantAccess.iRecord.hospitalsWithAccess) {
            	grantAccess.iRecord.hospitalsWithAccess = [grantAccess.hospital];
            } else {
        		grantAccess.iRecord.hospitalsWithAccess.push(grantAccess.hospital);
            }
        }
    	if (grantAccess.iProvider != null) {
        	// TODO: return error here
          	console.log("Cannot provide insurance details to another provider");
        }
        if (grantAccess.dCenter != null) {
          	if (!grantAccess.iRecord.dCentersWithAccess) {
            	grantAccess.iRecord.dCentersWithAccess = [grantAccess.dCenter];
            } else {
        		grantAccess.iRecord.dCentersWithAccess.push(grantAccess.dCenter);
            }
        }
        let assetRegistry = await getAssetRegistry('orange.medicalblocks.InsuranceRecord');
        await assetRegistry.update(grantAccess.iRecord);
    }
}

/**
* Remove Access from medical or insurance recrods
* @param {orange.medicalblocks.RemoveAccess} removeAccess
* @transaction
*/
async function removeAccessFromRecord(grantAccess) {
	if (grantAccess.mRecord != null) {
    	if (grantAccess.hospital != null) {
          	if (!grantAccess.mRecord.hospitalsWithAccess) {
            	// TODO: throw error
              	console.log("Cannot remove because it does not exist");
            } else {
        		grantAccess.mRecord.hospitalsWithAccess = grantAccess.mRecord.hospitalsWithAccess.filter((item) => item !== grantAccess.hospital);
            }
        }
    	if (grantAccess.iProvider != null) {
          	if (!grantAccess.mRecord.providersWithAccess) {
            	// TODO: throw error
              	console.log("Cannot remove because it does not exist");
            } else {
                grantAccess.mRecord.providersWithAccess = grantAccess.mRecord.providersWithAccess.filter((item) => item !== grantAccess.iProvider);
            }
        }
        if (grantAccess.dCenter != null) {
          	if (!grantAccess.mRecord.dCentersWithAccess) {
            	// TODO: throw error
              	console.log("Cannot remove because it does not exist");
            } else {
                grantAccess.mRecord.dCentersWithAccess = grantAccess.mRecord.dCentersWithAccess.filter((item) => item !== grantAccess.dCenter);
            }
        }
        let assetRegistry = await getAssetRegistry('orange.medicalblocks.MedicalRecord');
        await assetRegistry.update(grantAccess.mRecord);
    }
  	if (grantAccess.iRecord != null) {
    	if (grantAccess.hospital != null) {
          	if (!grantAccess.iRecord.hospitalsWithAccess) {
            	// TODO: throw error
              	console.log("Cannot remove because it does not exist");
            } else {
                grantAccess.iRecord.hospitalsWithAccess = grantAccess.mRecord.hospitalsWithAccess.filter((item) => item !== grantAccess.hospital);
            }
        }
    	if (grantAccess.iProvider != null) {
        	// TODO: return error here
          	console.log("Cannot provide insurance details to another provider");
        }
        if (grantAccess.dCenter != null) {
          	if (!grantAccess.iRecord.dCentersWithAccess) {
            	// TODO: throw error
              	console.log("Cannot remove because it does not exist");
            } else {
                grantAccess.iRecord.dCentersWithAccess = grantAccess.mRecord.dCentersWithAccess.filter((item) => item !== grantAccess.dCenter);
            }
        }
        let assetRegistry = await getAssetRegistry('orange.medicalblocks.InsuranceRecord');
        await assetRegistry.update(grantAccess.iRecord);
    }
}
