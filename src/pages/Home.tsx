import Header from "@/components/header";
import { LogInForm } from "@/components/LogInForm";

const Home = () => {
  return (
    <>
      <Header />
      <div className="container mx-auto">
        <h1 className="text-5xl font-bold py-5 text-center">
          Välkommen tillbaka
        </h1>
        <h2 className="text-3xl pt-5">Logga in</h2>
        <div className="">
          <LogInForm />
        </div>        
      </div>
    </>
  );
};

export default Home;
