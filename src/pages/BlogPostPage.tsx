import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Tag, Share2, MessageCircle } from 'lucide-react';
import { BlogPost } from '../types';
import { api } from '../services/api';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      loadPost(slug);
    }
  }, [slug]);

  const loadPost = async (s: string) => {
    setLoading(true);
    try {
      const data = await api.getBlogPost(s);
      setPost(data);
    } catch (err: any) {
      setError(err.message || 'Article not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-xs text-[#a8a6af] font-mono">
        Loading article...
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-serif text-[#f5eedc]">Article Not Found</h1>
        <p className="text-xs text-[#8c8a94] mt-2">The requested story is no longer published or has moved.</p>
        <Link
          to="/blog"
          className="mt-6 px-5 py-2 text-xs uppercase tracking-wider text-[#c5a059] border border-[#c5a059]/40 rounded hover:bg-[#c5a059]/10"
        >
          Return to Journal
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-[#09090b] text-[#e4e2dd] pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#a8a6af] hover:text-[#c5a059] mb-8 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Journal</span>
        </Link>

        {/* Article Header */}
        <header className="space-y-4 pb-8 border-b border-[#1c1c28]">
          <span className="text-xs uppercase tracking-widest font-mono text-[#c5a059]">
            {post.category}
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-[#f5eedc] font-normal leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#71707d] font-mono pt-2">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>{post.publishedAt}</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>Written by {post.author}</span>
            </span>
          </div>
        </header>

        {/* Featured Cover Image */}
        {post.coverImage && (
          <div className="my-8 rounded-xl overflow-hidden aspect-[16/9] border border-[#21212d] bg-[#14141c]">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-invert max-w-none text-[#d6d4ce] text-base leading-relaxed space-y-6 font-light">
          {post.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="whitespace-pre-line leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Tags */}
        <div className="mt-12 pt-6 border-t border-[#1c1c28] flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#71707d] font-mono mr-2">Tags:</span>
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 text-[11px] bg-[#14141c] text-[#a8a6af] rounded border border-[#242434]"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Studio Consultation Banner */}
        <div className="mt-16 bg-[#111117] border border-[#21212d] rounded-xl p-8 text-center space-y-4">
          <h3 className="text-2xl font-serif text-[#f5eedc]">Planning Your Wedding in Janakpur?</h3>
          <p className="text-xs text-[#a8a6af] max-w-md mx-auto">
            Let our photography and film directors guide you through a seamless, cinematic experience.
          </p>
          <div className="pt-2">
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#c5a059] hover:bg-[#d4b470] text-[#09090b] text-xs uppercase tracking-wider font-semibold rounded"
            >
              Inquire With Our Studio
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};
