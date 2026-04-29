import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface FleetKPIs {
  // Downtime & Availability
  totalFleet: number;
  daysAvailableThisMonth: number;
  daysInMonth: number;
  downtimeHealth: "good" | "warning" | "critical"; // >=24 good, <24 bad
  uptimePct: number;
  vehiclesDown: number;

  // TTR / MTTR
  mttrHours: number;
  mttrRating: "world_class" | "average" | "needs_improvement"; // <2h, 2-8h, >8h
  totalRepairsCompleted: number;
  totalDowntimeHours: number;
  repairsWithin48hPct: number;
  repeatRepairPct: number;

  // Cost
  totalMaintenanceCost: number;
  avgCostPerVehicle: number;
  avgCostPerKm: number;
  avgCostPerDelivery: number;

  // Operational
  utilizationRate: number;
  idleTimePct: number;
  avgFuelLevel: number;

  // Maintenance
  pmCompliancePct: number;
  scheduledVsUnscheduledRatio: number;
  mtbfHours: number;

  // Safety / Driver
  avgDriverScore: number;
  dvirCompliancePct: number;
  onTimeDeliveryPct: number;
  firstAttemptPct: number;

  // Raw data
  maintenanceOrders: any[];
  downtimeLogs: any[];
  driverScores: any[];
  fleetVehicles: any[];
}

export const useFleetKPIs = () => {
  const { user } = useAuth();
  const [kpis, setKpis] = useState<FleetKPIs | null>(null);
  const [loading, setLoading] = useState(true);

  const calculate = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    const [fleetRes, maintRes, downtimeRes, driverRes] = await Promise.all([
      supabase.from("fmcg_fleet_tracking").select("*").order("updated_at", { ascending: false }),
      supabase.from("fleet_maintenance_orders").select("*").order("created_at", { ascending: false }).limit(200),
      supabase.from("fleet_downtime_log").select("*").gte("log_date", monthStart).order("log_date", { ascending: false }),
      supabase.from("fleet_driver_scores").select("*").gte("score_date", monthStart).order("score_date", { ascending: false }),
    ]);

    const fleet = fleetRes.data || [];
    const maint = maintRes.data || [];
    const downtime = downtimeRes.data || [];
    const drivers = driverRes.data || [];

    const totalFleet = fleet.length;

    // === Downtime & Availability ===
    // Per vehicle: count days where is_available = true this month
    const vehicleAvailDays: Record<string, number> = {};
    const vehicleDownDays: Record<string, number> = {};
    fleet.forEach((v: any) => {
      vehicleAvailDays[v.id] = daysInMonth; // default: all days available
      vehicleDownDays[v.id] = 0;
    });
    downtime.forEach((d: any) => {
      if (!d.is_available && d.vehicle_id) {
        vehicleDownDays[d.vehicle_id] = (vehicleDownDays[d.vehicle_id] || 0) + 1;
        vehicleAvailDays[d.vehicle_id] = Math.max(0, (vehicleAvailDays[d.vehicle_id] || daysInMonth) - 1);
      }
    });

    const totalAvailDays = Object.values(vehicleAvailDays).reduce((s, v) => s + v, 0);
    const totalDownDays = Object.values(vehicleDownDays).reduce((s, v) => s + v, 0);
    const avgDaysAvailable = totalFleet > 0 ? Math.round(totalAvailDays / totalFleet) : daysInMonth;
    const uptimePct = totalFleet > 0 && daysInMonth > 0
      ? Math.round((totalAvailDays / (totalFleet * daysInMonth)) * 100)
      : 100;
    const vehiclesDown = fleet.filter((f: any) => f.current_status === "maintenance").length;

    // Downtime health: >=24 days available is good
    const downtimeHealth: "good" | "warning" | "critical" =
      avgDaysAvailable >= 24 ? "good" : avgDaysAvailable >= 20 ? "warning" : "critical";

    // === TTR / MTTR ===
    const completedRepairs = maint.filter((m: any) => m.status === "completed" && m.repair_hours != null);
    const totalRepairHours = completedRepairs.reduce((s: number, m: any) => s + (m.repair_hours || 0), 0);
    const mttrHours = completedRepairs.length > 0 ? Math.round((totalRepairHours / completedRepairs.length) * 10) / 10 : 0;
    const mttrRating: "world_class" | "average" | "needs_improvement" =
      mttrHours < 2 ? "world_class" : mttrHours <= 8 ? "average" : "needs_improvement";

    const totalDowntimeHours = completedRepairs.reduce((s: number, m: any) => s + (m.downtime_hours || 0), 0);
    const repairsWithin48h = completedRepairs.filter((m: any) => (m.downtime_hours || 0) <= 48).length;
    const repairsWithin48hPct = completedRepairs.length > 0
      ? Math.round((repairsWithin48h / completedRepairs.length) * 100) : 0;

    const repeatRepairs = maint.filter((m: any) => m.is_repeat_repair).length;
    const repeatRepairPct = maint.length > 0 ? Math.round((repeatRepairs / maint.length) * 100 * 10) / 10 : 0;

    // === Cost ===
    const totalMaintenanceCost = maint.reduce((s: number, m: any) => s + (m.total_cost || 0), 0);
    const avgCostPerVehicle = totalFleet > 0 ? Math.round(totalMaintenanceCost / totalFleet) : 0;

    // Calculate from fleet tracking
    const totalKm = fleet.reduce((s: number, f: any) => s + (f.total_km_today || 0), 0);
    const totalDeliveries = fleet.reduce((s: number, f: any) => s + (f.total_deliveries_today || 0), 0);
    const avgCostPerKm = totalKm > 0 ? Math.round((totalMaintenanceCost / totalKm) * 100) / 100 : 0;
    const avgCostPerDelivery = totalDeliveries > 0 ? Math.round(totalMaintenanceCost / totalDeliveries) : 0;

    // === Operational ===
    const activeVehicles = fleet.filter((f: any) => f.current_status === "en_route" || f.current_status === "loading").length;
    const utilizationRate = totalFleet > 0 ? Math.round((activeVehicles / totalFleet) * 100) : 0;
    const idleVehicles = fleet.filter((f: any) => f.current_status === "idle").length;
    const idleTimePct = totalFleet > 0 ? Math.round((idleVehicles / totalFleet) * 100) : 0;
    const avgFuelLevel = totalFleet > 0
      ? Math.round(fleet.reduce((s: number, f: any) => s + (f.fuel_level_pct || 0), 0) / totalFleet)
      : 0;

    // === Maintenance KPIs ===
    const preventive = maint.filter((m: any) => m.order_type === "preventive");
    const pmCompleted = preventive.filter((m: any) => m.status === "completed").length;
    const pmCompliancePct = preventive.length > 0 ? Math.round((pmCompleted / preventive.length) * 100) : 0;
    const scheduled = maint.filter((m: any) => m.order_type === "preventive" || m.order_type === "inspection").length;
    const unscheduled = maint.filter((m: any) => m.order_type === "corrective" || m.order_type === "emergency").length;
    const scheduledVsUnscheduledRatio = unscheduled > 0 ? Math.round((scheduled / unscheduled) * 100) / 100 : scheduled > 0 ? 10 : 0;

    // MTBF: total operational hours / number of failures
    const failures = maint.filter((m: any) => m.order_type === "corrective" || m.order_type === "emergency").length;
    const totalOpHours = totalFleet * avgDaysAvailable * 12; // assume 12hr operational days
    const mtbfHours = failures > 0 ? Math.round(totalOpHours / failures) : totalOpHours;

    // === Driver KPIs ===
    const avgDriverScore = drivers.length > 0
      ? Math.round(drivers.reduce((s: number, d: any) => s + (d.overall_score || 0), 0) / drivers.length)
      : 0;
    const dvirCompleted = drivers.filter((d: any) => d.dvir_completed).length;
    const dvirCompliancePct = drivers.length > 0 ? Math.round((dvirCompleted / drivers.length) * 100) : 0;

    const totalDriverDeliveries = drivers.reduce((s: number, d: any) => s + (d.deliveries_completed || 0), 0);
    const totalOnTime = drivers.reduce((s: number, d: any) => s + (d.deliveries_on_time || 0), 0);
    const totalFirstAttempt = drivers.reduce((s: number, d: any) => s + (d.first_attempt_success || 0), 0);
    const onTimeDeliveryPct = totalDriverDeliveries > 0 ? Math.round((totalOnTime / totalDriverDeliveries) * 100) : 0;
    const firstAttemptPct = totalDriverDeliveries > 0 ? Math.round((totalFirstAttempt / totalDriverDeliveries) * 100) : 0;

    setKpis({
      totalFleet,
      daysAvailableThisMonth: avgDaysAvailable,
      daysInMonth,
      downtimeHealth,
      uptimePct,
      vehiclesDown,
      mttrHours,
      mttrRating,
      totalRepairsCompleted: completedRepairs.length,
      totalDowntimeHours: Math.round(totalDowntimeHours * 10) / 10,
      repairsWithin48hPct,
      repeatRepairPct,
      totalMaintenanceCost,
      avgCostPerVehicle,
      avgCostPerKm,
      avgCostPerDelivery,
      utilizationRate,
      idleTimePct,
      avgFuelLevel,
      pmCompliancePct,
      scheduledVsUnscheduledRatio,
      mtbfHours,
      avgDriverScore,
      dvirCompliancePct,
      onTimeDeliveryPct,
      firstAttemptPct,
      maintenanceOrders: maint,
      downtimeLogs: downtime,
      driverScores: drivers,
      fleetVehicles: fleet,
    });
    setLoading(false);
  }, [user]);

  useEffect(() => { calculate(); }, [calculate]);

  return { kpis, loading, refetch: calculate };
};
