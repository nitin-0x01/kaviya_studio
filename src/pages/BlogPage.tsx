import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Tag, BookOpen } from 'lucide-react';
import { BlogPost } from '../types';
import { api } from '../services/api';

export const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadPosts();
  }, [selectedCategory]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await api.getBlogPosts(selectedCategory === 'all' ? undefined : selectedCategory);
      setPosts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'Traditions', 'Guides', 'Behind the Scenes', 'Weddings'];

  return (
    <div className="min-h-screen bg-[#09090b] text-[#e4e2dd] pt-28 pb-24">
      {/* Header */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-12">
        <span className="text-xs uppercase tracking-[0.3em] text-[#c5a059] font-mono">
          Journal & Stories
        </span>
        <h1 className="text-4xl sm:text-6xl font-serif text-[#f5eedc] mt-3 font-normal leading-tight">
          Wedding Traditions, Guides & Behind-the-Scenes
        </h1>
        <p className="mt-4 text-base text-[#a8a6af] font-light max-w-2xl mx-auto leading-relaxed">
          Expert insights, cultural guides for Maithili and Hindu rituals, and inspiration for
          couples planning weddings in Janakpur and across Nepal.
        </p>

        {/* Filter categories */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 text-xs uppercase tracking-wider font-medium rounded transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#c5a059] text-[#09090b] font-semibold'
                  : 'bg-[#14141d] text-[#8c8a94] hover:text-[#f5eedc] border border-[#232332]'
              }`}
            >
              {cat === 'all' ? 'All Articles' : cat}
            </button>
          ))}
        </div>
      </section>

      {/* Blog Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="py-24 text-center text-xs text-[#71707d] font-mono">
            Loading journal stories...
          </div>
        ) : posts.length === 0 ? (
          <div className="py-24 text-center text-sm text-[#71707d]">
            No published articles found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-[#0f0f15] border border-[#21212d] rounded-xl overflow-hidden flex flex-col justify-between hover:border-[#c5a059]/40 transition-all group"
              >
                <div>
                  <div className="aspect-[16/10] overflow-hidden relative bg-[#161622]">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 text-[10px] uppercase font-mono bg-[#09090b]/80 rounded text-[#c5a059]">
                      {post.category}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-[#6e6c77] font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#c5a059]" />
                        <span>{post.publishedAt}</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-[#c5a059]" />
                        <span>{post.author}</span>
                      </span>
                    </div>

                    <h2 className="text-xl font-serif text-[#f5eedc] font-medium group-hover:text-[#c5a059] transition-colors leading-snug">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>

                    <p className="text-xs text-[#a8a6af] leading-relaxed line-clamp-3 font-light">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-[#1a1a26] mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] text-[#6a6875]">
                    <Tag className="w-3 h-3 text-[#c5a059]" />
                    <span>{post.tags.slice(0, 2).join(', ')}</span>
                  </div>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#d4b470] hover:text-[#f5eedc] font-medium transition-colors"
                  >
                    <span>Read Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
