import urls from "constants/urls";
import request from "utils/request";


export const constructDataFromFile = (data: any) => ({
  spec: {
    accountId: data.credentials.accountId,
    desc: "",
    name: data?.name,
    providerName: data?.provider,
    accountCredentials:
      data.credentials
        ? [
          {
            key: data.credentials.key,
            keyId: data.credentials.keyId,
          }]

        : [],
  },
})

export const constructData = (data: any) => ({
  spec: {
    accountId: data?.access?.awsAccountId,
    desc: data?.access?.description,
    name: data?.access?.accountName || data?.access?.awsAccountId,
    providerName: data?.cloudProvider,
    accountCredentials:
      data?.access?.connectName === "accessKeys"
        ? data?.access?.credentials.map(
          (awsKeys: { secret: "string"; id: "string",adId: "string" }) => ({
            keyId:  data?.cloudProvider === "GCP" ? undefined : awsKeys.id,
            key: awsKeys.secret,
            adId: data?.cloudProvider === "Azure"? awsKeys.adId: undefined
          })
        )
        : [
          {
            accountId: data?.access?.accountId,
            desc: data?.access?.description,
            name: data?.access?.accountName,
          },
        ],
  },
});


export const addAccount = async (body: any) => {
  try {
    const data = await request(urls.ACCOUNT_DETAILS, {
      method: "POST",
      body: JSON.stringify(body),
    });
    return data
  } catch (err) {
    return { error: body?.spec?.name || true }
  }

}
