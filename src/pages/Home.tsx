import Header from "@/components/header";
import { useAuth } from "react-oidc-context";
import { ChevronRight } from "lucide-react";

function Home() {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = "30hetn6sf551i9l54dlb3anvl1";
    const logoutUri = "<logout uri>";
    const cognitoDomain =
      "https://eu-north-1dqvubodgo.auth.eu-north-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <div>
        <pre> Hello: {auth.user?.profile.email} </pre>
        <pre> ID Token: {auth.user?.id_token} </pre>
        <pre> Access Token: {auth.user?.access_token} </pre>
        <pre> Refresh Token: {auth.user?.refresh_token} </pre>

        <button onClick={() => auth.removeUser()}>Sign out</button>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div>
        <h1 className="text-5xl font-bold py-5 text-center text-slate-800">
          Välkommen tillbaka
        </h1>
        <div className="container mx-auto">
          <h2 className="text-3xl pt-5 text-slate-800">Logga in eller skapa ny användare </h2>
          <button
            className="flex items-center justify-center border border-solid text-slate-800 hover:bg-slate-800 hover:text-white rounded-xl p-2 mt-8 shadow"
            onClick={() => auth.signinRedirect()}
          >
            Fortsätt 
            
            <ChevronRight className="w-4 h-4 ml-3" />{" "}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;

// import Header from "@/components/header";
// import { LogInForm } from "@/components/LogInForm";

// const Home = () => {
//   return (
//     <>
//       <Header />
//       <div className="container mx-auto">
//         <h1 className="text-5xl font-bold py-5 text-center">
//           Välkommen tillbaka
//         </h1>
//         <h2 className="text-3xl pt-5">Logga in</h2>
//         <div className="">
//           <LogInForm />
//         </div>
//       </div>
//     </>
//   );
// };np

// export default Home;
// {/* <button onClick={() => signOutRedirect()}>Sign out</button> */}
// App.js
