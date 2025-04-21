
import React from "react";

export function SpotTable() {
  // For now this is just a static placeholder table -- upgrade later as needed!
  return (
    <div className="bg-background border border-border/30 rounded-xl shadow-sm w-[320px] min-w-[220px] p-4 flex flex-col gap-2 h-fit">
      <div className="font-semibold mb-2 text-lg text-primary flex items-center gap-2">
        {/* Spot icon/emoji for some quick visual branding */}
        <span role="img" aria-label="Spot">📍</span>
        Spot
      </div>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="py-1 px-2 text-xs font-semibold text-muted-foreground">#</th>
            <th className="py-1 px-2 text-xs font-semibold text-muted-foreground">Name</th>
            <th className="py-1 px-2 text-xs font-semibold text-muted-foreground">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-1 px-2 text-sm">1</td>
            <td className="py-1 px-2 text-sm">Acme Inc.</td>
            <td className="py-1 px-2 text-xs text-green-600">Active</td>
          </tr>
          <tr>
            <td className="py-1 px-2 text-sm">2</td>
            <td className="py-1 px-2 text-sm">Globex LLC</td>
            <td className="py-1 px-2 text-xs text-yellow-600">Pending</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
