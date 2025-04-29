import React, { useState, FormEvent, ChangeEvent } from "react";
import { Send, Mail, User, MessageSquare, AlertCircle } from "lucide-react";

interface FormData {
  email: string;
  message: string;
}

interface FormErrors {
  email?: string;
  message?: string;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    message: ""
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const isValid = validateForm();
    
    if (isValid) {
      console.log("Form submitted:", formData);
      fetch(`${API_BASE}/api/notification/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formData.email,
          body: formData.message
        })
      }).then(response => {
        if (!response.ok) {
          console.error(`Error submitting form data: ${response.status}`)
          alert("Something went wrong please again try later.")
        } else {
          setSubmitted(true);
        }
      })
    }
  };
  
  return (
    <div className="flex justify-center items-center w-full md:p-6">
      <div className="bg-gray-900 rounded-3xl text-white p-8 shadow-xl w-full max-w-2xl border border-gray-800">
        <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
        
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>          
          <div className="space-y-2">
            <label className="text-gray-300 text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`bg-gray-800 rounded-xl py-3 px-10 w-full border ${errors.email ? 'border-red-500' : 'border-gray-700'} focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition`}
                placeholder="your@email.com"
              />
            </div>
            {errors.email && (
              <div className="flex items-center gap-1 text-red-400 text-sm mt-1">
                <AlertCircle size={14} />
                <span>{errors.email}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-gray-300 text-sm font-medium">Message</label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 text-gray-400" size={18} />
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                className={`bg-gray-800 rounded-xl py-3 px-10 w-full min-h-32 border ${errors.message ? 'border-red-500' : 'border-gray-700'} focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition`}
                placeholder="How can we help you?"
              />
            </div>
            {errors.message && (
              <div className="flex items-center gap-1 text-red-400 text-sm mt-1">
                <AlertCircle size={14} />
                <span>{errors.message}</span>
              </div>
            )}
          </div>
          
          <button 
            type="submit" 
            className="bg-accent hover:bg-indigo-600 w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors duration-300"
          >
            <span>Send Message</span>
            <Send size={18} />
          </button>
          
          {submitted && Object.keys(errors).length === 0 && (
            <div className="bg-green-800 bg-opacity-25 border border-green-700 text-green-400 p-3 rounded-lg text-sm text-center">
              Message sent successfully!
            </div>
          )}
        </form>
        
        <div className="mt-6 pt-6 border-t border-gray-800 text-center text-gray-400 text-sm">
          We'll get back to you within 24 hours
        </div>
      </div>
    </div>
  );
};

export default ContactUs;