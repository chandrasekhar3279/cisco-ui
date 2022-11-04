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
});

export const constructDataFromStackURL = (data: any) => ({
  spec: {
    accountId: data?.awsAccountId,
    providerName: data?.cloudProvider,
    credentials: {
      assumeRole: [
        { roleARN: data.arn }
      ]
    }
  }
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
          (awsKeys: { secret: "string"; id: "string", adId: "string" }) => ({
            keyId: data?.cloudProvider === "GCP" ? undefined : awsKeys.id,
            key: awsKeys.secret,
            adId: data?.cloudProvider === "Azure" ? awsKeys.adId : undefined
          })
        )
        : ([
          {
            accountId: data?.access?.accountId,
            desc: data?.access?.description,
            name: data?.access?.accountName,
          },
        ]),
  },
});

export const constuctAWSData = (data: any) => ({
  spec: {
    // stackName: data?.access?.stackName,
    // cfaasAccountID: data?.access?.cfaasAccountID,
    // iamRoleName: data?.access?.iamRoleName,
    // region: data?.access?.region
  }
})

const poll = async function (fn: () => any, fnCondition: (arg0: any) => any, ms: number) {
  let result = await fn();
  while (fnCondition(result)) {
    await wait(ms);
    result = await fn();
  }
  return result;
};

const wait = function (ms = 1000) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};

const getStackName = (stackName: string) => request(urls.GET_CALL_STACK + stackName);
const validate = (result: { status: { createStackURL: any; }; }) => !result.status?.createStackURL;

export const addAccount = async (body: any, url?: string, method = "POST") => {
  try {
    const data = await request(url ? url : urls.ACCOUNT_DETAILS, {
      method,
      body: JSON.stringify(body),
    });

    if (url && !data?.status?.createStackURL) {
      const response = await poll(() => getStackName(data?.metadata?.id), validate, 3000);
      return response;
    }
    return data
  } catch (err) {
    return { error: body?.spec?.name || true }
  }
}
