import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Router from "./Router";
import { AuthProvider } from "react-oidc-context";
import { cognitoAuthorityUrl, cognitoClientId } from "./api/functions/urls";
import { Toaster } from "./components/ui/toaster";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const cognitoAuthConfig = {
  authority: `${cognitoAuthorityUrl}`,
  client_id: `${cognitoClientId}`,
  redirect_uri: `${location.origin}/tournaments`,
  response_type: "code",
  scope: "email openid phone aws.cognito.signin.user.admin",
};
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider {...cognitoAuthConfig}>
        <Router />
        <Toaster />
        <ReactQueryDevtools />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
