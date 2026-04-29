import { motion } from "framer-motion";
import { MapPin, Navigation, Truck } from "lucide-react";

interface ActiveDriver {
  id: string;
  name: string;
  vehicle: string;
  location: string;
  status: "active" | "idle" | "offline";
  lastUpdate: string;
}

const drivers: ActiveDriver[] = [
  {
    id: "DRV-001",
    name: "Michael Okonkwo",
    vehicle: "LAG-234-XY",
    location: "Lagos-Ibadan Expressway",
    status: "active",
    lastUpdate: "2 min ago",
  },
  {
    id: "DRV-002",
    name: "Ahmed Ibrahim",
    vehicle: "KAN-567-AB",
    location: "Awaiting dispatch",
    status: "idle",
    lastUpdate: "15 min ago",
  },
  {
    id: "DRV-003",
    name: "Chidi Eze",
    vehicle: "ABJ-890-CD",
    location: "Abuja Terminal",
    status: "active",
    lastUpdate: "1 min ago",
  },
  {
    id: "DRV-004",
    name: "Yusuf Abubakar",
    vehicle: "KAD-123-EF",
    location: "Kaduna Depot",
    status: "idle",
    lastUpdate: "30 min ago",
  },
];

const statusColors = {
  active: "bg-success",
  idle: "bg-warning",
  offline: "bg-muted-foreground",
};

const ActiveDrivers = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-heading font-semibold text-lg text-foreground">
            Active Drivers
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time driver status
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success" />
            <span className="text-xs text-muted-foreground">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-warning" />
            <span className="text-xs text-muted-foreground">Idle</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {drivers.map((driver, index) => (
          <motion.div
            key={driver.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
            className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Truck className="w-5 h-5 text-primary" />
              </div>
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${
                  statusColors[driver.status]
                }`}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground truncate">
                  {driver.name}
                </p>
                <span className="text-xs text-muted-foreground">
                  {driver.vehicle}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="w-3 h-3 text-muted-foreground" />
                <span className="text-sm text-muted-foreground truncate">
                  {driver.location}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-muted-foreground">
                {driver.lastUpdate}
              </span>
              {driver.status === "active" && (
                <div className="flex items-center gap-1 mt-1 text-primary">
                  <Navigation className="w-3 h-3" />
                  <span className="text-xs">Live</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ActiveDrivers;
