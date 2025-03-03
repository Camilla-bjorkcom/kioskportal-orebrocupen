import { NoResponseError } from "./apiErrors";
import fetchWithAuth from "./fetchWithAuth";

export const uploadImageFile = async (
  fileName: string,
  fileContent: string | undefined,
  tournamentId: string
) => {
  const response = await fetchWithAuth(`tournaments/${tournamentId}/logo`, {
    method: "PUT",
    body: JSON.stringify({
      fileName: fileName,
      fileContent: fileContent,
    }),
    headers: { "Content-Type": "application/json" },
  });

  if (!response) throw new NoResponseError("No response from server");

  return await response.json();
};
