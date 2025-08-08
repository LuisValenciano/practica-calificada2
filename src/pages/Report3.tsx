import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Report3 = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">Reporte 3</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="bg-muted rounded-lg p-8 mb-8 text-center">
            <p className="text-muted-foreground">
              Contenido del reporte se mostrará aquí
            </p>
          </div>
          
          <div className="text-center">
            <Button 
              onClick={() => navigate("/dashboard")}
              variant="secondary"
              className="px-8"
            >
              Volver
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Report3;