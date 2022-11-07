import { BrowserRouter, Route, Switch } from "react-router-dom";
import Header from "./Header";
import Login from "./Login";
import Register from "./Register";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
