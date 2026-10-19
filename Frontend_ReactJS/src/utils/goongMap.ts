/**
 * Goong Map Utilities for Điện Lạnh Hồng Thái
 * Sử dụng Goong.io - Bản đồ số chuyên biệt cho Việt Nam (ngõ ngách, số nhà chi tiết)
 */

const GOONG_API_KEY = import.meta.env.VITE_GOONG_API_KEY || '';
const GOONG_MAPTILES_KEY = import.meta.env.VITE_GOONG_MAPTILES_KEY || '';

export const goongConfig = {
  apiKey: GOONG_API_KEY,
  mapTilesKey: GOONG_MAPTILES_KEY,
};

/**
 * Tạo URL mở trực tiếp trên Goong Maps Web với địa chỉ
 */
export const getGoongMapUrl = (address: string): string => {
  if (!address) return 'https://maps.goong.io';
  return `https://maps.goong.io/?q=${encodeURIComponent(address.trim())}`;
};

/**
 * Tạo URL chỉ đường bằng Google Maps (dành cho chế độ giọng nói khi đang lái xe máy)
 */
export const getGoogleNavUrl = (address: string): string => {
  if (!address) return '';
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address.trim())}`;
};

/**
 * Tạo URL chat Zalo trực tiếp với số điện thoại
 */
export const getZaloChatUrl = (phone: string): string => {
  if (!phone) return '';
  // Chuẩn hóa số điện thoại (bỏ khoảng trắng, dấu gạch nối)
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return `https://zalo.me/${cleanPhone}`;
};

export interface GoongPrediction {
  place_id: string;
  description: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
}

/**
 * Gợi ý địa chỉ ngõ ngách chi tiết tại Việt Nam bằng Goong AutoComplete API
 */
export const searchGoongPlaces = async (input: string): Promise<GoongPrediction[]> => {
  if (!input || !GOONG_API_KEY) return [];
  try {
    const url = `https://rsapi.goong.io/Place/AutoComplete?api_key=${GOONG_API_KEY}&input=${encodeURIComponent(input.trim())}&limit=5`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.status === 'OK' && Array.isArray(data.predictions)) {
      return data.predictions;
    }
    return [];
  } catch (error) {
    console.error('Lỗi khi tìm kiếm địa chỉ Goong:', error);
    return [];
  }
};

/**
 * Geocoding địa chỉ ra tọa độ (lat, lng) bằng Goong Geocoding API
 */
export const geocodeWithGoong = async (address: string): Promise<{ lat: number; lng: number } | null> => {
  if (!address || !GOONG_API_KEY) return null;
  try {
    const url = `https://rsapi.goong.io/geocode?address=${encodeURIComponent(address.trim())}&api_key=${GOONG_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return { lat: location.lat, lng: location.lng };
    }
    return null;
  } catch (error) {
    console.error('Lỗi Geocode Goong:', error);
    return null;
  }
};
