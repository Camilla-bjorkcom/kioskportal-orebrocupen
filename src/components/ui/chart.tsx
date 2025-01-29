import React from "react";
import { TooltipProps } from "recharts";

// Typ för ChartConfig
export type ChartConfig = {
  [key: string]: {
    label: string;
    color: string;
  };
};

// Container för att ge enhetlig design för grafer
export const ChartContainer: React.FC<{
  config: ChartConfig;
  children: React.ReactNode;
}> = ({ config, children }) => {
  return (
    <div
      style={{
        padding: "16px",
        backgroundColor: "var(--background)",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      {children}
    </div>
  );
};

// Anpassad Tooltip för Recharts
export const ChartTooltip: React.FC<TooltipProps<any, any>> = ({
  active,
  payload,
  label,
}) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      style={{
        backgroundColor: "white",
        border: "1px solid #ddd",
        borderRadius: "4px",
        padding: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <p style={{ margin: 0, fontWeight: "bold" }}>{label}</p>
      <p style={{ margin: 0 }}>{`${payload[0].name}: ${payload[0].value}`}</p>
    </div>
  );
};

// Innehåll för Tooltips (med stöd för fler inställningar)
export const ChartTooltipContent: React.FC<{
  hideLabel?: boolean;
}> = ({ hideLabel }) => {
  return (
    <div
      style={{
        padding: "8px",
        backgroundColor: "#f9f9f9",
        borderRadius: "4px",
      }}
    >
      {!hideLabel && <p style={{ margin: 0 }}>Custom Tooltip Content</p>}
    </div>
  );
};
