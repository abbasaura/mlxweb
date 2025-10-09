import React from "react";

function Hero() {
  return (
    <>
      <section style={{ padding: '50px', backgroundColor: '#ffe0b2', textAlign: 'center' }}>
        <h1>Welcome to Multilynx</h1>
        <p>Your trusted partner for tech solutions.</p>
      </section>

      <section style={{ padding: '50px', backgroundColor: '#b2dfdb', textAlign: 'center' }}>
        <h1>Our Services</h1>
        <p>We provide the best tech solutions for your business.</p>
        <a href="#contact">Get in Touch</a>
      </section>
    </>
  );
}

export default Hero;
