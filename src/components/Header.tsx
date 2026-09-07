import React, { useState, useEffect } from 'react';
import { ScreenType } from '../types';

interface HeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  onOpenSearch?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  subscription?: {
    daysRemaining: number;
    subscriptionStatus: 'active' | 'grace_period' | 'locked';
    dailyRate: number;
  } | null;
  onOpenSubscriptionModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  searchQuery,
  onSearchChange,
  subscription,
  onOpenSubscriptionModal,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [weatherData, setWeatherData] = useState<{
    location: string;
    temp: number | null;
    humidity: number | null;
  }>({
    location: 'Location',
    temp: null,
    humidity: null,
  });

  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number, locationName: string) => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m`
        );
        if (res.ok) {
          const data = await res.json();
          setWeatherData({
            location: locationName,
            temp: Math.round(data.current?.temperature_2m ?? 24),
            humidity: Math.round(data.current?.relative_humidity_2m ?? 80),
          });
        }
      } catch (e) {
        setWeatherData({
          location: locationName,
          temp: 24,
          humidity: 80,
        });
      }
    };

    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          fetchWeather(latitude, longitude, 'Local Station');
        },
        () => {
          fetchWeather(-0.518, 37.28, 'Kirinyaga');
        },
        { timeout: 5000 }
      );
    } else {
      fetchWeather(-0.518, 37.28, 'Kirinyaga');
    }
  }, []);

  const getScreenTitle = (screen: ScreenType) => {
    switch (screen) {
      case 'dashboard':
        return 'Overview & Metrics';
      case 'sales-pos':
        return 'Point of Sale Counter';
      case 'inventory-stock':
        return 'Inventory & Stock Batches';
      case 'farmers-acreage-advisory':
        return 'Farmers & Customer Directory';
      case 'credit-debt-ledger':
        return 'Credit & Debt Ledger';
      case 'shift-register-daily-close':
        return 'Shift Close & Z-Report';
      case 'suppliers-pos':
        return 'Suppliers & Purchases';
      default:
        return 'AgroFlow Operations';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-[#dae2fd] px-6 flex items-center justify-between sticky top-0 z-10 shadow-xs">
      <div>
        <h1 className="font-playfair text-lg font-bold text-[#131b2e] leading-tight">
          {getScreenTitle(currentScreen)}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-72">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-lg">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products, farmers, sales..."
            className="w-full pl-9 pr-8 py-1.5 text-xs bg-[#f2f3ff] text-[#131b2e] border border-[#c0c9be]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#11bf36] focus:border-[#11bf36] focus:bg-white transition-all placeholder:text-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600 text-xs"
            >
              ×
            </button>
          )}
        </div>

        {weatherData.temp !== null && (
          <div className="hidden lg:flex items-center gap-2 bg-[#eaedff] px-3 py-1.5 rounded-lg border border-[#dae2fd] text-xs font-medium text-[#131b2e]">
            <span className="material-symbols-outlined text-[#11bf36] text-base">cloud</span>
            <span>
              {weatherData.location} {weatherData.temp}°C
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {subscription && (
          <button
            onClick={onOpenSubscriptionModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer shadow-xs ${
              subscription.subscriptionStatus === 'locked'
                ? 'bg-red-50 text-red-900 border-red-300 hover:bg-red-100'
                : subscription.subscriptionStatus === 'grace_period'
                ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                : 'bg-[#eaf8ed] text-[#003b1b] border-[#11bf36]/40 hover:bg-[#d2f5db]'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                subscription.subscriptionStatus === 'locked'
                  ? 'bg-red-600'
                  : subscription.subscriptionStatus === 'grace_period'
                  ? 'bg-amber-500 animate-pulse'
                  : 'bg-[#11bf36]'
              }`}
            ></span>
            <span>
              {subscription.subscriptionStatus === 'locked'
                ? 'License Locked'
                : subscription.subscriptionStatus === 'grace_period'
                ? 'Grace Period (24h)'
                : `${subscription.daysRemaining}d Active`}
            </span>
          </button>
        )}

        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 hover:bg-[#eaf8ed] hover:text-[#11bf36] transition-colors"
        >
          <span className="material-symbols-outlined text-xl">notifications</span>
        </button>

        <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-[#003b1b] border-2 border-[#11bf36] text-white flex items-center justify-center font-bold text-xs">
            JM
          </div>
          <div className="hidden sm:block text-left leading-tight">
            <div className="text-xs font-bold text-[#131b2e]">John Mwangi</div>
            <div className="text-[10px] text-gray-500">Manager</div>
          </div>
        </div>
      </div>
    </header>
  );
};
