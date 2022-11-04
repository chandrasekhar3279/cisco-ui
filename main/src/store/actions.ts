export const COLLAPSE_MENU = '@able/COLLAPSE_MENU';
export const COLLAPSE_TOGGLE = '@able/COLLAPSE_TOGGLE';
export const CHANGE_LAYOUT = '@able/CHANGE_LAYOUT';
export const CHANGE_SUB_LAYOUT = '@able/CHANGE_SUB_LAYOUT';
export const LAYOUT_TYPE = '@able/LAYOUT_TYPE';
export const RESET = '@able/RESET';
export const NAV_BRAND_COLOR = '@able/NAV_BRAND_COLOR';
export const HEADER_BACK_COLOR = '@able/HEADER_BACK_COLOR';
export const RTL_LAYOUT = '@able/RTL_LAYOUT';
export const NAV_FIXED_LAYOUT = '@able/NAV_FIXED_LAYOUT';
export const HEADER_FIXED_LAYOUT = '@able/HEADER_FIXED_LAYOUT';
export const BOX_LAYOUT = '@able/BOX_LAYOUT';
export const NAV_CONTENT_LEAVE = '@able/NAV_CONTENT_LEAVE';
export const NAV_COLLAPSE_LEAVE = '@able/NAV_COLLAPSE_LEAVE';
export const SET_DATA_FOR_ADD_ACCOUNT = "@account/SET_DATA_FOR_ADD_ACCOUNT"
export const RESET_ACCOUNT_DATA = "@account/RESET_ACCOUNT_DATA"

export type ACTIONTYPE =
    | { type: typeof COLLAPSE_MENU }
    | { type: typeof COLLAPSE_TOGGLE; menu: { id: string; type: string } }
    | { type: typeof CHANGE_LAYOUT; layout: string }
    | { type: typeof CHANGE_SUB_LAYOUT; subLayout: string }
    | { type: typeof LAYOUT_TYPE; layoutType: string }
    | { type: typeof RESET }
    | { type: typeof NAV_BRAND_COLOR; payload: any }
    | { type: typeof HEADER_BACK_COLOR; headerBackColor: string }
    | { type: typeof RTL_LAYOUT }
    | { type: typeof NAV_FIXED_LAYOUT }
    | { type: typeof HEADER_FIXED_LAYOUT }
    | { type: typeof BOX_LAYOUT }
    | { type: typeof NAV_CONTENT_LEAVE }
    | { type: typeof NAV_COLLAPSE_LEAVE; menu: { id: string; type: string } }
    | { type: typeof SET_DATA_FOR_ADD_ACCOUNT; data: any; key: string }
    | { type: typeof RESET_ACCOUNT_DATA };
