"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Building, Globe, Home, Landmark, Layers, Map, MapPin, Navigation } from "lucide-react";
import type { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import type { FormData } from "@/features/signup/schema";
import { addressClient } from "@/lib/addressClient";
import type { GeoItem } from "@/lib/types";

export function StepAddress({ register, errors, watch, setValue }: {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  watch: UseFormWatch<FormData>;
  setValue: UseFormSetValue<FormData>;
}) {
  const selectedCountry = watch("address.countryId");
  const selectedProvince = watch("address.provinceId");
  const selectedDistrict = watch("address.districtId");
  const selectedSector = watch("address.sectorId");
  const selectedCell = watch("address.cellId");

  const [countries, setCountries] = useState<GeoItem[]>([]);
  const [provinces, setProvinces] = useState<GeoItem[]>([]);
  const [districts, setDistricts] = useState<GeoItem[]>([]);
  const [sectors, setSectors] = useState<GeoItem[]>([]);
  const [cells, setCells] = useState<GeoItem[]>([]);
  const [villages, setVillages] = useState<GeoItem[]>([]);

  useEffect(() => {
    addressClient.getCountries().then(setCountries).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedCountry) {
      setProvinces([]);
      return;
    }
    addressClient.getProvinces(selectedCountry).then(setProvinces).catch(() => {});
  }, [selectedCountry]);

  useEffect(() => {
    if (!selectedProvince) {
      setDistricts([]);
      return;
    }
    addressClient.getDistricts(selectedProvince).then(setDistricts).catch(() => {});
  }, [selectedProvince]);

  useEffect(() => {
    if (!selectedDistrict) {
      setSectors([]);
      return;
    }
    addressClient.getSectors(selectedDistrict).then(setSectors).catch(() => {});
  }, [selectedDistrict]);

  useEffect(() => {
    if (!selectedSector) {
      setCells([]);
      return;
    }
    addressClient.getCells(selectedSector).then(setCells).catch(() => {});
  }, [selectedSector]);

  useEffect(() => {
    if (!selectedCell) {
      setVillages([]);
      return;
    }
    addressClient.getVillages(selectedCell).then(setVillages).catch(() => {});
  }, [selectedCell]);

  const renderAddressField = (level: string, fieldName: keyof FormData["address"], options: GeoItem[], icon: React.ReactNode, disabled = false) => {
    const reg = register(`address.${fieldName}` as any);
    return (
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-2 flex items-center gap-2">
          {icon}
          {level}
        </label>
        <select
          className={`w-full px-4 py-3 rounded-lg border ${disabled ? "bg-gray-100 text-gray-500" : "bg-white"} border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all`}
          disabled={disabled}
          {...reg}
          onChange={(e) => {
            reg.onChange(e);
            if (level === "Country") {
              setValue("address.provinceId", "");
              setValue("address.districtId", "");
              setValue("address.sectorId", "");
              setValue("address.cellId", "");
              setValue("address.villageId", "");
            } else if (level === "Province") {
              setValue("address.districtId", "");
              setValue("address.sectorId", "");
              setValue("address.cellId", "");
              setValue("address.villageId", "");
            } else if (level === "District") {
              setValue("address.sectorId", "");
              setValue("address.cellId", "");
              setValue("address.villageId", "");
            } else if (level === "Sector") {
              setValue("address.cellId", "");
              setValue("address.villageId", "");
            } else if (level === "Cell") {
              setValue("address.villageId", "");
            }
          }}
        >
          <option value="">Select {level}</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-teal-600" /> Complete Address Information
        </h3>
        <p className="text-sm text-gray-600">Please provide your complete address details for verification purposes.</p>
      </div>

      {renderAddressField("Country", "countryId", countries, <Globe className="h-4 w-4 text-gray-600" />)}
      {renderAddressField("Province", "provinceId", provinces, <Building className="h-4 w-4 text-gray-600" />, !selectedCountry)}
      {renderAddressField("District", "districtId", districts, <Map className="h-4 w-4 text-gray-600" />, !selectedProvince)}
      {renderAddressField("Sector", "sectorId", sectors, <Landmark className="h-4 w-4 text-gray-600" />, !selectedDistrict)}
      {renderAddressField("Cell", "cellId", cells, <Layers className="h-4 w-4 text-gray-600" />, !selectedSector)}
      {renderAddressField("Village", "villageId", villages, <Navigation className="h-4 w-4 text-gray-600" />, !selectedCell)}

      <div>
        <label className="block text-sm font-medium text-gray-800 mb-2 flex items-center gap-2">
          <Home className="h-4 w-4 text-gray-600" /> Street Address
        </label>
        <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-white" {...register("address.street")} placeholder="e.g., 123 Main Street, Apartment 4B" />
        {errors.address?.street && <p className="mt-1 text-sm text-rose-600">{errors.address.street.message}</p>}
      </div>

      <AddressPreview watch={watch} />
    </motion.div>
  );
}

function AddressPreview({ watch }: { watch: UseFormWatch<FormData> }) {
  const countryId = watch("address.countryId");
  const provinceId = watch("address.provinceId");
  const districtId = watch("address.districtId");
  const sectorId = watch("address.sectorId");
  const cellId = watch("address.cellId");
  const villageId = watch("address.villageId");
  const street = watch("address.street");

  if (!(countryId || provinceId || districtId || sectorId || cellId || villageId || street)) return null;

  // We only show raw IDs since async name lookup is outside this preview's scope
  const parts: string[] = [];
  if (street) parts.push(street);
  if (villageId) parts.push(`Village: ${villageId}`);
  if (cellId) parts.push(`Cell: ${cellId}`);
  if (sectorId) parts.push(`Sector: ${sectorId}`);
  if (districtId) parts.push(`District: ${districtId}`);
  if (provinceId) parts.push(`Province: ${provinceId}`);
  if (countryId) parts.push(`Country: ${countryId}`);

  return (
    <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
      <h4 className="font-medium text-teal-800 mb-2 flex items-center gap-2">
        <MapPin className="h-4 w-4" /> Address Preview
      </h4>
      <div className="text-sm text-gray-700 space-y-1">{parts.map((p, i) => (<div key={i}>{p}</div>))}</div>
    </div>
  );
}
