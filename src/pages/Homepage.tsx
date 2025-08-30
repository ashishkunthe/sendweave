import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white flex flex-col">
      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/10">
        <h1 className="text-2xl font-bold text-yellow-400">SendWeave</h1>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 text-sm font-medium text-white hover:text-yellow-400 transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-full text-sm hover:bg-yellow-500 transition"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center flex-grow px-6 py-20 text-center">
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Professional Email Automation
          <br />
          <span className="text-yellow-400">Simplified for Everyone</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-300 max-w-3xl mb-6 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          SendWeave enables businesses to design, schedule, and monitor{" "}
          <span className="text-indigo-300 font-semibold">
            automated email workflows
          </span>{" "}
          with an intuitive, drag-and-drop interface. Save time, engage
          customers, and measure performance with ease.
        </motion.p>

        {/* Trust Badge */}
        <motion.div
          className="mb-8 px-5 py-2 bg-green-500/20 text-green-300 font-medium rounded-full text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          Free to use – No credit card required
        </motion.div>

        <motion.div
          className="space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-yellow-400 text-black font-bold px-8 py-3 rounded-full text-lg shadow-lg hover:bg-yellow-500 transition"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 border border-white/30 rounded-full text-lg font-medium hover:bg-white/10 transition"
          >
            Explore Demo
          </button>
        </motion.div>
      </div>

      {/* Key Benefits */}
      <section className="py-16 bg-white/5 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-xl font-semibold mb-3 text-yellow-400">
              Time Efficiency
            </h3>
            <p className="text-gray-300">
              Automate recurring email tasks and free up your team to focus on
              growth.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3 text-pink-400">
              Higher Engagement
            </h3>
            <p className="text-gray-300">
              Personalized workflows lead to stronger customer connections and
              improved open rates.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3 text-indigo-400">
              Simple Interface
            </h3>
            <p className="text-gray-300">
              Visual builder designed for all users — no technical expertise
              required.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-12 text-yellow-400">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-2">1. Build Workflows</h3>
            <p className="text-gray-300 text-sm">
              Create flows visually using email and delay nodes to map your
              campaigns.
            </p>
          </div>
          <div className="bg-white/10 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-2">
              2. Schedule & Automate
            </h3>
            <p className="text-gray-300 text-sm">
              Define timings and automate delivery with precision and control.
            </p>
          </div>
          <div className="bg-white/10 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-2">3. Monitor Results</h3>
            <p className="text-gray-300 text-sm">
              Track campaign performance from a single dashboard with actionable
              insights.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white/5 backdrop-blur-lg text-center">
        <h2 className="text-3xl font-bold mb-12 text-pink-400">
          Trusted by Teams and Startups
        </h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-white/10 p-6 rounded-xl shadow-lg">
            <p className="italic text-gray-300">
              “SendWeave streamlined our entire outreach process. Our engagement
              rates improved significantly.”
            </p>
            <h4 className="mt-4 font-semibold">– Growth Lead, SaaS Startup</h4>
          </div>
          <div className="bg-white/10 p-6 rounded-xl shadow-lg">
            <p className="italic text-gray-300">
              “The visual builder is intuitive and reliable. It’s become an
              essential tool for our marketing team.”
            </p>
            <h4 className="mt-4 font-semibold">– Marketing Manager</h4>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-gray-400 text-sm text-center border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 gap-4">
          <p>© {new Date().getFullYear()} SendWeave. All rights reserved.</p>
          <div className="space-x-4">
            <a href="#" className="hover:text-white transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition">
              Terms
            </a>
            <a href="#" className="hover:text-white transition">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
