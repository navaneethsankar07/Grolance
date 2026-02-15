import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MoveLeft, Home, Sparkles } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  // Mouse Parallax Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 100, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 100, damping: 20 });

  const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);

  function handleMouseMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  return (
    <div 
      className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 overflow-hidden relative"
      onMouseMove={handleMouseMove}
    >
      {/* --- ANIMATED BACKGROUND ELEMENTS --- */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        
        {/* --- THE FLOATING AVATAR STACK --- */}
        <motion.div 
          style={{ rotateX, rotateY, perspective: 1000 }}
          className="relative mb-12"
        >
          {/* Main 404 Glass Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-64 h-80 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[40px] shadow-2xl flex flex-col items-center justify-center p-8 relative z-20"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-blue-400 p-1 mb-4 shadow-lg">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                alt="404 Avatar"
                className="w-full h-full rounded-full bg-white object-cover"
              />
            </div>
            <h1 className="text-6xl font-black text-slate-800 tracking-tighter">404</h1>
            <div className="h-1 w-12 bg-primary rounded-full mt-2" />
          </motion.div>

          {/* Floating Floating Orbs (Primary Colored) */}
          <motion.div 
            animate={{ y: [0, -40, 0], x: [0, 20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-12 w-20 h-20 bg-primary/20 backdrop-blur-md rounded-full border border-primary/30 flex items-center justify-center z-30"
          >
             <Sparkles className="text-primary w-8 h-8" />
          </motion.div>

          <motion.div 
            animate={{ y: [0, 30, 0], x: [0, -30, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/60 backdrop-blur-md rounded-3xl border border-white/80 shadow-xl flex items-center justify-center z-10 rotate-12"
          >
             <span className="text-slate-400 font-bold text-xl font-mono">NULL</span>
          </motion.div>
        </motion.div>

        {/* --- TEXT CONTENT --- */}
        <div className="text-center space-y-6 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Oops! You've drifted <span className="text-primary">off-course.</span>
            </h2>
            <p className="text-slate-500 mt-4 text-lg font-medium leading-relaxed">
              This page decided to take a permanent vacation. 
              Don't worry, even the best navigators get lost sometimes.
            </p>
          </motion.div>

          {/* --- BUTTONS --- */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 px-8 py-4 text-slate-600 font-bold hover:text-primary transition-colors"
            >
              <MoveLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Go Back
            </button>
            
            <button 
              onClick={() => navigate('/')}
              className="px-10 py-4 bg-primary text-white rounded-[20px] font-bold shadow-[0_20px_40px_-10px] shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-3"
            >
              <Home className="w-5 h-5" />
              Back to Safety
            </button>
          </motion.div>
        </div>
      </div>

      {/* Background Decorative Text */}
      <span className="absolute bottom-10 right-10 text-[180px] font-black text-slate-200/40 select-none pointer-events-none tracking-tighter">
        404
      </span>
    </div>
  );
};

export default NotFound;