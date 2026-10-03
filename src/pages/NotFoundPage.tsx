import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Camera } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#09090b] text-[#e4e2dd] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#161622] border border-[#2b2b3c] flex items-center justify-center text-[#c5a059] mx-auto">
          <Camera className="w-8 h-8" />
        </div>
        <span className="text-xs uppercase tracking-widest text-[#c5a059] font-mono">
          404 · Page Not Found
        </span>
        <h1 className="text-3xl font-serif text-[#f5eedc]">
          Moment Out of Frame
        </h1>
        <p className="text-xs text-[#a8a6af] leading-relaxed font-light">
          The page or gallery link you are looking for has been moved or does not exist.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#c5a059] hover:bg-[#d4b470] text-[#09090b] text-xs font-semibold uppercase tracking-wider rounded transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Studio Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
