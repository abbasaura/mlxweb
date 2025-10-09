import React from "react";

const services = [
  { title: "Enterprise Infrastructure", desc: "Data centers, networks, security solutions" },
  { title: "Cloud & Managed Services", desc: "Public cloud, virtualization, managed IT services" },
  { title: "Software Development", desc: "Web, mobile, ERP, CRM, BI dashboards" },
];

const Services = () => {
  return (
    <section id="services" className="services">
      <h3>Our Services</h3>
      {services.map((service, idx) => (
        <div key={idx} className="service-card">
          <h4>{service.title}</h4>
          <p>{service.desc}</p>
        </div>
      ))}
    </section>
  );
};

export default Services;
