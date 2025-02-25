import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Router from "./Router";
import { AuthProvider } from "react-oidc-context";
import { cognitoAuthorityUrl, cognitoClientId } from "./api/functions/urls";
import { Toaster } from "./components/ui/toaster";

const cognitoAuthConfig = {
  authority: `${cognitoAuthorityUrl}`,
  client_id: `${cognitoClientId}`,
  redirect_uri: `${location.origin}/tournaments`,
  response_type: "code",
  scope: "email openid phone aws.cognito.signin.user.admin",
};
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider {...cognitoAuthConfig}>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
