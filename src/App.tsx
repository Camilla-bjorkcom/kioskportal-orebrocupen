import { SidebarProvider } from "./components/ui/sidebar";
import Router from "./Router";
// index.js
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_DqvuboDGo",
  client_id: "30hetn6sf551i9l54dlb3anvl1",
  redirect_uri: "http://localhost:5173/createtournament",
  response_type: "code",
  scope: "email openid phone aws.cognito.signin.user.admin",
};

function App() {
  return <AuthProvider {...cognitoAuthConfig} ><Router /></AuthProvider>;
}

export default App;
