import { Link } from "react-router-dom"
import { Button } from "../ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-50 animate-[slideDown_0.5s_ease-out]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white animate-[pulse_2s_ease-in-out_infinite]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">RespiScope</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16 animate-[fadeIn_0.8s_ease-out]">
          <h2 className="text-5xl font-bold text-gray-900 mb-4 animate-[slideUp_0.6s_ease-out]">
            Welcome to <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">RespiScope Portal</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-[slideUp_0.8s_ease-out]">
            Your comprehensive healthcare management system. Access patient records, medical history, and AI-powered
            diagnostics all in one secure platform.
          </p>
        </div>

        {/* Login Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Doctor Login Card */}
          <Card className="group hover:shadow-2xl transition-all duration-500 border-2 hover:border-green-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm animate-[slideRight_0.6s_ease-out] overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="text-center pb-4 relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                <svg className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <CardTitle className="text-2xl text-green-700 group-hover:text-green-800 transition-colors duration-300">Healthcare Provider</CardTitle>
            </CardHeader>
            <CardContent className="text-center relative z-10">
              <p className="text-gray-600 mb-6 group-hover:text-gray-700 transition-colors duration-300">
                Access patient records, update medical information, and utilize AI diagnostic tools to provide the best
                care for your patients.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-500 group-hover:translate-x-2 transition-transform duration-300">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Full patient record access
                </div>
                <div className="flex items-center text-sm text-gray-500 group-hover:translate-x-2 transition-transform duration-300 delay-75">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  AI-powered diagnostics
                </div>
                <div className="flex items-center text-sm text-gray-500 group-hover:translate-x-2 transition-transform duration-300 delay-150">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Medical history management
                </div>
              </div>
              <Link to="/doctor-login" className="block">
                <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Login as Doctor
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Patient Login Card */}
          <Card className="group hover:shadow-2xl transition-all duration-500 border-2 hover:border-blue-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm animate-[slideLeft_0.6s_ease-out] overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="text-center pb-4 relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                <svg className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <CardTitle className="text-2xl text-blue-700 group-hover:text-blue-800 transition-colors duration-300">Patient</CardTitle>
            </CardHeader>
            <CardContent className="text-center relative z-10">
              <p className="text-gray-600 mb-6 group-hover:text-gray-700 transition-colors duration-300">
                View your medical records, track your health progress, and access your diagnostic reports in a secure,
                easy-to-use interface.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-500 group-hover:translate-x-2 transition-transform duration-300">
                  <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Personal health records
                </div>
                <div className="flex items-center text-sm text-gray-500 group-hover:translate-x-2 transition-transform duration-300 delay-75">
                  <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Test results & reports
                </div>
                <div className="flex items-center text-sm text-gray-500 group-hover:translate-x-2 transition-transform duration-300 delay-150">
                  <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Secure access anywhere
                </div>
              </div>
              <Link to="/patient-login" className="block">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Login as Patient
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-20 text-center animate-[fadeIn_1s_ease-out]">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Why Choose RespiScope Portal?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center group animate-[fadeIn_1.2s_ease-out] hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                <svg className="w-7 h-7 text-purple-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors duration-300">Secure & Private</h4>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">HIPAA-compliant security ensures your medical data stays protected</p>
            </div>
            <div className="flex flex-col items-center group animate-[fadeIn_1.4s_ease-out] hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                <svg className="w-7 h-7 text-orange-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-700 transition-colors duration-300">AI-Powered</h4>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Advanced AI diagnostics help healthcare providers make better decisions</p>
            </div>
            <div className="flex flex-col items-center group animate-[fadeIn_1.6s_ease-out] hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                <svg className="w-7 h-7 text-teal-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-teal-700 transition-colors duration-300">Easy to Use</h4>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Intuitive interface designed for both patients and healthcare providers</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-50 to-gray-100 border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 RespiScope Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideRight {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideLeft {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}

export default Landing