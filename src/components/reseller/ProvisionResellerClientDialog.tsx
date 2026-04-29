import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Building2 } from "lucide-react";

interface ProvisionResellerClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

export default function ProvisionResellerClientDialog({
  open,
  onOpenChange,
  onCreated,
}: ProvisionResellerClientDialogProps) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const [orgName, setOrgName] = useState("");
  const [tier, setTier] = useState("starter");
  const [maxLicenses, setMaxLicenses] = useState<string>("10");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");

  const reset = () => {
    setOrgName(""); setTier("starter"); setMaxLicenses("10");
    setOwnerEmail(""); setOwnerName(""); setOwnerPhone("");
  };

  const handleSubmit = async () => {
    if (!orgName || !ownerEmail || !ownerName) {
      toast({ title: "Missing fields", description: "Organization name, owner name and email are required.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("resell-create-client", {
        body: {
          organization: {
            name: orgName,
            subscription_tier: tier,
            max_reseller_licenses: Number(maxLicenses) || 0,
          },
          owner: {
            email: ownerEmail,
            full_name: ownerName,
            phone: ownerPhone || undefined,
          },
        },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);

      toast({
        title: "Client provisioned",
        description: `${orgName} is live. Owner sign-in details emailed to ${ownerEmail}.`,
      });
      reset();
      onOpenChange(false);
      onCreated?.();
    } catch (err: any) {
      toast({
        title: "Provisioning failed",
        description: err?.message || "Unexpected error.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="font-heading flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Provision Reseller Client
          </DialogTitle>
          <DialogDescription>
            Create a downstream tenant organization and its owner user in one step.
            A 6-month reseller lock is applied automatically (Super Admin can override).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="rc-org">Organization Name *</Label>
              <Input id="rc-org" value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Acme Logistics Ltd" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rc-tier">Subscription Tier</Label>
              <Select value={tier} onValueChange={setTier}>
                <SelectTrigger id="rc-tier"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="starter">Starter</SelectItem>
                  <SelectItem value="growth">Growth</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rc-licenses">Max Licenses</Label>
              <Input id="rc-licenses" type="number" min={1} value={maxLicenses} onChange={(e) => setMaxLicenses(e.target.value)} />
            </div>
          </div>

          <div className="border-t border-border/50 pt-4 space-y-3">
            <p className="text-sm font-medium text-foreground">Owner Account</p>
            <div className="space-y-2">
              <Label htmlFor="rc-oname">Owner Full Name *</Label>
              <Input id="rc-oname" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="Jane Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rc-oemail">Owner Email *</Label>
              <Input id="rc-oemail" type="email" value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} placeholder="owner@acme.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rc-ophone">Owner Phone (optional)</Label>
              <Input id="rc-ophone" value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)} placeholder="+234..." />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Provisioning...</> : <>Provision Client</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
