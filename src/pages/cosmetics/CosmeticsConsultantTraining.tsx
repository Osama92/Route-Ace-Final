import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, Users, Award, BookOpen } from "lucide-react";

const courses = [
  { name: "Advanced Skincare Science", enrolled: 145, completed: 112, avgScore: 87, modules: 8, status: "active" },
  { name: "Color Theory & Application", enrolled: 198, completed: 156, avgScore: 91, modules: 6, status: "active" },
  { name: "Sales Consultancy Skills", enrolled: 220, completed: 180, avgScore: 85, modules: 5, status: "active" },
  { name: "Product Knowledge — New Lines", enrolled: 310, completed: 45, avgScore: 0, modules: 4, status: "new" },
];

const CosmeticsConsultantTraining = () => (
  <IndustryLayout industryCode="cosmetics">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
          <GraduationCap className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Beauty Consultant Training</h1>
          <p className="text-muted-foreground">Manage training programs and consultant certifications</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">873</p><p className="text-xs text-muted-foreground">Active Consultants</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">493</p><p className="text-xs text-muted-foreground">Certifications Earned</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">88%</p><p className="text-xs text-muted-foreground">Avg Score</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">4</p><p className="text-xs text-muted-foreground">Active Courses</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5 text-pink-500" />Training Courses</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courses.map((c) => (
              <div key={c.name} className="p-4 rounded-xl border border-border bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <div><p className="font-semibold text-foreground">{c.name}</p><p className="text-xs text-muted-foreground">{c.modules} modules • {c.enrolled} enrolled</p></div>
                  <Badge variant={c.status === "active" ? "default" : "secondary"}>{c.status}</Badge>
                </div>
                <Progress value={c.enrolled > 0 ? (c.completed / c.enrolled) * 100 : 0} className="h-2 mb-2" />
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>{c.completed}/{c.enrolled} completed</span>
                  {c.avgScore > 0 && <span>Avg Score: {c.avgScore}%</span>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default CosmeticsConsultantTraining;
