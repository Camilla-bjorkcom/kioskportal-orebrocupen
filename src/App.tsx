import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Router from "./Router";
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_fIWSfo7Qk",
  client_id: "548kqd0kgvkk1c52ika1q5uq7s",
  redirect_uri: "http://localhost:5173/tournaments",
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
