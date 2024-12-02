import Header from "@/components/header"
import { SignUpForm } from "@/components/SignUpForm"


const SignUpPage = () => {
  return (
    <>
    <Header />
    <div className="container mx-auto">
      <h2 className="text-3xl pt-5">Skapa användare</h2>
      <div className="">
        <SignUpForm />
      </div>        
    </div>
  </>
  )
}

export default SignUpPage