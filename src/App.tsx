import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Router from "./Router";
import { AuthProvider } from "react-oidc-context";
import { cognitoAuthorityUrl, cognitoClientId } from "./api/functions/urls";

const cognitoAuthConfig = {
  authority: `${cognitoAuthorityUrl}`,
  client_id: `${cognitoClientId}`,
  redirect_uri: "d3eep4hnczz94h.cloudfront.net/tournaments",
  response_type: "code",
  scope: "email openid phone aws.cognito.signin.user.admin",
};
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider {...cognitoAuthConfig}> 
        <Router />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
