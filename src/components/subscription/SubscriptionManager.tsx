 import { useState } from "react";
 import { useQuery } from "@tanstack/react-query";
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
 import { supabase } from "@/integrations/supabase/client";
 import SubscriptionTierCard from "./SubscriptionTierCard";
 import { CreditCard } from "lucide-react";
 
 interface SubscriptionTier {
   id: string;
   name: string;
   monthly_price: number;
   features: any;
   max_users: number;
   is_active: boolean;
 }
 
 /**
  * Subscription Manager - Section I
  * Displays and manages subscription tiers
  */
 const SubscriptionManager = () => {
   const [selectedTier, setSelectedTier] = useState<string | null>(null);
 
  // Mock tiers for display (actual tiers come from database)
  const tiers: SubscriptionTier[] = [
    { id: "1", name: "Starter", monthly_price: 0, features: { dispatch: true, basic_reports: true, max_vehicles: 5, integrations: false }, max_users: 1, is_active: true },
    { id: "2", name: "Professional", monthly_price: 5000, features: { dispatch: true, operations: true, reports: true, max_vehicles: 50, integrations: ["zoho", "quickbooks"] }, max_users: 10, is_active: true },
    { id: "3", name: "Enterprise", monthly_price: 10000, features: { dispatch: true, operations: true, reports: true, max_vehicles: -1, integrations: ["zoho", "quickbooks", "nero", "whatsapp"], role_customization: true, analytics: true }, max_users: -1, is_active: true },
  ];
  
  const isLoading = false;
  const currentSubscription: any = null;
 
   if (isLoading) {
     return (
       <Card>
         <CardContent className="flex items-center justify-center py-12">
           <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
         </CardContent>
       </Card>
     );
   }
 
   return (
     <div className="space-y-6">
       <div>
         <h3 className="text-lg font-heading font-semibold flex items-center gap-2">
           <CreditCard className="w-5 h-5 text-primary" />
           Subscription Plans
         </h3>
         <p className="text-sm text-muted-foreground">
           Choose the plan that best fits your business needs
         </p>
       </div>
 
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {tiers?.map((tier) => (
           <SubscriptionTierCard
             key={tier.id}
             name={tier.name}
             price={tier.monthly_price}
             features={tier.features || {}}
             maxUsers={tier.max_users}
             isActive={tier.is_active}
             isCurrent={currentSubscription?.tier_id === tier.id}
             onSelect={() => setSelectedTier(tier.id)}
           />
         ))}
       </div>
 
       {/* Feature Comparison Note */}
       <Card className="bg-muted/30">
         <CardContent className="p-4">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
             <div>
               <p className="font-medium mb-1">Starter (Free)</p>
               <ul className="text-muted-foreground space-y-1">
                 <li>• Single user access</li>
                 <li>• Basic dispatch</li>
                 <li>• Limited reports</li>
               </ul>
             </div>
             <div>
               <p className="font-medium mb-1">Professional (₦5,000/mo)</p>
               <ul className="text-muted-foreground space-y-1">
                 <li>• Multi-user (up to 10)</li>
                 <li>• Zoho + QuickBooks sync</li>
                 <li>• Full operations tools</li>
               </ul>
             </div>
             <div>
               <p className="font-medium mb-1">Enterprise (₦10,000/mo)</p>
               <ul className="text-muted-foreground space-y-1">
                 <li>• Unlimited users</li>
                 <li>• WhatsApp + Website orders</li>
                 <li>• Role customization</li>
               </ul>
             </div>
           </div>
         </CardContent>
       </Card>
     </div>
   );
 };
 
 export default SubscriptionManager;