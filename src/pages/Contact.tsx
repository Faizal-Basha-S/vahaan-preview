
import React from "react";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Contact = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 pt-24 max-w-5xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-primary flex items-center">
            <Home className="h-4 w-4 mr-1" />
            Home
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Contact Us</span>
        </div>

        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
          <div className="bg-white dark:bg-gray-900 shadow-sm rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Company Information */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
                <p className="text-muted-foreground">
                  We'd love to hear from you! Reach out to us with any questions, feedback, or concerns.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Company Name</h3>
                    <p className="text-muted-foreground">Matchorax Technologies Private Limited</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <a href="mailto:support@vahaanxchange.com" className="text-primary hover:underline">
                      admin@vahaanxchange.com
                    </a>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <a href="tel:+918883867155" className="text-primary hover:underline">
                      +91 810-810-4175
                    </a>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold">Address</h3>
                    <address className="not-italic text-muted-foreground">
                      Egattur, Chennai<br />
                      Tamil Nadu, India
                    </address>
                  </div>
                </div>
                
                <div className="pt-4">
                  <h3 className="font-semibold mb-2">Business Hours</h3>
                  <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-muted-foreground">Saturday: 10:00 AM - 4:00 PM</p>
                  <p className="text-muted-foreground">Sunday: Closed</p>
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Your Name
                    </label>
                    <Input 
                      id="name" 
                      name="name" 
                      placeholder="Enter your full name" 
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email Address
                    </label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      placeholder="Enter your email address" 
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-1">
                      Subject
                    </label>
                    <Input 
                      id="subject" 
                      name="subject" 
                      placeholder="What is this regarding?" 
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">
                      Message
                    </label>
                    <Textarea 
                      id="message" 
                      name="message" 
                      placeholder="How can we help you?" 
                      rows={5} 
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Submit Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
