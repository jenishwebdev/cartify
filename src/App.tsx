import { Navbar } from "./components/Navbar";
import { CartDrawer } from "./components/CartDrawer";
import { Home } from "./pages/Home";

function App() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <Home />
      <CartDrawer />
    </div>
  );
}

export default App;
