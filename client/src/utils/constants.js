export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "api/auth";
export const SIGNUP_ROUTE = `${HOST}/${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${HOST}/${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${HOST}/${AUTH_ROUTES}/user-info`;
export const UPDATE_PROFILE = `${HOST}/${AUTH_ROUTES}/update-profile`
export const ADD_PROFILE_IMAGE = `${HOST}/${AUTH_ROUTES}/add-profile-image`
export const LOGOUT = `${HOST}/${AUTH_ROUTES}/logout`;

export const CONTACTS_ROUTES='api/contacts';
export const SEARCH_CONTACTS_ROUTES= `${HOST}/${CONTACTS_ROUTES}/search`;
export const GET_DM_CONTACTS_ROUTES= `${HOST}/${CONTACTS_ROUTES}/get-contacts-for-dm`;


export const MESSAGES_ROUTES = "api/messages";
export const GET_ALL_MESSAGES_ROUTE = `${HOST}/${MESSAGES_ROUTES}/get-messages`;

export const UPLOAD_FILE_ROUTE=`${HOST}/${MESSAGES_ROUTES}/upload-file`;