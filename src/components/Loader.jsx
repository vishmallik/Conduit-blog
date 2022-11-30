import "../stylesheets/_loader.css";
export default function Loader() {
  return (
    <div className="lds-ripple mx-auto mt-10 block min-h-screen py-16 text-center">
      <div></div>
      <div></div>
    </div>
  );
}
