import { appClient } from "./appClient";
import type { GeoItem } from "./types";

export const addressClient = {
  getCountries(): Promise<GeoItem[]> {
    return appClient.get<GeoItem[]>("/address/countries");
  },
  getProvinces(countryId: string): Promise<GeoItem[]> {
    return appClient.get<GeoItem[]>(`/address/provinces/${countryId}`);
  },
  getDistricts(provinceId: string): Promise<GeoItem[]> {
    return appClient.get<GeoItem[]>(`/address/districts/${provinceId}`);
  },
  getSectors(districtId: string): Promise<GeoItem[]> {
    return appClient.get<GeoItem[]>(`/address/sectors/${districtId}`);
  },
  getCells(sectorId: string): Promise<GeoItem[]> {
    return appClient.get<GeoItem[]>(`/address/cells/${sectorId}`);
  },
  getVillages(cellId: string): Promise<GeoItem[]> {
    return appClient.get<GeoItem[]>(`/address/villages/${cellId}`);
  },
};
