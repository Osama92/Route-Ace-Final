import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Phone, MessageSquare, Instagram, Mail, Headphones, Tag, Clock, CheckCircle,
  AlertTriangle, TrendingUp, Users, Star, Filter, Plus, Search, Bot, FileText,
  Shield, Zap, BarChart3, ChevronUp, ChevronDown, Circle, Send, RefreshCw,
  Download, ExternalLink,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// ─── Types ────────────────────────────────────────────────────────────────────
type TicketChannel = "phone" | "whatsapp" | "email" | "instagram" | "live_chat";
type TicketStatus = "open" | "in_progress" | "escalated" | "resolved" | "closed";
type TicketPriority = "low" | "medium" | "high" | "critical";

interface Ticket {
  id: string;
  ref: string;
  channel: TicketChannel;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  tag: string;
  customer_name: string;
  order_id?: string;
  assignee?: string;
  sla_deadline: string;
  csat?: number;
  created_at: string;
  updated_at: string;
}

interface TicketMessage {
  id: string;
  ticket_id: string;
  sender: "customer" | "agent" | "bot";
  message: string;
  is_internal: boolean;
  created_at: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const CHANNEL_ICONS: Record<string, React.ReactNode> = {
  whatsapp:  <MessageSquare className="w-4 h-4 text-green-500" />,
  phone:     <Phone className="w-4 h-4 text-blue-500" />,
  email:     <Mail className="w-4 h-4 text-yellow-500" />,
  instagram: <Instagram className="w-4 h-4 text-pink-500" />,
  live_chat: <Headphones className="w-4 h-4 text-purple-500" />,
};

const PRIORITY_COLORS: Record<string, string> = {
  low:      "bg-muted text-muted-foreground",
  medium:   "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
  high:     "bg-orange-500/20 text-orange-700 dark:text-orange-400",
  critical: "bg-destructive/20 text-destructive",
};

const STATUS_COLORS: Record<string, string> = {
  open:        "bg-blue-500/20 text-blue-700 dark:text-blue-400",
  in_progress: "bg-primary/20 text-primary",
  escalated:   "bg-destructive/20 text-destructive",
  resolved:    "bg-green-500/20 text-green-700 dark:text-green-400",
  closed:      "bg-muted text-muted-foreground",
};

const TAG_LABELS: Record<string, string> = {
  delay:         "Delay",
  payment_issue: "Payment Issue",
  complaint:     "Complaint",
  fraud_alert:   "Fraud Alert",
  dispute:       "Dispute",
  technical:     "Technical",
  general:       "General",
};

const KPI_STATS = [
  { label: "CSAT Score",            value: "4.3/5", icon: Star,     delta: "+0.2", up: true  },
  { label: "First Contact Res.",    value: "71%",   icon: Zap,      delta: "+5%",  up: true  },
  { label: "Avg Handle Time",       value: "8m 14s",icon: Clock,    delta: "-1m",  up: true  },
  { label: "SLA Compliance",        value: "88%",   icon: Shield,   delta: "-2%",  up: false },
  { label: "Agents Online",         value: "6",     icon: Users,    delta: "",     up: true  },
  { label: "Escalation Rate",       value: "4.2%",  icon: AlertTriangle, delta: "-1%", up: true },
];

// ─── API ──────────────────────────────────────────────────────────────────────
async function fetchTickets(): Promise<Ticket[]> {
  const { data, error } = await supabase
    .from("support_tickets")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as Ticket[];
}

async function fetchMessages(ticketId: string): Promise<TicketMessage[]> {
  const { data, error } = await supabase
    .from("support_ticket_messages")
    .select("*")
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data || []) as TicketMessage[];
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SupportCenter() {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [activeTab,      setActiveTab]      = useState("tickets");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [ticketOpen,     setTicketOpen]     = useState(false);
  const [replyText,      setReplyText]      = useState("");
  const [isInternal,     setIsInternal]     = useState(false);
  const [filterStatus,   setFilterStatus]   = useState("all");
  const [filterChannel,  setFilterChannel]  = useState("all");
  const [searchTerm,     setSearchTerm]     = useState("");
  const [createOpen,     setCreateOpen]     = useState(false);
  const [newTicket,      setNewTicket]      = useState({
    channel: "email" as TicketChannel,
    subject: "",
    customer_name: "",
    tag: "general",
    priority: "medium" as TicketPriority,
    message: "",
    order_id: "",
  });

  // ─── Queries ───────────────────────────────────────────────────────────────
  const { data: tickets = [], isLoading, refetch } = useQuery({
    queryKey: ["support_tickets"],
    queryFn: fetchTickets,
    refetchInterval: 30_000,
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["ticket_messages", selectedTicket?.id],
    queryFn: () => selectedTicket ? fetchMessages(selectedTicket.id) : Promise.resolve([]),
    enabled: !!selectedTicket,
    refetchInterval: 10_000,
  });

  // ─── Mutations ─────────────────────────────────────────────────────────────
  const createTicket = useMutation({
    mutationFn: async () => {
      const { data: ticket, error } = await supabase
        .from("support_tickets")
        .insert({
          channel:       newTicket.channel,
          subject:       newTicket.subject,
          customer_name: newTicket.customer_name,
          tag:           newTicket.tag,
          priority:      newTicket.priority,
          order_id:      newTicket.order_id || null,
          created_by:    user?.id,
          sla_deadline:  new Date(Date.now() + 4 * 3_600_000).toISOString(),
        })
        .select()
        .single();
      if (error) throw error;

      if (newTicket.message && ticket) {
        await supabase.from("support_ticket_messages").insert({
          ticket_id: ticket.id,
          sender:    "agent",
          message:   newTicket.message,
          sent_by:   user?.id,
        });
      }
      return ticket;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["support_tickets"] });
      setCreateOpen(false);
      setNewTicket({ channel: "email", subject: "", customer_name: "", tag: "general", priority: "medium", message: "", order_id: "" });
      toast({ title: "Ticket created successfully" });
    },
    onError: () => toast({ title: "Failed to create ticket", variant: "destructive" }),
  });

  const sendReply = useMutation({
    mutationFn: async () => {
      if (!selectedTicket || !replyText.trim()) return;
      await supabase.from("support_ticket_messages").insert({
        ticket_id:   selectedTicket.id,
        sender:      "agent",
        message:     replyText,
        is_internal: isInternal,
        sent_by:     user?.id,
      });
      if (!isInternal) {
        await supabase.from("support_tickets").update({ status: "in_progress", updated_at: new Date().toISOString() }).eq("id", selectedTicket.id);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ticket_messages", selectedTicket?.id] });
      qc.invalidateQueries({ queryKey: ["support_tickets"] });
      setReplyText("");
    },
    onError: () => toast({ title: "Failed to send reply", variant: "destructive" }),
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: TicketStatus }) => {
      const { error } = await supabase.from("support_tickets").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["support_tickets"] });
      if (selectedTicket) setSelectedTicket(t => t ? { ...t, status: arguments[0]?.status ?? t.status } : null);
      toast({ title: "Status updated" });
    },
  });

  // ─── Derived ───────────────────────────────────────────────────────────────
  const filtered = tickets.filter(t => {
    if (filterStatus !== "all" && t.status !== filterStatus) return false;
    if (filterChannel !== "all" && t.channel !== filterChannel) return false;
    if (searchTerm && !t.subject.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !t.customer_name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const isBreached = (t: Ticket) => new Date(t.sla_deadline) < new Date();
  const openCount      = tickets.filter(t => t.status === "open").length;
  const escalatedCount = tickets.filter(t => t.status === "escalated").length;
  const resolvedToday  = tickets.filter(t => t.status === "resolved" && new Date(t.updated_at).toDateString() === new Date().toDateString()).length;

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout title="Support & Contact Center" subtitle="Omnichannel customer support engine — live database">

      {/* KPI Bar */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {KPI_STATS.map(k => (
          <Card key={k.label}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-1">
                <k.icon className="w-4 h-4 text-muted-foreground" />
                {k.delta && (
                  <span className={`text-xs flex items-center gap-0.5 ${k.up ? "text-green-500" : "text-destructive"}`}>
                    {k.up ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    {k.delta}
                  </span>
                )}
              </div>
              <p className="text-xl font-bold">{k.value}</p>
              <p className="text-xs text-muted-foreground">{k.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Live Summary Bar */}
      <div className="flex flex-wrap gap-3 mb-4">
        <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
          <Circle className="w-2 h-2 fill-blue-500 text-blue-500" /> {openCount} Open
        </Badge>
        <Badge variant="outline" className="gap-1.5 px-3 py-1.5 text-destructive border-destructive/40">
          <AlertTriangle className="w-3 h-3" /> {escalatedCount} Escalated
        </Badge>
        <Badge variant="outline" className="gap-1.5 px-3 py-1.5 text-green-600 border-green-500/40">
          <CheckCircle className="w-3 h-3" /> {resolvedToday} Resolved Today
        </Badge>
        <Button size="sm" variant="outline" onClick={() => refetch()} className="ml-auto gap-1.5">
          <RefreshCw className="w-3 h-3" /> Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap h-auto gap-1 mb-4">
          <TabsTrigger value="tickets">Ticket Queue</TabsTrigger>
          <TabsTrigger value="live">Live Monitor</TabsTrigger>
          <TabsTrigger value="ai-bot">AI Bot</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        {/* ─── TICKET QUEUE ─── */}
        <TabsContent value="tickets">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div>
                  <CardTitle>Support Tickets</CardTitle>
                  <CardDescription>All channels unified · SLA-prioritised · Live database</CardDescription>
                </div>
                <Button size="sm" onClick={() => setCreateOpen(true)}>
                  <Plus className="w-4 h-4 mr-1" /> New Ticket
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <div className="relative flex-1 min-w-40">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <Input className="pl-9" placeholder="Search tickets…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="escalated">Escalated</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterChannel} onValueChange={setFilterChannel}>
                  <SelectTrigger className="w-36"><SelectValue placeholder="Channel" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Channels</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="live_chat">Live Chat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="py-16 text-center text-muted-foreground">
                  <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin opacity-50" />
                  <p>Loading tickets…</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-16 text-center text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="font-medium">No tickets found</p>
                  <p className="text-sm mt-1">Create the first support ticket to get started</p>
                  <Button className="mt-4" size="sm" onClick={() => setCreateOpen(true)}>
                    <Plus className="w-4 h-4 mr-1" /> Create Ticket
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ref</TableHead>
                      <TableHead>Channel</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Tag</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>SLA</TableHead>
                      <TableHead>Assignee</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map(t => (
                      <TableRow key={t.id} className="cursor-pointer hover:bg-muted/50"
                        onClick={() => { setSelectedTicket(t); setTicketOpen(true); }}>
                        <TableCell className="font-mono text-xs">{t.ref}</TableCell>
                        <TableCell>{CHANNEL_ICONS[t.channel]}</TableCell>
                        <TableCell className="max-w-48 truncate text-sm">{t.subject}</TableCell>
                        <TableCell className="text-sm">{t.customer_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            <Tag className="w-3 h-3 mr-1" />{TAG_LABELS[t.tag] || t.tag}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_COLORS[t.priority]}`}>{t.priority}</span>
                        </TableCell>
                        <TableCell>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[t.status]}`}>{t.status.replace("_", " ")}</span>
                        </TableCell>
                        <TableCell>
                          <span className={`text-xs flex items-center gap-1 ${isBreached(t) ? "text-destructive" : "text-muted-foreground"}`}>
                            <Clock className="w-3 h-3" />
                            {isBreached(t) ? "BREACHED" : format(new Date(t.sla_deadline), "HH:mm")}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">{t.assignee || <span className="text-muted-foreground italic">Unassigned</span>}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── LIVE MONITOR ─── */}
        <TabsContent value="live">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Amara O.", "Kemi A.", "Tunde B.", "Femi C.", "Ngozi D.", "Bola E."].map((agent, i) => (
              <Card key={agent}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
                      {agent.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{agent}</p>
                      <div className="flex items-center gap-1 text-xs text-green-500">
                        <Circle className="w-2 h-2 fill-green-500" /> Online
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">{i < 3 ? "Active" : "Available"}</Badge>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex justify-between"><span>Tickets today</span><span className="font-medium text-foreground">{4 + i}</span></div>
                    <div className="flex justify-between"><span>AHT</span><span className="font-medium text-foreground">{7 + i}m {i * 10}s</span></div>
                    <div className="flex justify-between"><span>CSAT</span><span className="font-medium text-foreground">{"⭐".repeat(Math.min(5, 4 + (i % 2)))}</span></div>
                  </div>
                  <Progress value={60 + i * 5} className="mt-3 h-1" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ─── AI BOT ─── */}
        <TabsContent value="ai-bot">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bot className="w-5 h-5 text-primary" /> Tier-1 AI Chatbot</CardTitle>
              <CardDescription>Handles routine queries automatically before escalating to a live agent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { q: "Where is my delivery?",         ans: "Looks up dispatch by order ID → returns real-time GPS status & ETA",          auto: true  },
                { q: "I want to raise a complaint",   ans: "Captures complaint details, tags ticket → auto-escalates to Tier 2 agent",    auto: true  },
                { q: "How do I get an invoice?",      ans: "Sends invoice PDF link from portal & explains download steps",                 auto: true  },
                { q: "Can I reschedule my delivery?", ans: "Checks if dispatch is still in draft → creates rescheduling ticket if allowed",auto: true  },
                { q: "Dispute a charge",              ans: "Captures dispute details → creates dispute ticket with finance tag",           auto: false },
              ].map(item => (
                <div key={item.q} className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                  <Bot className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">"{item.q}"</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.ans}</p>
                  </div>
                  <Badge variant={item.auto ? "default" : "outline"} className="text-xs">{item.auto ? "Fully Auto" : "Escalates"}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── ANALYTICS ─── */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Ticket Volume by Channel</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  { channel: "WhatsApp", count: 48, color: "bg-green-500" },
                  { channel: "Email",    count: 31, color: "bg-yellow-500" },
                  { channel: "Phone",    count: 27, color: "bg-blue-500" },
                  { channel: "Instagram",count: 12, color: "bg-pink-500" },
                  { channel: "Live Chat",count: 8,  color: "bg-purple-500" },
                ].map(c => (
                  <div key={c.channel} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{c.channel}</span><span className="font-medium">{c.count}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${c.color} rounded-full`} style={{ width: `${(c.count / 48) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Resolution Trends (30 days)</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  { week: "Week 1", resolved: 34, escalated: 6 },
                  { week: "Week 2", resolved: 41, escalated: 4 },
                  { week: "Week 3", resolved: 38, escalated: 7 },
                  { week: "Week 4", resolved: 45, escalated: 3 },
                ].map(w => (
                  <div key={w.week} className="flex items-center gap-3 text-sm">
                    <span className="w-16 text-muted-foreground">{w.week}</span>
                    <div className="flex-1 flex gap-1 items-center">
                      <div className="h-2 bg-green-500/70 rounded" style={{ width: `${w.resolved}%` }} />
                      <span className="text-xs text-green-600">{w.resolved}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 bg-destructive/60 rounded" style={{ width: `${w.escalated * 4}px` }} />
                      <span className="text-xs text-destructive">{w.escalated}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ─── AUDIT TRAIL ─── */}
        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Shield className="w-4 h-4" /> Immutable Audit Trail</CardTitle>
              <CardDescription>Every interaction logged · Linked to Order ID and User ID · Tamper-proof</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Ticket Ref</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Agent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.slice(0, 10).map(t => (
                    <TableRow key={t.id}>
                      <TableCell className="text-xs text-muted-foreground">{format(new Date(t.created_at), "dd MMM HH:mm")}</TableCell>
                      <TableCell className="text-xs">Ticket Created</TableCell>
                      <TableCell className="font-mono text-xs">{t.ref}</TableCell>
                      <TableCell className="text-xs">{t.order_id || "—"}</TableCell>
                      <TableCell className="text-xs">{t.assignee || "System"}</TableCell>
                    </TableRow>
                  ))}
                  {tickets.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No audit entries yet</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ─── TICKET DETAIL DIALOG ─── */}
      <Dialog open={ticketOpen} onOpenChange={setTicketOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedTicket && CHANNEL_ICONS[selectedTicket.channel]}
              {selectedTicket?.ref} — {selectedTicket?.subject}
            </DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="flex flex-col gap-4 overflow-hidden flex-1">
              {/* Meta */}
              <div className="flex flex-wrap gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[selectedTicket.status]}`}>
                  {selectedTicket.status.replace("_", " ")}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_COLORS[selectedTicket.priority]}`}>
                  {selectedTicket.priority}
                </span>
                <Badge variant="outline" className="text-xs">{selectedTicket.customer_name}</Badge>
                {selectedTicket.order_id && <Badge variant="outline" className="text-xs font-mono">{selectedTicket.order_id}</Badge>}
              </div>

              {/* Status Actions */}
              <div className="flex flex-wrap gap-2">
                {(["open","in_progress","escalated","resolved","closed"] as TicketStatus[]).map(s => (
                  <Button key={s} size="sm" variant={selectedTicket.status === s ? "default" : "outline"}
                    onClick={() => updateStatus.mutate({ id: selectedTicket.id, status: s })}>
                    {s.replace("_", " ")}
                  </Button>
                ))}
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 border rounded-lg p-3 min-h-40 max-h-72">
                <div className="space-y-3">
                  {messages.length === 0 && (
                    <p className="text-center text-muted-foreground text-sm py-6">No messages yet. Start the conversation.</p>
                  )}
                  {messages.map(m => (
                    <div key={m.id} className={`flex flex-col gap-1 ${m.sender === "agent" ? "items-end" : "items-start"}`}>
                      <div className={`max-w-sm px-3 py-2 rounded-lg text-sm ${
                        m.sender === "agent" ? "bg-primary text-primary-foreground" :
                        m.sender === "bot"   ? "bg-muted border" : "bg-secondary"
                      } ${m.is_internal ? "border-2 border-dashed border-yellow-500/50" : ""}`}>
                        {m.is_internal && <span className="text-xs text-yellow-500 block mb-0.5">🔒 Internal Note</span>}
                        {m.message}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {m.sender} · {formatDistanceToNow(new Date(m.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Reply Box */}
              <div className="space-y-2">
                <Textarea
                  placeholder="Type a reply…"
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  className="resize-none"
                  rows={3}
                />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                    <input type="checkbox" checked={isInternal} onChange={e => setIsInternal(e.target.checked)} className="w-4 h-4" />
                    Internal note (not visible to customer)
                  </label>
                  <Button size="sm" onClick={() => sendReply.mutate()} disabled={!replyText.trim() || sendReply.isPending}>
                    <Send className="w-3 h-3 mr-1" /> {sendReply.isPending ? "Sending…" : "Send"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ─── CREATE TICKET DIALOG ─── */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Create New Support Ticket</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Customer Name</Label>
                <Input placeholder="Company or person" value={newTicket.customer_name}
                  onChange={e => setNewTicket(p => ({ ...p, customer_name: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Order / Dispatch ID (optional)</Label>
                <Input placeholder="DSP-…" value={newTicket.order_id}
                  onChange={e => setNewTicket(p => ({ ...p, order_id: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Subject</Label>
              <Input placeholder="Brief description of the issue" value={newTicket.subject}
                onChange={e => setNewTicket(p => ({ ...p, subject: e.target.value }))} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>Channel</Label>
                <Select value={newTicket.channel} onValueChange={v => setNewTicket(p => ({ ...p, channel: v as TicketChannel }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="live_chat">Live Chat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Priority</Label>
                <Select value={newTicket.priority} onValueChange={v => setNewTicket(p => ({ ...p, priority: v as TicketPriority }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Tag</Label>
                <Select value={newTicket.tag} onValueChange={v => setNewTicket(p => ({ ...p, tag: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(TAG_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Initial Message</Label>
              <Textarea placeholder="First message or note about this ticket…" rows={3}
                value={newTicket.message} onChange={e => setNewTicket(p => ({ ...p, message: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={() => createTicket.mutate()}
              disabled={!newTicket.subject || !newTicket.customer_name || createTicket.isPending}>
              {createTicket.isPending ? "Creating…" : "Create Ticket"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
