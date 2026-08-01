"use client";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const rows = [
  { size: "XS", bust: "32", waist: "25", hip: "35" },
  { size: "S", bust: "34", waist: "27", hip: "37" },
  { size: "M", bust: "36", waist: "29", hip: "39" },
  { size: "L", bust: "38", waist: "31", hip: "41" },
  { size: "XL", bust: "40", waist: "33", hip: "43" },
];

export default function SizeGuideModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-2xl bg-white p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-xl">Size Guide (inches)</h3>
          <button onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-black/10 text-black/50">
              <th className="py-2">Size</th>
              <th className="py-2">Bust</th>
              <th className="py-2">Waist</th>
              <th className="py-2">Hip</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.size} className="border-b border-black/5">
                <td className="py-2">{r.size}</td>
                <td className="py-2">{r.bust}</td>
                <td className="py-2">{r.waist}</td>
                <td className="py-2">{r.hip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
