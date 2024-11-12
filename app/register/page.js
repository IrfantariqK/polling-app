/**
 * The Register component renders a RegisterForm component within a div element with specific styling.
 * @returns The Register component is being returned, which contains a div element with a class name of
 * "max-w-md mx-auto", a heading element with the text "Register", and the RegisterForm component.
 */

import RegisterForm from "@/components/RegisterForm";

export default function Register() {
  return (
    <div className="max-w-md mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Register</h1>
      <RegisterForm />
    </div>
  );
}
