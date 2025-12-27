
export default function ClientFooter() {
  return (
    <footer className="mt-5 border-t border-gray-300 bg-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-[37px] font-bold leading-7" style={{ fontFamily: 'MuseoModerno, sans-serif' }}>
              <span className="text-[#1A1A1A]">Gro</span>
              <span className="text-primary">lance</span>
            </h2>
            <p className=" text-sm font-medium text-black ml-8 " style={{ fontFamily: 'Murecho, sans-serif' }}>
              Your Craft, Your Crown.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-base font-bold text-[#1A1A1A]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Company
            </h3>
            <div className="flex flex-col gap-2">
              <button  className="text-sm font-bold text-gray-500 hover:text-gray-700 text-justify" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                About Us
              </button>
              <button  className="text-sm font-bold text-gray-500 hover:text-gray-700 text-justify" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Contact
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-base font-bold text-[#1A1A1A] " style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Support
            </h3>
            <div className="flex flex-col gap-2">
              <button  className="text-sm font-bold text-gray-500 hover:text-gray-700 text-justify" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                FAQs
              </button>
              <button className="text-sm font-bold text-gray-500 hover:text-gray-700 text-justify" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Dispute Resolution
              </button>
              <button  className="text-sm font-bold text-gray-500 hover:text-gray-700 text-justify" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Refund Policy
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-base font-bold text-[#1A1A1A] " style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Legal
            </h3>
            <div className="flex flex-col gap-2">
              <button  className="text-sm font-bold text-gray-500 hover:text-gray-700 text-justify" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Terms of Service
              </button>
              <button  className="text-sm font-bold text-gray-500 hover:text-gray-700 text-justify" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Privacy Policy
              </button>
              <p className="text-sm font-bold text-gray-500 text-justify" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Subscribe to our newsletter.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-gray-400 pt-6 md:flex-row">
          <p className="text-sm font-bold text-gray-500" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            © 2024 Freelancer. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18.7165 4.99992C18.0749 5.29159 17.3832 5.48325 16.6665 5.57492C17.3999 5.13325 17.9665 4.43325 18.2332 3.59159C17.5415 4.00825 16.7749 4.29992 15.9665 4.46659C15.3082 3.74992 14.3832 3.33325 13.3332 3.33325C11.3749 3.33325 9.77487 4.93325 9.77487 6.90825C9.77487 7.19159 9.8082 7.46659 9.86654 7.72492C6.89987 7.57492 4.2582 6.14992 2.49987 3.99159C2.19154 4.51659 2.01654 5.13325 2.01654 5.78325C2.01654 7.02492 2.64154 8.12492 3.6082 8.74992C3.01654 8.74992 2.46654 8.58325 1.9832 8.33325C1.9832 8.33325 1.9832 8.33325 1.9832 8.35825C1.9832 10.0916 3.21654 11.5416 4.84987 11.8666C4.54987 11.9499 4.2332 11.9916 3.9082 11.9916C3.6832 11.9916 3.4582 11.9666 3.24154 11.9249C3.69154 13.3583 5.01654 14.3749 6.57487 14.4083C5.3582 15.3749 3.81654 15.9416 2.1332 15.9416C1.84987 15.9416 1.56654 15.9249 1.2832 15.8916C2.86654 16.9083 4.74987 17.4999 6.76654 17.4999C13.3332 17.4999 16.9415 12.0499 16.9415 7.32492C16.9415 7.16659 16.9415 7.01658 16.9332 6.85825C17.6332 6.35825 18.2332 5.72492 18.7165 4.99992Z" />
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M15.8333 2.5H4.16667C3.24167 2.5 2.5 3.24167 2.5 4.16667V15.8333C2.5 16.75 3.25 17.5 4.16667 17.5H15.8333C16.75 17.5 17.5 16.75 17.5 15.8333V4.16667C17.5 3.24167 16.75 2.5 15.8333 2.5ZM7.08333 15H4.58333V8.33333H7.08333V15ZM5.83333 7.08333C5.50181 7.08333 5.18387 6.95164 4.94945 6.71722C4.71503 6.4828 4.58333 6.16485 4.58333 5.83333C4.58333 5.50181 4.71503 5.18387 4.94945 4.94945C5.18387 4.71503 5.50181 4.58333 5.83333 4.58333C6.16485 4.58333 6.4828 4.71503 6.71722 4.94945C6.95164 5.18387 7.08333 5.50181 7.08333 5.83333C7.08333 6.16485 6.95164 6.4828 6.71722 6.71722C6.4828 6.95164 6.16485 7.08333 5.83333 7.08333ZM15.4167 15H12.9167V11.25C12.9167 10.4583 12.7083 10 12.0833 10C11.4583 10 11.0417 10.4583 11.0417 11.25V15H8.54167V8.33333H11.0417V9.58333C11.4583 8.79167 12.2917 8.33333 13.3333 8.33333C14.7917 8.33333 15.4167 9.29167 15.4167 10.8333V15Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}