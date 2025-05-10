
import React from "react";
import Layout from "@/components/layout/Layout";

const AboutUs = () => {
  return (
    <Layout>
      <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-16">
        <h1 className="text-3xl font-bold text-primary mb-6">About Us</h1>

        <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          At VahaanXchange, we provide a simple, transparent, and secure digital platform that enables individuals to buy and sell vehicles directly—without involvement from intermediaries or external agents.
        </p>

        <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          With over 30 years of industry experience behind our vision, VahaanXchange is designed to empower people to handle their own vehicle transactions—whether it's a car, bike, scooter, or commercial vehicle.
        </p>

        <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          We are not a buyer, seller, or agent. We do not participate in transactions. Our role is to offer a technology-driven space where genuine buyers and sellers can connect, communicate, and carry out deals on their own terms.
        </p>

        <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          Our peer-to-peer platform helps users create listings, discover verified leads, and engage in direct conversations—while we ensure that the experience remains safe, secure, and user-controlled. A nominal platform fee is charged to maintain and enhance service quality.
        </p>

        <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          We are committed to a future where every individual has the power to manage their vehicle transactions with confidence, trust, and privacy.
        </p>

        <p className="mb-4 text-gray-800 dark:text-gray-200 font-semibold">
          VahaanXchange — A Platform for People, Powered by Trust.
        </p>

        <div className="mt-8 p-6 border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm">
          <p className="mb-2"><strong>Website:</strong> www.vahaanxchange.com</p>
          <p className="mb-2"><strong>Contact:</strong> 810-810-4175</p>
          <p><strong>Email:</strong> admin@vahaanxchange.com</p>
        </div>
      </div>
    </Layout>
  );
};

export default AboutUs;
