export const inventoryURL = (path: string) =>
  `${import.meta.env.VITE_INVENTORY_URL}${path}`;

export const apiUrl = (path: string) =>
  `${import.meta.env.VITE_BASE_URL_API}${path}`;

export const cognitoUserUrl = `${import.meta.env.VITE_COGNITO_USER}`;

export const cognitoAuthorityUrl = `${import.meta.env.VITE_COGNITO_AUTHORITY}`;

export const cognitoClientId = `${import.meta.env.VITE_COGNITO_CLIENTID}`;
