import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Building2, 
  Users, 
  Truck, 
  UserCheck,
  Settings,
  CreditCard,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  TrendingUp
} from "lucide-react";
import { format } from "date-fns";

const OrgAdminDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<string>("dispatcher");

  // Fetch organization stats
  const { data: stats } = useQuery({
    queryKey: ["org-admin-stats"],
    queryFn: async () => {
      const [drivers, vehicles, dispatches, payouts] = await Promise.all([
        supabase.from("drivers").select("id, status", { count: "exact" }),
        supabase.from("vehicles").select("id, status", { count: "exact" }),
        supabase.from("dispatches").select("id, status", { count: "exact" }),
        supabase.from("payout_approvals").select("id, status, amount").eq("status", "pending_org_admin")
      ]);

      return {
        totalDrivers: drivers.count || 0,
        activeDrivers: drivers.data?.filter(d => d.status === "active").length || 0,
        totalVehicles: vehicles.count || 0,
        activeVehicles: vehicles.data?.filter(v => v.status === "active").length || 0,
        totalDispatches: dispatches.count || 0,
        pendingPayouts: payouts.data?.length || 0,
        pendingPayoutAmount: payouts.data?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0
      };
    }
  });

  // Fetch team members
  const { data: teamMembers } = useQuery({
    queryKey: ["org-team-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          user_roles (role)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch pending payouts for approval
  const { data: pendingPayouts } = useQuery({
    queryKey: ["pending-org-payouts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payout_approvals")
        .select("*")
        .eq("status", "pending_org_admin")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Approve payout mutation
  const approvePayoutMutation = useMutation({
    mutationFn: async ({ payoutId, notes }: { payoutId: string; notes?: string }) => {
      const { error } = await supabase
        .from("payout_approvals")
        .update({
          status: "approved",
          org_admin_approved_by: user?.id,
          org_admin_approved_at: new Date().toISOString(),
          org_admin_notes: notes
        })
        .eq("id", payoutId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-org-payouts"] });
      queryClient.invalidateQueries({ queryKey: ["org-admin-stats"] });
      toast({ title: "Success", description: "Payout approved" });
    }
  });

  // Reject payout mutation
  const rejectPayoutMutation = useMutation({
    mutationFn: async ({ payoutId, reason }: { payoutId: string; reason: string }) => {
      const { error } = await supabase
        .from("payout_approvals")
        .update({
          status: "rejected",
          rejected_by: user?.id,
          rejected_at: new Date().toISOString(),
          rejection_reason: reason
        })
        .eq("id", payoutId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-org-payouts"] });
      toast({ title: "Success", description: "Payout rejected" });
    }
  });

  return (
    <DashboardLayout title="Organization Admin" subtitle="Manage your company settings and team">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Drivers</p>
                <p className="text-2xl font-bold">{stats?.activeDrivers || 0}/{stats?.totalDrivers || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Truck className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vehicles</p>
                <p className="text-2xl font-bold">{stats?.activeVehicles || 0}/{stats?.totalVehicles || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Dispatches</p>
                <p className="text-2xl font-bold">{stats?.totalDispatches || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <CreditCard className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Payouts</p>
                <p className="text-2xl font-bold">{stats?.pendingPayouts || 0}</p>
                <p className="text-xs text-muted-foreground">₦{(stats?.pendingPayoutAmount || 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Team Management</TabsTrigger>
          <TabsTrigger value="payouts">Payout Approvals</TabsTrigger>
          <TabsTrigger value="settings">Company Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => setActiveTab("team")}>
                  <Users className="w-5 h-5" />
                  <span>Manage Team</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => setActiveTab("payouts")}>
                  <CreditCard className="w-5 h-5" />
                  <span>Approve Payouts</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => setActiveTab("settings")}>
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Truck className="w-5 h-5" />
                  <span>View Fleet</span>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>Items requiring your attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingPayouts?.slice(0, 5).map((payout) => (
                    <div key={payout.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium">{payout.payout_type}</p>
                        <p className="text-sm text-muted-foreground">₦{payout.amount.toLocaleString()}</p>
                      </div>
                      <Badge variant="secondary">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                    </div>
                  ))}
                  {(!pendingPayouts || pendingPayouts.length === 0) && (
                    <div className="flex items-center justify-center py-8 text-muted-foreground">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      No pending approvals
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Team Management Tab */}
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Manage your organization's users</CardDescription>
                </div>
                <Button onClick={() => setInviteDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Invite Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers?.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.full_name || "—"}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {(member.user_roles as any)?.[0]?.role || "No role"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={member.approval_status === "approved" ? "default" : "secondary"}>
                          {member.approval_status}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(member.created_at), "MMM d, yyyy")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payout Approvals Tab */}
        <TabsContent value="payouts">
          <Card>
            <CardHeader>
              <CardTitle>Payout Approvals</CardTitle>
              <CardDescription>Review and approve payouts submitted by Finance Manager</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Finance Approved By</TableHead>
                    <TableHead>Finance Notes</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingPayouts?.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell className="capitalize">{payout.payout_type.replace("_", " ")}</TableCell>
                      <TableCell className="font-medium">₦{payout.amount.toLocaleString()}</TableCell>
                      <TableCell>{payout.finance_approved_by ? "Approved" : "—"}</TableCell>
                      <TableCell className="max-w-xs truncate">{payout.finance_notes || "—"}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{payout.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => approvePayoutMutation.mutate({ payoutId: payout.id })}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => rejectPayoutMutation.mutate({ payoutId: payout.id, reason: "Rejected by Org Admin" })}
                          >
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!pendingPayouts || pendingPayouts.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No pending payouts to approve
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Company Settings</CardTitle>
              <CardDescription>Configure your organization's preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input placeholder="Your Company Name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Tax ID (TIN)</Label>
                    <Input placeholder="Enter TIN" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Default VAT Rate (%)</Label>
                    <Input type="number" placeholder="7.5" />
                  </div>
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select defaultValue="NGN">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NGN">Nigerian Naira (₦)</SelectItem>
                        <SelectItem value="USD">US Dollar ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invite Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>Send an invitation to join your organization</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ops_manager">Operations Manager</SelectItem>
                  <SelectItem value="finance_manager">Finance Manager</SelectItem>
                  <SelectItem value="dispatcher">Dispatcher</SelectItem>
                  <SelectItem value="driver">Driver</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>Cancel</Button>
            <Button>Send Invitation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default OrgAdminDashboard;
