import {
  CognitoIdentityProviderClient,
  ChangePasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { useState } from "react";
import { useAuth } from "react-oidc-context";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const ChangePassword = () => {
  const [previousPassword, setPreviousPassword] = useState("");
  const [proposedPassword, setProposedPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const auth = useAuth();

  const handlePasswordChange = async () => {
    const client = new CognitoIdentityProviderClient({
      region: "eu-north-1",
    });

    const input = {
      PreviousPassword: previousPassword,
      ProposedPassword: proposedPassword,
      AccessToken: auth.user?.access_token,
    };

    const command = new ChangePasswordCommand(input);

    try {
      await client.send(command);
      setStatusMessage("Lösenordet har ändrats framgångsrikt!");
    } catch (error) {
      console.error("Error changing password:", error);
      setStatusMessage(
        "Misslyckades med att ändra lösenord. Kontrollera uppgifterna."
      );
    }
  };

  return (
    <div className="flex">
      <h2 className="font-semibold mr-2">Byt lösenord:</h2>
      <div className="flex flex-col">
        <label >
          Nuvarande lösenord
          <Input className="mt-2"
            type="password"
            value={previousPassword}
            onChange={(e) => setPreviousPassword(e.target.value)}
            placeholder="Ange ditt nuvarande lösenord"
          />
        </label>
        <br />
        <label>
          Nytt lösenord
          <Input className="mt-2"
            type="password"
            value={proposedPassword}
            onChange={(e) => setProposedPassword(e.target.value)}
            placeholder="Ange ett nytt lösenord"
          />
        </label>
        <br />
        <Button onClick={handlePasswordChange}>Ändra lösenord</Button>
        <p>{statusMessage}</p>
      </div>
    </div>
  );
};

export default ChangePassword;
