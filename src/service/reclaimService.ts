import { ReclaimProofRequest } from "@reclaimprotocol/js-sdk";
 
type OnSuccessCallback = (proofs: any) => void
type OnErroeCallback = (proofs: any) => void

export const initializeReclaimSession = async(
    onSuccess: OnSuccessCallback,
    onError: OnErroeCallback
): Promise<string> => {
    const APP_ID = import.meta.env.VITE_RECAIM_ID
    const APP_SECRET = import.meta.env.VITE_RECLAM_APP_SECRET
    const PROVIDER_ID = import.meta.env.VITE_RECLAM_PROVIDER_ID

    try{
        const reclaimClient = await ReclaimProofRequest.init(APP_ID, APP_SECRET, PROVIDER_ID)

        const url = await reclaimClient.getRequestUrl()

        reclaimClient.startSession({
            onSuccess: (proofs) => onSuccess(proofs),
            onError: (error) => onError(error),
        })

        return url
    }catch(error){
        console.error("Service: Error")
        throw error
    }
}