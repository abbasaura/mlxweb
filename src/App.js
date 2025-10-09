import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <div style={{ backgroundColor: '#e0f7fa', minHeight: '100vh' }}>
      <div className="app">
        <Header />
        <Hero />
        <Services />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}

export default App;
