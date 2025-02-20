import { User } from "oidc-client-ts";
import { apiUrl, cognitoUserUrl } from "./urls";

const fetchWithAuth = async (
  path: string,
  init?: RequestInit
): Promise<Response | undefined> => {
  try {
    const oidcStorage = sessionStorage.getItem(
      `oidc.user:${cognitoUserUrl}`
    );

    console.log(cognitoUserUrl)
    if (!oidcStorage) {
      throw new Error("No auth token found");
    }

    const auth = User.fromStorageString(oidcStorage);

    const baseUrl = apiUrl(path);
    console.log(`${baseUrl}`)
    const response = await fetch(`${baseUrl}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${auth.id_token}`,
        ...(init?.headers || {}),
      },
    });

    return response;
  } catch (error) {
    console.log(error);
    return undefined; 
  }
};

export default fetchWithAuth;
