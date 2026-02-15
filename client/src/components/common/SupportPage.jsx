import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createSupportTicket } from "./commonApi"; 

export default function SupportPage() {
  const user = useSelector((state) => state.auth.user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.full_name ? user?.full_name : "",
    email: user?.email || "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject.trim() || !formData.message.trim()) {
      return toast.error("Please fill in all required fields");
    }

    setIsSubmitting(true);
    try {
      const payload = {
        subject: formData.subject,
        message: formData.message,
      };

      await createSupportTicket(payload);
      
      toast.success("Support ticket created successfully!");
      setFormData((prev) => ({
        ...prev,
        subject: "",
        message: "",
      }));
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.response?.data?.message || "Failed to send message";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="bg-white border-b border-[#F3F4F6]">
        <div className="max-w-[1085px] mx-auto px-6 py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 max-w-[495px]">
              <h1 className="text-[31px] font-bold leading-[40px] text-[#111827] mb-4">
                Contact Support
              </h1>
              <p className="text-[15px] leading-[28px] text-[#4B5563]">
                Facing an issue? Send us a message and our team will get back to
                you. You will receive our response directly to your registered email address.
              </p>
            </div>

            <div className="flex-shrink-0">
              <div className="w-64 h-64 rounded-2xl bg-[#DEDEDE] flex items-center justify-center">
                <svg
                  width="128"
                  height="128"
                  viewBox="0 0 128 128"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M112 80C112 82.829 110.876 85.5421 108.876 87.5425C106.875 89.5429 104.162 90.6667 101.333 90.6667H37.3333L16 112V26.6667C16 23.8377 17.1238 21.1246 19.1242 19.1242C21.1246 17.1238 23.8377 16 26.6667 16H101.333C104.162 16 106.875 17.1238 108.876 19.1242C110.876 21.1246 112 23.8377 112 26.6667V80Z"
                    stroke="#3B82F6"
                    strokeOpacity="0.5"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1085px] mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="bg-white rounded-2xl border border-[#F3F4F6] shadow-sm p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="fullName"
                      className="text-[12px] font-medium leading-5 text-[#374151]"
                    >
                      Full Name
                    </label>
                    <input
                      disabled
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      className="h-[50px] px-[17px] py-[13px] rounded-lg border border-[#E5E7EB] bg-[#F3F4F6] text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="email"
                      className="text-[12px] font-medium leading-5 text-[#374151]"
                    >
                      Email Address
                    </label>
                    <input
                      disabled
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      className="h-[50px] px-[17px] py-[13px] rounded-lg border border-[#E5E7EB] bg-[#F3F4F6] text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="subject"
                    className="text-[12px] font-medium leading-5 text-[#374151]"
                  >
                    Subject
                  </label>
                  <input
                    required
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Brief description of your issue"
                    className="h-[50px] px-[17px] py-[13px] rounded-lg border border-[#E5E7EB] bg-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="message"
                    className="text-[12px] font-medium leading-5 text-[#374151]"
                  >
                    Message
                  </label>
                  <textarea
                    required
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Please describe your issue in detail..."
                    rows={6}
                    className="px-[17px] py-[13px] rounded-lg border border-[#E5E7EB] bg-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-[50px] px-8 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center min-w-[160px]"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                  <p className="text-[11px] text-[#6B7280] italic">
                    * To ensure quality support, you can have a maximum of 5 active support tickets at a time.
                  </p>
                </div>
              </form>
            </div>
          </div>

          <div className="lg:w-[324px] space-y-6">
            <div className="bg-white rounded-2xl border border-[#F3F4F6] shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.99984 18.3332C14.6022 18.3332 18.3332 14.6022 18.3332 9.99984C18.3332 5.39746 14.6022 1.6665 9.99984 1.6665C5.39746 1.6665 1.6665 5.39746 1.6665 9.99984C1.6665 14.6022 5.39746 18.3332 9.99984 18.3332Z"
                      stroke="#3B82F6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 5V10L13.3333 11.6667"
                      stroke="#3B82F6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-[14px] font-semibold leading-6 text-[#111827]">
                  Response Time
                </h3>
              </div>
              <p className="text-[12px] leading-5 text-[#4B5563]">
                We typically respond within{" "}
                <span className="font-semibold text-[#111827]">24 hours</span>{" "}
                during business days.
              </p>
            </div>

            <div className="bg-[#F0F9FF] rounded-2xl border border-[#B9E6FE] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0 border border-[#B9E6FE]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 6L12 13L2 6" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-[14px] font-semibold leading-6 text-[#0369A1]">
                  Email Updates
                </h3>
              </div>
              <p className="text-[12px] leading-5 text-[#0369A1]">
                Keep an eye on your inbox. All status updates and replies will be sent to <strong>{formData.email}</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}