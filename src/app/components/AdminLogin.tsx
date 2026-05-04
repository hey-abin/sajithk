import { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, User } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (password: string) => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E8E8E8] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2rem] p-10 shadow-2xl shadow-[#0EA5E9]/10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#0EA5E9] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-[#0EA5E9]/20">
            <Lock className="text-white w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black tracking-tighter uppercase">Admin Access</h2>
          <p className="text-[#2D2D2D]/50 mt-2 font-medium">Enter your credentials to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D2D2D]/30" size={20} />
            <input
              type="text"
              placeholder="Username"
              defaultValue="admin"
              disabled
              className="w-full pl-12 pr-4 py-4 bg-[#E8E8E8]/50 border-2 border-transparent rounded-2xl focus:border-[#0EA5E9] focus:bg-white transition-all outline-none font-bold"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D2D2D]/30" size={20} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-[#E8E8E8]/50 border-2 border-transparent rounded-2xl focus:border-[#0EA5E9] focus:bg-white transition-all outline-none font-bold"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="w-full py-4 bg-[#0EA5E9] text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[#0EA5E9]/20 hover:bg-[#2D2D2D] transition-all"
          >
            Sign In
          </button>
        </form>
      </motion.div>
    </div>
  );
}
