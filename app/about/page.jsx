'use client';
import React from 'react';
import { assets } from '@/public/assets/assets';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const AboutPage = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <Image
                src={assets.logo}
                alt="Matcha Logo"
                className="w-32 h-32 md:w-40 md:h-40"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-4">
              Toub Matcha
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the finest quality matcha products, carefully sourced and crafted for your wellness journey.
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 space-y-12">
            
            {/* Our Story */}
            <section>
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">Our Story</h2>
              <div className="prose prose-lg text-gray-700 space-y-4">
                <p>
                Welcome to Toub Matcha, where our journey began with a simple idea which is an e commerce 
                that allow matcha lover in Cambodia to find the right suitable matcha. 
                Founded in 2025, we set out to create a platform that would provide the best user experience to matcha lover in Cambodia. 
                What started as a passion project has grown into a community driven by a shared purpose.
                </p>

              </div>
            </section>

            {/* Our Mission */}
            <section>
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">Our Mission</h2>
              <div className="prose prose-lg text-gray-700 space-y-4">
                <p>
                Our mission is to provide the best service to Matcha Lover in Cambodia. 
                We believe in  innovation, quality, community. 
                These values are the foundation of everything we do and guide us in providing the best matcha e commerce website 
                that are both effective and meaningful.
                </p>
              </div>
            </section>

            {/* Why Choose Us */}
            <section>
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">Why Choose Matcha</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-green-700">Premium Quality</h3>
                  <p className="text-gray-700">
                    Every product is carefully selected and tested to ensure it meets our strict quality standards. 
                    We work directly with certified organic farms in Japan.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-green-700">Authentic Tradition</h3>
                  <p className="text-gray-700">
                    Our matcha comes from traditional tea gardens where the art of cultivation has been 
                    perfected over centuries of practice and dedication.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-green-700">Health Benefits</h3>
                  <p className="text-gray-700">
                    Rich in antioxidants, amino acids, and nutrients, our matcha products support your 
                    wellness journey with every sip.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-green-700">Sustainable Practices</h3>
                  <p className="text-gray-700">
                    We partner with farms that use sustainable growing methods, ensuring the environment 
                    is protected for future generations.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="border-t pt-8">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">Get in Touch</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-3 text-gray-700">
                    <p><strong>Email:</strong> contact@ToubMatcha.com</p>
                    <p><strong>Phone:</strong> +1-234-567-890</p>
                    <p><strong>Address:</strong> Kirirom Cambodia</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Business Hours</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
                    <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM</p>
                    <p><strong>Sunday:</strong> Closed</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Ready to Experience Premium Matcha?
            </h3>
            <p className="text-gray-600 mb-6">
              Explore our collection of authentic matcha products and start your wellness journey today.
            </p>
            <button 
              onClick={() => window.location.href = '/all-products'}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutPage;
