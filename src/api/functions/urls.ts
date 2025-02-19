

export const inventoryURL =  (path: string) => `${import.meta.env.VITE_INVENTORY_URL}${path}`;

export const apiUrl = (path:string) => `${import.meta.env.BASE_URL_API}${path}`
    
export const cognitoUserUrl = `${import.meta.env.COGNITO_USER}`
      