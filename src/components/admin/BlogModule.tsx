import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  Upload,
  Check,
  Search,
  Eye,
  EyeOff,
  Calendar,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { BlogPost } from '../../types';
import { api } from '../../services/api';
import { MediaPickerModal } from '../MediaPickerModal';

interface BlogModuleProps {
  onNotify: (type: 'success' | 'error', message: string) => void;
}

export const BlogModule: React.FC<BlogModuleProps> = ({ onNotify }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminBlogPosts();
      setPosts(data);
    } catch (err: any) {
      onNotify('error', 'Failed to load blog posts.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost?.title || !editingPost?.content) return;

    try {
      if (editingPost.id) {
        await api.updateBlogPost(editingPost.id, editingPost);
        onNotify('success', `Post "${editingPost.title}" updated.`);
      } else {
        await api.createBlogPost(editingPost);
        onNotify('success', `New article "${editingPost.title}" published.`);
      }
      setEditingPost(null);
      loadPosts();
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to save blog post.');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete post "${title}"?`)) return;
    try {
      await api.deleteBlogPost(id);
      onNotify('success', 'Article deleted.');
      loadPosts();
    } catch (err: any) {
      onNotify('error', 'Failed to delete post.');
    }
  };

  const handleTogglePublish = async (post: BlogPost) => {
    try {
      await api.updateBlogPost(post.id, { isPublished: !post.isPublished });
      onNotify('success', post.isPublished ? 'Article unpublished.' : 'Article published live!');
      loadPosts();
    } catch {
      onNotify('error', 'Failed to update publication status.');
    }
  };

  const filtered = posts.filter(
    (p) =>
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif text-[#f5eedc]">Blog & Articles Manager</h2>
          <p className="text-xs text-[#8e8c99]">
            Publish wedding guides, Maithili culture insights, and photography preparation tips.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setEditingPost({
              title: '',
              slug: '',
              excerpt: '',
              content: '',
              category: 'Wedding Guide',
              tags: ['Janakpur', 'Wedding Tips'],
              author: 'Kaviya Studio',
              coverImage:
                'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
              isPublished: true,
              publishedAt: new Date().toISOString().split('T')[0],
            })
          }
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#c5a059] hover:bg-[#d4b470] text-[#09090b] text-xs font-semibold uppercase tracking-wider transition-all shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-[#0e0e14] border border-[#20202e] rounded-xl p-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#716f7c]" />
          <input
            type="text"
            placeholder="Search articles by title, excerpt or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#14141d] border border-[#262638] rounded-lg text-xs text-[#f5eedc] focus:outline-none focus:border-[#c5a059]"
          />
        </div>
      </div>

      {/* Posts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((post) => (
          <div
            key={post.id}
            className="bg-[#0e0e14] border border-[#20202e] rounded-xl overflow-hidden flex flex-col justify-between hover:border-[#35354a] transition-all group"
          >
            <div>
              <div className="relative h-44 overflow-hidden bg-[#161622]">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e14] via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] uppercase font-mono text-[#c5a059]">
                  {post.category}
                </span>

                <button
                  type="button"
                  onClick={() => handleTogglePublish(post)}
                  className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-sm ${
                    post.isPublished
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/50'
                      : 'bg-zinc-900/80 text-zinc-400 border border-zinc-700/50'
                  }`}
                  title={post.isPublished ? 'Published (Click to hide)' : 'Hidden (Click to publish)'}
                >
                  {post.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#716f7c]">
                  <Calendar className="w-3 h-3" />
                  <span>{post.publishedAt}</span>
                  <span>·</span>
                  <span>{post.author}</span>
                </div>

                <h3 className="text-base font-serif text-[#f5eedc] font-medium line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-[#8e8c99] line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-[#1a1a26] bg-[#0c0c11] flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#716f7c]">/{post.slug}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPost(post)}
                  className="p-1.5 rounded text-[#a5a3b0] hover:text-white hover:bg-[#1a1a26]"
                  title="Edit Post"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(post.id, post.title)}
                  className="p-1.5 rounded text-red-400 hover:text-red-300 hover:bg-red-950/30"
                  title="Delete Post"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-xs text-[#716f7c]">
            No blog articles found. Click "Write New Article" above.
          </div>
        )}
      </div>

      {/* Edit / Add Modal */}
      {editingPost && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#101017] border border-[#27273a] rounded-xl max-w-2xl w-full p-6 space-y-4 my-8">
            <h3 className="text-base font-serif text-[#f5eedc]">
              {editingPost.id ? `Edit: ${editingPost.title}` : 'Write New Article'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase font-mono text-[#8e8c99] mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={editingPost.title || ''}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                      setEditingPost({
                        ...editingPost,
                        title,
                        slug: editingPost.id ? editingPost.slug : slug,
                      });
                    }}
                    className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc]"
                    placeholder="e.g. Planning a Traditional Mithila Vivah in Janakpur"
                  />
                </div>

                <div>
                  <label className="block uppercase font-mono text-[#8e8c99] mb-1">URL Slug</label>
                  <input
                    type="text"
                    required
                    value={editingPost.slug || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                    className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase font-mono text-[#8e8c99] mb-1">Cover Image</label>
                <div className="flex items-center gap-3">
                  {editingPost.coverImage && (
                    <img
                      src={editingPost.coverImage}
                      alt="Cover"
                      className="w-16 h-10 object-cover rounded border border-[#2b2b3f]"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setPickerOpen(true)}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-[#1a1a26] border border-[#2b2b3f] text-[#f5eedc] rounded"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>Upload or Pick Cover Photo</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase font-mono text-[#8e8c99] mb-1">Category</label>
                  <input
                    type="text"
                    value={editingPost.category || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                    className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc]"
                    placeholder="e.g. Wedding Guide"
                  />
                </div>

                <div>
                  <label className="block uppercase font-mono text-[#8e8c99] mb-1">Author</label>
                  <input
                    type="text"
                    value={editingPost.author || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                    className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc]"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase font-mono text-[#8e8c99] mb-1">Excerpt (Summary)</label>
                <textarea
                  rows={2}
                  value={editingPost.excerpt || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc]"
                  placeholder="Short teaser for cards and meta description..."
                />
              </div>

              <div>
                <label className="block uppercase font-mono text-[#8e8c99] mb-1">Article Content</label>
                <textarea
                  rows={8}
                  required
                  value={editingPost.content || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  className="w-full bg-[#181824] border border-[#2b2b3f] rounded px-3 py-2 text-[#f5eedc] leading-relaxed font-sans"
                  placeholder="Write the full story or guide..."
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-[#a5a3b0]">
                  <input
                    type="checkbox"
                    checked={editingPost.isPublished ?? true}
                    onChange={(e) =>
                      setEditingPost({ ...editingPost, isPublished: e.target.checked })
                    }
                    className="accent-[#c5a059]"
                  />
                  <span>Publish live on website</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#1e1e2d]">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="px-4 py-2 rounded bg-[#181824] text-[#a5a3b0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#c5a059] text-[#09090b] font-semibold"
                >
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {pickerOpen && (
        <MediaPickerModal
          isOpen={pickerOpen}
          onClose={() => setPickerOpen(false)}
          onSelect={(url) => {
            if (editingPost) setEditingPost({ ...editingPost, coverImage: url });
            setPickerOpen(false);
          }}
          title="Select Cover Image"
          accept="image"
        />
      )}
    </div>
  );
};
