import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCcw, Home, ShieldCheck } from 'lucide-react';

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false });
    window.location.href = "/"; 
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute w-[500px] h-[500px] bg-primary rounded-full blur-[120px] -z-10"
          />

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-white relative"
          >
            <div className="absolute -top-10 left-1/2 -translate-x-1/2">
              <div className="w-20 h-20 bg-primary rounded-3xl shadow-xl shadow-primary/30 flex items-center justify-center text-white">
                <AlertTriangle size={40} />
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                System <span className="text-primary">Interrupt</span>
              </h1>
              
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p className="text-sm font-mono text-slate-500 break-words italic">
                  Error: {this.state.error?.message || "Unexpected runtime exception"}
                </p>
              </div>

              <p className="text-slate-600 font-medium">
                Our core protocol encountered an unhandled exception. Don't worry, your data is safe.
              </p>

              <div className="flex flex-col gap-3 pt-4">
                <button 
                  onClick={this.handleReset}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <RefreshCcw size={18} />
                  Restart Session
                </button>
                
                <button 
                  onClick={() => window.location.reload()}
                  className="w-full py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <ShieldCheck size={18} className="text-primary" />
                  Attempt Hot-Fix
                </button>
              </div>
            </div>
          </motion.div>

          <p className="mt-12 text-slate-400 font-mono text-xs uppercase tracking-widest">
            Security Protocol: Active // Grolance_Shield_v1.0
          </p>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default GlobalErrorBoundary;