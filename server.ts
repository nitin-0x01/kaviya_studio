import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import multer from 'multer';
import { fileURLToPath } from 'url';
import {
  defaultSettings,
  defaultServices,
  defaultPackages,
  defaultGallery,
  defaultTestimonials,
  defaultBookings,
  defaultAlbums,
  defaultBlogPosts,
  defaultMedia,
  defaultActivityLogs,
} from './src/data/defaultData.ts';
import {
  ActivityLog,
  AdminRole,
  AdminUser,
  Album,
  BlogPost,
  BookingInquiry,
  BookingStatus,
  GalleryItem,
  MediaItem,
  PricingPackage,
  Service,
  StudioSettings,
  Testimonial,
} from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

// Directories setup
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const uploadsDir = path.join(dataDir, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve persistent uploads statically
app.use('/uploads', express.static(uploadsDir));

// Database storage file
const dbPath = path.join(dataDir, 'studio-store.json');

interface UserRecord extends AdminUser {
  passwordHash: string;
  salt: string;
}

interface StudioStore {
  adminAuth: {
    initialized: boolean;
    username: string;
    passwordHash: string;
    salt: string;
    sessions: Record<string, { username: string; role: AdminRole; expiresAt: number }>;
  };
  users: UserRecord[];
  settings: StudioSettings;
  services: Service[];
  packages: PricingPackage[];
  gallery: GalleryItem[];
  albums: Album[];
  blogPosts: BlogPost[];
  media: MediaItem[];
  testimonials: Testimonial[];
  bookings: BookingInquiry[];
  activityLogs: ActivityLog[];
  analytics: {
    pageViews: number;
    inquirySubmissions: number;
    lastUpdated: string;
  };
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

function loadStore(): StudioStore {
  if (fs.existsSync(dbPath)) {
    try {
      const raw = fs.readFileSync(dbPath, 'utf8');
      const parsed = JSON.parse(raw);
      // Ensure any newly added array collections exist
      if (!parsed.albums) parsed.albums = defaultAlbums;
      if (!parsed.blogPosts) parsed.blogPosts = defaultBlogPosts;
      if (!parsed.media) parsed.media = defaultMedia;
      if (!parsed.users) parsed.users = [];
      if (!parsed.activityLogs) parsed.activityLogs = defaultActivityLogs;
      return parsed;
    } catch (e) {
      console.error('Failed to parse database file, reinitializing', e);
    }
  }

  const initialStore: StudioStore = {
    adminAuth: {
      initialized: false,
      username: '',
      passwordHash: '',
      salt: '',
      sessions: {},
    },
    users: [],
    settings: defaultSettings,
    services: defaultServices,
    packages: defaultPackages,
    gallery: defaultGallery,
    albums: defaultAlbums,
    blogPosts: defaultBlogPosts,
    media: defaultMedia,
    testimonials: defaultTestimonials,
    bookings: defaultBookings,
    activityLogs: defaultActivityLogs,
    analytics: {
      pageViews: 1420,
      inquirySubmissions: 38,
      lastUpdated: new Date().toISOString(),
    },
  };
  fs.writeFileSync(dbPath, JSON.stringify(initialStore, null, 2), 'utf8');
  return initialStore;
}

function saveStore(store: StudioStore) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(store, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving store to file:', err);
  }
}

let store = loadStore();

function logActivity(username: string, action: string, module: string, details?: string) {
  const log: ActivityLog = {
    id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    username,
    action,
    module,
    details,
  };
  store.activityLogs.unshift(log);
  if (store.activityLogs.length > 200) {
    store.activityLogs = store.activityLogs.slice(0, 200);
  }
}

// Multer Storage Configuration for persistent local device uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${safeName}-${uniqueSuffix}${ext}`);
  },
});

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.mp4', '.webm', '.mov'];

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMime = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/avif',
    'video/mp4',
    'video/webm',
    'video/quicktime',
  ];

  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return cb(new Error(`Security rejection: File extension "${ext}" is not permitted. Only standard image and video files are allowed.`));
  }

  if (allowedMime.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}. Only JPG, PNG, WEBP, AVIF, MP4, and WEBM are allowed.`));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 60 * 1024 * 1024, // 60MB max
  },
});

// Authentication middleware
interface AuthenticatedRequest extends Request {
  adminUser?: { username: string; role: AdminRole };
}

function requireAdminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const session = store.adminAuth.sessions[token];

  if (!session || session.expiresAt < Date.now()) {
    if (session) {
      delete store.adminAuth.sessions[token];
      saveStore(store);
    }
    res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
    return;
  }

  req.adminUser = { username: session.username, role: session.role || 'super_admin' };
  next();
}

function requireRole(allowedRoles: AdminRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.adminUser) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    if (req.adminUser.role !== 'super_admin' && !allowedRoles.includes(req.adminUser.role)) {
      res.status(403).json({
        error: `Forbidden: Requires elevated permissions (${allowedRoles.join(', ')}). Your role: ${req.adminUser.role}`,
      });
      return;
    }
    next();
  };
}

// ---------------- API ROUTES ----------------

// Auth status (Checks if first-time master admin setup is needed)
app.get('/api/auth/status', (_req: Request, res: Response) => {
  res.json({
    initialized: store.adminAuth.initialized,
    username: store.adminAuth.initialized ? store.adminAuth.username : null,
  });
});

// Master Admin Setup (Only allowed if not initialized yet)
app.post('/api/auth/setup', (req: Request, res: Response) => {
  if (store.adminAuth.initialized) {
    return res.status(400).json({ error: 'Administrator account is already initialized.' });
  }

  const { username, password, email } = req.body;
  if (!username || typeof username !== 'string' || username.trim().length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters long.' });
  }
  if (!password || typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, salt);
  const token = crypto.randomBytes(32).toString('hex');

  store.adminAuth.initialized = true;
  store.adminAuth.username = username.trim();
  store.adminAuth.salt = salt;
  store.adminAuth.passwordHash = passwordHash;
  store.adminAuth.sessions = {
    [token]: {
      username: username.trim(),
      role: 'super_admin',
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  };

  // Add to users list
  store.users = [
    {
      id: `usr-${Date.now()}`,
      username: username.trim(),
      email: email || 'kabiyastudio@gmail.com',
      role: 'super_admin',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      passwordHash,
      salt,
    },
  ];

  logActivity(username.trim(), 'Master Admin Initialized', 'Auth', 'Primary super administrator account created.');
  saveStore(store);

  res.json({
    success: true,
    message: 'Master administrator account created successfully.',
    token,
    user: { username: store.adminAuth.username, role: 'super_admin' },
  });
});

// Admin Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  if (!store.adminAuth.initialized) {
    return res.status(400).json({ error: 'System not initialized. Please complete initial setup first.' });
  }

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const uname = username.trim().toLowerCase();

  // Check main master admin
  let matchedUser: { username: string; role: AdminRole; salt: string; passwordHash: string } | null = null;
  if (uname === store.adminAuth.username.toLowerCase()) {
    matchedUser = {
      username: store.adminAuth.username,
      role: 'super_admin',
      salt: store.adminAuth.salt,
      passwordHash: store.adminAuth.passwordHash,
    };
  } else {
    // Check secondary admin users
    const subUser = store.users.find((u) => u.username.toLowerCase() === uname);
    if (subUser) {
      matchedUser = subUser;
    }
  }

  if (!matchedUser) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  const computedHash = hashPassword(password, matchedUser.salt);
  if (computedHash !== matchedUser.passwordHash) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  store.adminAuth.sessions[token] = {
    username: matchedUser.username,
    role: matchedUser.role,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };

  logActivity(matchedUser.username, 'Admin Logged In', 'Auth', `Session initiated with role ${matchedUser.role}`);
  saveStore(store);

  res.json({
    success: true,
    token,
    user: { username: matchedUser.username, role: matchedUser.role },
  });
});

// Admin Logout
app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const session = store.adminAuth.sessions[token];
    if (session) {
      logActivity(session.username, 'Admin Logged Out', 'Auth');
    }
    delete store.adminAuth.sessions[token];
    saveStore(store);
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

// Admin Me
app.get('/api/auth/me', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    authenticated: true,
    username: req.adminUser?.username,
    role: req.adminUser?.role || 'super_admin',
  });
});

// Update Credentials
app.post('/api/auth/update-credentials', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const { currentPassword, newUsername, newPassword } = req.body;
  const username = req.adminUser?.username || '';

  // Only master admin or matching user can update
  if (username === store.adminAuth.username) {
    const computedHash = hashPassword(currentPassword || '', store.adminAuth.salt);
    if (computedHash !== store.adminAuth.passwordHash) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }

    if (newUsername && typeof newUsername === 'string' && newUsername.trim().length >= 3) {
      store.adminAuth.username = newUsername.trim();
    }

    if (newPassword && typeof newPassword === 'string') {
      if (newPassword.length < 8) {
        return res.status(400).json({ error: 'New password must be at least 8 characters.' });
      }
      const newSalt = crypto.randomBytes(16).toString('hex');
      store.adminAuth.salt = newSalt;
      store.adminAuth.passwordHash = hashPassword(newPassword, newSalt);
    }
  }

  logActivity(username, 'Updated Credentials', 'Security');
  saveStore(store);
  res.json({ success: true, message: 'Credentials updated successfully.' });
});

// --- MEDIA LIBRARY & LOCAL DEVICE UPLOADS ---

// Single File Upload
app.post(
  '/api/upload',
  requireAdminAuth,
  upload.single('file'),
  (req: AuthenticatedRequest, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file received.' });
    }

    const isVideo = req.file.mimetype.startsWith('video/');
    const publicUrl = `/uploads/${req.file.filename}`;

    const newMedia: MediaItem = {
      id: `med-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      filename: req.file.filename,
      originalName: req.file.originalname,
      url: publicUrl,
      mimeType: req.file.mimetype,
      size: req.file.size,
      type: isVideo ? 'video' : 'image',
      title: req.body.title || req.file.originalname,
      caption: req.body.caption || '',
      altText: req.body.altText || req.body.title || req.file.originalname,
      category: req.body.category || 'general',
      albumId: req.body.albumId || undefined,
      uploadedAt: new Date().toISOString(),
    };

    store.media.unshift(newMedia);
    logActivity(
      req.adminUser?.username || 'Admin',
      'Uploaded Media',
      'Media',
      `${newMedia.originalName} (${(newMedia.size / (1024 * 1024)).toFixed(2)} MB)`
    );
    saveStore(store);

    res.json({
      success: true,
      file: newMedia,
      url: publicUrl,
    });
  }
);

// Bulk Files Upload
app.post(
  '/api/upload/bulk',
  requireAdminAuth,
  upload.array('files', 20),
  (req: AuthenticatedRequest, res: Response) => {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files received.' });
    }

    const createdItems: MediaItem[] = [];
    for (const f of files) {
      const isVideo = f.mimetype.startsWith('video/');
      const publicUrl = `/uploads/${f.filename}`;
      const item: MediaItem = {
        id: `med-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        filename: f.filename,
        originalName: f.originalname,
        url: publicUrl,
        mimeType: f.mimetype,
        size: f.size,
        type: isVideo ? 'video' : 'image',
        title: f.originalname,
        category: req.body.category || 'general',
        albumId: req.body.albumId || undefined,
        uploadedAt: new Date().toISOString(),
      };
      createdItems.push(item);
      store.media.unshift(item);
    }

    logActivity(
      req.adminUser?.username || 'Admin',
      'Bulk Uploaded Media',
      'Media',
      `${createdItems.length} files uploaded`
    );
    saveStore(store);

    res.json({
      success: true,
      files: createdItems,
    });
  }
);

// Get Media Library items
app.get('/api/media', requireAdminAuth, (req: Request, res: Response) => {
  const { search, type, category, albumId } = req.query;
  let items = store.media;

  if (type && type !== 'all') {
    items = items.filter((m) => m.type === type);
  }
  if (category && category !== 'all') {
    items = items.filter((m) => m.category === category);
  }
  if (albumId && albumId !== 'all') {
    items = items.filter((m) => m.albumId === albumId);
  }
  if (search && typeof search === 'string') {
    const s = search.toLowerCase();
    items = items.filter(
      (m) =>
        m.title.toLowerCase().includes(s) ||
        m.originalName.toLowerCase().includes(s) ||
        (m.caption && m.caption.toLowerCase().includes(s))
    );
  }

  // Calculate storage usage
  const totalBytes = store.media.reduce((acc, curr) => acc + (curr.size || 0), 0);

  res.json({
    items,
    totalCount: items.length,
    totalBytes,
    totalMegabytes: (totalBytes / (1024 * 1024)).toFixed(2),
  });
});

// Update Media Metadata
app.put('/api/media/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const index = store.media.findIndex((m) => m.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Media not found.' });
  }

  store.media[index] = { ...store.media[index], ...req.body };
  logActivity(req.adminUser?.username || 'Admin', 'Updated Media Metadata', 'Media', store.media[index].title);
  saveStore(store);
  res.json(store.media[index]);
});

// Delete Media item
app.delete('/api/media/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const item = store.media.find((m) => m.id === req.params.id);
  if (item && item.url.startsWith('/uploads/')) {
    const diskPath = path.join(uploadsDir, item.filename);
    if (fs.existsSync(diskPath)) {
      try {
        fs.unlinkSync(diskPath);
      } catch (e) {
        console.error('Failed to remove file from disk:', e);
      }
    }
  }

  store.media = store.media.filter((m) => m.id !== req.params.id);
  logActivity(req.adminUser?.username || 'Admin', 'Deleted Media', 'Media', item?.title || req.params.id);
  saveStore(store);
  res.json({ success: true });
});

// Bulk Delete Media
app.post('/api/media/bulk-delete', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) {
    return res.status(400).json({ error: 'ids array required.' });
  }

  for (const id of ids) {
    const item = store.media.find((m) => m.id === id);
    if (item && item.url.startsWith('/uploads/')) {
      const diskPath = path.join(uploadsDir, item.filename);
      if (fs.existsSync(diskPath)) {
        try {
          fs.unlinkSync(diskPath);
        } catch (e) {}
      }
    }
  }

  store.media = store.media.filter((m) => !ids.includes(m.id));
  logActivity(req.adminUser?.username || 'Admin', 'Bulk Deleted Media', 'Media', `${ids.length} files removed`);
  saveStore(store);
  res.json({ success: true, count: ids.length });
});

// Storage Status & Verification
app.get('/api/admin/storage-status', requireAdminAuth, (_req: Request, res: Response) => {
  const totalStorageBytes = store.media.reduce((acc, curr) => acc + (curr.size || 0), 0);
  const filesOnDisk = fs.existsSync(uploadsDir) ? fs.readdirSync(uploadsDir) : [];

  res.json({
    provider: process.env.STORAGE_PROVIDER || 'local_disk',
    isEphemeral: true,
    uploadsDir,
    totalRecords: store.media.length,
    filesOnDiskCount: filesOnDisk.length,
    totalBytes: totalStorageBytes,
    totalMegabytes: (totalStorageBytes / (1024 * 1024)).toFixed(2),
    supportedExtensions: ALLOWED_EXTENSIONS,
    maxFileSizeMB: 60,
  });
});

app.get('/api/admin/media/verify-sync', requireAdminAuth, (_req: Request, res: Response) => {
  const filesOnDisk = fs.existsSync(uploadsDir) ? fs.readdirSync(uploadsDir) : [];
  let matched = 0;
  const missing: string[] = [];

  for (const m of store.media) {
    if (m.url.startsWith('/uploads/')) {
      const diskPath = path.join(uploadsDir, m.filename);
      if (fs.existsSync(diskPath)) {
        matched++;
      } else {
        missing.push(m.filename);
      }
    } else {
      matched++;
    }
  }

  const orphaned = filesOnDisk.filter((f) => !store.media.some((m) => m.filename === f));

  res.json({
    totalDatabaseRecords: store.media.length,
    matchedOnDisk: matched,
    missingCount: missing.length,
    missingFiles: missing.slice(0, 10),
    orphanedCount: orphaned.length,
    orphanedFiles: orphaned.slice(0, 10),
    healthy: missing.length === 0,
  });
});

// --- ALBUMS ---
app.get('/api/albums', (_req: Request, res: Response) => {
  const albumsWithCounts = store.albums.map((a) => {
    const count = store.gallery.filter((g) => g.albumId === a.id).length;
    return { ...a, itemCount: count };
  });
  res.json(albumsWithCounts.sort((a, b) => a.order - b.order));
});

app.post('/api/albums', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const newAlbum: Album = {
    id: `alb-${Date.now()}`,
    title: req.body.title || 'Untitled Album',
    slug: req.body.slug || req.body.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `album-${Date.now()}`,
    description: req.body.description || '',
    coverImage: req.body.coverImage || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=85&w=1200',
    category: req.body.category || 'wedding',
    isFeatured: Boolean(req.body.isFeatured),
    isPublished: req.body.isPublished ?? true,
    order: store.albums.length + 1,
    createdAt: new Date().toISOString().split('T')[0],
  };

  store.albums.push(newAlbum);
  logActivity(req.adminUser?.username || 'Admin', 'Created Album', 'Portfolio', newAlbum.title);
  saveStore(store);
  res.json(newAlbum);
});

app.put('/api/albums/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const index = store.albums.findIndex((a) => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Album not found.' });
  }

  store.albums[index] = { ...store.albums[index], ...req.body };
  logActivity(req.adminUser?.username || 'Admin', 'Updated Album', 'Portfolio', store.albums[index].title);
  saveStore(store);
  res.json(store.albums[index]);
});

app.delete('/api/albums/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  store.albums = store.albums.filter((a) => a.id !== req.params.id);
  // Reset albumId for orphaned gallery items
  store.gallery = store.gallery.map((g) => (g.albumId === req.params.id ? { ...g, albumId: undefined } : g));
  logActivity(req.adminUser?.username || 'Admin', 'Deleted Album', 'Portfolio', req.params.id);
  saveStore(store);
  res.json({ success: true });
});

// --- BLOG & ARTICLES ---
app.get('/api/blog', (req: Request, res: Response) => {
  const { category, tag } = req.query;
  let posts = store.blogPosts.filter((p) => p.isPublished);

  if (category && category !== 'all') {
    posts = posts.filter((p) => p.category.toLowerCase() === String(category).toLowerCase());
  }
  if (tag) {
    posts = posts.filter((p) => p.tags.includes(String(tag)));
  }

  res.json(posts);
});

app.get('/api/blog/:slug', (req: Request, res: Response) => {
  const post = store.blogPosts.find((p) => p.slug === req.params.slug && p.isPublished);
  if (!post) {
    return res.status(404).json({ error: 'Article not found.' });
  }
  res.json(post);
});

app.get('/api/admin/blog', requireAdminAuth, (_req: Request, res: Response) => {
  res.json(store.blogPosts);
});

app.post('/api/admin/blog', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const newPost: BlogPost = {
    id: `post-${Date.now()}`,
    title: req.body.title || 'Untitled Post',
    slug: req.body.slug || req.body.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `post-${Date.now()}`,
    excerpt: req.body.excerpt || '',
    content: req.body.content || '',
    coverImage: req.body.coverImage || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=85&w=1200',
    category: req.body.category || 'General',
    tags: Array.isArray(req.body.tags) ? req.body.tags : ['Janakpur'],
    author: req.body.author || req.adminUser?.username || 'Kaviya Studio',
    isPublished: req.body.isPublished ?? true,
    publishedAt: req.body.publishedAt || new Date().toISOString().split('T')[0],
    seoTitle: req.body.seoTitle || req.body.title,
    seoDescription: req.body.seoDescription || req.body.excerpt,
  };

  store.blogPosts.unshift(newPost);
  logActivity(req.adminUser?.username || 'Admin', 'Created Article', 'Blog', newPost.title);
  saveStore(store);
  res.json(newPost);
});

app.put('/api/admin/blog/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const index = store.blogPosts.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Post not found.' });
  }

  store.blogPosts[index] = { ...store.blogPosts[index], ...req.body };
  logActivity(req.adminUser?.username || 'Admin', 'Updated Article', 'Blog', store.blogPosts[index].title);
  saveStore(store);
  res.json(store.blogPosts[index]);
});

app.delete('/api/admin/blog/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  store.blogPosts = store.blogPosts.filter((p) => p.id !== req.params.id);
  logActivity(req.adminUser?.username || 'Admin', 'Deleted Article', 'Blog', req.params.id);
  saveStore(store);
  res.json({ success: true });
});

// --- ADMIN USERS & ROLES ---
app.get('/api/admin/users', requireAdminAuth, (_req: Request, res: Response) => {
  // Return list with master admin plus any secondary users, without sensitive password hash
  const list = [
    {
      id: 'usr-master',
      username: store.adminAuth.username,
      email: store.settings.email || 'kabiyastudio@gmail.com',
      role: 'super_admin' as AdminRole,
      createdAt: '2026-01-01',
    },
    ...store.users.map((u) => ({
      id: u.id,
      username: u.username,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
      lastLogin: u.lastLogin,
    })),
  ];
  res.json(list);
});

app.post('/api/admin/users', requireAdminAuth, requireRole(['super_admin']), (req: AuthenticatedRequest, res: Response) => {
  const { username, password, email, role } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, salt);

  const newUser: UserRecord = {
    id: `usr-${Date.now()}`,
    username: username.trim(),
    email: email || '',
    role: role || 'content_manager',
    createdAt: new Date().toISOString(),
    passwordHash,
    salt,
  };

  store.users.push(newUser);
  logActivity(req.adminUser?.username || 'Admin', 'Created Admin User', 'Users', `${username} (${newUser.role})`);
  saveStore(store);

  res.json({
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
    role: newUser.role,
    createdAt: newUser.createdAt,
  });
});

app.delete('/api/admin/users/:id', requireAdminAuth, requireRole(['super_admin']), (req: AuthenticatedRequest, res: Response) => {
  store.users = store.users.filter((u) => u.id !== req.params.id);
  logActivity(req.adminUser?.username || 'Admin', 'Deleted Admin User', 'Users', req.params.id);
  saveStore(store);
  res.json({ success: true });
});

// --- ACTIVITY LOGS ---
app.get('/api/admin/logs', requireAdminAuth, (_req: Request, res: Response) => {
  res.json(store.activityLogs);
});

// --- SETTINGS ---
app.get('/api/settings', (_req: Request, res: Response) => {
  store.analytics.pageViews += 1;
  saveStore(store);
  res.json(store.settings);
});

app.put('/api/settings', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  store.settings = { ...store.settings, ...req.body };
  logActivity(req.adminUser?.username || 'Admin', 'Updated Website Settings', 'Settings');
  saveStore(store);
  res.json({ success: true, settings: store.settings });
});

// --- SERVICES ---
app.get('/api/services', (_req: Request, res: Response) => {
  const activeServices = store.services.filter((s) => s.isPublished !== false);
  res.json(activeServices.sort((a, b) => (a.order || 0) - (b.order || 0)));
});

app.get('/api/admin/services', requireAdminAuth, (_req: Request, res: Response) => {
  res.json(store.services);
});

app.post('/api/services', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const newService: Service = {
    id: `srv-${Date.now()}`,
    slug: req.body.slug || req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title: req.body.title || 'Untitled Service',
    coverImage: req.body.coverImage || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800',
    description: req.body.description || '',
    shortDescription: req.body.shortDescription || '',
    features: Array.isArray(req.body.features) ? req.body.features : [],
    deliverables: Array.isArray(req.body.deliverables) ? req.body.deliverables : [],
    priceDisplay: req.body.priceDisplay || 'Contact for pricing',
    contactForPrice: req.body.contactForPrice ?? true,
    featured: Boolean(req.body.featured),
    category: req.body.category || 'wedding',
    isPublished: req.body.isPublished ?? true,
    order: store.services.length + 1,
  };
  store.services.push(newService);
  logActivity(req.adminUser?.username || 'Admin', 'Created Service', 'Services', newService.title);
  saveStore(store);
  res.json(newService);
});

app.put('/api/services/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const index = store.services.findIndex((s) => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Service not found.' });
  }
  store.services[index] = { ...store.services[index], ...req.body };
  logActivity(req.adminUser?.username || 'Admin', 'Updated Service', 'Services', store.services[index].title);
  saveStore(store);
  res.json(store.services[index]);
});

app.delete('/api/services/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  store.services = store.services.filter((s) => s.id !== req.params.id);
  logActivity(req.adminUser?.username || 'Admin', 'Deleted Service', 'Services', req.params.id);
  saveStore(store);
  res.json({ success: true });
});

// --- PACKAGES ---
app.get('/api/packages', (_req: Request, res: Response) => {
  const activePackages = store.packages.filter((p) => p.isEnabled !== false);
  res.json(activePackages.sort((a, b) => a.order - b.order));
});

app.get('/api/admin/packages', requireAdminAuth, (_req: Request, res: Response) => {
  res.json(store.packages.sort((a, b) => a.order - b.order));
});

app.post('/api/packages', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const newPkg: PricingPackage = {
    id: `pkg-${Date.now()}`,
    name: req.body.name || 'New Package',
    price: req.body.contactForPrice ? null : req.body.price || null,
    contactForPrice: req.body.contactForPrice ?? true,
    tagline: req.body.tagline || '',
    photographersCount: req.body.photographersCount || '1 Photographer',
    hours: req.body.hours || '8 Hours Coverage',
    editedImages: req.body.editedImages || '150+ Retouched Photos',
    album: req.body.album || 'Standard Album',
    video: req.body.video || 'Highlight Video',
    drone: req.body.drone || 'Optional Add-on',
    deliveryTime: req.body.deliveryTime || '14 Days',
    features: Array.isArray(req.body.features) ? req.body.features : [],
    isPopular: Boolean(req.body.isPopular),
    isEnabled: req.body.isEnabled ?? true,
    order: store.packages.length + 1,
  };
  store.packages.push(newPkg);
  logActivity(req.adminUser?.username || 'Admin', 'Created Package', 'Packages', newPkg.name);
  saveStore(store);
  res.json(newPkg);
});

app.put('/api/packages/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const index = store.packages.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Package not found.' });
  }
  store.packages[index] = { ...store.packages[index], ...req.body };
  logActivity(req.adminUser?.username || 'Admin', 'Updated Package', 'Packages', store.packages[index].name);
  saveStore(store);
  res.json(store.packages[index]);
});

app.delete('/api/packages/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  store.packages = store.packages.filter((p) => p.id !== req.params.id);
  logActivity(req.adminUser?.username || 'Admin', 'Deleted Package', 'Packages', req.params.id);
  saveStore(store);
  res.json({ success: true });
});

// --- GALLERY ---
app.get('/api/gallery', (req: Request, res: Response) => {
  const { category, featured, albumId } = req.query;
  let items = store.gallery;
  if (category && category !== 'all') {
    items = items.filter((g) => g.category === category);
  }
  if (featured === 'true') {
    items = items.filter((g) => g.isFeatured);
  }
  if (albumId && albumId !== 'all') {
    items = items.filter((g) => g.albumId === albumId);
  }
  res.json(items);
});

app.post('/api/gallery', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const {
    title,
    coupleOrClient,
    category,
    imageUrl,
    aspectRatio,
    location,
    isFeatured,
    videoUrl,
    caption,
    albumId,
    altText,
  } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ error: 'Image URL or data is required.' });
  }

  const newItem: GalleryItem = {
    id: `gal-${Date.now()}`,
    title: title || 'Untitled Project',
    coupleOrClient: coupleOrClient || 'Valued Client',
    category: category || 'wedding',
    imageUrl,
    aspectRatio: aspectRatio || 'landscape',
    location: location || 'Janakpur, Nepal',
    isFeatured: Boolean(isFeatured),
    videoUrl: videoUrl || undefined,
    albumId: albumId || undefined,
    altText: altText || title || caption,
    date: new Date().toISOString().split('T')[0],
    caption: caption || '',
    isDemo: false,
    order: store.gallery.length + 1,
  };
  store.gallery.unshift(newItem);
  logActivity(req.adminUser?.username || 'Admin', 'Added Gallery Photo', 'Portfolio', newItem.title);
  saveStore(store);
  res.json(newItem);
});

app.put('/api/gallery/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const index = store.gallery.findIndex((g) => g.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Gallery item not found.' });
  }
  store.gallery[index] = { ...store.gallery[index], ...req.body };
  logActivity(req.adminUser?.username || 'Admin', 'Updated Gallery Item', 'Portfolio', store.gallery[index].title);
  saveStore(store);
  res.json(store.gallery[index]);
});

app.delete('/api/gallery/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  store.gallery = store.gallery.filter((g) => g.id !== req.params.id);
  logActivity(req.adminUser?.username || 'Admin', 'Deleted Gallery Item', 'Portfolio', req.params.id);
  saveStore(store);
  res.json({ success: true });
});

// --- TESTIMONIALS ---
app.get('/api/testimonials', (_req: Request, res: Response) => {
  const approved = store.testimonials.filter((t) => t.isApproved);
  res.json(approved);
});

app.get('/api/admin/testimonials', requireAdminAuth, (_req: Request, res: Response) => {
  res.json(store.testimonials);
});

app.post('/api/testimonials', (req: Request, res: Response) => {
  const { clientName, eventType, location, quote, rating, photoUrl } = req.body;
  if (!clientName || !quote) {
    return res.status(400).json({ error: 'Client name and review text are required.' });
  }

  const newTestimonial: Testimonial = {
    id: `test-${Date.now()}`,
    clientName: clientName.trim(),
    eventType: eventType || 'Wedding Photography',
    location: location || 'Janakpur',
    quote: quote.trim(),
    rating: Number(rating) || 5,
    photoUrl: photoUrl || undefined,
    date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    isApproved: false, // Requires admin review
    isFeatured: false,
    isDemo: false,
    order: store.testimonials.length + 1,
  };

  store.testimonials.push(newTestimonial);
  saveStore(store);

  res.json({
    success: true,
    message: 'Thank you! Your testimonial has been submitted for studio review.',
    testimonial: newTestimonial,
  });
});

app.post('/api/admin/testimonials', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const newTestimonial: Testimonial = {
    id: `test-${Date.now()}`,
    clientName: req.body.clientName || 'Valued Couple',
    eventType: req.body.eventType || 'Wedding',
    location: req.body.location || 'Janakpur',
    quote: req.body.quote || '',
    rating: req.body.rating || 5,
    photoUrl: req.body.photoUrl || undefined,
    date: req.body.date || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    isApproved: req.body.isApproved ?? true,
    isFeatured: Boolean(req.body.isFeatured),
    isDemo: false,
    order: store.testimonials.length + 1,
  };
  store.testimonials.unshift(newTestimonial);
  logActivity(req.adminUser?.username || 'Admin', 'Added Testimonial', 'Testimonials', newTestimonial.clientName);
  saveStore(store);
  res.json(newTestimonial);
});

app.put('/api/admin/testimonials/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const index = store.testimonials.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Testimonial not found.' });
  }
  store.testimonials[index] = { ...store.testimonials[index], ...req.body };
  logActivity(req.adminUser?.username || 'Admin', 'Updated Testimonial', 'Testimonials', store.testimonials[index].clientName);
  saveStore(store);
  res.json(store.testimonials[index]);
});

app.delete('/api/admin/testimonials/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  store.testimonials = store.testimonials.filter((t) => t.id !== req.params.id);
  logActivity(req.adminUser?.username || 'Admin', 'Deleted Testimonial', 'Testimonials', req.params.id);
  saveStore(store);
  res.json({ success: true });
});

// --- BOOKINGS & INQUIRIES ---
app.post('/api/bookings', (req: Request, res: Response) => {
  const {
    fullName,
    phone,
    email,
    eventType,
    eventDate,
    eventLocation,
    preferredPackage,
    estimatedBudget,
    additionalRequirements,
    preferredContactMethod,
    honeypot,
  } = req.body;

  if (honeypot) {
    return res.status(400).json({ error: 'Spam detected.' });
  }

  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
    return res.status(400).json({ error: 'Please provide your full name.' });
  }
  if (!phone || typeof phone !== 'string' || phone.trim().length < 7) {
    return res.status(400).json({ error: 'Please provide a valid phone number with country code.' });
  }
  if (!email || !email.includes('@') || !email.includes('.')) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }
  if (!eventDate) {
    return res.status(400).json({ error: 'Please specify the anticipated event date.' });
  }

  // Duplicate submission prevention (within 60 seconds)
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPhone = phone.trim().replace(/[^0-9]/g, '');
  const existingRecent = store.bookings.find((b) => {
    const bPhone = b.phone.replace(/[^0-9]/g, '');
    const bEmail = b.email.toLowerCase();
    const timeDiff = Date.now() - new Date(b.createdAt).getTime();
    return (
      (bEmail === normalizedEmail || bPhone === normalizedPhone) &&
      b.eventDate === eventDate &&
      timeDiff < 60 * 1000
    );
  });

  if (existingRecent) {
    return res.status(200).json({
      success: true,
      referenceNumber: existingRecent.referenceNumber,
      booking: existingRecent,
      message: `Your inquiry has already been received under reference ${existingRecent.referenceNumber}. We are processing your request.`,
    });
  }

  // Collision-safe unique reference generation
  let referenceNumber = '';
  const currentYear = new Date().getFullYear();
  do {
    const randNum = Math.floor(1000 + Math.random() * 9000);
    referenceNumber = `KS-${currentYear}-${randNum}`;
  } while (store.bookings.some((b) => b.referenceNumber === referenceNumber));

  const newBooking: BookingInquiry = {
    id: `book-${Date.now()}`,
    referenceNumber,
    fullName: fullName.trim(),
    phone: phone.trim(),
    email: email.trim().toLowerCase(),
    eventType: eventType || 'Wedding Photography',
    eventDate,
    eventLocation: eventLocation || 'Janakpur, Nepal',
    preferredPackage: preferredPackage || 'Custom Package',
    estimatedBudget: estimatedBudget || undefined,
    additionalRequirements: additionalRequirements || undefined,
    preferredContactMethod: preferredContactMethod || 'whatsapp',
    status: 'new',
    adminNotes: 'Inquiry received via website. Awaiting studio availability check.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.bookings.unshift(newBooking);
  store.analytics.inquirySubmissions += 1;
  saveStore(store);

  res.status(201).json({
    success: true,
    referenceNumber,
    booking: newBooking,
    message: 'Your inquiry has been submitted to Kaviya Studio. We will contact you soon.',
  });
});

app.get('/api/bookings/track/:ref', (req: Request, res: Response) => {
  const ref = req.params.ref.toUpperCase().trim();
  const booking = store.bookings.find((b) => b.referenceNumber.toUpperCase() === ref);
  if (!booking) {
    return res.status(404).json({ error: 'No booking inquiry found with reference number: ' + ref });
  }

  res.json({
    referenceNumber: booking.referenceNumber,
    fullName: booking.fullName,
    eventType: booking.eventType,
    eventDate: booking.eventDate,
    eventLocation: booking.eventLocation,
    preferredPackage: booking.preferredPackage,
    status: booking.status,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
  });
});

app.get('/api/admin/bookings', requireAdminAuth, (req: Request, res: Response) => {
  const { status, search, eventType, dateFrom, dateTo } = req.query;
  let list = store.bookings;

  if (status && status !== 'all') {
    list = list.filter((b) => b.status === status);
  }
  if (eventType && eventType !== 'all') {
    list = list.filter((b) => b.eventType === eventType);
  }
  if (dateFrom) {
    list = list.filter((b) => b.eventDate >= String(dateFrom));
  }
  if (dateTo) {
    list = list.filter((b) => b.eventDate <= String(dateTo));
  }
  if (search && typeof search === 'string') {
    const s = search.toLowerCase();
    list = list.filter(
      (b) =>
        b.fullName.toLowerCase().includes(s) ||
        b.referenceNumber.toLowerCase().includes(s) ||
        b.phone.includes(s) ||
        b.email.toLowerCase().includes(s) ||
        b.eventLocation.toLowerCase().includes(s)
    );
  }

  res.json(list);
});

// Create manual inquiry from Admin
app.post('/api/admin/bookings', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const randNum = Math.floor(1000 + Math.random() * 9000);
  const currentYear = new Date().getFullYear();
  const referenceNumber = `KS-${currentYear}-${randNum}`;

  const manualBooking: BookingInquiry = {
    id: `book-${Date.now()}`,
    referenceNumber,
    fullName: req.body.fullName || 'Walk-in Client',
    phone: req.body.phone || '',
    email: req.body.email || '',
    eventType: req.body.eventType || 'Wedding Photography',
    eventDate: req.body.eventDate || new Date().toISOString().split('T')[0],
    eventLocation: req.body.eventLocation || 'Janakpur',
    preferredPackage: req.body.preferredPackage || 'Custom Package',
    estimatedBudget: req.body.estimatedBudget,
    additionalRequirements: req.body.additionalRequirements,
    preferredContactMethod: req.body.preferredContactMethod || 'phone',
    status: req.body.status || 'contacted',
    adminNotes: req.body.adminNotes || 'Manual booking entered by studio administrator.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.bookings.unshift(manualBooking);
  logActivity(req.adminUser?.username || 'Admin', 'Manually Created Booking', 'Bookings', manualBooking.referenceNumber);
  saveStore(store);
  res.json(manualBooking);
});

// CSV Export for Bookings
app.get('/api/admin/bookings/export-csv', requireAdminAuth, (_req: Request, res: Response) => {
  const headers = [
    'Reference',
    'Full Name',
    'Phone',
    'Email',
    'Event Type',
    'Event Date',
    'Event Location',
    'Package',
    'Status',
    'Budget',
    'Created At',
  ];

  const rows = store.bookings.map((b) => [
    `"${b.referenceNumber}"`,
    `"${b.fullName.replace(/"/g, '""')}"`,
    `"${b.phone}"`,
    `"${b.email}"`,
    `"${b.eventType}"`,
    `"${b.eventDate}"`,
    `"${b.eventLocation.replace(/"/g, '""')}"`,
    `"${b.preferredPackage.replace(/"/g, '""')}"`,
    `"${b.status}"`,
    `"${b.estimatedBudget || ''}"`,
    `"${b.createdAt}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="kaviya-studio-bookings.csv"');
  res.send(csvContent);
});

app.patch('/api/admin/bookings/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const index = store.bookings.findIndex((b) => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Booking not found.' });
  }

  const { status, adminNotes } = req.body;
  if (status) store.bookings[index].status = status;
  if (adminNotes !== undefined) store.bookings[index].adminNotes = adminNotes;
  store.bookings[index].updatedAt = new Date().toISOString();

  logActivity(
    req.adminUser?.username || 'Admin',
    'Updated Booking Status',
    'Bookings',
    `${store.bookings[index].referenceNumber} -> ${status}`
  );
  saveStore(store);
  res.json(store.bookings[index]);
});

app.delete('/api/admin/bookings/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const ref = store.bookings.find((b) => b.id === req.params.id)?.referenceNumber;
  store.bookings = store.bookings.filter((b) => b.id !== req.params.id);
  logActivity(req.adminUser?.username || 'Admin', 'Deleted Booking', 'Bookings', ref || req.params.id);
  saveStore(store);
  res.json({ success: true });
});

// --- ADMIN ANALYTICS ---
app.get('/api/admin/analytics', requireAdminAuth, (_req: Request, res: Response) => {
  const totalBookings = store.bookings.length;
  const newBookings = store.bookings.filter((b) => b.status === 'new').length;
  const contactedBookings = store.bookings.filter((b) => b.status === 'contacted').length;
  const confirmedBookings = store.bookings.filter((b) => b.status === 'confirmed').length;
  const completedBookings = store.bookings.filter((b) => b.status === 'completed').length;
  const cancelledBookings = store.bookings.filter((b) => b.status === 'cancelled').length;

  const totalStorageBytes = store.media.reduce((acc, curr) => acc + (curr.size || 0), 0);

  res.json({
    totalBookings,
    newBookings,
    contactedBookings,
    confirmedBookings,
    completedBookings,
    cancelledBookings,
    totalGalleryItems: store.gallery.length,
    totalAlbums: store.albums.length,
    totalBlogPosts: store.blogPosts.length,
    totalMediaItems: store.media.length,
    totalServices: store.services.length,
    totalPackages: store.packages.length,
    totalTestimonials: store.testimonials.length,
    totalStorageBytes,
    totalStorageMB: (totalStorageBytes / (1024 * 1024)).toFixed(2),
    pageViews: store.analytics.pageViews,
    inquirySubmissions: store.analytics.inquirySubmissions,
  });
});

// Admin Reset Database
app.post('/api/admin/reset-database', requireAdminAuth, requireRole(['super_admin']), (req: AuthenticatedRequest, res: Response) => {
  store.settings = defaultSettings;
  store.services = defaultServices;
  store.packages = defaultPackages;
  store.gallery = defaultGallery;
  store.albums = defaultAlbums;
  store.blogPosts = defaultBlogPosts;
  store.media = defaultMedia;
  store.testimonials = defaultTestimonials;
  logActivity(req.adminUser?.username || 'Admin', 'Reset Database', 'System', 'Restored to default demo data');
  saveStore(store);
  res.json({ success: true, message: 'Database reset to default authentic demo data.' });
});

// Admin Export Database JSON
app.get('/api/admin/export-database', requireAdminAuth, (_req: Request, res: Response) => {
  const exportData = {
    settings: store.settings,
    services: store.services,
    packages: store.packages,
    gallery: store.gallery,
    albums: store.albums,
    blogPosts: store.blogPosts,
    media: store.media,
    testimonials: store.testimonials,
    bookings: store.bookings,
    exportedAt: new Date().toISOString(),
  };
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="kaviya-studio-full-backup.json"');
  res.send(JSON.stringify(exportData, null, 2));
});

// Admin Import Database JSON
app.post('/api/admin/import-database', requireAdminAuth, requireRole(['super_admin']), (req: AuthenticatedRequest, res: Response) => {
  const { backupData } = req.body;
  if (!backupData || typeof backupData !== 'object') {
    return res.status(400).json({ error: 'Invalid backup file format.' });
  }

  if (backupData.settings) store.settings = backupData.settings;
  if (Array.isArray(backupData.services)) store.services = backupData.services;
  if (Array.isArray(backupData.packages)) store.packages = backupData.packages;
  if (Array.isArray(backupData.gallery)) store.gallery = backupData.gallery;
  if (Array.isArray(backupData.albums)) store.albums = backupData.albums;
  if (Array.isArray(backupData.blogPosts)) store.blogPosts = backupData.blogPosts;
  if (Array.isArray(backupData.media)) store.media = backupData.media;
  if (Array.isArray(backupData.testimonials)) store.testimonials = backupData.testimonials;
  if (Array.isArray(backupData.bookings)) store.bookings = backupData.bookings;

  logActivity(req.adminUser?.username || 'Admin', 'Imported Database Backup', 'System');
  saveStore(store);
  res.json({ success: true, message: 'Backup restored successfully.' });
});

// ---------------- VITE / STATIC SERVING ----------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Kaviya Studio CMS server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
