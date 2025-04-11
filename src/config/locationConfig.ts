import { HONG_KONG_DISTRICTS } from "@/utils/locationData";

// Configuration for enabled/disabled districts
export const DISTRICT_CONFIG = HONG_KONG_DISTRICTS.reduce((acc, district) => {
  acc[district] = district === "北角"; // Only 北角 is enabled, all others are disabled
  return acc;
}, {} as Record<string, boolean>);

// Helper function to get all enabled districts
export const getEnabledDistricts = () => {
  return HONG_KONG_DISTRICTS.filter(district => DISTRICT_CONFIG[district]);
};

// Helper function to check if a district is enabled
export const isDistrictEnabled = (district: string) => {
  return DISTRICT_CONFIG[district] || false;
}; 