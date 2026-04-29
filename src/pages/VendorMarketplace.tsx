import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Star, MapPin, Wrench, Plus, Search, Verified } from "lucide-react";

interface Vendor {
  id: string;
  business_name: string;
  description: string;
  service_locations: string[];
  service_categories: string[];
  is_verified: boolean;
  avg_rating: number;
  total_reviews: number;
  total_jobs_completed: number;
  contact_email: string;
  contact_phone: string;
}

export default function VendorMarketplace() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    business_name: "",
    description: "",
    contact_email: "",
    contact_phone: "",
    service_locations: "",
    service_categories: "",
  });

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("vendor_partners")
      .select("*")
      .eq("is_active", true)
      .order("avg_rating", { ascending: false });
    if (error) toast.error("Failed to load vendors");
    else setVendors((data as any) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const register = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("vendor_partners").insert({
      user_id: user?.id,
      business_name: form.business_name,
      description: form.description,
      contact_email: form.contact_email,
      contact_phone: form.contact_phone,
      service_locations: form.service_locations.split(",").map((s) => s.trim()).filter(Boolean),
      service_categories: form.service_categories.split(",").map((s) => s.trim()).filter(Boolean),
    });
    if (error) {
      toast.error(`Registration failed: ${error.message}`);
    } else {
      toast.success("Vendor registered. Pending verification.");
      setOpen(false);
      setForm({ business_name: "", description: "", contact_email: "", contact_phone: "", service_locations: "", service_categories: "" });
      load();
    }
  };

  const filtered = vendors.filter(
    (v) =>
      !search ||
      v.business_name.toLowerCase().includes(search.toLowerCase()) ||
      (v.service_categories || []).some((c) => c.toLowerCase().includes(search.toLowerCase())),
  );

  const renderStars = (rating: number) => {
    const r = Math.round(rating);
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star key={s} className={`w-3.5 h-3.5 ${s <= r ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout title="Vendor Marketplace">
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Vendor Marketplace</h1>
            <p className="text-muted-foreground">Trusted partners for maintenance and parts</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="w-4 h-4" /> Become a Vendor</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Register as Vendor Partner</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Business Name</Label><Input value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} /></div>
                <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Email</Label><Input type="email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} /></div>
                  <div><Label>Phone</Label><Input value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} /></div>
                </div>
                <div><Label>Service Locations (comma-separated)</Label><Input placeholder="Lagos, Abuja, Port Harcourt" value={form.service_locations} onChange={(e) => setForm({ ...form, service_locations: e.target.value })} /></div>
                <div><Label>Categories (comma-separated)</Label><Input placeholder="Injector servicing, Engine repair, Spare parts" value={form.service_categories} onChange={(e) => setForm({ ...form, service_categories: e.target.value })} /></div>
                <Button className="w-full" onClick={register} disabled={!form.business_name}>Submit</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search vendors or services…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : filtered.length === 0 ? (
          <Card><CardContent className="py-12 text-center">
            <Wrench className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No vendors yet. Be the first to register.</p>
          </CardContent></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((v) => (
              <Card key={v.id} className="hover:shadow-md transition">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {v.business_name}
                      {v.is_verified && <Verified className="w-4 h-4 text-primary" />}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {renderStars(v.avg_rating)}
                    <span className="text-muted-foreground">({v.total_reviews})</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {v.description && <p className="text-sm text-muted-foreground line-clamp-2">{v.description}</p>}
                  {v.service_categories?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {v.service_categories.slice(0, 3).map((c, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{c}</Badge>
                      ))}
                    </div>
                  )}
                  {v.service_locations?.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {v.service_locations.slice(0, 2).join(", ")}
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                    <span>{v.total_jobs_completed} jobs</span>
                    <Button size="sm" variant="outline">Request Service</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
