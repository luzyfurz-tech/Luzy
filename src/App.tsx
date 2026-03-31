import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  X, 
  MessageCircle, 
  User, 
  Settings, 
  LogOut, 
  Coins, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Edit2, 
  ChevronLeft,
  BarChart3,
  Users,
  TrendingUp,
  Activity,
  ArrowRight,
  Shield,
  ShoppingBag,
  LifeBuoy,
  Send,
  Camera,
  Lock,
  ChevronRight,
  Upload,
  Loader2
} from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { 
  getFantasyProfiles, 
  seedFantasyProfiles, 
  createFantasyProfile, 
  updateFantasyProfile, 
  deleteFantasyProfile,
  getAllUsers,
  updateUserCoins,
  updateUserVip,
  getSystemStats,
  getSystemSettings,
  updateSystemSettings,
  getActiveChats,
  getChatMessages,
  getUserProfile,
  markChatAsRead,
  sendMessage,
  createChat,
  updateUserProfile,
  getNextQueuedChat,
  seedTestUsersAndMessages,
  likeProfile,
  getMatches,
  getChatsForUser,
  unlockMessageImage,
  uploadImage,
  boostProfile,
  db
} from './services/firebaseService';
import { getDoc, doc } from 'firebase/firestore';
import { cn } from './lib/utils';

// --- Components ---

const FileUploader = ({ onUpload, path, label = "Upload Billede" }: { onUpload: (url: string) => void, path: string, label?: string }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file, path);
      onUpload(url);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload fejlede. Prøv igen.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
      >
        {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
        {uploading ? 'Uploader...' : label}
      </button>
    </div>
  );
};

const Hero = () => {
  const { login } = useAuth();
  
  return (
    <div className="min-h-screen bg-black text-white selection:bg-orange-500 selection:text-white">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-zinc-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Heart className="text-orange-500 fill-current" size={28} />
          <span className="text-2xl font-black tracking-tighter">SPARK</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-400">
          <a href="#welcome" className="hover:text-orange-500 transition-colors">Velkommen</a>
          <a href="#features" className="hover:text-orange-500 transition-colors">Funktioner</a>
          <a href="#membership" className="hover:text-orange-500 transition-colors">Medlemskab</a>
          <a href="#stats" className="hover:text-orange-500 transition-colors">Statistik</a>
          <a href="#about" className="hover:text-orange-500 transition-colors">Om os</a>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={login} className="text-sm font-bold hover:text-orange-500 transition-colors">Log ind</button>
          <button onClick={login} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full text-sm font-bold transition-all active:scale-95 shadow-lg shadow-orange-500/20">
            Opret profil
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="welcome" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop" 
            alt="Happy Couple" 
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-xl"
          >
            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-6">
              FIND DIN NÆSTE <span className="text-orange-500">GNIST</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 font-light mb-10 leading-relaxed">
              Oplev en verden af spændende profiler. Opret dig i dag og få <span className="text-orange-500 font-bold">50 GRATIS COINS</span> til at starte din rejse.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={login}
                className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-5 rounded-2xl text-xl font-black shadow-2xl shadow-orange-500/30 transition-all active:scale-95 flex items-center gap-3"
              >
                Kom i gang nu
                <ArrowRight size={24} />
              </button>
              <button className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 hover:bg-zinc-800 text-white px-10 py-5 rounded-2xl text-xl font-black transition-all active:scale-95">
                Se video
              </button>
            </div>
          </motion.div>

          {/* Registration Card Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            className="hidden lg:block bg-zinc-900/40 backdrop-blur-2xl border border-zinc-800 p-10 rounded-[40px] shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-orange-500/20 transition-all duration-700" />
            
            <h2 className="text-3xl font-black mb-2 tracking-tight">Opret en konto</h2>
            <p className="text-gray-500 text-sm mb-8">Det tager under 30 sekunder at komme i gang.</p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Brugernavn</label>
                <div className="w-full bg-black/50 border border-zinc-800 rounded-2xl h-14" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email Adresse</label>
                <div className="w-full bg-black/50 border border-zinc-800 rounded-2xl h-14" />
              </div>
              <div className="pt-4">
                <button 
                  onClick={login}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-5 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2"
                >
                  <Heart size={20} fill="currentColor" />
                  Tilmeld dig GRATIS
                </button>
              </div>
            </div>

            <div className="mt-10 pt-10 border-t border-zinc-800">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Seneste medlemmer</p>
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden">
                    <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-zinc-950">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">Det hele starter med en <span className="text-orange-500 italic">Dato</span></h2>
            <p className="text-xl text-gray-500 font-light">
              Vi gør det nemt og sjovt at møde nye mennesker. Vores platform er designet til at skabe ægte forbindelser gennem spændende profiler og interaktioner.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Ægte Profiler", desc: "Vi verificerer vores brugere for at sikre en tryg oplevelse.", icon: <Users size={32} /> },
              { title: "Hurtig Chat", desc: "Start en samtale med det samme med vores intuitive chat.", icon: <MessageCircle size={32} /> },
              { title: "Sikker Platform", desc: "Dine data er beskyttet med den nyeste teknologi.", icon: <Shield size={32} /> }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-zinc-900/50 border border-zinc-800 p-10 rounded-[32px] hover:bg-zinc-900 transition-all group"
              >
                <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Comparison Section */}
      <section id="membership" className="py-32 bg-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/5 blur-[160px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 uppercase">Vælg din <span className="text-orange-500">oplevelse</span></h2>
            <p className="text-xl text-gray-500 font-light">
              Uanset om du er her for at kigge eller for at finde den helt store gnist, har vi en pakke der passer til dig.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Basis Plan */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900/30 border border-zinc-800 p-10 rounded-[40px] backdrop-blur-sm flex flex-col"
            >
              <div className="mb-8">
                <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">Basis</h3>
                <p className="text-gray-500 text-sm">Til dig der lige er startet</p>
              </div>

              <div className="space-y-6 flex-1">
                {[
                  { text: "3 Galleri billeder", included: true },
                  { text: "Standard profil synlighed", included: true },
                  { text: "Se hvem der liker dig", included: false },
                  { text: "Gratis billeder i chat", included: false },
                  { text: "Daglige gratis beskeder", included: false },
                  { text: "Prioriteret support", included: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center",
                      item.included ? "bg-green-500/10 text-green-500" : "bg-zinc-800 text-gray-600"
                    )}>
                      {item.included ? <Activity size={12} /> : <Lock size={12} />}
                    </div>
                    <span className={cn("text-sm font-bold", item.included ? "text-gray-200" : "text-gray-600")}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              <button onClick={login} className="mt-12 w-full py-5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-black transition-all active:scale-95">
                Opret Gratis Profil
              </button>
            </motion.div>

            {/* VIP Plan */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 border-2 border-orange-500/50 p-10 rounded-[40px] backdrop-blur-sm flex flex-col relative"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-6 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                Mest Populær
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-3xl font-black uppercase tracking-tight text-orange-500">VIP</h3>
                  <div className="bg-orange-500/20 p-1 rounded-lg">
                    <Activity size={20} className="text-orange-500" />
                  </div>
                </div>
                <p className="text-gray-400 text-sm">Den ultimative dating oplevelse</p>
              </div>

              <div className="space-y-6 flex-1">
                {[
                  { text: "10 Galleri billeder", included: true },
                  { text: "Boostet profil synlighed", included: true },
                  { text: "Se hvem der har liket dig", included: true },
                  { text: "Gratis adgang til alle billeder", included: true },
                  { text: "5 Daglige gratis beskeder", included: true },
                  { text: "Prioriteret support", included: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center">
                      <Activity size={12} />
                    </div>
                    <span className="text-sm font-bold text-white">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              <button onClick={login} className="mt-12 w-full py-5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black transition-all active:scale-95 shadow-xl shadow-orange-500/20">
                Bliv VIP Medlem
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-32 border-y border-zinc-900">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { label: "Medlemmer i alt", value: "25.430+", icon: <Users className="text-blue-500" /> },
              { label: "Online nu", value: "1.240", icon: <Activity className="text-green-500" /> },
              { label: "Kvinder online", value: "642", icon: <Heart className="text-rose-500" /> },
              { label: "Mænd online", value: "598", icon: <Heart className="text-blue-400" /> }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center space-y-4"
              >
                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-black tracking-tighter">{stat.value}</div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-orange-500/5 blur-[120px] rounded-full -translate-y-1/2" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-10">Klar til at finde din <span className="text-orange-500">gnist?</span></h2>
          <button 
            onClick={login}
            className="bg-orange-500 hover:bg-orange-600 text-white px-16 py-6 rounded-2xl text-2xl font-black shadow-2xl shadow-orange-500/40 transition-all active:scale-95"
          >
            Tilmeld dig GRATIS nu
          </button>
          <p className="mt-8 text-gray-500 font-medium">Ingen kreditkort påkrævet. 50 gratis coins ved tilmelding.</p>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 border-t border-zinc-900 bg-black">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Heart className="text-orange-500 fill-current" size={20} />
            <span className="text-lg font-black tracking-tighter">SPARK</span>
          </div>
          <div className="flex gap-8 text-sm font-bold text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privatlivspolitik</a>
            <a href="#" className="hover:text-white transition-colors">Betingelser</a>
            <a href="#" className="hover:text-white transition-colors">Kontakt</a>
          </div>
          <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">© 2026 SPARK DATING. ALLE RETTIGHEDER FORBEHOLDES.</p>
        </div>
      </footer>
    </div>
  );
};

const SwipeGame = ({ showToast, impersonatedProfile }: { showToast: (msg: string) => void, impersonatedProfile?: any }) => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<null | 'left' | 'right'>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      const data = await getFantasyProfiles();
      if (data) {
        // Filter out the impersonated profile if it exists
        const filtered = data.filter(p => p.id !== impersonatedProfile?.id);
        setProfiles(filtered);
      }
    };
    fetchProfiles();
  }, [impersonatedProfile]);

  const handleSwipe = async (dir: 'left' | 'right') => {
    setDirection(dir);
    
    const swiperId = impersonatedProfile ? impersonatedProfile.id : user?.uid;
    if (dir === 'right' && swiperId && profiles[currentIndex]) {
      const isMatch = await likeProfile(swiperId, profiles[currentIndex].id);
      if (isMatch) {
        showToast(impersonatedProfile ? `MATCH for ${impersonatedProfile.username}! ❤️` : 'Det er et MATCH! ❤️');
      }
    }

    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setDirection(null);
    }, 300);
  };

  const currentProfile = profiles[currentIndex];

  if (!currentProfile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white p-8">
        <Search className="w-16 h-16 text-orange-500 mb-4" />
        <h2 className="text-2xl font-bold">Ingen flere profiler i nærheden</h2>
        <p className="text-gray-400 text-center mt-2">Prøv at ændre dine filtre eller kom tilbage senere.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto aspect-[3/4] mt-8 group">
      {impersonatedProfile && (
        <div className="absolute -top-12 left-0 right-0 flex justify-center">
          <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-full backdrop-blur-md">
            <Activity size={14} className="text-orange-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-orange-500">Impersonerer: {impersonatedProfile.username}</span>
          </div>
        </div>
      )}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentProfile.id}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            x: direction === 'left' ? -500 : direction === 'right' ? 500 : 0,
            rotate: direction === 'left' ? -20 : direction === 'right' ? 20 : 0
          }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="absolute inset-0 bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-zinc-800"
        >
          <img 
            src={currentProfile.gallery?.[0] || `https://picsum.photos/seed/${currentProfile.id}/600/800`} 
            alt={currentProfile.username}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-2xl font-bold text-white">{currentProfile.username}, {currentProfile.age}</h3>
              <div className="w-2 h-2 rounded-full bg-green-500" />
            </div>
            <p className="text-gray-300 text-sm mb-4">{currentProfile.city} • {currentProfile.status}</p>
            <p className="text-gray-400 text-xs line-clamp-2">{currentProfile.about}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute -bottom-20 left-0 w-full flex justify-center gap-6">
        <button 
          onClick={() => handleSwipe('left')}
          className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl"
        >
          <X size={32} />
        </button>
        <button 
          onClick={() => handleSwipe('right')}
          className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-green-500 hover:bg-green-500 hover:text-white transition-all shadow-xl"
        >
          <Heart size={32} />
        </button>
      </div>
    </div>
  );
};

const ProfilFabrik = ({ onBack, showToast }: { onBack: () => void, showToast: (msg: string) => void }) => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    setLoading(true);
    const data = await getFantasyProfiles();
    setProfiles(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      username: formData.get('username'),
      age: Number(formData.get('age')),
      city: formData.get('city'),
      gender: formData.get('gender'),
      seekingGender: formData.get('seekingGender'),
      status: formData.get('status'),
      about: formData.get('about'),
      backstory: formData.get('backstory'),
      interests: (formData.get('interests') as string).split(',').map(s => s.trim()),
      gallery: [formData.get('image') || `https://picsum.photos/seed/${formData.get('username')}/600/800`]
    };

    try {
      if (currentProfile) {
        await updateFantasyProfile(currentProfile.id, data);
        showToast('Profil opdateret!');
      } else {
        await createFantasyProfile(data);
        showToast('Profil oprettet!');
      }
      setIsEditing(false);
      setCurrentProfile(null);
      loadProfiles();
    } catch (error) {
      showToast('Fejl under gemning.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFantasyProfile(id);
      showToast('Profil slettet.');
      setDeleteConfirm(null);
      loadProfiles();
    } catch (error) {
      showToast('Kunne ikke slette profil.');
    }
  };

  if (isEditing || currentProfile) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <button onClick={() => { setIsEditing(false); setCurrentProfile(null); }} className="p-2 bg-zinc-900 rounded-xl hover:bg-zinc-800">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold">{currentProfile ? 'Rediger Profil' : 'Opret Ny Profil'}</h2>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-900 p-6 md:p-8 rounded-3xl border border-zinc-800 space-y-6 max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 uppercase font-bold">Brugernavn</label>
              <input name="username" required defaultValue={currentProfile?.username} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1 outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase font-bold">Alder</label>
              <input name="age" type="number" required defaultValue={currentProfile?.age} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1 outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase font-bold">By</label>
              <input name="city" required defaultValue={currentProfile?.city} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1 outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase font-bold">Køn</label>
              <select name="gender" defaultValue={currentProfile?.gender || 'Kvinde'} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1 outline-none focus:ring-2 focus:ring-orange-500">
                <option>Kvinde</option>
                <option>Mand</option>
                <option>Andet</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase font-bold">Søger Køn</label>
              <select name="seekingGender" defaultValue={currentProfile?.seekingGender || 'Mand'} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1 outline-none focus:ring-2 focus:ring-orange-500">
                <option>Mand</option>
                <option>Kvinde</option>
                <option>Begge</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase font-bold">Status / Tagline</label>
            <input name="status" required defaultValue={currentProfile?.status} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1 outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase font-bold">Om (Kort)</label>
            <textarea name="about" required defaultValue={currentProfile?.about} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1 outline-none focus:ring-2 focus:ring-orange-500 h-20" />
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase font-bold">Backstory (For Moderatorer)</label>
            <textarea name="backstory" required defaultValue={currentProfile?.backstory} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1 outline-none focus:ring-2 focus:ring-orange-500 h-32" />
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase font-bold">Interesser (Komma-separeret)</label>
            <input name="interests" required defaultValue={currentProfile?.interests?.join(', ')} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1 outline-none focus:ring-2 focus:ring-orange-500" placeholder="Kunst, Rejser, Vin..." />
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase font-bold">Billeder</label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {currentProfile?.gallery?.map((img: string, idx: number) => (
                <div key={idx} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-zinc-800 group">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => {
                      const newGallery = currentProfile.gallery.filter((_: any, i: number) => i !== idx);
                      setCurrentProfile({ ...currentProfile, gallery: newGallery });
                    }}
                    className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <div className="aspect-[3/4] bg-zinc-800 border-2 border-dashed border-zinc-700 rounded-xl flex items-center justify-center">
                <FileUploader 
                  path="fantasy-profiles" 
                  label="+" 
                  onUpload={(url) => {
                    const newGallery = [...(currentProfile?.gallery || []), url];
                    setCurrentProfile({ ...currentProfile, gallery: newGallery });
                  }} 
                />
              </div>
            </div>
          </div>
          <button type="submit" className="w-full py-4 bg-orange-500 hover:bg-orange-600 rounded-2xl font-bold transition-all active:scale-95">
            Gem Profil
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-all border border-zinc-800">
            <ChevronLeft size={20} />
            <span className="text-sm font-bold">Tilbage</span>
          </button>
          <h2 className="text-2xl font-bold">Profil Fabrik</h2>
        </div>
        <button onClick={() => setIsEditing(true)} className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
          <Plus size={16} /> Opret Ny
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {profiles.map(p => (
            <div key={p.id} className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden group">
              <div className="aspect-[3/4] relative">
                <img src={p.gallery?.[0]} alt={p.username} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 gap-2">
                  <button onClick={() => setCurrentProfile(p)} className="flex-1 py-2 bg-white text-black rounded-xl font-bold text-xs flex items-center justify-center gap-1">
                    <Edit2 size={12} /> Rediger
                  </button>
                  <button onClick={() => setDeleteConfirm(p.id)} className="p-2 bg-red-500 text-white rounded-xl">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold">{p.username}, {p.age}</h3>
                <p className="text-xs text-gray-500">{p.city}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">Er du sikker?</h3>
            <p className="text-gray-400 mb-8">Denne handling kan ikke fortrydes. Profilen og alle tilhørende data vil blive slettet permanent.</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-6 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 font-bold transition-all"
              >
                Annuller
              </button>
              <button 
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-6 py-3 rounded-2xl bg-red-500 hover:bg-red-600 font-bold transition-all"
              >
                Slet Profil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const UserManagement = ({ onBack, showToast }: { onBack: () => void, showToast: (msg: string) => void }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const data = await getAllUsers();
    setUsers(data || []);
    setLoading(false);
  };

  const handleAddCoins = async (uid: string) => {
    const amount = Number(prompt('Hvor mange coins skal tilføjes?', '100'));
    if (amount) {
      const user = users.find(u => u.uid === uid);
      await updateUserCoins(uid, (user?.coins || 0) + amount);
      showToast(`${amount} coins tilføjet!`);
      loadUsers();
    }
  };

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.uid?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-all border border-zinc-800">
            <ChevronLeft size={20} />
            <span className="text-sm font-bold">Tilbage</span>
          </button>
          <h2 className="text-2xl font-bold">User Management</h2>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Søg på email eller ID..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>
      </div>

      <div className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Bruger</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Rolle</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Saldo</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Oprettet</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Handlinger</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Henter brugere...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Ingen brugere fundet.</td></tr>
              ) : (
                filteredUsers.map(u => (
                  <tr key={u.uid} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold">
                          {u.email?.[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-bold">{u.email}</div>
                          <div className="text-[10px] text-gray-500">{u.uid}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "px-2 py-1 rounded-md text-[10px] font-bold uppercase",
                        u.role === 'admin' ? "bg-red-500/10 text-red-500" : 
                        u.role === 'moderator' ? "bg-blue-500/10 text-blue-500" : "bg-green-500/10 text-green-500"
                      )}>
                        {u.role || 'user'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-orange-500 font-bold">
                        <Coins size={14} /> {u.coins || 0}
                      </div>
                    </td>
                    <td className="p-4 text-xs text-gray-500">
                      {u.createdAt?.toDate().toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <button onClick={() => handleAddCoins(u.uid)} className="text-xs bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded-lg border border-zinc-700 transition-all">
                        + Coins
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const SystemStats = ({ onBack }: { onBack: () => void }) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    const data = await getSystemStats();
    setStats(data);
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-all border border-zinc-800">
          <ChevronLeft size={20} />
          <span className="text-sm font-bold">Tilbage</span>
        </button>
        <h2 className="text-2xl font-bold">System Stats</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Brugere', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Aktive Chats', value: stats?.totalChats || 0, icon: MessageCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Beskeder Sendt', value: stats?.totalMessages || 0, icon: Activity, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { label: 'Omsætning (Coins)', value: stats?.totalRevenue || 0, icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        ].map((s, i) => (
          <div key={i} className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", s.bg, s.color)}>
              <s.icon size={24} />
            </div>
            <div className="text-3xl font-bold mb-1">{s.value}</div>
            <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
          <h3 className="text-xl font-bold mb-6">User Distribution</h3>
          <div className="flex items-center gap-8">
            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">VIP Medlemmer</span>
                <span className="font-bold text-orange-500">{stats?.userDistribution?.vip || 0}</span>
              </div>
              <div className="w-full bg-black h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-orange-500 h-full transition-all duration-1000" 
                  style={{ width: `${(stats?.userDistribution?.vip / stats?.totalUsers) * 100 || 0}%` }} 
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Basis Medlemmer</span>
                <span className="font-bold text-blue-500">{stats?.userDistribution?.basis || 0}</span>
              </div>
              <div className="w-full bg-black h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full transition-all duration-1000" 
                  style={{ width: `${(stats?.userDistribution?.basis / stats?.totalUsers) * 100 || 0}%` }} 
                />
              </div>
            </div>
            <div className="w-32 h-32 rounded-full border-8 border-zinc-800 flex items-center justify-center relative">
              <div className="text-center">
                <div className="text-2xl font-black">{stats?.totalUsers}</div>
                <div className="text-[8px] text-gray-500 uppercase font-bold">Total</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
          <h3 className="text-xl font-bold mb-6">Top Fantasy Profiler</h3>
          <div className="space-y-4">
            {stats?.topFantasyProfiles?.map((p: any, i: number) => (
              <div key={p.id} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-2xl transition-all">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-800 bg-zinc-800">
                  <img src={p.gallery?.[0]} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold">{p.username}</div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold">{p.city}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-orange-500 flex items-center gap-1 justify-end">
                    <Heart size={12} className="fill-current" /> {p.likeCount || 0}
                  </div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold">Likes</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
          <h3 className="text-xl font-bold mb-6">Moderator Performance</h3>
          <div className="space-y-6">
            {[
              { name: 'Fantasy Support Team', messages: 1245, responseTime: '45s', efficiency: 98 },
              { name: 'Night Shift AI', messages: 856, responseTime: '12s', efficiency: 100 },
              { name: 'Weekend Crew', messages: 432, responseTime: '1m 20s', efficiency: 92 },
            ].map((mod, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-bold">{mod.name}</span>
                  <span className="text-gray-500">{mod.messages} beskeder</span>
                </div>
                <div className="w-full bg-black h-2 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full" style={{ width: `${mod.efficiency}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-gray-500 uppercase font-bold">
                  <span>Effektivitet: {mod.efficiency}%</span>
                  <span>Svartid: {mod.responseTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
          <h3 className="text-xl font-bold mb-6">Seneste Aktivitet</h3>
          <div className="space-y-4">
            {[
              { type: 'user', text: 'Ny bruger tilmeldt: luzyfurz@gmail.com', time: '2m siden' },
              { type: 'chat', text: 'Ny chat startet mellem Isabella og Mads', time: '5m siden' },
              { type: 'coins', text: 'Kunde købte 500 coins', time: '12m siden' },
              { type: 'admin', text: 'Fantasy profil "Isabella" opdateret', time: '45m siden' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-2xl transition-all cursor-default">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  activity.type === 'user' ? "bg-blue-500" :
                  activity.type === 'chat' ? "bg-green-500" :
                  activity.type === 'coins' ? "bg-orange-500" : "bg-purple-500"
                )} />
                <div className="flex-1">
                  <p className="text-sm">{activity.text}</p>
                  <span className="text-[10px] text-gray-500">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminPanel = ({ setActiveTab, showToast, impersonatedProfile, setImpersonatedProfile }: { setActiveTab: (tab: any) => void, showToast: (msg: string) => void, impersonatedProfile: any, setImpersonatedProfile: (p: any) => void }) => {
  const [seeding, setSeeding] = useState(false);
  const [subView, setSubView] = useState<'main' | 'fabrik' | 'users' | 'stats' | 'impersonate' | 'settings'>('main');

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await seedFantasyProfiles();
      showToast('20 Fantasy profiler er oprettet!');
    } catch (error) {
      console.error(error);
      showToast('Der skete en fejl under seeding.');
    } finally {
      setSeeding(false);
    }
  };

  const handleSeedTestData = async () => {
    setSeeding(true);
    try {
      await seedTestUsersAndMessages();
      showToast('Test brugere og beskeder er oprettet!');
    } catch (error) {
      console.error(error);
      showToast('Fejl ved oprettelse af test data');
    } finally {
      setSeeding(false);
    }
  };

  if (subView === 'fabrik') return <ProfilFabrik onBack={() => setSubView('main')} showToast={showToast} />;
  if (subView === 'users') return <UserManagement onBack={() => setSubView('main')} showToast={showToast} />;
  if (subView === 'stats') return <SystemStats onBack={() => setSubView('main')} />;
  if (subView === 'settings') return <SystemSettingsManager onBack={() => setSubView('main')} showToast={showToast} />;
  if (subView === 'impersonate') return <ImpersonationManager onBack={() => setSubView('main')} setImpersonatedProfile={setImpersonatedProfile} impersonatedProfile={impersonatedProfile} setActiveTab={setActiveTab} />;

  return (
    <div className="p-4 md:p-8 text-white w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Admin Panel</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {impersonatedProfile && (
            <div className="flex items-center gap-3 bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-xl">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-orange-500">
                <img src={impersonatedProfile.gallery?.[0]} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-orange-500 font-bold uppercase tracking-tighter">Aktiv Impersonering</span>
                <span className="text-xs font-bold">{impersonatedProfile.username}</span>
              </div>
              <button 
                onClick={() => setImpersonatedProfile(null)}
                className="ml-2 text-gray-500 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )}
          <button 
            onClick={handleSeed}
            disabled={seeding}
            className="bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 px-6 py-3 rounded-2xl text-sm font-bold border border-zinc-700 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {seeding ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : <Settings size={16} />}
            {seeding ? 'Seeder...' : 'Seed 20 Fantasy Profiler'}
          </button>
          <button 
            onClick={handleSeedTestData}
            disabled={seeding}
            className="bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 px-6 py-3 rounded-2xl text-sm font-bold border border-zinc-700 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {seeding ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : <MessageCircle size={16} />}
            {seeding ? 'Seeder...' : 'Seed Test Beskeder'}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 flex flex-col">
          <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 mb-4">
            <MessageCircle size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">Moderator Workstation</h3>
          <p className="text-gray-400 text-sm mb-6 flex-1">Gå til moderator-interfacet for at håndtere chats og kundekontakt.</p>
          <button 
            onClick={() => setActiveTab('mod')}
            className="w-full py-4 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-orange-500/20"
          >
            Åben Workstation
          </button>
        </div>

        <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 flex flex-col">
          <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 mb-4">
            <TrendingUp size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">Impersonation Swipe</h3>
          <p className="text-gray-400 text-sm mb-6 flex-1">Vælg en fantasy profil og swipe på deres vegne for at skabe matches.</p>
          <button 
            onClick={() => setSubView('impersonate')}
            className="w-full py-4 bg-rose-500 hover:bg-rose-600 active:bg-rose-700 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-rose-500/20"
          >
            Vælg Profil & Swipe
          </button>
        </div>

        <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 flex flex-col">
          <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-4">
            <User size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">Profil Fabrik</h3>
          <p className="text-gray-400 text-sm mb-6 flex-1">Opret, rediger og slet fantasy profiler i systemet.</p>
          <button 
            onClick={() => setSubView('fabrik')}
            className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 border border-zinc-700 rounded-2xl font-bold transition-all active:scale-95"
          >
            Administrer
          </button>
        </div>

        <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 flex flex-col">
          <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 mb-4">
            <Coins size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">User Management</h3>
          <p className="text-gray-400 text-sm mb-6 flex-1">Overblik over kunders saldo, historik og kontostatus.</p>
          <button 
            onClick={() => setSubView('users')}
            className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 border border-zinc-700 rounded-2xl font-bold transition-all active:scale-95"
          >
            Administrer
          </button>
        </div>

        <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 flex flex-col">
          <div className="w-12 h-12 bg-zinc-500/10 rounded-2xl flex items-center justify-center text-zinc-500 mb-4">
            <Settings size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">System Priser</h3>
          <p className="text-gray-400 text-sm mb-6 flex-1">Ret priser for beskeder, billeder og VIP fordele.</p>
          <button 
            onClick={() => setSubView('settings')}
            className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 border border-zinc-700 rounded-2xl font-bold transition-all active:scale-95"
          >
            Ret Priser
          </button>
        </div>

        <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 flex flex-col">
          <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 mb-4">
            <Filter size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">System Stats</h3>
          <p className="text-gray-400 text-sm mb-6 flex-1">Se detaljeret statistik over aktivitet, matches og omsætning.</p>
          <button 
            onClick={() => setSubView('stats')}
            className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 border border-zinc-700 rounded-2xl font-bold transition-all active:scale-95"
          >
            Se Stats
          </button>
        </div>
      </div>
    </div>
  );
};

const SystemSettingsManager = ({ onBack, showToast }: { onBack: () => void, showToast: (msg: string) => void }) => {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = getSystemSettings((data) => {
      setSettings(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newSettings = {
      prices: {
        basicMessage: Number(formData.get('basicMessage')),
        vipMessage: Number(formData.get('vipMessage')),
        imageMessage: Number(formData.get('imageMessage')),
        unlockImage: Number(formData.get('unlockImage')),
      },
      vipBenefits: {
        freeMessagesPerDay: Number(formData.get('freeMessagesPerDay')),
      }
    };
    
    try {
      await updateSystemSettings(newSettings);
      showToast('Systemindstillinger gemt!');
    } catch (error) {
      console.error(error);
      showToast('Fejl ved gemning af indstillinger');
    }
  };

  if (loading) return <div className="p-8 text-center">Henter indstillinger...</div>;

  return (
    <div className="p-4 md:p-8 text-white w-full max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-all">
          <ChevronLeft size={24} />
          <span className="font-bold">Tilbage til Admin</span>
        </button>
        <h2 className="text-2xl font-bold">System Priser & Indstillinger</h2>
      </div>

      <form onSubmit={handleSave} className="bg-zinc-900 border border-zinc-800 rounded-[40px] p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2 text-orange-500">
              <Coins size={20} />
              Besked Priser
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold">Basis Besked (Coins)</label>
                <input name="basicMessage" type="number" defaultValue={settings?.prices?.basicMessage} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1 outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold">VIP Besked (Coins)</label>
                <input name="vipMessage" type="number" defaultValue={settings?.prices?.vipMessage} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1 outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold">Sende Billede (Coins)</label>
                <input name="imageMessage" type="number" defaultValue={settings?.prices?.imageMessage} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1 outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold">Låse op for Billede (Coins)</label>
                <input name="unlockImage" type="number" defaultValue={settings?.prices?.unlockImage} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1 outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2 text-blue-500">
              <Activity size={20} />
              VIP Fordele
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold">Gratis Beskeder pr. Dag</label>
                <input name="freeMessagesPerDay" type="number" defaultValue={settings?.vipBenefits?.freeMessagesPerDay} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            
            <div className="bg-zinc-800/50 border border-zinc-700/50 p-6 rounded-3xl space-y-3">
              <h4 className="text-sm font-bold text-gray-400">Forslag til Coin-brug:</h4>
              <ul className="text-xs text-gray-500 space-y-2 list-disc pl-4">
                <li>Boost profil i søgeresultater (f.eks. 20 coins for 1 time)</li>
                <li>Se hvem der har liket din profil (f.eks. 10 coins pr. afsløring)</li>
                <li>Virtuelle gaver til fantasy profiler (f.eks. 5-50 coins)</li>
                <li>Prioriteret besked-levering (f.eks. 3 coins pr. besked)</li>
                <li>Anonym browsing mode (f.eks. 50 coins pr. dag)</li>
                <li>Super Like: Giver modtageren en push-notifikation med det samme (f.eks. 5 coins)</li>
                <li>Læs-kvitteringer: Se hvornår dine beskeder bliver læst (f.eks. 15 coins pr. måned)</li>
                <li>Teleport: Skift din lokation til en anden by midlertidigt (f.eks. 10 coins pr. dag)</li>
                <li>Profil-temaer: Lås op for unikke farver og badges på din profil (f.eks. 25 coins)</li>
              </ul>
            </div>
          </div>
        </div>

        <button type="submit" className="w-full py-4 bg-orange-500 hover:bg-orange-600 rounded-2xl font-bold transition-all active:scale-95 shadow-xl shadow-orange-500/20">
          Gem Systemindstillinger
        </button>
      </form>
    </div>
  );
};

const ImpersonationManager = ({ onBack, setImpersonatedProfile, impersonatedProfile, setActiveTab }: { onBack: () => void, setImpersonatedProfile: (p: any) => void, impersonatedProfile: any, setActiveTab: (tab: any) => void }) => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getFantasyProfiles();
      if (data) setProfiles(data);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="p-4 md:p-8 text-white w-full max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-all">
          <ChevronLeft size={24} />
          <span className="font-bold">Tilbage til Admin</span>
        </button>
        <h2 className="text-2xl font-bold">Vælg Karakter at Impersonere</h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-zinc-900 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {profiles.map(p => (
            <div 
              key={p.id}
              onClick={() => {
                setImpersonatedProfile(p);
              }}
              className={cn(
                "relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer border-2 transition-all group",
                impersonatedProfile?.id === p.id ? "border-orange-500 scale-95" : "border-transparent hover:border-zinc-700"
              )}
            >
              <img src={p.gallery?.[0]} alt={p.username} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 p-3 w-full">
                <p className="text-sm font-bold truncate">{p.username}</p>
                <p className="text-[10px] text-gray-400">{p.city}</p>
              </div>
              {impersonatedProfile?.id === p.id && (
                <div className="absolute top-2 right-2 bg-orange-500 text-white p-1 rounded-full">
                  <Activity size={12} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {impersonatedProfile && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-4"
        >
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-2xl flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500">
                <img src={impersonatedProfile.gallery?.[0]} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-sm font-bold">Du impersonerer nu {impersonatedProfile.username}</p>
                <p className="text-xs text-gray-500">Klar til at swipe på deres vegne</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('swipe')}
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-orange-500/20 transition-all active:scale-95"
            >
              <TrendingUp size={20} />
              Gå til Swipe Game
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const UserChat = ({ showToast }: { showToast: (msg: string) => void }) => {
  const { user, profile } = useAuth();
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsub = getChatsForUser(user.uid, async (data) => {
      const enriched = await Promise.all(data.map(async (chat) => {
        const otherId = chat.fantasyId === user.uid ? chat.customerId : chat.fantasyId;
        const otherProfile = await getDoc(doc(db, 'fantasyProfiles', otherId));
        return { ...chat, otherProfile: otherProfile.exists() ? { id: otherProfile.id, ...otherProfile.data() } : null };
      }));
      setChats(enriched);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  if (selectedChat) {
    return <ChatWindow chat={selectedChat} onBack={() => setSelectedChat(null)} showToast={showToast} />;
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto w-full text-white space-y-8">
      <h1 className="text-4xl font-bold tracking-tight">Beskeder</h1>
      
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-zinc-900 rounded-2xl animate-pulse" />)}
        </div>
      ) : chats.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/50 rounded-[40px] border border-zinc-800">
          <MessageCircle size={48} className="mx-auto text-zinc-700 mb-4" />
          <h2 className="text-xl font-bold">Ingen beskeder endnu</h2>
          <p className="text-gray-500 mt-2">Find et match og start en samtale!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {chats.map(chat => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className="flex items-center gap-4 p-4 bg-zinc-900 hover:bg-zinc-800 rounded-3xl border border-zinc-800 transition-all group text-left"
            >
              <div className="w-14 h-14 rounded-2xl overflow-hidden border border-zinc-700">
                <img src={chat.otherProfile?.gallery?.[0]} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold truncate">{chat.otherProfile?.username}</h3>
                  <span className="text-[10px] text-gray-500">{chat.lastTimestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
              </div>
              {chat.unreadCount > 0 && (
                <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-[10px] font-bold">
                  {chat.unreadCount}
                </div>
              )}
              <ChevronRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ChatWindow = ({ chat, onBack, showToast }: { chat: any, onBack: () => void, showToast: (msg: string) => void }) => {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [settings, setSettings] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubMessages = getChatMessages(chat.id, (data) => {
      setMessages(data);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });
    const unsubSettings = getSystemSettings(setSettings);
    markChatAsRead(chat.id);
    return () => {
      unsubMessages();
      unsubSettings();
    };
  }, [chat.id]);

  const handleSend = async (imageUrl?: string) => {
    if (!inputText.trim() && !imageUrl) return;
    try {
      await sendMessage(chat.id, user!.uid, chat.fantasyId, inputText, imageUrl);
      setInputText('');
    } catch (error: any) {
      try {
        const err = JSON.parse(error.message);
        if (err.error === 'Insufficient coins') {
          showToast('Du mangler coins! Køb flere i shoppen.');
        } else {
          showToast('Kunne ikke sende besked.');
        }
      } catch {
        showToast('Kunne ikke sende besked.');
      }
    }
  };

  const handleUnlock = async (messageId: string) => {
    try {
      await unlockMessageImage(chat.id, messageId, user!.uid);
      showToast('Billede låst op!');
    } catch (error: any) {
      try {
        const err = JSON.parse(error.message);
        if (err.error === 'Insufficient coins') {
          showToast('Du mangler coins! Køb flere i shoppen.');
        } else {
          showToast('Kunne ikke låse billede op.');
        }
      } catch {
        showToast('Kunne ikke låse billede op.');
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] lg:h-screen max-w-4xl mx-auto w-full bg-black">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 flex items-center gap-4 bg-zinc-900/50 backdrop-blur-md">
        <button onClick={onBack} className="p-2 hover:bg-zinc-800 rounded-xl transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-700">
          <img src={chat.otherProfile?.gallery?.[0]} alt="" className="w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="font-bold">{chat.otherProfile?.username}</h3>
          <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Online nu</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => {
          const isMe = m.senderId === user?.uid;
          const isLocked = m.imageUrl && m.isLocked && !profile?.isVip && !isMe;

          return (
            <div key={m.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[80%] rounded-2xl p-3 shadow-lg",
                isMe ? "bg-orange-500 text-white rounded-tr-none" : "bg-zinc-900 text-gray-200 rounded-tl-none border border-zinc-800"
              )}>
                {m.imageUrl ? (
                  <div className="space-y-2">
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-zinc-800 min-w-[200px]">
                      {isLocked ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-zinc-900/80 backdrop-blur-xl">
                          <Lock size={32} className="text-orange-500 mb-2" />
                          <p className="text-xs font-bold mb-3">Dette billede er låst</p>
                          <button 
                            onClick={() => handleUnlock(m.id)}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-[10px] font-bold transition-all active:scale-95 flex items-center gap-2"
                          >
                            <Coins size={12} /> Lås op ({settings?.prices?.unlockImage || 5} Coins)
                          </button>
                          <p className="text-[8px] text-gray-500 mt-2 uppercase tracking-tighter">Gratis for VIP</p>
                        </div>
                      ) : (
                        <img src={m.imageUrl} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    {m.text && <p className="text-sm">{m.text}</p>}
                  </div>
                ) : (
                  <p className="text-sm">{m.text}</p>
                )}
                <p className={cn("text-[8px] mt-1 opacity-50", isMe ? "text-right" : "text-left")}>
                  {m.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <FileUploader 
            path={`chats/${chat.id}`} 
            label="" 
            onUpload={(url) => handleSend(url)} 
          />
          <input 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Skriv en besked..."
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500 transition-all"
          />
          <button 
            onClick={() => handleSend()}
            className="p-3 bg-orange-500 hover:bg-orange-600 rounded-2xl text-white transition-all active:scale-90 shadow-lg shadow-orange-500/20"
          >
            <Send size={20} />
          </button>
        </div>
        <div className="mt-2 flex justify-between items-center px-1">
          <p className="text-[8px] text-gray-500 uppercase tracking-widest">
            {profile?.isVip 
              ? `VIP: 50% rabat (${profile?.freeMessagesToday < (settings?.vipBenefits?.freeMessagesPerDay || 5) ? ((settings?.vipBenefits?.freeMessagesPerDay || 5) - profile.freeMessagesToday) + ' gratis tilbage' : (settings?.prices?.vipMessage || 2) + ' coins pr. besked'})` 
              : `Basis: ${settings?.prices?.basicMessage || 4} Coins pr. besked / ${settings?.prices?.imageMessage || 5} pr. billede`}
          </p>
          <div className="flex items-center gap-1">
            <Coins size={10} className="text-orange-500" />
            <span className="text-[10px] font-bold">{profile?.coins || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ModeratorBackend = ({ onBack, showToast }: { onBack?: () => void, showToast: (msg: string) => void }) => {
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [customer, setCustomer] = useState<any>(null);
  const [fantasy, setFantasy] = useState<any>(null);
  const [inputText, setInputText] = useState('');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Timer for active chat
  useEffect(() => {
    let interval: any;
    if (selectedChat && isSessionActive) {
      setElapsedTime(0);
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [selectedChat, isSessionActive]);

  // Polling for next chat
  useEffect(() => {
    let interval: any;
    if (isSessionActive && !selectedChat) {
      setIsSearching(true);
      const searchForChat = async () => {
        try {
          const nextChat = await getNextQueuedChat();
          if (nextChat) {
            setSelectedChat(nextChat);
            setIsSearching(false);
          }
        } catch (error) {
          console.error("Error searching for chat:", error);
        }
      };
      
      searchForChat();
      interval = setInterval(searchForChat, 5000);
    } else {
      setIsSearching(false);
    }
    return () => clearInterval(interval);
  }, [isSessionActive, selectedChat]);

  useEffect(() => {
    if (!selectedChat) {
      setMessages([]);
      setCustomer(null);
      setFantasy(null);
      return;
    }

    const unsubscribe = getChatMessages(selectedChat.id, (data) => {
      setMessages(data);
    });

    const loadInfo = async () => {
      try {
        const [c, profiles] = await Promise.all([
          getUserProfile(selectedChat.customerId),
          getFantasyProfiles()
        ]);
        setCustomer(c);
        const f = profiles?.find(p => p.id === selectedChat.fantasyId);
        setFantasy(f);
      } catch (error) {
        console.error("Error loading chat info:", error);
      }
    };
    loadInfo();
    markChatAsRead(selectedChat.id);

    return () => unsubscribe();
  }, [selectedChat]);

  const handleSend = async () => {
    if (!selectedChat || !inputText.trim()) return;
    try {
      await sendMessage(selectedChat.id, selectedChat.fantasyId, selectedChat.customerId, inputText);
      await markChatAsRead(selectedChat.id);
      setInputText('');
      setSelectedChat(null); // Return to waiting state
      showToast('Besked sendt!');
    } catch (error) {
      console.error(error);
      showToast('Kunne ikke sende besked');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden flex-col">
      {/* Top Header */}
      <div className="h-16 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-bold text-orange-500 uppercase tracking-widest">Moderator Workstation</h3>
          <div className="h-4 w-px bg-zinc-800" />
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", isSessionActive ? "bg-green-500 animate-pulse" : "bg-zinc-600")} />
            <span className="text-xs font-bold text-gray-400">{isSessionActive ? "Session Aktiv" : "Session Inaktiv"}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {onBack && (
            <button 
              onClick={onBack}
              className="text-xs bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-xl border border-zinc-700 transition-all flex items-center gap-1 font-bold"
            >
              <ChevronLeft size={14} /> Admin Panel
            </button>
          )}
          <button 
            onClick={() => setIsSessionActive(!isSessionActive)}
            className={cn(
              "px-6 py-2 rounded-xl font-bold text-xs transition-all border",
              isSessionActive 
                ? "bg-rose-500/10 border-rose-500/50 text-rose-500 hover:bg-rose-500/20" 
                : "bg-green-500/10 border-green-500/50 text-green-500 hover:bg-green-500/20"
            )}
          >
            {isSessionActive ? "Stop Session" : "Start Chat"}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {!isSessionActive ? (
          <div className="flex-1 flex items-center justify-center flex-col gap-6 bg-zinc-950">
            <div className="w-24 h-24 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 text-zinc-700">
              <Activity size={48} />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Moderation Inaktiv</h2>
              <p className="text-gray-500 max-w-md mx-auto">Tryk på "Start Chat" for at begynde at modtage beskeder fra kunder.</p>
            </div>
            <button 
              onClick={() => setIsSessionActive(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-orange-500/20"
            >
              Start Session
            </button>
          </div>
        ) : !selectedChat ? (
          <div className="flex-1 flex items-center justify-center flex-col gap-6 bg-zinc-950">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20 text-orange-500">
                <Search size={40} className="animate-bounce" />
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Søger efter beskeder...</h2>
              <p className="text-gray-500">Systemet lytter efter nye indkommende beskeder til fantasy profiler.</p>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Left: Customer Info */}
            <div className="w-80 border-r border-zinc-800 bg-zinc-900/20 p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Kunde</h3>
                <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-[10px] font-bold border border-green-500/20">ONLINE</span>
              </div>
              
              <div className="aspect-square rounded-2xl bg-zinc-900 mb-4 overflow-hidden border border-zinc-800">
                <img src={`https://picsum.photos/seed/${customer?.uid}/400/400`} alt="Customer" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold">{customer?.username || customer?.email?.split('@')[0]}</h2>
                  <p className="text-gray-400 text-sm">{customer?.city || 'Ukendt by'} • {customer?.age || '??'} år</p>
                </div>
                
                <div className="flex items-center gap-2 text-orange-500 font-bold text-sm bg-orange-500/10 p-3 rounded-xl border border-orange-500/20">
                  <Coins size={16} />
                  <span>{customer?.coins || 0} Coins</span>
                </div>

                <div className="pt-4 border-t border-zinc-800">
                  <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Interne Noter</label>
                  <textarea 
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm mt-2 h-32 focus:ring-1 focus:ring-orange-500 outline-none transition-all" 
                    placeholder="Skriv noter om kunden her..." 
                  />
                </div>
              </div>
            </div>

            {/* Middle: Chat Area */}
            <div className="flex-1 flex flex-col bg-zinc-950 relative border-x border-zinc-800">
              {/* Chat Header */}
              <div className="p-4 border-b border-zinc-800 bg-zinc-900/30 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-rose-500 text-white text-[10px] font-bold rounded-full animate-pulse">
                    LIVE SESSION
                  </div>
                  <span className="text-xs text-gray-400 font-mono">ID: #{selectedChat.id.slice(0, 8)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="text-gray-500">SVARTID:</span>
                  <span className={cn(
                    "font-mono",
                    elapsedTime > 60 ? "text-rose-500" : "text-orange-500"
                  )}>{formatTime(elapsedTime)}</span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/20 to-transparent">
                {messages.map(msg => (
                  <div key={msg.id} className={cn("flex", msg.senderId === selectedChat.fantasyId ? "justify-end" : "justify-start")}>
                    <div className={cn(
                      "rounded-2xl p-4 max-w-[80%] shadow-lg",
                      msg.senderId === selectedChat.fantasyId 
                        ? "bg-orange-500 text-white rounded-tr-none" 
                        : "bg-zinc-800 text-gray-100 rounded-tl-none border border-zinc-700"
                    )}>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className={cn(
                          "text-[10px]",
                          msg.senderId === selectedChat.fantasyId ? "text-orange-200" : "text-gray-500"
                        )}>
                          {msg.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {msg.senderId !== selectedChat.fantasyId && (
                          <span className="text-[10px] text-orange-500 font-bold uppercase tracking-tighter">Kunde</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 backdrop-blur-md">
                <div className="relative">
                  <textarea 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 pr-32 text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all h-28 resize-none shadow-inner"
                    placeholder="Skriv dit svar som karakteren..."
                  />
                  <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                    <button 
                      onClick={handleSend}
                      disabled={!inputText.trim()}
                      className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/30 flex items-center gap-2"
                    >
                      Send Svar
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex justify-between items-center px-2">
                  <div className="flex gap-4">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Tegn: {inputText.length}</span>
                    <span className="text-[10px] text-orange-500 font-bold uppercase tracking-widest">Moderator Mode</span>
                  </div>
                  <button className="text-[10px] text-zinc-600 hover:text-rose-500 font-bold uppercase transition-all">Anmeld Bruger</button>
                </div>
              </div>
            </div>

            {/* Right: Fantasy Info */}
            <div className="w-80 border-l border-zinc-800 bg-zinc-900/20 p-6 overflow-y-auto">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Din Karakter</h3>
              
              <div className="aspect-square rounded-2xl bg-zinc-900 mb-4 overflow-hidden border border-zinc-800">
                <img src={fantasy?.gallery?.[0]} alt="Fantasy" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold">{fantasy?.username}, {fantasy?.age}</h2>
                  <p className="text-gray-400 text-sm">{fantasy?.city} • {fantasy?.status}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Backstory</label>
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 mt-2">
                      <p className="text-xs text-gray-300 leading-relaxed italic">
                        "{fantasy?.backstory}"
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Interesser</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {fantasy?.interests?.map((tag: string) => (
                        <span key={tag} className="px-2 py-1 bg-orange-500/5 border border-orange-500/10 rounded-md text-[10px] text-orange-400 font-medium">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const ProfileSearch = ({ onSelect }: { onSelect: (profile: any) => void }) => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Søgning');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getFantasyProfiles();
      setProfiles(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = profiles.filter(p => {
    const matchesSearch = p.username?.toLowerCase().includes(search.toLowerCase()) || 
                         p.city?.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full text-white space-y-8">
      <div className="flex flex-wrap gap-3">
        {['Søgning', 'Søg profilnavn', 'Anbefalinger', 'Hvad nu hvis'].map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-6 py-2.5 rounded-full text-sm font-bold transition-all",
              filter === f ? "bg-orange-500 text-white" : "bg-zinc-900 text-gray-400 hover:bg-zinc-800"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">Søgning</h1>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input 
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Søg på navn eller by..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-lg outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            />
          </div>
          <button className="bg-zinc-900 border border-zinc-800 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all">
            <Filter size={20} />
            Tilpas søgning
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-zinc-900 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {filtered.map(p => (
            <motion.div 
              key={p.id}
              whileHover={{ y: -10 }}
              onClick={() => onSelect(p)}
              className="relative aspect-[3/4] rounded-3xl overflow-hidden cursor-pointer group shadow-2xl"
            >
              <img 
                src={p.gallery?.[0]} 
                alt={p.username} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 md:p-6 w-full">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg md:text-xl font-bold">{p.username}</h3>
                  <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                </div>
                <p className="text-xs md:text-sm text-gray-300">{p.age} år, {p.city}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const ProfileDetail = ({ profile, onBack, onMessage }: { profile: any, onBack: () => void, onMessage: (p: any) => void }) => {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto w-full text-white space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-all group">
        <ChevronLeft className="group-hover:-translate-x-1 transition-transform" size={24} />
        <span className="font-bold">Tilbage til søgning</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border border-zinc-800">
            <img 
              src={profile.gallery?.[0]} 
              alt={profile.username} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {profile.gallery?.slice(1).map((img: string, i: number) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden border border-zinc-800">
                <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold tracking-tight">{profile.username}, {profile.age}</h1>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            </div>
            <p className="text-xl text-gray-400 font-light">{profile.city} • {profile.status}</p>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => onMessage(profile)}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-orange-500/20 transition-all active:scale-95"
            >
              <MessageCircle size={20} />
              Send Besked
            </button>
            <button className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:bg-zinc-800 transition-all">
              <Heart size={24} className="text-red-500" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl space-y-4">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Om mig</h3>
              <p className="text-gray-300 leading-relaxed">{profile.about}</p>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl space-y-4">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Interesser</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests?.map((interest: string) => (
                  <span key={interest} className="px-4 py-1.5 bg-zinc-800 border border-zinc-700 rounded-full text-xs font-bold text-gray-300">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Matches = ({ onSelect, impersonatedProfile }: { onSelect: (profile: any) => void, impersonatedProfile?: any }) => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const targetId = impersonatedProfile ? impersonatedProfile.id : user?.uid;
    if (!targetId) return;

    const unsub = getMatches(targetId, async (data) => {
      const enriched = await Promise.all(data.map(async (m) => {
        const otherId = m.users.find((id: string) => id !== targetId);
        // Try to get from fantasyProfiles first
        const fantasy = await getDoc(doc(db, 'fantasyProfiles', otherId));
        if (fantasy.exists()) return { ...m, profile: { id: fantasy.id, ...fantasy.data() } };
        // Then try users
        const u = await getDoc(doc(db, 'users', otherId));
        return { ...m, profile: u.exists() ? { id: u.id, ...u.data() } : null };
      }));
      setMatches(enriched.filter(m => m.profile));
      setLoading(false);
    });
    return () => unsub();
  }, [user, impersonatedProfile]);

  return (
    <div className="p-8 max-w-4xl mx-auto w-full text-white space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight">
          {impersonatedProfile ? `Matches for ${impersonatedProfile.username}` : 'Dine Matches'}
        </h1>
        {impersonatedProfile && (
          <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-full">
            <Activity size={12} className="text-orange-500" />
            <span className="text-[10px] font-bold uppercase tracking-tighter text-orange-500">Impersonering Aktiv</span>
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="aspect-[3/4] bg-zinc-900 rounded-3xl animate-pulse" />)}
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/50 rounded-[40px] border border-zinc-800">
          <Heart size={48} className="mx-auto text-zinc-700 mb-4" />
          <h2 className="text-xl font-bold">Ingen matches endnu</h2>
          <p className="text-gray-500 mt-2">Begynd at swipe for at finde din næste gnist!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {matches.map(m => (
            <motion.div 
              key={m.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => onSelect(m.profile)}
              className="relative aspect-[3/4] rounded-3xl overflow-hidden cursor-pointer group"
            >
              <img src={m.profile.gallery?.[0] || `https://picsum.photos/seed/${m.profile.id}/400/600`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 w-full">
                <h3 className="font-bold text-lg">{m.profile.username}</h3>
                <p className="text-xs text-gray-400">{m.profile.city}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const Shop = ({ showToast }: { showToast: (msg: string) => void }) => {
  const { user } = useAuth();
  
  const packages = [
    { id: 'coins_100', name: '100 Coins', price: '99 kr.', coins: 100, popular: false },
    { id: 'coins_500', name: '500 Coins', price: '399 kr.', coins: 500, popular: true },
    { id: 'coins_1000', name: '1000 Coins', price: '699 kr.', coins: 1000, popular: false },
    { id: 'vip_month', name: 'VIP Medlemskab', price: '199 kr./md', coins: 0, isVip: true, popular: false }
  ];

  const handleBuy = async (pkg: any) => {
    if (!user) return;
    if (pkg.coins > 0) {
      await updateUserCoins(user.uid, pkg.coins);
      showToast(`Du har købt ${pkg.coins} coins!`);
    } else if (pkg.isVip) {
      await updateUserVip(user.uid, true);
      showToast('VIP medlemskab aktiveret!');
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto w-full text-white space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black tracking-tighter">SPARK SHOP</h1>
        <p className="text-gray-400 text-lg">Køb coins for at sende beskeder eller bliv VIP for ekstra fordele.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map(pkg => (
          <motion.div 
            key={pkg.id}
            whileHover={{ y: -10 }}
            className={cn(
              "bg-zinc-900 border p-8 rounded-[32px] flex flex-col items-center text-center relative overflow-hidden",
              pkg.popular ? "border-orange-500 shadow-2xl shadow-orange-500/10" : "border-zinc-800"
            )}
          >
            {pkg.popular && (
              <div className="absolute top-4 right-4 bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                Mest Populær
              </div>
            )}
            
            <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center text-orange-500 mb-6">
              {pkg.isVip ? <Shield size={32} /> : <Coins size={32} />}
            </div>
            
            <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
            <div className="text-3xl font-black mb-6">{pkg.price}</div>
            
            <button 
              onClick={() => handleBuy(pkg)}
              className={cn(
                "w-full py-4 rounded-2xl font-bold transition-all active:scale-95",
                pkg.popular ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
              )}
            >
              Køb Nu
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const CustomerService = ({ showToast }: { showToast: (msg: string) => void }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Besked sendt til kundeservice. Vi svarer hurtigst muligt.');
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="p-8 max-w-2xl mx-auto w-full text-white space-y-8">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-500 mx-auto border border-orange-500/20">
          <LifeBuoy size={40} />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Kundeservice</h1>
        <p className="text-gray-400">Har du spørgsmål eller brug for hjælp? Skriv til os herunder.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] space-y-6 shadow-2xl">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Emne</label>
          <select className="w-full bg-black/50 border border-zinc-800 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-orange-500">
            <option>Betaling & Coins</option>
            <option>Tekniske problemer</option>
            <option>Rapporter bruger</option>
            <option>Andet</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Besked</label>
          <textarea 
            required
            className="w-full bg-black/50 border border-zinc-800 rounded-2xl p-4 h-40 outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            placeholder="Beskriv dit problem her..."
          />
        </div>

        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-5 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-xl shadow-orange-500/20">
          Send Besked
        </button>
      </form>
    </div>
  );
};

export default function App() {
  const { user, profile, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'search' | 'swipe' | 'chats' | 'profile' | 'admin' | 'mod' | 'matches' | 'shop' | 'support'>('search');
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [impersonatedProfile, setImpersonatedProfile] = useState<any>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (profile?.role === 'admin') {
      setActiveTab('admin');
    } else if (profile?.role === 'moderator') {
      setActiveTab('mod');
    }
  }, [profile?.role]);

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-orange-500"
        >
          <Heart size={48} fill="currentColor" />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return <Hero />;
  }

  return (
    <div className="h-screen bg-black flex flex-col overflow-hidden">
      {/* Navbar */}
      <nav className="bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shrink-0">
        <div className="flex items-center gap-2">
          <Heart className="text-orange-500 fill-current" size={24} />
          <span className="text-xl font-bold text-white tracking-tighter">SPARK</span>
        </div>

        <div className="hidden lg:flex items-center gap-6">
          {profile?.role === 'customer' && (
            <>
              {[
                { id: 'search', label: 'Opdag' },
                { id: 'swipe', label: 'Swipe' },
                { id: 'matches', label: 'Matches' },
                { id: 'chats', label: 'Beskeder' },
                { id: 'shop', label: 'Shop' },
                { id: 'support', label: 'Kundeservice' },
              ].map((item) => (
                <button 
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={cn(
                    "text-sm font-bold uppercase tracking-widest transition-all", 
                    activeTab === item.id ? "text-orange-500" : "text-gray-400 hover:text-white"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </>
          )}
          {profile?.role === 'admin' && (
            <button 
              onClick={() => setActiveTab('admin')}
              className={cn("text-sm font-bold uppercase tracking-widest transition-all", activeTab === 'admin' ? "text-orange-500" : "text-gray-400 hover:text-white")}
            >
              Admin
            </button>
          )}
          {profile?.role === 'moderator' && (
            <button 
              onClick={() => setActiveTab('mod')}
              className={cn("text-sm font-bold uppercase tracking-widest transition-all", activeTab === 'mod' ? "text-orange-500" : "text-gray-400 hover:text-white")}
            >
              Workstation
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {profile?.role === 'customer' && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-zinc-800/80 px-4 py-2 rounded-2xl border border-zinc-700 shadow-inner">
                <div className="bg-orange-500/20 p-1 rounded-lg">
                  <Coins size={16} className="text-orange-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 font-bold uppercase leading-none">Saldo</span>
                  <span className="text-sm font-black text-white leading-none">{profile?.coins || 0}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 bg-zinc-800/80 px-4 py-2 rounded-2xl border border-zinc-700 shadow-inner">
                <div className="bg-blue-500/20 p-1 rounded-lg">
                  <Send size={16} className="text-blue-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 font-bold uppercase leading-none">Gratis</span>
                  <span className="text-sm font-black text-white leading-none">
                    {profile?.isVip ? (5 - (profile?.freeMessagesToday || 0)) : 0}
                  </span>
                </div>
              </div>

              {profile?.isVip && (
                <div className="hidden sm:flex items-center gap-2 bg-orange-500/10 px-3 py-2 rounded-2xl border border-orange-500/20">
                  <Activity size={14} className="text-orange-500" />
                  <span className="text-[10px] font-black text-orange-500 uppercase tracking-tighter">VIP AKTIV</span>
                </div>
              )}
            </div>
          )}
          <div className="flex items-center gap-3 pl-4 border-l border-zinc-800">
            <button onClick={() => setActiveTab('profile')} className="w-8 h-8 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700 active:scale-90 transition-transform">
              <img src={user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </button>
            <button onClick={logout} className="text-gray-500 hover:text-red-500 transition-all active:scale-90">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative z-10 pb-24 lg:pb-0">
        {activeTab === 'search' && !selectedProfile && <ProfileSearch onSelect={(p) => setSelectedProfile(p)} />}
        {activeTab === 'search' && selectedProfile && (
          <ProfileDetail 
            profile={selectedProfile} 
            onBack={() => setSelectedProfile(null)} 
            onMessage={async (p) => {
              const chatId = await createChat(user.uid, p.id);
              if (chatId) setActiveTab('chats');
            }} 
          />
        )}
        {activeTab === 'swipe' && <SwipeGame showToast={showToast} impersonatedProfile={impersonatedProfile} />}
        {activeTab === 'matches' && <Matches onSelect={(p) => { setSelectedProfile(p); setActiveTab('search'); }} impersonatedProfile={impersonatedProfile} />}
        {activeTab === 'shop' && <Shop showToast={showToast} />}
        {activeTab === 'support' && <CustomerService showToast={showToast} />}
        {activeTab === 'admin' && <AdminPanel setActiveTab={setActiveTab} showToast={showToast} impersonatedProfile={impersonatedProfile} setImpersonatedProfile={setImpersonatedProfile} />}
        {activeTab === 'mod' && <ModeratorBackend onBack={profile?.role === 'admin' ? () => setActiveTab('admin') : undefined} showToast={showToast} />}
        {activeTab === 'chats' && <UserChat showToast={showToast} />}
        {activeTab === 'profile' && (
          <div className="p-4 md:p-8 max-w-2xl mx-auto w-full text-white">
            <h1 className="text-3xl font-bold mb-8">Din Profil</h1>
            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const data = {
                  age: Number(formData.get('age')),
                  city: formData.get('city'),
                  gender: formData.get('gender'),
                  seekingGender: formData.get('seekingGender'),
                };
                await updateUserProfile(user.uid, data);
                showToast('Profil opdateret!');
              }}
              className="space-y-6 bg-zinc-900 p-6 md:p-8 rounded-3xl border border-zinc-800"
            >
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-zinc-800 overflow-hidden border-2 border-orange-500">
                  <img src={user.photoURL || ''} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{user.displayName}</h2>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-gray-500 uppercase font-bold tracking-widest">Galleri ({profile?.gallery?.length || 0} / {profile?.isVip ? 10 : 3})</label>
                  {profile?.isVip ? (
                    <span className="text-[10px] bg-orange-500/10 text-orange-500 px-2 py-1 rounded-full font-bold">VIP LIMIT: 10</span>
                  ) : (
                    <span className="text-[10px] bg-zinc-800 text-gray-400 px-2 py-1 rounded-full font-bold">BASIS LIMIT: 3</span>
                  )}
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {profile?.gallery?.map((img: string, idx: number) => (
                    <div key={idx} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-zinc-800 group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={async () => {
                          const newGallery = profile.gallery.filter((_: any, i: number) => i !== idx);
                          await updateUserProfile(user.uid, { gallery: newGallery });
                        }}
                        className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {(profile?.gallery?.length || 0) < (profile?.isVip ? 10 : 3) && (
                    <div className="aspect-[3/4] bg-zinc-800 border-2 border-dashed border-zinc-700 rounded-xl flex items-center justify-center">
                      <FileUploader 
                        path={`users/${user.uid}/gallery`} 
                        label="+" 
                        onUpload={async (url) => {
                          const newGallery = [...(profile?.gallery || []), url];
                          await updateUserProfile(user.uid, { gallery: newGallery });
                        }} 
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase font-bold">Alder</label>
                  <input name="age" type="number" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1 outline-none focus:ring-2 focus:ring-orange-500 transition-all" defaultValue={profile?.age} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase font-bold">By</label>
                  <input name="city" type="text" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1 outline-none focus:ring-2 focus:ring-orange-500 transition-all" defaultValue={profile?.city} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase font-bold">Køn</label>
                  <select name="gender" defaultValue={profile?.gender || 'Mand'} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1 outline-none focus:ring-2 focus:ring-orange-500">
                    <option>Mand</option>
                    <option>Kvinde</option>
                    <option>Andet</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase font-bold">Søger Køn</label>
                  <select name="seekingGender" defaultValue={profile?.seekingGender || 'Kvinde'} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 mt-1 outline-none focus:ring-2 focus:ring-orange-500">
                    <option>Kvinde</option>
                    <option>Mand</option>
                    <option>Begge</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  type="button"
                  onClick={async () => {
                    if (confirm('Vil du booste din profil i 24 timer for 50 coins?')) {
                      try {
                        await boostProfile(user.uid, 24, 50);
                        showToast('Profil boostet! Du er nu mere synlig.');
                      } catch (error: any) {
                        showToast(error.message);
                      }
                    }
                  }}
                  className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-2xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <TrendingUp size={20} className="text-orange-500" />
                  Boost Profil (50 Coins)
                </button>
                <button type="submit" className="flex-1 py-4 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-orange-500/20">
                  Gem Profil
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-zinc-900/90 backdrop-blur-xl border-t border-zinc-800 px-2 py-3 flex justify-around items-center z-50">
        {[
          { id: 'search', icon: <Search size={20} />, label: 'Opdag' },
          { id: 'swipe', icon: <TrendingUp size={20} />, label: 'Swipe' },
          { id: 'matches', icon: <Heart size={20} />, label: 'Matches' },
          { id: 'chats', icon: <MessageCircle size={20} />, label: 'Beskeder' },
          { id: 'shop', icon: <ShoppingBag size={20} />, label: 'Shop' },
          { id: 'profile', icon: <User size={20} />, label: 'Profil' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={cn(
              "flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all",
              activeTab === item.id ? "text-orange-500" : "text-gray-500 hover:text-white"
            )}
          >
            {item.icon}
            <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-800 px-6 py-3 rounded-2xl shadow-2xl z-[100] text-sm font-bold text-white whitespace-nowrap"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
