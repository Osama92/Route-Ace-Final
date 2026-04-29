import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Loader2 } from "lucide-react";

const CreateDispatchDialog = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    customer_id: "",
    pickup_address: "",
    delivery_address: "",
    cargo_description: "",
    cargo_weight_kg: "",
    priority: "normal",
    scheduled_pickup: "",
    vehicle_id: "",
    driver_id: "",
    distance_km: "",
    cost: "",
  });

  const { data: customers } = useQuery({
    queryKey: ["ops-customers-list"],
    queryFn: async () => {
      const { data } = await supabase.from("customers").select("id, company_name").order("company_name");
      return data || [];
    },
    enabled: open,
  });

  const { data: drivers } = useQuery({
    queryKey: ["ops-drivers-list"],
    queryFn: async () => {
      const { data } = await supabase.from("drivers").select("id, full_name").eq("status", "active");
      return data || [];
    },
    enabled: open,
  });

  const { data: vehicles } = useQuery({
    queryKey: ["ops-vehicles-list"],
    queryFn: async () => {
      const { data } = await supabase.from("vehicles").select("id, registration_number, truck_type").eq("status", "active");
      return data || [];
    },
    enabled: open,
  });

  const handleSubmit = async () => {
    if (!form.customer_id || !form.pickup_address || !form.delivery_address) {
      toast({ title: "Missing fields", description: "Customer, pickup & delivery addresses are required", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const distanceKm = form.distance_km ? parseFloat(form.distance_km) : null;
      const costValue = form.cost ? parseFloat(form.cost) : null;
      const { error } = await supabase.from("dispatches").insert([{
        dispatch_number: `DSP-${Date.now()}`,
        customer_id: form.customer_id,
        pickup_address: form.pickup_address,
        delivery_address: form.delivery_address,
        cargo_description: form.cargo_description || null,
        cargo_weight_kg: form.cargo_weight_kg ? parseFloat(form.cargo_weight_kg) : null,
        priority: form.priority,
        scheduled_pickup: form.scheduled_pickup || null,
        vehicle_id: form.vehicle_id || null,
        driver_id: form.driver_id || null,
        distance_km: distanceKm,
        return_distance_km: distanceKm,
        total_distance_km: distanceKm ? distanceKm * 2 : null,
        cost: costValue,
        status: form.driver_id ? "assigned" : "pending",
        created_by: user?.id,
        submitted_by: user?.id,
      }]);

      if (error) throw error;

      toast({ title: "Dispatch created", description: "New dispatch has been created successfully" });
      queryClient.invalidateQueries({ queryKey: ["ops-dispatches"] });
      queryClient.invalidateQueries({ queryKey: ["ops-today-dispatches"] });
      queryClient.invalidateQueries({ queryKey: ["waybill-dispatches"] });
      setOpen(false);
      setForm({ customer_id: "", pickup_address: "", delivery_address: "", cargo_description: "", cargo_weight_kg: "", priority: "normal", scheduled_pickup: "", vehicle_id: "", driver_id: "", distance_km: "", cost: "" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="w-3 h-3 mr-1" />New Dispatch</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Dispatch</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Customer *</Label>
            <Select value={form.customer_id} onValueChange={(v) => setForm((p) => ({ ...p, customer_id: v }))}>
              <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
              <SelectContent>
                {customers?.map((c) => <SelectItem key={c.id} value={c.id}>{c.company_name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Pickup Address *</Label>
            <Input value={form.pickup_address} onChange={(e) => setForm((p) => ({ ...p, pickup_address: e.target.value }))} placeholder="Enter pickup location" />
          </div>
          <div>
            <Label>Delivery Address *</Label>
            <Input value={form.delivery_address} onChange={(e) => setForm((p) => ({ ...p, delivery_address: e.target.value }))} placeholder="Enter delivery location" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Cargo Description</Label>
              <Input value={form.cargo_description} onChange={(e) => setForm((p) => ({ ...p, cargo_description: e.target.value }))} placeholder="e.g. 40ft container" />
            </div>
            <div>
              <Label>Weight (kg)</Label>
              <Input type="number" value={form.cargo_weight_kg} onChange={(e) => setForm((p) => ({ ...p, cargo_weight_kg: e.target.value }))} placeholder="e.g. 5000" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Priority</Label>
              <Select value={form.priority} onValueChange={(v) => setForm((p) => ({ ...p, priority: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Distance (km)</Label>
              <Input type="number" value={form.distance_km} onChange={(e) => setForm((p) => ({ ...p, distance_km: e.target.value }))} placeholder="e.g. 350" />
            </div>
            <div>
              <Label>Trip Cost (₦) *</Label>
              <Input type="number" value={form.cost} onChange={(e) => setForm((p) => ({ ...p, cost: e.target.value }))} placeholder="e.g. 150000" />
            </div>
          </div>
          <div>
            <Label>Scheduled Pickup</Label>
            <Input type="datetime-local" value={form.scheduled_pickup} onChange={(e) => setForm((p) => ({ ...p, scheduled_pickup: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Assign Driver</Label>
              <Select value={form.driver_id} onValueChange={(v) => setForm((p) => ({ ...p, driver_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger>
                <SelectContent>
                  {drivers?.map((d) => <SelectItem key={d.id} value={d.id}>{d.full_name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Assign Vehicle</Label>
              <Select value={form.vehicle_id} onValueChange={(v) => setForm((p) => ({ ...p, vehicle_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger>
                <SelectContent>
                  {vehicles?.map((v) => <SelectItem key={v.id} value={v.id}>{v.registration_number} ({v.truck_type})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
            Create Dispatch
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDispatchDialog;
