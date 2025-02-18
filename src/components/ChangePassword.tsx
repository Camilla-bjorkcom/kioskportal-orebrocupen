import { useState } from "react";
import { useAuth } from "react-oidc-context";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CognitoIdentityProviderClient,
  ChangePasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const ChangePassword = () => {
  const [previousPassword, setPreviousPassword] = useState("");
  const [proposedPassword, setProposedPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");
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
      setStatusType("success");
      hideMessageAfterTimeout();
    } catch (error) {
      console.error("Error changing password:", error);
      setStatusMessage(
        "Misslyckades med att ändra lösenord. Kontrollera uppgifterna."
      );
      setStatusType("error");
      hideMessageAfterTimeout();
    }
  };

  const hideMessageAfterTimeout = () => {
    setTimeout(() => {
      setStatusMessage("");
      setStatusType("");
    }, 10000);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="dark:bg-slate-900 dark:hover:bg-slate-800"
        >
          Byt lösenord
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Byt lösenord</SheetTitle>
          <SheetDescription>
            Ange ditt nuvarande och nya lösenord.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="current-password" className="text-right">
              Nuvarande lösenord
            </Label>
            <Input
              id="current-password"
              type="password"
              value={previousPassword}
              onChange={(e) => setPreviousPassword(e.target.value)}
              placeholder="Ange ditt nuvarande lösenord"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-password" className="text-right">
              Nytt lösenord
            </Label>
            <Input
              id="new-password"
              type="password"
              value={proposedPassword}
              onChange={(e) => setProposedPassword(e.target.value)}
              placeholder="Ange ett nytt lösenord"
              className="col-span-3"
            />
          </div>
        </div>
        {statusMessage && (
          <p
            className={`mt-4 ${
              statusType === "success"
                ? "text-green-500"
                : statusType === "error"
                ? "text-red-500"
                : ""
            }`}
          >
            {statusMessage}
          </p>
        )}
        <SheetFooter>
          <SheetClose asChild>
            <Button onClick={handlePasswordChange}>Ändra lösenord</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ChangePassword;
