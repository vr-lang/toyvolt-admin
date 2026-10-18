import React, { useState, useEffect, useMemo } from 'react';
import ReviewsHeaderToolbar from '../../components/reviews/ReviewsHeaderToolbar';
import ReviewsKpiCards from '../../components/reviews/ReviewsKpiCards';
import ReviewsFilterToolbar from '../../components/reviews/ReviewsFilterToolbar';
import ReviewCard from '../../components/reviews/ReviewCard';
import ReplyReviewModal from '../../components/reviews/ReplyReviewModal';
import ReviewPolicyModal from '../../components/reviews/ReviewPolicyModal';
import PhotoLightboxModal from '../../components/reviews/PhotoLightboxModal';
import ReviewsBottomPanels from '../../components/reviews/ReviewsBottomPanels';
import { reviewService } from '../../services/reviewService';
import { 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  X, 
  Sparkles, 
  Search, 
  ShieldAlert,
  Layers
} from 'lucide-react';

const DEMO_REVIEWS = [
  {
    _id: 'rev_6711a123f8b10',
    parentName: 'Priya Sundaram',
    childAge: 'Mother of 5yo Boy',
    city: 'Bengaluru',
    state: 'Karnataka',
    rating: 5,
    title: 'Survives stair tumbles! My 5yo is totally obsessed.',
    comment: 'Ordered this for my son\'s 5th birthday. The 360-degree flip capability is super responsive and the rubber tires don\'t leave marks on our wooden floor. Battery easily lasts 45 minutes of continuous racing. Truly impressed by the build quality!',
    photos: [
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&auto=format&fit=crop&q=80'
    ],
    productName: 'Supercharged Stunt RC Racer (Blue/Orange)',
    productSku: 'RC-STUNT-02',
    isVerified: true,
    status: 'PUBLISHED',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    storeReply: {
      text: 'Thank you Priya! We are thrilled to hear your little racer is having a blast. Wishing your family countless hours of joyful play!\n\n— Toyvolt Play Experience Team'
    }
  },
  {
    _id: 'rev_6711b456e7a21',
    parentName: 'Rohan & Meera Verma',
    childAge: 'Parents of 7yo Girl',
    city: 'Pune',
    state: 'Maharashtra',
    rating: 5,
    title: 'Top notch wooden finish and zero plastic smell',
    comment: 'As parents conscious about microplastics and toxic dyes, this wooden solar system kit was a fantastic buy. Every celestial body is smoothly sanded with no sharp splinters. We spent our Sunday assembling it together. Outstanding educational value!',
    photos: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&auto=format&fit=crop&q=80'
    ],
    productName: 'Wooden Solar System Orrery & Space Explorer',
    productSku: 'STEM-SOL-01',
    isVerified: true,
    status: 'PUBLISHED',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    storeReply: null
  },
  {
    _id: 'rev_6711c789d6c32',
    parentName: 'Ananya Iyer',
    childAge: 'Mother of 4yo & 8yo',
    city: 'Chennai',
    state: 'Tamil Nadu',
    rating: 5,
    title: 'Sturdy magnets, beautiful translucent colors',
    comment: 'The magnetic polarity is strong enough to build tall towers without collapsing midway. Both my 4yo and 8yo play together for hours without screen time. Arrived in just 2 days via Delhivery in very secure packaging.',
    photos: [
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80'
    ],
    productName: 'Magnetic Tile Castle Architect Set (100 Pcs)',
    productSku: 'MAG-TILE-100',
    isVerified: true,
    status: 'PENDING',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    storeReply: null
  },
  {
    _id: 'rev_6711d012c5b43',
    parentName: 'Vikramaditya Rathore',
    childAge: 'Uncle / Festive Gifting',
    city: 'Jaipur',
    state: 'Rajasthan',
    rating: 4,
    title: 'Great metallic detailing, wish it came with acrylic display case',
    comment: 'The metallic paint finish and pullback motor mechanism are exceptionally authentic. A bit smaller than anticipated from the pictures, but heavy metal feel in hand. My nephew loved it.',
    photos: [],
    productName: 'Die-Cast Vintage Formula Racing Duo',
    productSku: 'DC-VINT-02',
    isVerified: true,
    status: 'PENDING',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    storeReply: null
  },
  {
    _id: 'rev_6711e345b4a54',
    parentName: 'Sunita Mukherjee',
    childAge: 'Mother of 18-month Toddler',
    city: 'Kolkata',
    state: 'West Bengal',
    rating: 5,
    title: 'Sensory obstacle detection works like magic!',
    comment: 'Keeps my 18-month-old actively crawling and laughing. The obstacle sensors turn the crab smoothly when it hits a wall. Rechargeable battery via USB-C is a lifesaver compared to having to change AA batteries every few days.',
    photos: [
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop&q=80'
    ],
    productName: 'Musical Sensory Interactive Crawl Crab',
    productSku: 'SEN-CRAB-03',
    isVerified: true,
    status: 'PUBLISHED',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    storeReply: {
      text: 'Hello Sunita! Thank you for trusting Toyvolt for your toddler’s sensory milestones. The USB-C convenience is one of our favorite upgrades too!\n\n— Toyvolt Quality & Safety Assurance'
    }
  },
  {
    _id: 'rev_6711f678a3f65',
    parentName: 'Neeraj Kapoor',
    childAge: 'Father of 9yo Boy',
    city: 'Gurugram',
    state: 'Haryana',
    rating: 2,
    title: 'Controller range lower than advertised in open society park',
    comment: 'The buggy is fast indoors, but when we took it down to the society park, the 2.4GHz remote lost connection beyond 15 meters. Replaced remote batteries with fresh Duracells but still noticed intermittent lag when turning left.',
    photos: [],
    productName: 'Speedster High-Velocity Drift Buggy',
    productSku: 'RC-DRIFT-04',
    isVerified: true,
    status: 'FLAGGED',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    storeReply: {
      text: 'Hi Neeraj, our apologies for the range issue. Our technical quality team would like to inspect your unit\'s internal antenna. We have dispatched a replacement unit via BlueDart express.\n\n— Toyvolt Customer Care'
    }
  }
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isBackendImplemented, setIsBackendImplemented] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Filters & Tabs
  const [activeTab, setActiveTab] = useState('ALL');
  const [search, setSearch] = useState('');
  const [starRating, setStarRating] = useState('ALL');
  const [mediaFilter, setMediaFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');

  // Modals
  const [replyReview, setReplyReview] = useState(null);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [lightboxData, setLightboxData] = useState({
    isOpen: false,
    photos: [],
    initialIndex: 0,
    reviewerName: ''
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchReviews = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await reviewService.getReviews();
      if (res.isBackendImplemented) {
        setReviews(res.reviews || []);
        setIsBackendImplemented(true);
        setIsDemoMode(false);
      } else {
        // Backend review endpoint is not yet mounted (404)
        setIsBackendImplemented(false);
        setIsDemoMode(true);
        setReviews(DEMO_REVIEWS);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
      setIsBackendImplemented(false);
      setIsDemoMode(true);
      setReviews(DEMO_REVIEWS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Tab counts
  const tabCounts = useMemo(() => {
    const counts = { ALL: reviews.length, PENDING: 0, PUBLISHED: 0, FLAGGED: 0, ARCHIVED: 0 };
    reviews.forEach((r) => {
      const status = r.status || 'PENDING';
      if (counts[status] !== undefined) {
        counts[status] += 1;
      }
    });
    return counts;
  }, [reviews]);

  // Filtered & Sorted
  const filteredReviews = useMemo(() => {
    return reviews
      .filter((r) => {
        // Status Tab
        if (activeTab !== 'ALL') {
          const status = r.status || 'PENDING';
          if (status !== activeTab) return false;
        }

        // Rating
        if (starRating === '5' && r.rating !== 5) return false;
        if (starRating === '4' && r.rating !== 4) return false;
        if (starRating === '3' && r.rating !== 3) return false;
        if (starRating === 'low' && (r.rating > 2)) return false;

        // Media / Verified
        if (mediaFilter === 'PHOTOS' && (!r.photos || r.photos.length === 0)) return false;
        if (mediaFilter === 'VERIFIED' && r.isVerified === false) return false;

        // Search
        if (search.trim()) {
          const q = search.toLowerCase();
          const nameMatch = (r.parentName || r.user?.name || '').toLowerCase().includes(q);
          const productMatch = (r.productName || r.product?.name || '').toLowerCase().includes(q);
          const commentMatch = (r.comment || r.body || '').toLowerCase().includes(q);
          const titleMatch = (r.title || '').toLowerCase().includes(q);
          if (!nameMatch && !productMatch && !commentMatch && !titleMatch) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        if (sortBy === 'rating_high') {
          return (b.rating || 5) - (a.rating || 5);
        }
        if (sortBy === 'rating_low') {
          return (a.rating || 5) - (b.rating || 5);
        }
        return 0;
      });
  }, [reviews, activeTab, starRating, mediaFilter, search, sortBy]);

  // Status Update Handler
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      if (isBackendImplemented) {
        await reviewService.updateReviewStatus(id, newStatus);
      }
      // Update in local state
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r))
      );
      showToast(`Review marked as ${newStatus}.`);
    } catch (err) {
      console.error('Status update failed:', err);
      // Still update locally in sandbox
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r))
      );
      showToast(`Status updated in sandbox view.`);
    }
  };

  // Reply Save Handler
  const handleSaveReply = async (id, fullReply) => {
    try {
      if (isBackendImplemented) {
        await reviewService.replyToReview(id, fullReply);
      }
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? { ...r, storeReply: { text: fullReply } } : r))
      );
      showToast('Store response posted successfully!');
    } catch (err) {
      console.error('Reply submission failed:', err);
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? { ...r, storeReply: { text: fullReply } } : r))
      );
      showToast('Store reply recorded in sandbox view.');
    }
  };

  const handleOpenLightbox = (photos, initialIndex, reviewerName) => {
    setLightboxData({
      isOpen: true,
      photos,
      initialIndex,
      reviewerName
    });
  };

  const handleExportCSV = () => {
    reviewService.exportReviewsCSV(filteredReviews);
  };

  const handleResetFilters = () => {
    setActiveTab('ALL');
    setSearch('');
    setStarRating('ALL');
    setMediaFilter('ALL');
    setSortBy('newest');
  };

  const hasActiveFilters = activeTab !== 'ALL' || search.trim() !== '' || starRating !== 'ALL' || mediaFilter !== 'ALL' || sortBy !== 'newest';

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans text-neutral-900 bg-[#F7F3EB] min-h-screen">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#171717] text-white border-2 border-neutral-900 p-3 shadow-[4px_4px_0px_#000] flex items-center gap-3 font-mono text-xs animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-neutral-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header Toolbar */}
      <ReviewsHeaderToolbar
        onExportCSV={handleExportCSV}
        onOpenPolicyModal={() => setIsPolicyModalOpen(true)}
        onRefresh={() => fetchReviews(true)}
        refreshing={refreshing}
        totalReviews={reviews.length}
        isBackendImplemented={isBackendImplemented}
        isDemoMode={isDemoMode}
        onToggleDemoMode={() => setIsDemoMode((prev) => !prev)}
      />

      {/* Transparent Backend Availability Notice */}
      {!isBackendImplemented && (
        <div className="p-3 sm:p-4 bg-[#FFF3DF] border-3 border-neutral-900 shadow-[4px_4px_0px_#000] font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#315FE8] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-black text-neutral-900 uppercase">
                HONEST BACKEND STATUS NOTICE // REVIEW API STANDBY
              </span>
              <p className="text-neutral-700 font-sans text-[11px] leading-relaxed">
                The Toyvolt backend currently does not have <code className="font-mono bg-white px-1 border border-neutral-400">/api/v1/admin/reviews</code> endpoints mounted. You are viewing the fully interactive moderation console with simulated parent testimonials, unboxing proofs, and display engine rules.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-white border border-neutral-900 font-bold text-[10px] text-neutral-800 uppercase shrink-0 self-start sm:self-center">
            UI READY FOR MOUNT
          </span>
        </div>
      )}

      {/* KPI Cards */}
      <ReviewsKpiCards reviews={reviews} />

      {/* Filter and Tab Strip */}
      <ReviewsFilterToolbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabCounts={tabCounts}
        search={search}
        onSearchChange={setSearch}
        starRating={starRating}
        onStarRatingChange={setStarRating}
        mediaFilter={mediaFilter}
        onMediaFilterChange={setMediaFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        totalFiltered={filteredReviews.length}
      />

      {/* Reviews List */}
      {loading ? (
        <div className="bg-white border-4 border-neutral-900 shadow-[5px_5px_0px_#000] p-8 text-center font-mono">
          <div className="animate-spin w-8 h-8 border-4 border-neutral-900 border-t-transparent mx-auto mb-3" />
          <div className="text-sm font-bold text-neutral-800">LOADING PARENT REVIEWS...</div>
          <div className="text-xs text-neutral-500 mt-1">Connecting to customer feedback stream and unboxing media.</div>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="bg-white border-4 border-neutral-900 shadow-[5px_5px_0px_#000] p-12 text-center font-mono space-y-3">
          <div className="w-12 h-12 bg-neutral-100 border-2 border-neutral-900 mx-auto flex items-center justify-center text-neutral-600">
            <Star className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black uppercase text-neutral-900">
            NO REVIEWS FOUND
          </h3>
          <p className="text-xs text-neutral-600 max-w-md mx-auto font-sans">
            No parent reviews match your active tab or search filters.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              onUpdateStatus={handleUpdateStatus}
              onOpenReply={(rev) => setReplyReview(rev)}
              onOpenLightbox={handleOpenLightbox}
            />
          ))}
        </div>
      )}

      {/* Bottom Architectural Panels: Display Engine Config & Sentiment Topics */}
      <ReviewsBottomPanels
        onConfigSaved={() => showToast('Storefront display rules updated.')}
      />

      {/* Reply Modal */}
      <ReplyReviewModal
        isOpen={Boolean(replyReview)}
        onClose={() => setReplyReview(null)}
        review={replyReview}
        onSaveReply={handleSaveReply}
      />

      {/* Policy & Compliance Modal */}
      <ReviewPolicyModal
        isOpen={isPolicyModalOpen}
        onClose={() => setIsPolicyModalOpen(false)}
      />

      {/* Photo Lightbox Modal */}
      <PhotoLightboxModal
        isOpen={lightboxData.isOpen}
        onClose={() => setLightboxData((prev) => ({ ...prev, isOpen: false }))}
        photos={lightboxData.photos}
        initialIndex={lightboxData.initialIndex}
        reviewerName={lightboxData.reviewerName}
      />

    </div>
  );
}
