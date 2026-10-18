import React from 'react';
import { X, Calendar, Sparkles, ArrowRight, Zap, Gift, Compass } from 'lucide-react';

const FESTIVE_CAMPAIGNS = [
  {
    id: 'diwali',
    name: 'Diwali Mega Gifting Playfest',
    season: 'October - November',
    tag: 'PEAK GMV QUARTER',
    tagColor: 'bg-[#FF7626] text-white',
    description: 'India\'s largest toy gifting surge. Parents and extended relatives purchase high-ticket remote-controlled cars, robotic sets, and heirloom wooden board games.',
    suggestedCode: 'DIWALI25',
    couponPreset: {
      code: 'DIWALI25',
      type: 'percentage',
      value: 25,
      minOrder: 2499,
      maxDiscount: 1250,
      desc: 'Diwali Grand Playfest: 25% Off up to ₹1,250 on premium toys'
    },
    popularCategories: ['RC Cars & Drones', 'Robotics & STEM Kits', 'Deluxe Board Games'],
    typicalGmvLift: '+240% Order Velocity'
  },
  {
    id: 'childrens-day',
    name: 'Children\'s Day Celebration',
    season: '14 November (Annual)',
    tag: 'SPECIAL DAY OF PLAY',
    tagColor: 'bg-[#315FE8] text-white',
    description: 'Dedicated celebration of childhood joy and learning. Schools, parents, and preschools buy sensory toys, Montessori puzzles, and creative art sets.',
    suggestedCode: 'CHILDREN15',
    couponPreset: {
      code: 'CHILDREN15',
      type: 'percentage',
      value: 15,
      minOrder: 1299,
      maxDiscount: 500,
      desc: 'Children’s Day Special: 15% Off storewide for little builders'
    },
    popularCategories: ['Montessori & Wooden Toys', 'Sensory Play', 'Art & Craft Kits'],
    typicalGmvLift: '+110% Order Velocity'
  },
  {
    id: 'christmas-newyear',
    name: 'Christmas & New Year Toy Carnival',
    season: 'December 20 - January 2',
    tag: 'HOLIDAY VACATION RUSH',
    tagColor: 'bg-emerald-600 text-white',
    description: 'Holiday unboxing season and winter vacation entertainment. Parents look for battery-operated toys, dollhouses, and educational family board games.',
    suggestedCode: 'SANTA300',
    couponPreset: {
      code: 'SANTA300',
      type: 'flat',
      value: 300,
      minOrder: 1999,
      maxDiscount: null,
      desc: 'Santa Secret Playpack: Flat ₹300 off on holiday toy orders'
    },
    popularCategories: ['Musical & Battery Toys', 'Dollhouses & Figures', 'Family Games'],
    typicalGmvLift: '+165% Order Velocity'
  },
  {
    id: 'summer-vacation',
    name: 'Summer Vacation & STEM Workshop Season',
    season: 'April - June',
    tag: 'ED-TECH & HOBBIES',
    tagColor: 'bg-[#FFD983] text-neutral-900',
    description: 'School summer holidays. High demand for long-duration engagement kits, science laboratory boxes, coding kits, and outdoor sports equipment.',
    suggestedCode: 'SUMMERPLAY',
    couponPreset: {
      code: 'SUMMERPLAY',
      type: 'flat',
      value: 400,
      minOrder: 2200,
      maxDiscount: null,
      desc: 'Summer Explorer: Flat ₹400 off on DIY & Science kits above ₹2,200'
    },
    popularCategories: ['Solar & DIY Science Kits', 'Lego-compatible Bricks', 'Outdoor Sports'],
    typicalGmvLift: '+85% Order Velocity'
  },
  {
    id: 'rakhi',
    name: 'Raksha Bandhan Sibling Gifting',
    season: 'August',
    tag: 'SIBLING BUNDLES',
    tagColor: 'bg-pink-600 text-white',
    description: 'Brother-sister toy gifting bundles. Twin packs, matchbox diecast sets, and soft plush companions see tremendous multi-unit cart additions.',
    suggestedCode: 'RAKHI200',
    couponPreset: {
      code: 'RAKHI200',
      type: 'flat',
      value: 200,
      minOrder: 1499,
      maxDiscount: null,
      desc: 'Rakhi Playpack: Flat ₹200 off on sibling toy combos'
    },
    popularCategories: ['Diecast Twin Packs', 'Plush Soft Toys', 'Action Hero Duos'],
    typicalGmvLift: '+75% Order Velocity'
  }
];

export default function FestiveCalendarModal({
  isOpen,
  onClose,
  onLaunchTemplate
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/70 backdrop-blur-xs flex items-center justify-center p-4 font-mono">
      <div className="relative bg-[#FFF9F0] border-4 border-neutral-900 shadow-[8px_8px_0px_#000] w-full max-w-3xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-[#171717] text-white p-4 border-b-4 border-neutral-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-[#FF7626]" />
            <div>
              <h3 className="font-black text-sm uppercase tracking-tight">
                INDIAN FESTIVE E-COMMERCE CAMPAIGN PLAYBOOK
              </h3>
              <p className="text-[10px] text-neutral-400 font-sans">
                Curated seasonal promotional blueprints optimized for Indian toy purchasing cycles
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 border-2 border-neutral-900 bg-white text-neutral-900 hover:bg-neutral-100 shadow-[2px_2px_0px_#000]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notice Strip */}
        <div className="bg-[#FFD983] border-b-2 border-neutral-900 px-5 py-2 text-xs font-bold text-neutral-900 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-neutral-900" />
            INDIAN TOY RETAIL PEAK STRATEGY
          </span>
          <span className="text-[10px] uppercase font-mono tracking-wider">
            GST & INVOICE COMPLIANT
          </span>
        </div>

        {/* Content List */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {FESTIVE_CAMPAIGNS.map((fest) => (
            <div
              key={fest.id}
              className="bg-white border-2 border-neutral-900 shadow-[4px_4px_0px_#000] p-4 transition-all hover:bg-[#FFFDF7]"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-neutral-200 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-sm uppercase text-neutral-900">
                    {fest.name}
                  </h4>
                  <span className={`px-2 py-0.5 text-[9px] font-black uppercase border border-neutral-900 shadow-[1px_1px_0px_#000] ${fest.tagColor}`}>
                    {fest.tag}
                  </span>
                </div>
                <div className="text-[11px] font-bold text-neutral-600 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{fest.season}</span>
                </div>
              </div>

              <p className="text-xs text-neutral-700 font-sans leading-relaxed mb-3">
                {fest.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#F7F3EB] p-3 border border-neutral-900 mb-3 text-[11px]">
                <div>
                  <div className="font-black text-neutral-800 uppercase text-[10px] mb-1">
                    KEY TOY CATEGORIES
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {fest.popularCategories.map((c) => (
                      <span key={c} className="px-1.5 py-0.5 bg-white border border-neutral-400 text-[10px] font-sans">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="font-black text-neutral-800 uppercase text-[10px] mb-1">
                    BENCHMARK LIFT
                  </div>
                  <div className="font-mono font-bold text-emerald-700">
                    {fest.typicalGmvLift}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="font-mono text-xs">
                  <span className="text-neutral-500 text-[10px]">BLUEPRINT CODE:</span>{' '}
                  <span className="font-black bg-[#FFD983] px-2 py-0.5 border border-neutral-900">
                    {fest.suggestedCode}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onLaunchTemplate(fest.couponPreset);
                    onClose();
                  }}
                  className="px-3 py-1.5 border-2 border-neutral-900 bg-[#315FE8] hover:bg-[#234bc5] text-white text-xs font-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span>LOAD AS CAMPAIGN</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#F0EEEE] border-t-2 border-neutral-900 flex items-center justify-between text-xs">
          <span className="text-[10px] text-neutral-600 font-sans">
            Campaign blueprints configure automatic cart price deductions and minimum threshold rules.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 border-2 border-neutral-900 bg-white hover:bg-neutral-100 font-bold text-xs"
          >
            CLOSE PLAYBOOK
          </button>
        </div>

      </div>
    </div>
  );
}
