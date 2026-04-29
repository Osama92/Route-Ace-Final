import { motion } from "framer-motion";
import { MapPin, Clock, Truck, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Shipment {
  id: string;
  origin: string;
  destination: string;
  driver: string;
  status: "delivered" | "transit" | "pending" | "delayed";
  eta: string;
  distance: string;
}

const shipments: Shipment[] = [
  {
    id: "SHP-001",
    origin: "Lagos Warehouse",
    destination: "Abuja Distribution",
    driver: "Michael Okonkwo",
    status: "transit",
    eta: "2h 45m",
    distance: "458 km",
  },
  {
    id: "SHP-002",
    origin: "Port Harcourt",
    destination: "Kano Terminal",
    driver: "Ahmed Ibrahim",
    status: "pending",
    eta: "Awaiting dispatch",
    distance: "892 km",
  },
  {
    id: "SHP-003",
    origin: "Ibadan Hub",
    destination: "Lagos Warehouse",
    driver: "Chidi Eze",
    status: "delivered",
    eta: "Completed",
    distance: "128 km",
  },
  {
    id: "SHP-004",
    origin: "Calabar Port",
    destination: "Enugu Center",
    driver: "Emeka Nwachukwu",
    status: "delayed",
    eta: "3h 20m (delayed)",
    distance: "245 km",
  },
  {
    id: "SHP-005",
    origin: "Kaduna Depot",
    destination: "Jos Terminal",
    driver: "Yusuf Abubakar",
    status: "transit",
    eta: "1h 15m",
    distance: "176 km",
  },
];

const statusLabels = {
  delivered: "Delivered",
  transit: "In Transit",
  pending: "Pending",
  delayed: "Delayed",
};

const RecentShipments = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="glass-card overflow-hidden"
    >
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Recent Shipments
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Track your latest dispatch activities
            </p>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary/30">
            <tr>
              <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Shipment
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Route
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Driver
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                ETA
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Distance
              </th>
              <th className="text-right py-4 px-6"></th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((shipment, index) => (
              <motion.tr
                key={shipment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                className="data-table-row"
              >
                <td className="py-4 px-6">
                  <span className="font-medium text-foreground">
                    {shipment.id}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <div className="text-sm">
                      <p className="text-foreground">{shipment.origin}</p>
                      <p className="text-muted-foreground">
                        → {shipment.destination}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">
                      {shipment.driver}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`status-badge status-${shipment.status}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {statusLabels[shipment.status]}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {shipment.eta}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-foreground">
                    {shipment.distance}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default RecentShipments;
