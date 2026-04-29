import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import useTenantMode from "@/hooks/useTenantMode";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Warehouse, Plus, Truck, MapPin, Calendar, Package, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const STATUS_VARIANTS: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-700 border-amber-500/30",
  assigned: "bg-blue-500/10 text-blue-700 border-blue-500/30",
  in_transit: "bg-purple-500/10 text-purple-700 border-purple-500/30",
  delivered: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
  cancelled: "bg-red-500/10 text-red-700 border-red-500/30",
};

export default function WarehouseOutbound() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { isDepartment, mode } = useTenantMode();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    warehouse_name: "",
    origin_address: "",
    destination_address: "",
    internal_stakeholder: "",
    goods_description: "",
    total_weight_kg: "",
    requested_date: new Date().toISOString().split("T")[0],
    priority: "normal",
    notes: "",
  });

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["outbound-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("outbound_requests" as any)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data as any[];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("outbound_requests" as any).insert({
        ...form,
        total_weight_kg: form.total_weight_kg ? parseFloat(form.total_weight_kg) : null,
        created_by: user.id,
      } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Outbound request created. Outbound Officer will assign a vehicle.");
      qc.invalidateQueries({ queryKey: ["outbound-requests"] });
      setOpen(false);
      setForm({
        warehouse_name: "",
        origin_address: "",
        destination_address: "",
        internal_stakeholder: "",
        goods_description: "",
        total_weight_kg: "",
        requested_date: new Date().toISOString().split("T")[0],
        priority: "normal",
        notes: "",
      });
    },
    onError: (e: any) => toast.error(e.message || "Failed to create request"),
  });

  const stats = {
    pending: requests.filter((r) => r.status === "pending").length,
    assigned: requests.filter((r) => r.status === "assigned").length,
    in_transit: requests.filter((r) => r.status === "in_transit").length,
    delivered: requests.filter((r) => r.status === "delivered").length,
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Warehouse className="w-3.5 h-3.5" /> Mode: {mode === "LOGISTICS_DEPARTMENT" ? "Department" : "Company"}
          </div>
          <h1 className="text-3xl font-bold">Warehouse Outbound Requests</h1>
          <p className="text-muted-foreground mt-1">
            Warehouse-originated dispatch requests. Each request flows into the dispatch engine with mandatory
            pre-trip / post-trip inspection enforcement.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="w-4 h-4" /> New Outbound Request</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>Create Outbound Request</DialogTitle></DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Warehouse *</Label>
                <Input value={form.warehouse_name} onChange={(e) => setForm({ ...form, warehouse_name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Requested Date *</Label>
                <Input type="date" value={form.requested_date} onChange={(e) => setForm({ ...form, requested_date: e.target.value })} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Origin Address *</Label>
                <Input value={form.origin_address} onChange={(e) => setForm({ ...form, origin_address: e.target.value })} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Destination Address *</Label>
                <Input value={form.destination_address} onChange={(e) => setForm({ ...form, destination_address: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{isDepartment ? "Internal Stakeholder" : "Customer / Recipient"}</Label>
                <Input value={form.internal_stakeholder} onChange={(e) => setForm({ ...form, internal_stakeholder: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Total Weight (kg)</Label>
                <Input type="number" value={form.total_weight_kg} onChange={(e) => setForm({ ...form, total_weight_kg: e.target.value })} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Goods Description</Label>
                <Textarea value={form.goods_description} onChange={(e) => setForm({ ...form, goods_description: e.target.value })} rows={2} />
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Notes</Label>
                <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button
                onClick={() => create.mutate()}
                disabled={!form.warehouse_name || !form.origin_address || !form.destination_address || create.isPending}
              >
                {create.isPending ? "Creating..." : "Create Request"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Pending Assignment", value: stats.pending, icon: AlertTriangle, color: "text-amber-600" },
          { label: "Assigned", value: stats.assigned, icon: Truck, color: "text-blue-600" },
          { label: "In Transit", value: stats.in_transit, icon: MapPin, color: "text-purple-600" },
          { label: "Delivered Today", value: stats.delivered, icon: Package, color: "text-emerald-600" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className={`w-8 h-8 ${s.color}`} />
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Requests</CardTitle>
          <CardDescription>
            Inspection-driven dispatch authority enforced — vehicles cannot leave without pre-trip inspection.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading…</div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Warehouse className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No outbound requests yet. Create your first one.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {requests.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{r.request_number}</span>
                      <Badge variant="outline" className={STATUS_VARIANTS[r.status] || ""}>
                        {r.status}
                      </Badge>
                      {r.priority !== "normal" && (
                        <Badge variant="outline" className="text-[10px]">{r.priority}</Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium mt-1">{r.warehouse_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.origin_address} → {r.destination_address}
                    </p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {new Date(r.requested_date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
