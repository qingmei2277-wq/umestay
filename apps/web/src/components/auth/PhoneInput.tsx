"use client";

import { useState, useCallback } from "react";

const COUNTRY_CODES = [
  { code: "+81", label: "🇯🇵 +81", country: "JP" },
  { code: "+86", label: "🇨🇳 +86", country: "CN" },
  { code: "+82", label: "🇰🇷 +82", country: "KR" },
  { code: "+1",  label: "🇺🇸 +1",  country: "US" },
  { code: "+886", label: "🇹🇼 +886", country: "TW" },
  { code: "+852", label: "🇭🇰 +852", country: "HK" },
  { code: "+65",  label: "🇸🇬 +65",  country: "SG" },
  { code: "+44",  label: "🇬🇧 +44",  country: "GB" },
  { code: "+61",  label: "🇦🇺 +61",  country: "AU" },
  { code: "+49",  label: "🇩🇪 +49",  country: "DE" },
  { code: "+33",  label: "🇫🇷 +33",  country: "FR" },
];

interface PhoneInputProps {
  value: string;
  onChange: (e164: string) => void;
  defaultCountry?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function PhoneInput({
  value,
  onChange,
  defaultCountry = "JP",
  placeholder = "09012345678",
  disabled,
}: PhoneInputProps) {
  const defaultEntry = COUNTRY_CODES.find((c) => c.country === defaultCountry) ?? COUNTRY_CODES[0];
  const [countryCode, setCountryCode] = useState(defaultEntry.code);
  const [localNumber, setLocalNumber] = useState("");

  const handleNumberChange = useCallback(
    (num: string) => {
      const digits = num.replace(/\D/g, "");
      setLocalNumber(digits);
      // Convert to E.164: remove leading 0 for JP/etc if present
      const stripped = digits.startsWith("0") ? digits.slice(1) : digits;
      onChange(stripped ? `${countryCode}${stripped}` : "");
    },
    [countryCode, onChange]
  );

  const handleCountryChange = useCallback(
    (code: string) => {
      setCountryCode(code);
      const stripped = localNumber.startsWith("0") ? localNumber.slice(1) : localNumber;
      onChange(stripped ? `${code}${stripped}` : "");
    },
    [localNumber, onChange]
  );

  return (
    <div className="flex gap-2">
      <select
        value={countryCode}
        onChange={(e) => handleCountryChange(e.target.value)}
        disabled={disabled}
        className="w-28 rounded-lg border border-gray-300 px-2 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none bg-white"
      >
        {COUNTRY_CODES.map((c) => (
          <option key={c.country} value={c.code}>
            {c.label}
          </option>
        ))}
      </select>
      <input
        type="tel"
        value={localNumber}
        onChange={(e) => handleNumberChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
      />
    </div>
  );
}
