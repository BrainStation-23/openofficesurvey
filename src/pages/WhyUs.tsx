
import { CircleDollarSign, CloudCog, Mail, Users, Infinity, LineChart, Lock, Server, ExternalLink, Check } from "lucide-react";

const WhyUs = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-24">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Enterprise Features Without Enterprise Costs
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Unlike traditional survey platforms that charge per user, our solution offers a one-time setup with zero recurring costs. Perfect for organizations of any size.
            </p>
          </div>
        </div>
      </section>

      {/* Cost Comparison Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Pay More When You Can Own Your Platform?
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
                <h3 className="text-xl font-semibold text-red-600 mb-4">Traditional Survey Platforms</h3>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-center">
                    <CircleDollarSign className="h-5 w-5 text-red-500 mr-2" />
                    $99-299/month base fee
                  </li>
                  <li className="flex items-center">
                    <Users className="h-5 w-5 text-red-500 mr-2" />
                    Additional $5-15 per user/month
                  </li>
                  <li className="flex items-center">
                    <Lock className="h-5 w-5 text-red-500 mr-2" />
                    Limited features on basic plans
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl shadow-md border border-blue-100">
                <h3 className="text-xl font-semibold text-blue-600 mb-4">Open Office Survey</h3>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-center">
                    <CircleDollarSign className="h-5 w-5 text-green-500 mr-2" />
                    One-time setup cost
                  </li>
                  <li className="flex items-center">
                    <Infinity className="h-5 w-5 text-green-500 mr-2" />
                    Unlimited users
                  </li>
                  <li className="flex items-center">
                    <LineChart className="h-5 w-5 text-green-500 mr-2" />
                    Scale as needed, when needed
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Tier Benefits */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Powerful Free Tier Infrastructure
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <CloudCog className="h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Backend Hosting</h3>
                <p className="text-gray-600 mb-4">
                  Hosted on Supabase's generous free tier, supporting up to 50,000 monthly active users with enterprise-grade PostgreSQL database.
                </p>
                <div className="space-y-2">
                  <p className="text-green-600 font-semibold">$0/month</p>
                  <a 
                    href="https://supabase.com/pricing" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    View Supabase Pricing <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <Users className="h-12 w-12 text-purple-500 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Frontend Hosting</h3>
                <p className="text-gray-600 mb-4">
                  Deploy on Vercel, Netlify, or similar platforms with their free tier offerings. Benefit from global CDN and automatic deployments.
                </p>
                <div className="space-y-2">
                  <p className="text-green-600 font-semibold">$0/month</p>
                  <div className="space-y-1">
                    <a 
                      href="https://vercel.com/pricing" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      Vercel Pricing <ExternalLink className="h-4 w-4" />
                    </a>
                    <a 
                      href="https://www.netlify.com/pricing/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      Netlify Pricing <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <Mail className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Your SMTP Server</h3>
                <p className="text-gray-600">
                  Use your own SMTP server for complete control over email communications. No additional email service costs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Self Hosting Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <Server className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-bold">Want Complete Control?</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Don't want to rely on managed free tier services? No problem! Our platform is built entirely with open-source technologies, meaning there's no vendor lock-in. Host everything on your own infrastructure:
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  Self-host PostgreSQL database on your servers
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  Deploy the frontend to your own web servers
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  Use your existing email infrastructure
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  Complete control over your data and infrastructure
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Scale Up Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Start Free, Scale When You Need
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Perfect for organizations with up to 50,000 monthly active users for free. 
              Need more? Scale up only when you need to - no pressure, no hidden charges.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhyUs;
