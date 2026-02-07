import { ReactNode } from "react";

export function MetricCard({
  title,
  value,
  delta,
  tooltip,
  children
}: {
  title: string;
  value: string | number;
  delta?: string;
  tooltip?: string;
  children?: ReactNode;
}) {
  return (
    <div className="card space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          {tooltip ? (
            <p className="mt-1 text-xs text-slate-500">{tooltip}</p>
          ) : null}
        </div>
        {delta ? <span className="badge">{delta}</span> : null}
      </div>
      <div className="text-3xl font-semibold text-white">{value}</div>
      {children}
    </div>
  );
}
