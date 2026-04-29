import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Wallet } from "lucide-react";

const mockWallets = [
  { id: "1", address: "0x9876...ef01", network: "Ethereum", tokens: ["USDT", "USDC", "EURC"], autoConvert: true, currency: "NGN", balance: 245000, provider: "Embedded Custody" },
  { id: "2", address: "T7Hx...8nRq", network: "Tron", tokens: ["USDT"], autoConvert: false, currency: "USD", balance: 89500, provider: "Embedded Custody" },
  { id: "3", address: "0x3456...7890", network: "Polygon", tokens: ["USDC"], autoConvert: true, currency: "GBP", balance: 34200, provider: "Embedded Custody" },
];

const BusinessWalletsTab = () => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2"><Wallet className="h-5 w-5" />Business Wallets</CardTitle>
        <Button size="sm">+ Add Wallet</Button>
      </div>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockWallets.map(w => (
          <Card key={w.id} className="border-2">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline">{w.network}</Badge>
                <Badge className="bg-emerald-500/10 text-emerald-500">Active</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Wallet Address</p>
                <p className="font-mono text-sm">{w.address}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Supported Tokens</p>
                <div className="flex gap-1 mt-1">{w.tokens.map(t => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}</div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Balance</p>
                <p className="text-xl font-bold">${w.balance.toLocaleString()}</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm">Auto-Convert to {w.currency}</span>
                <Switch checked={w.autoConvert} />
              </div>
              <p className="text-xs text-muted-foreground">{w.provider}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default BusinessWalletsTab;
