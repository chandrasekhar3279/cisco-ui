import * as actionTypes from './actions';

import { ACTIONTYPE } from './actions';

interface CredentialsProps {
    id?: string, secret?: string, valid?: boolean, edit?: boolean
}


export const initialState = {
    accountDetails: {
        "accountName": "" as string,
        "description": "" as string,
        "accountType": "iam-user" as string,
        "email": "" as string,
        "password": "" as string,
        "awsAccountId": "" as string,
        "awsIAMUser": "" as string,
        "awsIAMPassword": "" as string
    },
    access: {
        connectName: "" as string,
        accountName: "" as string,
        description: "" as string,
        accountType: "rootUser" as string,
        email: "" as string,
        password: "" as string,
        awsAccountId: "" as string,
        awsIAMUser: "" as string,
        awsIAMPassword: "" as string,
        credentials: [{ id: '', secret: '', valid: false, edit: false }] as CredentialsProps[]
    },
    cloudProvider: "" as string,

};

const accountReducer = (state = { ...initialState }, action: ACTIONTYPE) => {
    switch (action.type) {
        case actionTypes.SET_DATA_FOR_ADD_ACCOUNT:
            return {
                ...state,
                [action["key"]]: action.data

            };
        case actionTypes.RESET_ACCOUNT_DATA:
            console.log(state, "final values")
            return {
                ...initialState
            };
        default:
            return state;
    }
};

export default accountReducer;
