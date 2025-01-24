import { User } from "oidc-client-ts";

const fetchWithAuth = async (path: string, init?: RequestInit): Promise<Response | undefined> => {
  try {
    const oidcStorage = sessionStorage.getItem(
      `oidc.user:https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_fIWSfo7Qk:548kqd0kgvkk1c52ika1q5uq7s`
    );

    if (!oidcStorage) {
      throw new Error("No auth token found");
    }

    const auth = User.fromStorageString(oidcStorage);

    const baseUrl = "https://zxilxqtzdb.execute-api.eu-north-1.amazonaws.com/prod/";
    console.log(`${baseUrl}${path}`)
    const response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${auth.id_token}`,
        ...(init?.headers || {}),
      },
    });

    // Return the response if successful
    return response;
  } catch (error) {
    console.log(error);
    return undefined; // In case of an error, return undefined
  }
};

export default fetchWithAuth;
