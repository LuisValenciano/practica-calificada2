import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Dashboard = () => {
  const navigate = useNavigate();

  const reports = [
    { id: 1, title: "Reporte 1", path: "/reporte-1" },
    { id: 2, title: "Reporte 2", path: "/reporte-2" },
    { id: 3, title: "Reporte 3", path: "/reporte-3" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-foreground">Panel de Reportes</h1>
          </div>
          
          <div className="space-y-4">
            {reports.map((report) => (
              <Button
                key={report.id}
                onClick={() => navigate(report.path)}
                className="w-full h-12 font-medium"
                variant="default"
              >
                {report.title}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;